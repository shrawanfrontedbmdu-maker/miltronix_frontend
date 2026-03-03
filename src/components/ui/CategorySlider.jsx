import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import { fetchCategories } from "../../api/api";

// ─── Global cache — component unmount hone pe bhi data rehta hai ──────────────
let categoriesCache = null;

function CategorySlider() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(categoriesCache || []);

  useEffect(() => {
    // Cache hit — koi fetch nahi
    if (categoriesCache) {
      setCategories(categoriesCache);
      return;
    }

    const loadCategories = async () => {
      try {
        const cats = await fetchCategories();
        const data = Array.isArray(cats) ? cats : [];
        categoriesCache = data; // cache mein save
        setCategories(data);
      } catch (err) {
        console.error("Fetch categories error:", err);
      }
    };

    loadCategories();
  }, []);

  const handleClick = (categoryKey) => {
    navigate(`/category/${categoryKey}`);
  };

  if (!categories.length) return null;

  return (
    <>
      <style>{`
        .category-bg {
          background: #e5e3e1;
          padding: 30px 0 25px 0;
        }
        .category-slide {
          text-align: center;
          cursor: pointer;
        }
        .category-img {
          width: 100px;
          height: 100px;
          object-fit: contain;
          display: block;
          margin: auto;
          transition: transform 0.3s ease;
        }
        .category-img:hover {
          transform: scale(1.05);
        }
        .category-title {
          margin-top: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #222;
          text-transform: uppercase;
        }
      `}</style>

      <section className="category-bg">
        <div className="container">
          <Swiper
            slidesPerView={3}
            spaceBetween={20}
            breakpoints={{
              576: { slidesPerView: 4 },
              768: { slidesPerView: 5 },
              992: { slidesPerView: 7 },
            }}
          >
            {categories.map((cat) => (
              <SwiperSlide
                key={cat._id}
                className="category-slide"
                onClick={() => handleClick(cat.categoryKey)}
              >
                <img
                  src={cat.image || "/src/assets/default-category.png"}
                  alt={cat.pageTitle || "category"}
                  className="category-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "/src/assets/default-category.png";
                  }}
                />
                <p className="category-title">{cat.pageTitle}</p>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
}

export default CategorySlider;
