"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useMounted from "@/hooks/useMounted";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useRoom, useStorage } from "@liveblocks/react";
import { Editor } from "@monaco-editor/react";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import { RotateCcwIcon, ShareIcon, TypeIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../_constants";
import { EditorPanelSkeleton } from "./EditorPanelSkeleton";
import ShareSnippetDialog from "./ShareSnippetDialog";

export function EditorPanel() {
  const params = useParams();
  const snippetIdRaw = params?.snippetId as string;
  const snippetId = snippetIdRaw
    ? (snippetIdRaw.replace("snippet_", "") as Id<"codeSnippets">)
    : undefined;
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const { language, theme, fontSize, editor, setFontSize, setEditor } =
    useCodeEditorStore();

  const mounted = useMounted();
  const room = useRoom();
  const collaborativeCode = useStorage((root) => root.code);
  const snippet = useQuery(api.codeSnippets.getSnippetById, {
    snippetId: snippetId as Id<"codeSnippets">,
  });
  const updateSnippet = useMutation(api.codeSnippets.updateSnippet);
  const lastLocalChange = useRef<string | null>(null);
  const lastCursorPosition = useRef<{
    lineNumber: number;
    column: number;
  } | null>(null);

  useEffect(() => {
    if (!snippet || !editor) return;

    const savedCode = localStorage.getItem(`editor-code-${language}`);
    const initialCode =
      savedCode || snippet.code || LANGUAGE_CONFIG[language].defaultCode;
    editor.setValue(initialCode);

    // Initialize Liveblocks storage with initial code if empty
    const initializeStorage = async () => {
      const { root } = await room.getStorage(); // Get the storage root (LiveObject)
      const collaborativeCode = root.get("code"); // Get the 'code' property from storage

      if (!collaborativeCode) {
        // If 'code' doesn't exist, initialize it
        root.set("code", initialCode);
      }
    };

    initializeStorage();
  }, [language, editor, snippet, room]);

  useEffect(() => {
    const savedFontSize = localStorage.getItem("editor-font-size");
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
  }, [setFontSize]);

  useEffect(() => {
    if (
      !collaborativeCode ||
      !editor ||
      collaborativeCode === editor.getValue() ||
      collaborativeCode === lastLocalChange.current
    )
      return;

    // Preserve cursor position and selection
    const currentPosition = editor.getPosition();
    const currentSelection = editor.getSelection();
    lastCursorPosition.current = currentPosition
      ? {
          lineNumber: currentPosition.lineNumber,
          column: currentPosition.column,
        }
      : null;

    // Update editor value
    editor.setValue(collaborativeCode);

    // Restore cursor position and selection
    if (lastCursorPosition.current) {
      editor.setPosition(lastCursorPosition.current);
      if (currentSelection) {
        editor.setSelection(currentSelection);
      }
      editor.revealPositionInCenter(lastCursorPosition.current);
    }
  }, [collaborativeCode, editor]);

  const handleRefresh = async () => {
    const defaultCode = LANGUAGE_CONFIG[language].defaultCode;
    if (editor) {
      editor.setValue(defaultCode);
      lastLocalChange.current = defaultCode;

      // Update Liveblocks storage
      const { root } = await room.getStorage(); // Get the storage root (LiveObject)
      root.set("code", defaultCode); // Update the 'code' property

      if (snippetId) {
        updateSnippet({
          id: snippetId as Id<"codeSnippets">,
          code: defaultCode,
        });
      }
    }
    localStorage.removeItem(`editor-code-${language}`);
  };

  const handleEditorChange = useCallback(
    debounce(async (value: string | undefined) => {
      if (value) {
        lastLocalChange.current = value;
        localStorage.setItem(`editor-code-${language}`, value);

        // Update Liveblocks storage
        const { root } = await room.getStorage(); // Get the storage root (LiveObject)
        root.set("code", value); // Update the 'code' property

        if (snippetId) {
          updateSnippet({ id: snippetId as Id<"codeSnippets">, code: value });
        }
      }
    }, 300),
    [language, snippetId, room, updateSnippet]
  );

  const handleFontSizeChange = (newSize: number) => {
    const size = Math.min(Math.max(newSize, 12), 24);
    setFontSize(size);
    localStorage.setItem("editor-font-size", size.toString());
  };

  if (!mounted || !snippet) return <EditorPanelSkeleton />;

  return (
    <div className="relative">
      <div className="relative bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1e1e2e] ring-1 ring-white/5">
              <Image
                src={"/" + language + ".png"}
                alt="Logo"
                width={24}
                height={24}
              />
            </div>
            <div>
              <h2 className="text-sm font-medium text-white">Code Editor</h2>
              <p className="text-xs text-gray-500">
                Collaborate and execute your code
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Font Size Slider */}
            <div className="flex items-center gap-3 px-3 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-white/5">
              <TypeIcon className="size-4 text-gray-400" />
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) =>
                    handleFontSizeChange(parseInt(e.target.value))
                  }
                  className="w-20 h-1 bg-gray-600 rounded-lg cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-400 min-w-[2rem] text-center">
                  {fontSize}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-lg ring-1 ring-white/5 transition-colors"
              aria-label="Reset to default code"
            >
              <RotateCcwIcon className="size-4 text-gray-400" />
            </motion.button>

            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsShareDialogOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg overflow-hidden bg-gradient-to-r
               from-blue-500 to-blue-600 opacity-90 hover:opacity-100 transition-opacity"
            >
              <ShareIcon className="size-4 text-white" />
              <span className="text-sm font-medium text-white">Share</span>
            </motion.button>
          </div>
        </div>

        {/* Editor */}
        <div className="relative group rounded-xl overflow-hidden ring-1 ring-white/[0.05]">
          <Editor
            height="600px"
            language={LANGUAGE_CONFIG[language].monacoLanguage}
            value={
              (collaborativeCode as string) || (snippet.code as string) || ""
            }
            onChange={handleEditorChange}
            theme={theme}
            beforeMount={defineMonacoThemes}
            onMount={(editor) => setEditor(editor)}
            options={{
              minimap: { enabled: false },
              fontSize,
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 16, bottom: 16 },
              renderWhitespace: "selection",
              fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
              fontLigatures: true,
              cursorBlinking: "smooth",
              smoothScrolling: true,
              contextmenu: true,
              renderLineHighlight: "all",
              lineHeight: 1.6,
              letterSpacing: 0.5,
              roundedSelection: true,
              scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              },
            }}
          />
        </div>
      </div>
      {isShareDialogOpen && (
        <ShareSnippetDialog onClose={() => setIsShareDialogOpen(false)} />
      )}
    </div>
  );
}

export default EditorPanel;
