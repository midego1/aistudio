import { Suspense } from "react";
import { BlogPage } from "@/components/landing/blog-page";
import { getAllCategories, getAllPosts } from "@/lib/blog";
import { constructMetadata } from "@/lib/constructMetadata";

export const metadata = constructMetadata({
  title: "Blog | Proppi",
  description:
    "Tips, guides, and industry insights to help you create stunning property listings. Learn from experts and elevate your real estate photography.",
  canonical: "/blog",
});

export default function Blog() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  return (
    <Suspense>
      <BlogPage categories={categories} posts={posts} />
    </Suspense>
  );
}
