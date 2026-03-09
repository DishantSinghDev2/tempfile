// src/app/(marketing)/blog/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/blogs";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionMarker } from "@/components/ui/section-marker";

export const metadata: Metadata = {
  title: "Blog — TempFile",
  description:
    "Tips, guides, and updates from the TempFile team. Learn about secure file sharing, privacy, and developer tools.",
  alternates: { canonical: "https://tempfile.io/blog" },
};

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  const { posts } = await getBlogPosts({ limit: 20 });

  return (
    <div className="py-20 px-6">
      <div className="max-w-2xl mx-auto space-y-16">
        <FadeIn>
          <div className="space-y-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Blog
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">
              Writing
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Technical guides, product updates, and insights on secure file
              sharing.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <SectionMarker index={1} total={1} label="All posts" />
          <div className="space-y-0">
            {posts.length === 0 ? (
              <div className="border-t border-border py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  No posts yet. Check back soon.
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="border-t border-border py-6 flex flex-col gap-2 group hover:bg-muted/5 -mx-4 px-4 rounded-sm transition-colors last:border-b"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-sm font-semibold text-foreground group-hover:underline underline-offset-4 decoration-border leading-snug">
                      {post.title}
                    </h2>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground shrink-0">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {post.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {post.description}
                    </p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-1.5 pt-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[9px] uppercase tracking-widest border border-border rounded-sm px-1.5 py-px text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
