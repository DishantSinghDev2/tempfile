// src/app/(marketing)/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost } from "@/lib/blogs";
import { ArrowLeft, Clock } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Post Not Found | TempFile" };

  return {
    title: `${post.title} — TempFile Blog`,
    description: post.description,
    alternates: { canonical: `https://tempfile.io/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  return (
    <div className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-12 font-mono"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to blog
        </Link>

        {/* Header */}
        <header className="mb-12 space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px] uppercase tracking-widest border border-border rounded-sm px-1.5 py-px text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-semibold tracking-tight leading-[1.1] text-foreground">
            {post.title}
          </h1>
          {post.description && (
            <p className="text-base text-muted-foreground leading-relaxed">
              {post.description}
            </p>
          )}
          <div className="flex items-center gap-4 pt-2">
            {post.author && (
              <span className="text-xs text-muted-foreground">
                By{" "}
                <span className="text-foreground font-medium">
                  {post.author.name}
                </span>
              </span>
            )}
            <span className="text-muted-foreground/40">·</span>
            <span className="font-mono text-xs text-muted-foreground">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            {post.readingTime && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span className="font-mono">{post.readingTime} min read</span>
                </div>
              </>
            )}
          </div>
        </header>

        <div className="border-t border-border mb-12" />

        {/* Content */}
        <div
          className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-foreground prose-a:underline prose-code:font-mono prose-code:text-xs"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="border-t border-border mt-12 pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
          >
            <ArrowLeft className="h-3 w-3" />
            All posts
          </Link>
        </div>
      </div>
    </div>
  );
}
