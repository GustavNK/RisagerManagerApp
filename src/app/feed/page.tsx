"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, getErrorMessage, getApiUrl } from "@/lib/api";

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
  const [user, setUser] = useState<{ username: string } | null>(null);
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
      authorName: user?.username || "Anonymous",
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
          color: #1F2937;
        }
        .prose strong {
          font-weight: 700;
          color: #111827;
        }
        .prose em {
          font-style: italic;
          color: #374151;
        }
        .prose p {
          color: #1F2937;
          margin: 0.75em 0;
        }
        .rich-text-editor {
          color: #1F2937;
        }
        .rich-text-editor:focus {
          color: #1F2937;
        }
      `}</style>

      {/* Header */}
      <header className="bg-green-800/90 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo and Site Name */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">🌲</span>
              </div>
              <h1 className="text-3xl font-bold text-white">Risager Plantage</h1>
            </Link>

            {/* Navigation and User Section */}
            <div className="flex items-center space-x-6">
              {/* Navigation */}
              <nav className="hidden md:flex space-x-3 items-center">
                <Link href="/" className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                  Home
                </Link>
                <Link href="/booking" className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                  Book Now
                </Link>
                <Link href="/bookings" className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                  View Bookings
                </Link>
              </nav>

              {/* Divider */}
              <div className="hidden md:block w-px h-6 bg-green-300"></div>

              {/* User Section */}
              <div className="flex items-center space-x-4">
                <span className="text-green-100">
                  Welcome, <span className="font-semibold">{user?.username}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-green-800 mb-4">Community Feed</h2>
          <p className="text-xl text-green-600">Share your experiences and connect with other guests</p>
        </div>

        {/* Create Post Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-green-100 mb-8">
          <h3 className="text-2xl font-semibold text-green-800 mb-6">Create a New Post</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Title</label>
              <input
                type="text"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter post title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Content</label>
              <div className="border border-green-200 rounded-lg overflow-hidden">
                <div className="bg-green-50 px-4 py-2 border-b border-green-200 flex space-x-2">
                  <button
                    type="button"
                    onClick={handleBold}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={handleItalic}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors italic"
                  >
                    I
                  </button>
                </div>
                <textarea
                  id="content-editor"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rich-text-editor focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Share your thoughts..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Attach File (optional)</label>
              <input
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

            <button
              onClick={handlePostSubmit}
              disabled={createPostMutation.isPending || !newPostTitle.trim() || !newPostContent.trim()}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-3 px-6 rounded-lg transition-colors font-medium"
            >
              {createPostMutation.isPending ? "Posting..." : "Create Post"}
            </button>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-green-600 text-lg">No posts yet. Be the first to share something!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-green-100">
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
                      <button
                        onClick={() => downloadFile(post)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}