"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, getErrorMessage, getApiUrl } from "@/lib/api";
import { Header, Container } from "@/components/layout";
import { Button, Card, Label, Input } from "@/components/ui";

interface Post {
  id: number;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
  attachmentFileName?: string;
  attachmentOriginalName?: string;
  attachmentContentType?: string;
}

export default function FeedPage() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    router.push('/login');
  };

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/login');
      return;
    }
    setLoading(false);
  }, [router]);

  const { data: posts = [] } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await api.api.postsList();
      return response.data as Post[];
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; authorName: string; file?: File }) => {
      if (data.file) {
        return api.api.postsWithFileCreate({
          title: data.title,
          content: data.content,
          authorName: data.authorName,
          file: data.file,
        });
      } else {
        return api.api.postsCreate({
          title: data.title,
          content: data.content,
          authorName: data.authorName,
        });
      }
    },
    onSuccess: () => {
      setNewPostTitle("");
      setNewPostContent("");
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error("Error creating post:", error);
    },
  });

  const handlePostSubmit = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    createPostMutation.mutate({
      title: newPostTitle,
      content: newPostContent,
      authorName: user?.email || "Anonymous",
      file: selectedFile || undefined,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('da-DK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadFile = async (post: Post) => {
    if (!post.attachmentFileName) return;

    try {
      const response = await fetch(getApiUrl(`/api/posts/download/${post.id}`));
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = post.attachmentOriginalName || post.attachmentFileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleBold = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      if (selectedText) {
        const boldText = `<strong>${selectedText}</strong>`;
        const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const newContent = newPostContent.substring(0, start) + boldText + newPostContent.substring(end);
          setNewPostContent(newContent);
        }
      }
    }
  };

  const handleItalic = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      if (selectedText) {
        const italicText = `<em>${selectedText}</em>`;
        const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const newContent = newPostContent.substring(0, start) + italicText + newPostContent.substring(end);
          setNewPostContent(newContent);
        }
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
      <div className="text-green-800 text-xl">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <style jsx>{`
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
          font-weight: 700;
          margin: 0.5em 0 0.25em 0;
          color: var(--foreground);
        }
        .prose strong {
          font-weight: 700;
          color: var(--foreground);
        }
        .prose em {
          font-style: italic;
          color: var(--foreground);
          opacity: 0.8;
        }
        .prose p {
          color: var(--foreground);
          margin: 0.75em 0;
        }
        .rich-text-editor {
          color: var(--foreground);
        }
        .rich-text-editor:focus {
          color: var(--foreground);
        }
      `}</style>

      <Header />

      <main>
        <Container size="md" className="py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Familiefeed</h1>
          <p className="text-xl text-green-600">Del dine oplevelser og forbind med andre familiemedlemmer</p>
        </div>

        {/* Create Post Form */}
        <Card className="p-8 mb-8">
          <h3 className="text-2xl font-semibold text-green-800 mb-6">Create a New Post</h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="post-title">Title</Label>
              <Input
                id="post-title"
                type="text"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="Enter post title..."
              />
            </div>

            <div>
              <Label htmlFor="content-editor">Content</Label>
              <div className="border border-green-200 rounded-lg overflow-hidden">
                <div className="bg-green-50 px-4 py-2 border-b border-green-200 flex space-x-2">
                  <Button
                    type="button"
                    onClick={handleBold}
                    size="sm"
                    className="font-bold"
                  >
                    B
                  </Button>
                  <Button
                    type="button"
                    onClick={handleItalic}
                    size="sm"
                    className="italic"
                  >
                    I
                  </Button>
                </div>
                <textarea
                  id="content-editor"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rich-text-editor focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none border-0"
                  placeholder="Share your thoughts..."
                />
              </div>
            </div>

            <div>
              <Label htmlFor="file-upload">Attach File (optional)</Label>
              <input
                id="file-upload"
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {selectedFile && (
                <p className="mt-2 text-sm text-green-600">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <Button
              onClick={handlePostSubmit}
              disabled={createPostMutation.isPending || !newPostTitle.trim() || !newPostContent.trim()}
              fullWidth
              size="lg"
              isLoading={createPostMutation.isPending}
            >
              {createPostMutation.isPending ? "Posting..." : "Create Post"}
            </Button>
          </div>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-green-600 text-lg">No posts yet. Be the first to share something!</p>
            </div>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-green-800 mb-2">{post.title}</h3>
                    <p className="text-sm text-green-600">
                      By {post.authorName} on {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>

                <div
                  className="prose prose-green max-w-none mb-4 text-gray-900"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {post.attachmentFileName && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">Attachment:</p>
                        <p className="text-sm text-green-600">{post.attachmentOriginalName}</p>
                      </div>
                      <Button
                        onClick={() => downloadFile(post)}
                        size="sm"
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
        </Container>
      </main>
    </div>
  );
}