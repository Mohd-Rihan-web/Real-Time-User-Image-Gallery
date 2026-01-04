import { useState, React } from "react";
import axios from "axios";
import { useEffect, useRef } from "react";
import PostButtons from "./PostButtons";

function ImageGrid({ searchItem }) {
  const [images, setImages] = useState([]);
  const [Item, setItem] = useState("nature");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef(null);
  const lastImageRef = useRef(null);

  useEffect(() => {
    if (searchItem && searchItem.trim() !== "") {
      setItem(searchItem.trim());
    } else {
      setItem("mountains");
    }

    setImages([]);
    setPage(1);
  }, [searchItem]);

  useEffect(() => {
    fetchImages();
  }, [Item, page]);

 const fetchImages = async () => {
  setLoading(true);

  try {
    let response;
    let newImages = [];

    if (Item) {
      response = await axios.get(
        `https://api.unsplash.com/search/photos`,
        {
          params: {
            query: Item,
            page: page,
            per_page: 12,
            client_id: "Fayy0bQbNYFe7V25NHTWeCAHRLSAnMmdiT3LJPW1VZU",
          },
        }
      );

      newImages = response.data.results;
    } else {
      response = await axios.get(
        `https://api.unsplash.com/photos`,
        {
          params: {
            page: page,
            per_page: 12,
            client_id: "Fayy0bQbNYFe7V25NHTWeCAHRLSAnMmdiT3LJPW1VZU",
          },
        }
      );

      newImages = response.data;
    }

    // ✅ DEDUPLICATION YAHI PE
    setImages((prev) => {
      const existingIds = new Set(prev.map((img) => img.id));

      const uniqueNewImages = newImages.filter(
        (img) => !existingIds.has(img.id)
      );

      return [...prev, ...uniqueNewImages];
    });
  } catch (error) {
    console.error("Failed to load images", error);
  } finally {
    setLoading(false);
  }
};

  // 3️⃣ Infinite scroll (minimal change)
  useEffect(() => {
    if (loading) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });

    if (lastImageRef.current) {
      observerRef.current.observe(lastImageRef.current);
    }
  }, [loading]);

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-4">
      {images.map((img, index) => {
        const triggerIndex = images.length - 2;
        const shouldObserve = index === triggerIndex;

        return (
          <div
            key={img.id}
            ref={shouldObserve ? lastImageRef : null}
            className="mb-4 break-inside-avoid"
          >
            <a href={img.urls.full}>
              <img
              src={img.urls.regular}
              alt={img.alt_description}
              loading="lazy"
              className="w-full rounded-xl"
            />
            </a>
            <div><PostButtons postId={img.id} image={img}/></div>
          </div>
        );
      })}

      {loading && (
          <p className="w-full text-center text-gray-500 mt-6">
            Loading more images...
          </p>
      )}
    </div>
  );
}

export default ImageGrid;
