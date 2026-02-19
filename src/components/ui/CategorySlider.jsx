import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import { fetchCategories } from "../../api/api";

function CategorySlider() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await fetchCategories();
        setCategories(Array.isArray(cats) ? cats : []);
      } catch (err) {
        console.error("Fetch categories error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleClick = (categoryKey) => {
    navigate(`/category/${categoryKey}`);
  };

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>;
  }

  if (!categories.length) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>No categories found</div>;
  }

  return (
    <>
      <style>{`
        .category-bg {
          background: #e5e3e1;
          padding: 70px 0 25px 0;
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
                  src={
                    cat.image
                      ? cat.image.startsWith("http")
                        ? cat.image
                        : cat.image
                      : "/src/assets/default-category.png"
                  }
                  alt={cat.pageTitle || "category"}
                  className="category-img"
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
