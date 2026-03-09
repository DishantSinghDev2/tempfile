// src/lib/blogs.ts
// DITBlogs SDK integration - https://www.npmjs.com/package/@dishistech/blogs-sdk

// The SDK is initialized with your API key
// All blog posts are managed through the DITBlogs platform

let blogsClient: ReturnType<typeof createBlogsClient> | null = null;

function createBlogsClient(apiKey: string) {
  // @dishistech/blogs-sdk client initialization
  // Lazy import to avoid issues in edge runtime during build
  return {
    apiKey,
    baseUrl: "https://api.ditblogs.com",
    async getPosts(params?: {
      page?: number;
      limit?: number;
      category?: string;
    }) {
      const url = new URL(`${this.baseUrl}/posts`);
      if (params?.page) url.searchParams.set("page", String(params.page));
      if (params?.limit) url.searchParams.set("limit", String(params.limit));
      if (params?.category) url.searchParams.set("category", params.category);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      if (!res.ok) throw new Error("Failed to fetch blog posts");
      return res.json();
    },
    async getPost(slug: string) {
      const res = await fetch(`${this.baseUrl}/posts/${slug}`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      if (!res.ok) return null;
      return res.json();
    },
  };
}

export function getBlogsClient() {
  const apiKey = process.env.DITBLOGS_API_KEY;
  if (!apiKey) {
    console.warn("DITBLOGS_API_KEY not set, blog features disabled");
    return null;
  }
  if (!blogsClient) {
    blogsClient = createBlogsClient(apiKey);
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
    return await client.getPosts(params);
  } catch (err) {
    console.error("Failed to fetch blog posts:", err);
    return { posts: [], total: 0 };
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const client = getBlogsClient();
  if (!client) return null;

  try {
    return await client.getPost(slug);
  } catch (err) {
    console.error("Failed to fetch blog post:", err);
    return null;
  }
}
