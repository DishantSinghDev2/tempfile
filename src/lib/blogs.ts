// src/lib/blogs.ts
import { DITBlogsClient } from "@dishistech/blogs-sdk";
import { getCloudflareContext } from "@opennextjs/cloudflare";

let blogsClient: DITBlogsClient | null = null;

export function getBlogsClient() {
  let apiKey: string | undefined;
  
  try {
    const { env } = getCloudflareContext();
    apiKey = env.DITBLOGS_API_KEY;
  } catch (err) {
    // Fallback for build time or non-cloudflare environments
    apiKey = process.env.DITBLOGS_API_KEY;
  }
  
  if (!apiKey) {
    console.warn("DITBLOGS_API_KEY not set, blog features disabled");
    return null;
  }
  
  if (!blogsClient) {
    blogsClient = new DITBlogsClient(apiKey);
  }
  return blogsClient;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  publishedAt: string;
  author: {
    name: string;
    avatar?: string;
  };
  coverImage?: string;
  tags?: string[];
  readingTime?: number;
}

export async function getBlogPosts(params?: {
  page?: number;
  limit?: number;
}): Promise<{ posts: BlogPost[]; total: number }> {
  const client = getBlogsClient();
  if (!client) return { posts: [], total: 0 };

  try {
    const response = await client.getPosts(params);
    return {
      posts: response.posts as unknown as BlogPost[],
      total: response.pagination.total,
    };
  } catch (err) {
    console.error("Failed to fetch blog posts:", err);
    return { posts: [], total: 0 };
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const client = getBlogsClient();
  if (!client) return null;

  try {
    return (await client.getPost(slug)) as unknown as BlogPost;
  } catch (err) {
    console.error("Failed to fetch blog post:", err);
    return null;
  }
}
