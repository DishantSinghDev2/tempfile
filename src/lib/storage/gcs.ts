// src/lib/storage/gcs.ts
// Google Cloud Storage signed URL generation
// Workers only handle metadata - all file data flows directly client ↔ GCS/R2
import type { R2Bucket } from "@cloudflare/workers-types";

export interface SignedUploadUrl {
  url: string;
  storageKey: string;
  expiresAt: Date;
}

export interface SignedDownloadUrl {
  url: string;
  expiresAt: Date;
}

/**
 * Generate a GCS signed upload URL.
 * The client uploads directly to GCS — our Worker never touches file bytes.
 */
export async function createGCSUploadSignedUrl(params: {
  storageKey: string;
  mimeType: string;
  maxSize: number;
  gcsBucket: string;
  clientEmail: string;
  privateKey: string;
}): Promise<string> {
  const { storageKey, mimeType, maxSize, gcsBucket, clientEmail, privateKey } =
    params;

  const serviceAccount = {
    client_email: clientEmail,
    private_key: privateKey.replace(/\\n/g, "\n"),
  };
  const expirationMinutes = 30;
  const expiration = Math.floor(Date.now() / 1000) + expirationMinutes * 60;

  // Build the signing string for V4 signed URL
  const url = `https://storage.googleapis.com/${gcsBucket}/${storageKey}`;

  // For production, use @google-cloud/storage SDK or implement V4 signing
  // This is a simplified version - in production inject the GCS library
  const signedUrl = await generateV4SignedUrl({
    serviceAccount,
    method: "PUT",
    bucket: gcsBucket,
    object: storageKey,
    contentType: mimeType,
    expiration,
    conditions: [["content-length-range", 1, maxSize]],
  });

  return signedUrl;
}

export async function createGCSDownloadSignedUrl(params: {
  storageKey: string;
  gcsBucket: string;
  clientEmail: string;
  privateKey: string;
  filename: string;
}): Promise<string> {
  const { storageKey, gcsBucket, clientEmail, privateKey, filename } = params;
  const serviceAccount = {
    client_email: clientEmail,
    private_key: privateKey.replace(/\\n/g, "\n"),
  };
  const expiration = Math.floor(Date.now() / 1000) + 3600; // 1 hour

  return generateV4SignedUrl({
    serviceAccount,
    method: "GET",
    bucket: gcsBucket,
    object: storageKey,
    expiration,
    responseContentDisposition: `attachment; filename="${encodeURIComponent(filename)}"`,
  });
}

// Minimal V4 GCS signed URL implementation using Web Crypto API
// (compatible with Cloudflare Workers edge runtime)
async function generateV4SignedUrl(params: {
  serviceAccount: { client_email: string; private_key: string };
  method: string;
  bucket: string;
  object: string;
  expiration: number;
  contentType?: string;
  conditions?: Array<[string, number, number] | string[]>;
  responseContentDisposition?: string;
}): Promise<string> {
  const {
    serviceAccount,
    method,
    bucket,
    object,
    expiration,
    contentType,
    responseContentDisposition,
  } = params;

  const now = new Date();
  const datestamp = now.toISOString().slice(0, 10).replace(/-/g, "");
  const timestamp = now.toISOString().replace(/[:-]/g, "").slice(0, 15) + "Z";
  const credentialScope = `${datestamp}/auto/storage/goog4_request`;
  const credential = `${serviceAccount.client_email}/${credentialScope}`;

  const queryParams: Record<string, string> = {
    "X-Goog-Algorithm": "GOOG4-RSA-SHA256",
    "X-Goog-Credential": credential,
    "X-Goog-Date": timestamp,
    "X-Goog-Expires": String(expiration - Math.floor(Date.now() / 1000)),
    "X-Goog-SignedHeaders": contentType ? "content-type;host" : "host",
  };

  if (responseContentDisposition) {
    queryParams["response-content-disposition"] = responseContentDisposition;
  }

  const canonicalUri = `/${bucket}/${object.split("/").map(encodeURIComponent).join("/")}`;
  const canonicalHeaders = contentType
    ? `content-type:${contentType}\nhost:storage.googleapis.com\n`
    : `host:storage.googleapis.com\n`;
  const signedHeaders = contentType ? "content-type;host" : "host";

  const sortedQuery = Object.keys(queryParams)
    .sort()
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
    .join("&");

  const canonicalRequest = [
    method,
    canonicalUri,
    sortedQuery,
    canonicalHeaders,
    signedHeaders,
    "UNSIGNED-PAYLOAD",
  ].join("\n");

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(canonicalRequest)
  );
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const stringToSign = [
    "GOOG4-RSA-SHA256",
    timestamp,
    credentialScope,
    hashHex,
  ].join("\n");

  // Import RSA private key and sign
  const privateKeyPem = serviceAccount.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\n/g, "");

  const privateKeyDer = Uint8Array.from(atob(privateKeyPem), (c) =>
    c.charCodeAt(0)
  );
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    privateKeyDer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(stringToSign)
  );

  const signatureHex = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const finalQueryParams = `${sortedQuery}&X-Goog-Signature=${signatureHex}`;

  return `https://storage.googleapis.com${canonicalUri}?${finalQueryParams}`;
}

/**
 * Move file from GCS Standard to Cloudflare R2 for hot serving.
 * Called when a file exceeds download threshold.
 */
export async function promoteFileToR2(params: {
  storageKey: string;
  gcsBucket: string;
  clientEmail: string;
  privateKey: string;
  r2Bucket: R2Bucket;
  mimeType: string;
}): Promise<boolean> {
  try {
    const { storageKey, gcsBucket, clientEmail, privateKey, r2Bucket, mimeType } =
      params;

    // Fetch from GCS
    const downloadUrl = await createGCSDownloadSignedUrl({
      storageKey,
      gcsBucket,
      clientEmail,
      privateKey,
      filename: storageKey,
    });

    const response = await fetch(downloadUrl);
    if (!response.ok) return false;

    const data = await response.arrayBuffer();
    await r2Bucket.put(storageKey, data, {
      httpMetadata: { contentType: mimeType },
    });

    return true;
  } catch (err) {
    console.error("Failed to promote file to R2:", err);
    return false;
  }
}

/**
 * Create R2 download URL (via signed URL or public URL)
 */
export async function createR2DownloadUrl(
  storageKey: string,
  filename: string
): Promise<string> {
  // In production, use Cloudflare R2 presigned URLs or a public bucket
  // For now return a worker route that proxies with redirect
  const encodedKey = encodeURIComponent(storageKey);
  const encodedFilename = encodeURIComponent(filename);
  return `/api/r2-proxy/${encodedKey}?filename=${encodedFilename}`;
}
