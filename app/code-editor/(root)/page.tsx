"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { Code2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { LANGUAGE_CONFIG } from "./_constants";

export default function NewCodeRoomPage() {
  const router = useRouter();
  const { userId, getToken } = useAuth();
  const createSnippet = useMutation(api.codeSnippets.createSnippet);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState(Object.keys(LANGUAGE_CONFIG)[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error("Please sign in to create a code room.");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a title.");
      return;
    }

    setIsSubmitting(true);
    try {
      const snippetId = await createSnippet({
        title,
        language,
        code: LANGUAGE_CONFIG[language].defaultCode,
      });
      const roomId = `snippet_${snippetId}`;
      toast.success("Code room created successfully!");
      router.push(`/code-editor/room/${roomId}`);
    } catch (error) {
      toast.error("Failed to create code room. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-6 w-6" />
            Create New Code Room
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="text-sm font-medium text-muted-foreground"
              >
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter code room title"
                className="mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="language"
                className="text-sm font-medium text-muted-foreground"
              >
                Language
              </label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(LANGUAGE_CONFIG).map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {LANGUAGE_CONFIG[lang].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Code Room"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
