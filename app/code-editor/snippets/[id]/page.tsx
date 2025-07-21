"use client";

import {
  defineMonacoThemes,
  LANGUAGE_CONFIG,
} from "@/app/code-editor/(root)/_constants";
import { Editor } from "@monaco-editor/react";
import { useQuery } from "convex/react";
import { Clock, Code, MessageSquare, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Comments from "./_components/Comments";
import CopyButton from "./_components/CopyButton";
import SnippetLoadingSkeleton from "./_components/SnippetLoadingSkeleton";

function SnippetDetailPage() {
  const params = useParams();
  const snippetId = params?.id as string;
  const { theme } = useTheme();

  const snippet = useQuery(api.codeSnippets.getSnippetById, {
    snippetId: snippetId as Id<"codeSnippets">,
  });
  const comments = useQuery(api.codeSnippets.getComments, {
    snippetId: snippetId as Id<"codeSnippets">,
  });

  if (snippet === undefined) return <SnippetLoadingSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] transition-colors">
      <main className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="bg-white dark:bg-[#121218] border border-gray-200 dark:border-[#ffffff0a] rounded-2xl p-6 sm:p-8 mb-6 backdrop-blur-xl shadow-sm dark:shadow-none">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center size-12 rounded-xl bg-gray-100 dark:bg-[#ffffff08] p-2.5">
                  <img
                    src={`/${snippet.language}.png`}
                    alt={`${snippet.language} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    {snippet.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-[#8b8b8d]">
                      <User className="w-4 h-4" />
                      <span>{snippet.userName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-[#8b8b8d]">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(snippet._creationTime).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-[#8b8b8d]">
                      <MessageSquare className="w-4 h-4" />
                      <span>{comments?.length} comments</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="inline-flex items-center px-3 py-1.5 bg-gray-100 dark:bg-[#ffffff08] text-gray-700 dark:text-[#808086] rounded-lg text-sm font-medium">
                {snippet.language}
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="mb-8 rounded-2xl overflow-hidden border border-gray-200 dark:border-[#ffffff0a] bg-white dark:bg-[#121218] shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-[#ffffff0a]">
              <div className="flex items-center gap-2 text-gray-600 dark:text-[#808086]">
                <Code className="w-4 h-4" />
                <span className="text-sm font-medium">Source Code</span>
              </div>
              <CopyButton code={snippet.code} />
            </div>
            <Editor
              height="600px"
              language={LANGUAGE_CONFIG[snippet.language].monacoLanguage}
              value={snippet.code}
              theme={theme === "dark" ? "vs-dark" : "light"}
              beforeMount={defineMonacoThemes}
              options={{
                minimap: { enabled: false },
                fontSize: 16,
                readOnly: true,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                renderWhitespace: "selection",
                fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                fontLigatures: true,
              }}
            />
          </div>

          <Comments snippetId={snippet._id} />
        </div>
      </main>
    </div>
  );
}
export default SnippetDetailPage;
