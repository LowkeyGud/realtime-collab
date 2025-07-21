"use client";

import { useOrganization } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import SnippetsPageSkeleton from "./_components/SnippetsPageSkeleton";

import NavigationHeader from "@/components/code-components/NavigationHeader";
import { AnimatePresence, motion } from "framer-motion";
import { Code, Grid, Layers, Tag, Users, X } from "lucide-react";
import SnippetCard from "./_components/SnippetCard";

function SnippetsPage() {
  const { organization, isLoaded } = useOrganization();
  const snippets = useQuery(
    api.codeSnippets.getSnippetsByOrgId,
    organization?.id ? { organizationId: organization.id } : "skip"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");

  // loading state for organization
  if (!isLoaded) {
    return (
      <div className="min-h-screen">
        <NavigationHeader />
        <SnippetsPageSkeleton />
      </div>
    );
  }

  // Not in organization state
  if (!organization) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationHeader />
        <div className="relative max-w-md mx-auto mt-20 p-8 rounded-2xl overflow-hidden bg-card border">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border mb-6">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium text-foreground mb-3">
              Join an Organization
            </h3>
            <p className="text-muted-foreground mb-6">
              You need to be part of an organization to view and create code
              snippets. Join or create an organization to get started.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // loading state for snippets
  if (snippets === undefined) {
    return <div className="min-h-screen"></div>;
  }

  const languages = [...new Set(snippets.map((s) => s.language))];
  const popularLanguages = languages.slice(0, 5);

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch =
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.userName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLanguage =
      !selectedLanguage || snippet.language === selectedLanguage;

    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {/* Filters Section */}
        <div className="relative max-w-5xl mx-auto mb-12 space-y-6">
          {/* Search */}

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg ring-1 ring-border">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Languages:</span>
            </div>

            {popularLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() =>
                  setSelectedLanguage(lang === selectedLanguage ? null : lang)
                }
                className={`
                    group relative px-3 py-1.5 rounded-lg transition-all duration-200
                    ${
                      selectedLanguage === lang
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 ring-2 ring-blue-200 dark:ring-blue-500/50"
                        : "text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 ring-1 ring-border"
                    }
                  `}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={`/${lang}.png`}
                    alt={lang}
                    className="w-4 h-4 object-contain"
                  />
                  <span className="text-sm">{lang}</span>
                </div>
              </button>
            ))}

            {selectedLanguage && (
              <button
                onClick={() => setSelectedLanguage(null)}
                className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}

            <div className="ml-auto flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {filteredSnippets.length} snippets found
              </span>

              {/* View Toggle */}
              <div className="flex items-center gap-1 p-1 bg-muted rounded-lg ring-1 ring-border">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 rounded-md transition-all ${
                    view === "grid"
                      ? "bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 rounded-md transition-all ${
                    view === "list"
                      ? "bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Snippets Grid */}
        <motion.div
          className={`grid gap-6 ${
            view === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 max-w-3xl mx-auto"
          }`}
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredSnippets.map((snippet) => (
              <SnippetCard key={snippet._id} snippet={snippet} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* edge case: empty state */}
        {filteredSnippets.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-md mx-auto mt-20 p-8 rounded-2xl overflow-hidden bg-card border"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border mb-6">
                <Code className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium text-foreground mb-3">
                No snippets found
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedLanguage
                  ? "Try adjusting your search query or filters"
                  : "Be the first to share a code snippet with the community"}
              </p>

              {(searchQuery || selectedLanguage) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedLanguage(null);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear all filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
export default SnippetsPage;
