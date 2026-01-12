"use client";

import {
  IconFileSearch,
  IconMessageCircle,
  IconSearch,
} from "@tabler/icons-react";
import Link from "next/link";
import { useMemo } from "react";
import { useHelpFilters } from "@/hooks/use-help-filters";
import type { HelpArticleMeta, HelpCategory } from "@/lib/help";
import { HelpArticleCard } from "./help-article-card";
import { HelpCategoryCard } from "./help-category-card";
import { LandingFooter } from "./landing-footer";
import { LandingNav } from "./landing-nav";

interface HelpPageProps {
  articles: HelpArticleMeta[];
  popularArticles: HelpArticleMeta[];
  categories: HelpCategory[];
  articleCountByCategory: Record<string, number>;
}

export function HelpPage({
  articles,
  popularArticles,
  categories,
  articleCountByCategory,
}: HelpPageProps) {
  const { search, setSearch, clearSearch } = useHelpFilters();

  // Filter articles based on search
  const searchResults = useMemo(() => {
    if (!search?.trim()) {
      return null;
    }

    const searchLower = search.toLowerCase();
    return articles.filter((article) => {
      const matchesTitle = article.title.toLowerCase().includes(searchLower);
      const matchesDescription = article.description
        .toLowerCase()
        .includes(searchLower);
      return matchesTitle || matchesDescription;
    });
  }, [articles, search]);

  const isSearching = search && search.trim().length > 0;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--landing-bg)" }}
    >
      <LandingNav />

      <main>
        {/* Hero Section with Search */}
        <section className="px-6 pt-20 pb-16 text-center md:pt-28 md:pb-20">
          <div className="mx-auto max-w-2xl">
            <h1
              className="font-bold text-4xl tracking-tight sm:text-5xl"
              style={{ color: "var(--landing-text)" }}
            >
              How can we help?
            </h1>
            <p
              className="mx-auto mt-4 max-w-lg text-lg leading-relaxed"
              style={{ color: "var(--landing-text-muted)" }}
            >
              Search our knowledge base or browse categories below
            </p>

            {/* Search Input */}
            <div className="relative mx-auto mt-8 max-w-xl">
              <IconSearch
                className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2"
                style={{ color: "var(--landing-text-muted)" }}
              />
              <input
                aria-label="Search help articles"
                className="h-14 w-full rounded-2xl pr-5 pl-14 text-base outline-none transition-all placeholder:opacity-50 focus:ring-2"
                onChange={(e) => setSearch(e.target.value || null)}
                placeholder="Search for articles…"
                style={{
                  backgroundColor: "var(--landing-card)",
                  color: "var(--landing-text)",
                  border: "1px solid var(--landing-border)",
                  boxShadow: "0 4px 20px -4px var(--landing-shadow)",
                }}
                type="text"
                value={search ?? ""}
              />
            </div>
          </div>
        </section>

        {/* Search Results */}
        {isSearching && (
          <section className="px-6 pb-16">
            <div className="mx-auto max-w-3xl">
              <div className="mb-6 flex items-center justify-between">
                <h2
                  className="font-semibold text-sm uppercase tracking-wider"
                  style={{ color: "var(--landing-text-muted)" }}
                >
                  Search Results
                  {searchResults && ` (${searchResults.length})`}
                </h2>
                <button
                  className="text-sm transition-opacity hover:opacity-70"
                  onClick={clearSearch}
                  style={{ color: "var(--landing-accent)" }}
                  type="button"
                >
                  Clear search
                </button>
              </div>

              {searchResults && searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((article) => (
                    <HelpArticleCard
                      article={article}
                      key={`${article.category}-${article.slug}`}
                      showCategory
                    />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div
                    className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: "var(--landing-bg-alt)",
                      border: "1px solid var(--landing-border)",
                    }}
                  >
                    <IconFileSearch
                      className="size-8"
                      style={{ color: "var(--landing-text-muted)" }}
                    />
                  </div>
                  <h3
                    className="font-semibold text-lg"
                    style={{ color: "var(--landing-text)" }}
                  >
                    No articles found
                  </h3>
                  <p
                    className="mx-auto mt-2 max-w-sm text-sm"
                    style={{ color: "var(--landing-text-muted)" }}
                  >
                    Try a different search term or browse categories below
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Popular Articles */}
        {!isSearching && popularArticles.length > 0 && (
          <section
            className="px-6 py-16"
            style={{ backgroundColor: "var(--landing-bg-alt)" }}
          >
            <div className="mx-auto max-w-4xl">
              <h2
                className="mb-8 text-center font-semibold text-sm uppercase tracking-wider"
                style={{ color: "var(--landing-text-muted)" }}
              >
                Popular Articles
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {popularArticles.map((article) => (
                  <HelpArticleCard
                    article={article}
                    key={`${article.category}-${article.slug}`}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Categories */}
        {!isSearching && (
          <section className="px-6 py-16">
            <div className="mx-auto max-w-4xl">
              <h2
                className="mb-8 text-center font-semibold text-sm uppercase tracking-wider"
                style={{ color: "var(--landing-text-muted)" }}
              >
                Browse by Category
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((category) => (
                  <HelpCategoryCard
                    articleCount={articleCountByCategory[category.slug] || 0}
                    category={category}
                    key={category.slug}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Still Need Help CTA */}
        <section className="px-6 py-16">
          <div
            className="mx-auto max-w-2xl rounded-3xl px-8 py-12 text-center"
            style={{
              backgroundColor: "var(--landing-card)",
              border: "1px solid var(--landing-border)",
              boxShadow: "0 20px 40px -12px var(--landing-shadow)",
            }}
          >
            <div
              className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full"
              style={{
                backgroundColor: "var(--landing-bg)",
                border: "1px solid var(--landing-border)",
              }}
            >
              <IconMessageCircle
                className="size-7"
                style={{ color: "var(--landing-accent)" }}
              />
            </div>
            <h2
              className="font-bold text-2xl tracking-tight"
              style={{ color: "var(--landing-text)" }}
            >
              Still need help?
            </h2>
            <p
              className="mx-auto mt-3 max-w-md text-base leading-relaxed"
              style={{ color: "var(--landing-text-muted)" }}
            >
              Can&apos;t find what you&apos;re looking for? Our support team is
              here to help.
            </p>
            <Link
              className="mt-6 inline-flex h-11 items-center rounded-full px-6 font-medium text-sm transition-all duration-200 hover:scale-[1.03]"
              href="/contact"
              style={{
                backgroundColor: "var(--landing-accent)",
                color: "var(--landing-accent-foreground)",
              }}
            >
              Contact Support
            </Link>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
