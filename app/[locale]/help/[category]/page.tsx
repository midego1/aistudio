import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HelpCategoryPage } from "@/components/landing/help-category-page";
import { constructMetadata } from "@/lib/constructMetadata";
import {
  getArticlesByCategory,
  getCategoryBySlug,
  helpCategories,
} from "@/lib/help";

interface HelpCategoryProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return helpCategories.map((category) => ({
    category: category.slug,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: HelpCategoryProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return constructMetadata({
      title: "Category Not Found | Proppi Help",
      noIndex: true,
    });
  }

  return constructMetadata({
    title: `${category.title} | Proppi Help`,
    description: category.description,
    canonical: `/help/${categorySlug}`,
  });
}

export default async function HelpCategory({ params }: HelpCategoryProps) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const articles = getArticlesByCategory(categorySlug);

  return <HelpCategoryPage articles={articles} category={category} />;
}
