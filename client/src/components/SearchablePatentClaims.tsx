import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ChevronDown, Copy, Download } from "lucide-react";
import { PATENT_CLAIMS, type PatentClaim } from "@/data/patentClaims";

export type { PatentClaim } from "@/data/patentClaims";
export { PATENT_CLAIMS } from "@/data/patentClaims";

function exportClaim(claim: PatentClaim): void {
  const lines = [
    `Claim #${claim.number}: ${claim.title}`,
    `Category: ${claim.category} · Type: ${claim.type}`,
    "",
    claim.description,
    "",
    "Specifications:",
    ...Object.entries(claim.specifications).map(
      ([key, value]) => `  ${key}: ${value}`
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `claim-${claim.number}.txt`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export const SearchablePatentClaims: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "composition" | "manufacturing" | "device"
  >("all");
  const [expandedClaim, setExpandedClaim] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"number" | "relevance">("number");

  const filteredClaims = useMemo(() => {
    let filtered = PATENT_CLAIMS;

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(c => c.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        c =>
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.number.toString().includes(query) ||
          Object.values(c.specifications).some(v =>
            v.toLowerCase().includes(query)
          )
      );
    }

    // Sort
    if (sortBy === "relevance" && searchQuery) {
      filtered.sort((a, b) => {
        const aScore = (
          a.title.toLowerCase().match(new RegExp(searchQuery, "g")) || []
        ).length;
        const bScore = (
          b.title.toLowerCase().match(new RegExp(searchQuery, "g")) || []
        ).length;
        return bScore - aScore;
      });
    } else {
      filtered.sort((a, b) => a.number - b.number);
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  const categoryStats = {
    composition: PATENT_CLAIMS.filter(c => c.category === "composition").length,
    manufacturing: PATENT_CLAIMS.filter(c => c.category === "manufacturing")
      .length,
    device: PATENT_CLAIMS.filter(c => c.category === "device").length,
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-4xl font-bold text-primary mb-2">
          Patent Claims Explorer
        </h2>
        <p className="text-foreground/70">
          U.S. Provisional Patent Application 63/934,269 - 25 Claims
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8 space-y-4"
      >
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-primary/50" size={20} />
          <input
            type="text"
            placeholder="Search claims by title, number, or specifications..."
            aria-label="Search patent claims by title, number, or specifications"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-background/50 border border-primary/30 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
          />
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-semibold text-foreground/70 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value as any)}
              className="w-full px-4 py-2 bg-background/50 border border-primary/30 rounded-lg text-foreground focus:outline-none focus:border-primary"
            >
              <option value="all">
                All Categories ({PATENT_CLAIMS.length})
              </option>
              <option value="composition">
                Composition & Material ({categoryStats.composition})
              </option>
              <option value="manufacturing">
                Manufacturing Method ({categoryStats.manufacturing})
              </option>
              <option value="device">
                Device & System ({categoryStats.device})
              </option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-semibold text-foreground/70 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-4 py-2 bg-background/50 border border-primary/30 rounded-lg text-foreground focus:outline-none focus:border-primary"
            >
              <option value="number">Claim Number</option>
              <option value="relevance" disabled={!searchQuery}>
                Relevance
              </option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div
          className="text-sm text-foreground/60"
          role="status"
          aria-live="polite"
        >
          Showing {filteredClaims.length} of {PATENT_CLAIMS.length} claims
        </div>
      </motion.div>

      {/* Claims List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <AnimatePresence>
          {filteredClaims.map((claim, index) => (
            <motion.div
              key={claim.number}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.05 }}
              className="border border-primary/30 rounded-lg overflow-hidden hover:border-primary/60 transition-colors"
            >
              {/* Claim Header */}
              <button
                onClick={() =>
                  setExpandedClaim(
                    expandedClaim === claim.number ? null : claim.number
                  )
                }
                aria-expanded={expandedClaim === claim.number}
                aria-controls={`searchable-claim-detail-${claim.number}`}
                className="w-full px-6 py-4 bg-background/50 hover:bg-background/70 transition-colors text-left flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-primary font-bold text-lg">
                      #{claim.number}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {claim.title}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        claim.category === "composition"
                          ? "bg-cyan-500/20 text-cyan-300"
                          : claim.category === "manufacturing"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-green-500/20 text-green-300"
                      }`}
                    >
                      {claim.category === "composition"
                        ? "Composition"
                        : claim.category === "manufacturing"
                          ? "Manufacturing"
                          : "Device"}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        claim.type === "composition"
                          ? "bg-purple-500/20 text-purple-300"
                          : claim.type === "apparatus"
                            ? "bg-orange-500/20 text-orange-300"
                            : "bg-blue-500/20 text-blue-300"
                      }`}
                    >
                      {claim.type.charAt(0).toUpperCase() + claim.type.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/70">
                    {claim.description}
                  </p>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-primary transition-transform ${expandedClaim === claim.number ? "rotate-180" : ""}`}
                />
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedClaim === claim.number && (
                  <motion.div
                    id={`searchable-claim-detail-${claim.number}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-primary/30 px-6 py-4 bg-background/30 space-y-4"
                  >
                    {/* Specifications */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">
                        Specifications
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(claim.specifications).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="bg-background/50 p-3 rounded border border-primary/20"
                            >
                              <p className="text-xs text-foreground/60 font-semibold">
                                {key}
                              </p>
                              <p className="text-sm text-foreground font-mono">
                                {value}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-primary/20">
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(
                            `Claim #${claim.number}: ${claim.title}`
                          )
                        }
                        className="flex items-center gap-2 px-3 py-2 bg-primary/20 hover:bg-primary/40 text-primary rounded text-sm font-semibold transition-colors"
                      >
                        <Copy size={16} /> Copy
                      </button>
                      <button
                        onClick={() => exportClaim(claim)}
                        className="flex items-center gap-2 px-3 py-2 bg-primary/20 hover:bg-primary/40 text-primary rounded text-sm font-semibold transition-colors"
                      >
                        <Download size={16} /> Export
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredClaims.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-foreground/60">
              No claims match your search criteria.
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Statistics Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 pt-8 border-t border-primary/20 grid grid-cols-3 gap-4"
      >
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            {categoryStats.composition}
          </p>
          <p className="text-sm text-foreground/60">Composition Claims</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            {categoryStats.manufacturing}
          </p>
          <p className="text-sm text-foreground/60">Manufacturing Claims</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            {categoryStats.device}
          </p>
          <p className="text-sm text-foreground/60">Device Claims</p>
        </div>
      </motion.div>
    </div>
  );
};

export default SearchablePatentClaims;
