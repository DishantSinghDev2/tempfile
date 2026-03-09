declare module "@dishistech/blogs-sdk" {
  export class DITBlogsClient {
    constructor(apiKey: string);
    getPosts(params?: {
      page?: number;
      limit?: number;
      category?: string;
      tag?: string;
    }): Promise<{
      posts: any[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>;
    getPost(slug: string): Promise<any>;
    getCategories(): Promise<any[]>;
    getCategory(slug: string, params?: { page?: number; limit?: number }): Promise<any>;
    getTags(): Promise<any[]>;
    getTag(slug: string, params?: { page?: number; limit?: number }): Promise<any>;
    getComments(postSlug: string): Promise<any[]>;
    postComment(params: {
      postSlug: string;
      content: string;
      userToken: string;
      parentId?: string;
    }): Promise<any>;
  }
}
