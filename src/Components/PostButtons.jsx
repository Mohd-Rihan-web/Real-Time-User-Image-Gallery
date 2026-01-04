import React from "react";
import { id } from "@instantdb/react";
import { db } from "./instantDB";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";

/* =========================
   SLUG HELPER (LOCAL)
========================= */
const makeSlug = (text) => {
  if (!text) return "image";
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

function PostButtons({ postId, image }) {
  const navigate = useNavigate();

  /* =========================
     USER ID (PERSISTENT)
  ========================== */
  const userId = React.useMemo(() => {
    let savedId = localStorage.getItem("app_userId");
    if (!savedId) {
      savedId = id();
      localStorage.setItem("app_userId", savedId);
    }
    return savedId;
  }, []);

  /* =========================
     FETCH LIKES & COMMENTS (REAL-TIME)
  ========================== */
  // Ek hi query mein likes aur comments dono mangwa lete hain, performance achi rahegi
  const { data, isLoading } = db.useQuery({
    likes: {
      $: { where: { postId } },
    },
    comments: {
      $: { where: { postId } },
    },
  });

  // Likes logic
  const likes = data?.likes || [];
  const myLikeRecord = likes.find((l) => l.userId === userId);
  const hasLiked = !!myLikeRecord;

  // ✅ Comment Count Logic
  // Hum comments array ki length use karenge jo ki sabse reliable tarika hai
  const comments = data?.comments || [];
  const commentCount = comments.length;

  /* =========================
     LIKE / UNLIKE
  ========================== */
  const toggleLike = () => {
    if (hasLiked) {
      db.transact(db.tx.likes[myLikeRecord.id].delete());
    } else {
      db.transact(
        db.tx.likes[id()].update({
          postId,
          userId,
          serverCreatedAt: Date.now(),
        })
      );
    }
  };

  /* =========================
     COMMENT BUTTON
  ========================== */
  const openComments = () => {
    const slug = makeSlug(
      image?.alt_description || image?.description
    );

    navigate(`/post/${postId}/${slug}`, {
      state: { image },
    });
  };

  /* =========================
     UI
  ========================== */
  return (
    <div className="flex items-center gap-4 mt-2">
      {/* LIKE */}
      <button
        onClick={toggleLike}
        className={`flex items-center gap-1 text-sm transition-transform active:scale-90 ${
          hasLiked ? "text-red-500 hover:text-red-500 transition-colors" : "text-gray-400 hover:text-white transition-colors"
        } `}
      >
        <Heart
          size={20}
          fill={hasLiked ? "currentColor" : "none"}
        />
        <span>{likes.length}</span>
      </button>

      {/* COMMENT */}
      <button
        onClick={openComments}
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <MessageCircle size={20} />
        {/* Agar load ho raha hai toh '...' dikhayenge warna count */}
        <span>{commentCount}</span>
      </button>
    </div>
  );
}

export default PostButtons;