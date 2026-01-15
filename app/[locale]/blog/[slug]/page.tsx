import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostPage } from "@/components/landing/blog-post-page";
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { constructMetadata } from "@/lib/constructMetadata";

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Return 404 for slugs not generated at build time
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return constructMetadata({
      title: "Post Not Found | Proppi",
      noIndex: true,
    });
  }

  return constructMetadata({
    title: `${post.title} | Proppi Blog`,
    description: post.description,
    canonical: `/blog/${slug}`,
    type: "article",
    publishedTime: post.date,
    authors: [post.author],
  });
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, post.category, 3);

  return <BlogPostPage post={post} relatedPosts={relatedPosts} />;
}
