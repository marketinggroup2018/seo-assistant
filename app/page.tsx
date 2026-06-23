"use client";

import { useState } from "react";

type AnalysisResult = {
  score: number;
  wordCount: number;
  charCount: number;
  keywordInTitle: boolean;
  keywordInMeta: boolean;
  keywordInFirstParagraph: boolean;
  keywordCount: number;
  keywordDensity: number;
  metaLength: number;
  hasGoodMetaLength: boolean;
  h2Count: number;
  h3Count: number;
  questionCount: number;
  recommendations: string[];
};

export default function Home() {
  const [title, setTitle] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [content, setContent] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  function countKeyword(text: string, keyword: string) {
    if (!keyword.trim()) return 0;

    const normalizedText = text.toLowerCase();
    const normalizedKeyword = keyword.toLowerCase().trim();

    return normalizedText.split(normalizedKeyword).length - 1;
  }

  function analyzeContent() {
    const cleanContent = content.trim();
    const words = cleanContent.split(/\s+/).filter(Boolean);
    const wordCount = cleanContent ? words.length : 0;
    const charCount = content.length;

    const keyword = focusKeyword.trim().toLowerCase();
    const titleLower = title.toLowerCase();
    const metaLower = metaDescription.toLowerCase();
    const contentLower = content.toLowerCase();

    const firstParagraph = content
      .split(/\n\s*\n/)
      .find((paragraph) => paragraph.trim().length > 0) || "";

    const keywordInTitle = keyword ? titleLower.includes(keyword) : false;
    const keywordInMeta = keyword ? metaLower.includes(keyword) : false;
    const keywordInFirstParagraph = keyword
      ? firstParagraph.toLowerCase().includes(keyword)
      : false;

    const keywordCount = keyword
      ? countKeyword(contentLower, keyword)
      : 0;

    const keywordDensity =
      wordCount > 0 ? Number(((keywordCount / wordCount) * 100).toFixed(2)) : 0;

    const metaLength = metaDescription.length;
    const hasGoodMetaLength = metaLength >= 120 && metaLength <= 160;

    const lines = content.split("\n");

    const h2Count = lines.filter((line) =>
      line.trim().startsWith("## ")
    ).length;

    const h3Count = lines.filter((line) =>
      line.trim().startsWith("### ")
    ).length;

    const questionCount = (content.match(/\?/g) || []).length;

    let score = 0;
    const recommendations: string[] = [];

    if (title.trim()) {
      score += 10;
    } else {
      recommendations.push("Add a clear SEO title.");
    }

    if (focusKeyword.trim()) {
      score += 10;
    } else {
      recommendations.push("Add a focus keyword before analyzing the article.");
    }

    if (keywordInTitle) {
      score += 15;
    } else if (focusKeyword.trim()) {
      recommendations.push("Use the focus keyword naturally in the article title.");
    }

    if (hasGoodMetaLength) {
      score += 15;
    } else {
      recommendations.push("Keep the meta description between 120 and 160 characters.");
    }

    if (keywordInMeta) {
      score += 10;
    } else if (focusKeyword.trim()) {
      recommendations.push("Add the focus keyword inside the meta description.");
    }

    if (keywordInFirstParagraph) {
      score += 10;
    } else if (focusKeyword.trim()) {
      recommendations.push("Mention the focus keyword naturally in the first paragraph.");
    }

    if (wordCount >= 300) {
      score += 10;
    } else {
      recommendations.push("Increase the article length to at least 300 words.");
    }

    if (wordCount >= 700) {
      score += 10;
    } else {
      recommendations.push("For stronger SEO, aim for 700+ words when the topic needs depth.");
    }

    if (h2Count >= 2) {
      score += 5;
    } else {
      recommendations.push("Add at least two H2 sections. Use lines starting with ##.");
    }

    if (questionCount >= 2) {
      score += 5;
    } else {
      recommendations.push("Add FAQ-style questions to improve search intent coverage.");
    }

    if (score > 100) score = 100;

    setResult({
      score,
      wordCount,
      charCount,
      keywordInTitle,
      keywordInMeta,
      keywordInFirstParagraph,
      keywordCount,
      keywordDensity,
      metaLength,
      hasGoodMetaLength,
      h2Count,
      h3Count,
      questionCount,
      recommendations,
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            SEO Assistant
          </h1>
          <p className="mt-4 text-slate-300">
            Analyze article structure, keyword usage, meta description, headings, and SEO readiness.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Article Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title..."
            className="mb-6 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
          />

          <label className="mb-2 block text-sm font-medium text-slate-200">
            Focus Keyword
          </label>
          <input
            value={focusKeyword}
            onChange={(e) => setFocusKeyword(e.target.value)}
            placeholder="Example: SEO tools"
            className="mb-6 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
          />

          <label className="mb-2 block text-sm font-medium text-slate-200">
            Meta Description
          </label>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="Enter meta description..."
            rows={3}
            className="mb-6 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
          />

          <label className="mb-2 block text-sm font-medium text-slate-200">
            Article Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your article content here. Use ## for H2 headings and ### for H3 headings."
            rows={14}
            className="mb-6 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
          />

          <button
            onClick={analyzeContent}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Analyze
          </button>
        </div>

        {result && (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-5 text-2xl font-semibold">
              Analysis Result
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <ResultCard label="SEO Score" value={`${result.score}/100`} highlight />
              <ResultCard label="Word Count" value={result.wordCount.toString()} />
              <ResultCard label="Characters" value={result.charCount.toString()} />
              <ResultCard label="Meta Length" value={`${result.metaLength} chars`} />
              <ResultCard label="Keyword Count" value={result.keywordCount.toString()} />
              <ResultCard label="Keyword Density" value={`${result.keywordDensity}%`} />
              <ResultCard label="H2 Count" value={result.h2Count.toString()} />
              <ResultCard label="H3 Count" value={result.h3Count.toString()} />
              <ResultCard label="Questions" value={result.questionCount.toString()} />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <CheckCard
                label="Keyword in Title"
                passed={result.keywordInTitle}
              />
              <CheckCard
                label="Keyword in Meta"
                passed={result.keywordInMeta}
              />
              <CheckCard
                label="Keyword in First Paragraph"
                passed={result.keywordInFirstParagraph}
              />
            </div>

            <div className="mt-6 rounded-xl bg-slate-950 p-4">
              <h3 className="mb-3 font-semibold">Recommendations</h3>

              {result.recommendations.length > 0 ? (
                <ul className="space-y-2 text-slate-300">
                  {result.recommendations.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-green-400">
                  Good initial SEO structure. The article passes the main checks.
                </p>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function ResultCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl bg-slate-950 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p
        className={`mt-2 text-3xl font-bold ${
          highlight ? "text-blue-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function CheckCard({
  label,
  passed,
}: {
  label: string;
  passed: boolean;
}) {
  return (
    <div className="rounded-xl bg-slate-950 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p
        className={`mt-2 text-lg font-semibold ${
          passed ? "text-green-400" : "text-red-400"
        }`}
      >
        {passed ? "Passed" : "Needs improvement"}
      </p>
    </div>
  );
}