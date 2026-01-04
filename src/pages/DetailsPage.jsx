import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { id } from "@instantdb/react";
import { db } from "../Components/instantDB";
import { Download } from "lucide-react"; // Icon import kiya

function DetailsPage() {
  const { postId } = useParams();
  const { state } = useLocation();

  const [image, setImage] = useState(state?.image || null);
  const [comment, setComment] = useState("");

  /* =========================
     USER ID (PERSISTENT)
  ========================== */
  const userId = useMemo(() => {
    let uid = localStorage.getItem("app_userId");
    if (!uid) {
      uid = id();
      localStorage.setItem("app_userId", uid);
    }
    return uid;
  }, []);

  /* =========================
     IMAGE FALLBACK
  ========================== */
  useEffect(() => {
    if (image) return;

    axios
      .get(`https://api.unsplash.com/photos/${postId}`, {
        headers: {
          Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_KEY}`,
        },
      })
      .then((res) => setImage(res.data))
      .catch(() => setImage(null));
  }, [postId, image]);

  /* =========================
     FETCH COMMENTS (REAL-TIME)
  ========================== */
  const { data, isLoading } = db.useQuery({
    comments: {
      $: {
        where: { postId },
        order: { serverCreatedAt: "asc" },
      },
    },
  });

  const comments = data?.comments || [];

  /* =========================
     DOWNLOAD FUNCTION
  ========================== */
  const handleDownload = async () => {
    const imageUrl = image.urls.full || image.urls.regular;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `unsplash-${postId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const addComment = () => {
    if (!comment.trim()) return;
    db.transact(
      db.tx.comments[id()].update({
        postId,
        userId,
        text: comment.trim(),
        createdAt: Date.now(),
      })
    );
    setComment("");
  };

  const deleteComment = (commentId) => {
    db.transact(db.tx.comments[commentId].delete());
  };

  const timeAgo = (timestamp) => {
    if (!timestamp) return "just now";
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  };

  if (!image) {
    return <p className="text-center mt-10 text-gray-500">Image not found</p>;
  }

  return (
    <div className="w-full text-white mx-auto p-4 flex justify-center">
      <div className="w-[90%] lg:w-1/2">
        
        {/* IMAGE CONTAINER - Isse 'relative' rakha hai taaki button iske upar dikhe */}
        <div className="relative group mb-4">
          <img
            src={image.urls.full || image.urls.regular}
            alt={image.alt_description}
            className="w-full rounded-lg object-contain"
          />

          {/* DOWNLOAD BUTTON - Top Right corner */}
          <button
            onClick={handleDownload}
            className="absolute top-4 right-4 bg-white text-black p-2 rounded-full shadow-lg transition-colors hover:text-gray-400 flex items-center justify-center"
            title="Download Image"
          >
            <Download size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* TITLE */}
        <h2 className="capitalize text-2xl text-gray-300 mb-6">
          {image.alt_description || "Untitled Image"}
        </h2>
        {/* COMMENT INPUT */}
        <div className="flex gap-2 mb-6">

          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 bg-transparent border border-gray-600 rounded px-3 py-2 text-white outline-none focus:border-white transition-all"
          />
          <button
            onClick={addComment}
            className="bg-white text-black px-4 rounded font-medium active:scale-95 transition-transform"
          >
            Post
          </button>
        </div>
        <p>{comments.length ? "": "No Comments Yet"}</p>

        {/* COMMENTS LIST */}
        <div className="space-y-3">
          {isLoading && <p className="text-gray-500 italic">Loading comments...</p>}

          {comments.map((c) => (
            <div
              key={c.id}
              className="bg-gray-800 rounded p-3 text-sm flex justify-between items-center"
            >
              <div>
                <p>{c.text}</p>
                <span className="text-gray-400 text-xs">
                  {timeAgo(c.serverCreatedAt)}
                </span>
              </div>

              {c.userId === userId && (
                <button
                  onClick={() => deleteComment(c.id)}
                  className="text-red-500 text-xs ml-2 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DetailsPage;