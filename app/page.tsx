"use client";

import { useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [result, setResult] = useState<null | {
    wordCount: number;
    charCount: number;
    hasTitle: boolean;
    hasEnoughContent: boolean;
    score: number;
  }>(null);

  function analyzeContent() {
    const words = content
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    const wordCount = content.trim() ? words.length : 0;
    const charCount = content.length;
    const hasTitle = title.trim().length > 0;
    const hasEnoughContent = wordCount >= 300;

    let score = 0;

    if (hasTitle) score += 25;
    if (wordCount >= 300) score += 25;
    if (wordCount >= 700) score += 20;
    if (charCount >= 1500) score += 15;
    if (content.includes("?")) score += 15;

    if (score > 100) score = 100;

    setResult({
      wordCount,
      charCount,
      hasTitle,
      hasEnoughContent,
      score,
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            SEO Assistant
          </h1>
          <p className="mt-4 text-slate-300">
            Analyze your article structure before publishing. No paid API required.
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
            Article Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your article content here..."
            rows={12}
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-sm text-slate-400">SEO Score</p>
                <p className="mt-2 text-3xl font-bold text-blue-400">
                  {result.score}/100
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Word Count</p>
                <p className="mt-2 text-3xl font-bold">
                  {result.wordCount}
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Characters</p>
                <p className="mt-2 text-3xl font-bold">
                  {result.charCount}
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Title Check</p>
                <p className="mt-2 text-lg font-semibold">
                  {result.hasTitle ? "Title exists" : "Title is missing"}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-slate-950 p-4">
              <h3 className="mb-3 font-semibold">Recommendations</h3>
              <ul className="space-y-2 text-slate-300">
                {!result.hasTitle && (
                  <li>• Add a clear SEO-friendly article title.</li>
                )}
                {!result.hasEnoughContent && (
                  <li>• Increase article length to at least 300 words.</li>
                )}
                {result.wordCount >= 300 && result.wordCount < 700 && (
                  <li>• Good start, but long-form SEO content usually performs better above 700 words.</li>
                )}
                {!content.includes("?") && (
                  <li>• Add question-based sections or FAQs to improve search intent coverage.</li>
                )}
                {result.score >= 75 && (
                  <li>• The article has a good initial SEO structure.</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}