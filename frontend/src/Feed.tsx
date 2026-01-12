import React, { useEffect, useState } from "react";
import api from "./api/axios";
import axios from "axios";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Plus,
  LogOut,
  Trash2,
  Image as ImageIcon,
  X,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Define the interface based on your backend Pydantic model
interface Author {
  id: string;
  email: string;
}

interface Post {
  id: string;
  caption: string;
  url: string;
  file_name: string;
  file_type?: string; // MIME type of the uploaded file
  created_at: string;
  author?: Author; // Optional depending on your exact backend response
  user_id?: string; // Fallback if author object isn't fully loaded
  is_owner?: boolean; // From the custom field we discussed adding
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCaption, setUploadCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const navigate = useNavigate();

  // Fetch Feed
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:8000/feed", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
    } catch (err) {
      setError("Failed to load feed. Please try again.");
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [navigate]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle Upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setIsUploading(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("caption", uploadCaption);

    try {
      await api.post("http://localhost:8000/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset and refresh
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadCaption("");
      setPreviewUrl(null);
      fetchPosts(); // Refresh feed
    } catch (err) {
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove from UI immediately
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (err) {
      alert("Failed to delete post.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-gray-100 z-40 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <div className="w-3 h-3 bg-current rounded-full" />
          </div>
          PixelShare
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" /> New Post
          </button>
          <button
            onClick={handleLogout}
            title="Log out"
            aria-label="Log out"
            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto pt-24 pb-20 px-4">
        {/* Mobile Upload Button */}
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="sm:hidden w-full mb-6 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" /> Share a Moment
        </button>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-center text-sm">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-gray-500 text-sm">Loading your feed...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              No posts yet
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Be the first to share something!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                      {(post.author?.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        {post.author?.email.split("@")[0] ||
                          `User ${post.user_id?.slice(0, 5)}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.created_at).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Delete Button (Only show if owner) */}
                  {/* Note: Adjust logic based on how your backend returns ownership info */}
                  <div className="relative group">
                    <button
                      type="button"
                      title="More options"
                      className="p-2 text-gray-400 hover:text-gray-600"
                      aria-label="More options"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    {/* Simple Dropdown for Demo */}
                    <div className="absolute right-0 top-full hidden group-hover:block bg-white border border-gray-100 shadow-xl rounded-xl p-1 min-w-[120px] z-10">
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {post.file_type?.includes("video") ? (
                    <video
                      src={post.url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={post.url}
                      alt={post.caption}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>

                {/* Actions Bar */}
                <div className="p-4 pb-2 flex items-center gap-4">
                  <button
                    title="Like this post"
                    className="text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Heart className="w-6 h-6" />
                  </button>
                  <button
                    title="Comment on this post"
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    <MessageCircle className="w-6 h-6" />
                  </button>
                  <button
                    title="Share this post"
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>

                {/* Caption */}
                <div className="px-4 pb-4">
                  {post.caption && (
                    <p className="text-sm text-gray-900 leading-relaxed">
                      <span className="font-semibold mr-2">
                        {post.author?.email.split("@")[0]}
                      </span>
                      {post.caption}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Create new post</h3>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                title="Close"
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6">
              {/* Image Preview Area */}
              <div className="mb-6">
                {previewUrl ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setUploadFile(null);
                        setPreviewUrl(null);
                      }}
                      title="Remove selected file"
                      aria-label="Remove selected file"
                      className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 hover:border-indigo-500 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <ImageIcon className="w-6 h-6 text-indigo-600" />
                      </div>
                      <p className="mb-1 text-sm text-gray-500">
                        <span className="font-semibold text-indigo-600">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">
                        SVG, PNG, JPG or GIF
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>

              {/* Caption Input */}
              <div className="mb-6">
                <textarea
                  placeholder="Write a caption..."
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  className="w-full p-3 text-black bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none h-24 text-sm"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!uploadFile || isUploading}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                  </>
                ) : (
                  "Share Post"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
