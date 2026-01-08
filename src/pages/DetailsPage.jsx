import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { id } from "@instantdb/react";
import { db } from "../Components/instantDB";
import { Download } from "lucide-react";

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
          Authorization: `Client-ID Fayy0bQbNYFe7V25NHTWeCAHRLSAnMmdiT3LJPW1VZU`,
        },
      })
      .then((res) => setImage(res.data))
      .catch(() => setImage(null));
  }, [postId, image]);

  /* =========================
     FETCH COMMENTS (REAL-TIME)
     No ordering / sorting now
  ========================== */
  const { data, isLoading } = db.useQuery({
    comments: {
      $: {
        where: { postId },
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

  /* =========================
     ADD COMMENT (NO TIME FIELD)
  ========================== */
  const addComment = () => {
    if (!comment.trim()) return;

    db.transact(
      db.tx.comments[id()].update({
        postId,
        userId,
        text: comment.trim(),
      })
    );

    setComment("");
  };

  const deleteComment = (commentId) => {
    db.transact(db.tx.comments[commentId].delete());
  };

  if (!image) {
    return <p className="text-center mt-10 text-gray-500">Image not found</p>;
  }

  return (
    <div className="w-full text-white mx-auto p-4 flex justify-center">
      <div className="w-[90%] lg:w-1/2">
        
        {/* IMAGE */}
        <div className="relative group mb-4">
          <img
            src={image.urls.full || image.urls.regular}
            alt={image.alt_description}
            className="w-full rounded-lg object-contain"
          />

          <button
            onClick={handleDownload}
            className="absolute top-4 right-4 bg-white text-black p-2 rounded-full shadow-lg"
          >
            <Download size={20} strokeWidth={2.5} />
          </button>
        </div>

        <h2 className="capitalize text-2xl text-gray-300 mb-6">
          {image.alt_description || "Untitled Image"}
        </h2>

        {/* COMMENT INPUT */}
        <div className="flex gap-2 mb-6">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 bg-transparent border border-gray-600 rounded px-3 py-2 text-white outline-none focus:border-white"
          />
          <button
            onClick={addComment}
            className="bg-white text-black px-4 rounded font-medium active:scale-95"
          >
            Post
          </button>
        </div>

        <p>{comments.length ? "" : "No Comments Yet"}</p>

        {/* COMMENTS */}
        <div className="space-y-3">
          {isLoading && <p className="text-gray-500 italic">Loading comments...</p>}

          {comments.map((c) => (
            <div
              key={c.id}
              className="bg-gray-800 rounded p-3 text-sm flex justify-between items-center"
            >
              <p>{c.text}</p>

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
