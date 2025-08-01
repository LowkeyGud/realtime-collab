"use client";
import { generateSummaryAction } from "@/app/actions/ai-summary";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import React, { useEffect, useRef, useState } from "react";

type ChatPageProps = {
  params: Promise<{ orgId: string }>;
};

export default function ChatPage({ params }: ChatPageProps) {
  const { organization } = useOrganization();
  const { user } = useUser();

  const { orgId } = React.use(params);

  const chatGroup = useQuery(api.chatGroups.getByOrgId, {
    organizationId: orgId,
  });
  const messages = useQuery(
    api.message.getMessages,
    chatGroup ? { chatGroupId: chatGroup._id } : "skip"
  );

  const sendMessage = useMutation(api.message.sendMessage);
  const generateUploadUrl = useMutation(api.message.generateUploadUrl);

  const [messageText, setMessageText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [aiSummaryExpanded, setAiSummaryExpanded] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Generate AI summary when messages change
  useEffect(() => {
    const generateSummary = async () => {
      if (!messages || messages.length < 5) {
        setAiSummary(null);
        return;
      }

      setIsLoadingSummary(true);
      try {
        const summary = await generateSummaryAction(
          messages.map((msg) => ({
            username: msg.username,
            body: msg.body,
            _creationTime: msg._creationTime,
          }))
        );
        setAiSummary(summary);
        if (summary) {
          setAiSummaryExpanded(true);
        }
      } catch (error) {
        console.error("Error generating summary:", error);
        setAiSummary(null);
      } finally {
        setIsLoadingSummary(false);
      }
    };

    // Debounce summary generation
    const timeoutId = setTimeout(generateSummary, 2000);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedImage]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatGroup || isSending) return;

    setIsSending(true);
    try {
      if (selectedImage) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          body: selectedImage,
        });
        const { storageId } = await result.json();
        await sendMessage({
          imageStorageId: storageId,
          chatGroupId: chatGroup._id,
          body: messageText,
        });
      } else {
        await sendMessage({
          chatGroupId: chatGroup._id,
          body: messageText,
        });
      }

      setMessageText("");
      setSelectedImage(null);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (!chatGroup) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!organization || !user || organization.id !== orgId) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-background">
        <div className="text-destructive text-lg font-medium">
          Access Denied
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground relative h-[calc(100vh-4rem)]">
      {/* AI Summary Section */}
      {(aiSummary || isLoadingSummary) && (
        <div className="border-b border-border bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 relative z-10">
          <div className="p-4">
            <button
              onClick={() => setAiSummaryExpanded(!aiSummaryExpanded)}
              className="flex items-center justify-between w-full text-left hover:bg-black/5 dark:hover:bg-white/5 rounded-lg p-2 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  {isLoadingSummary ? (
                    <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                  ) : (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <span className="font-medium text-sm text-foreground">
                  {isLoadingSummary ? "Generating AI Summary..." : "AI Summary"}
                </span>
              </div>
              <svg
                className={`w-4 h-4 text-muted-foreground transition-transform ${
                  aiSummaryExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {aiSummaryExpanded && aiSummary && (
              <div className="mt-2 p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-border/50">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {aiSummary}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        className={`absolute inset-0 ${aiSummary || isLoadingSummary ? "pt-[80px]" : "pt-4"} pb-20 overflow-y-auto p-4 space-y-4`}
      >
        {messages?.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.userId === user.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`w-[70%] flex items-start gap-3 p-3 rounded-xl transition-all ${
                msg.userId === user.id
                  ? "bg-primary/10"
                  : "bg-muted border border-border"
              } hover:bg-opacity-90`}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={msg.user?.imageUrl} alt={msg.username} />
                <AvatarFallback className="text-sm">
                  {msg.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-medium text-foreground">
                    {msg.username}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(msg._creationTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="mt-1 text-foreground">{msg.body}</p>
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="Chat image"
                    className="mt-2 max-w-[200px] rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setFullScreenImage(msg.imageUrl)}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background"
      >
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all bg-background text-foreground placeholder-muted-foreground"
            />
            {previewUrl && (
              <div className="absolute bottom-full left-0 mb-2">
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Image preview"
                    className="w-12 h-12 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>

          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
              className="hidden"
            />
            <div className="p-2 hover:bg-accent rounded-lg transition-colors">
              <svg
                className="w-5 h-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828l6.586-6.586M12 3v6m0 0H6m6 0h6"
                />
              </svg>
            </div>
          </label>

          <button
            type="submit"
            disabled={(!messageText && !selectedImage) || isSending}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:bg-muted-foreground disabled:text-muted disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isSending && (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-current"></div>
            )}
            Send
          </button>
        </div>
      </form>

      {fullScreenImage && (
        <div
          className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setFullScreenImage(null)}
        >
          <img
            src={fullScreenImage}
            alt="Full screen chat image"
            className="max-w-[90%] max-h-[90%] object-contain"
          />
          <button
            className="absolute top-4 right-4 bg-background text-foreground rounded-full w-8 h-8 flex items-center justify-center text-lg border border-border"
            onClick={() => setFullScreenImage(null)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
