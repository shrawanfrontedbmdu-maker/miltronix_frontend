import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import { fetchCategories } from "../../api/api";

const BACKEND_URL = "https://miltronix-backend-1.onrender.com";

function CategorySlider() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await fetchCategories();
        setCategories(cats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleClick = (categoryKey) => {
    navigate(`/category/${categoryKey}`);
  };

  if (loading)
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading categories...
      </div>
    );

  if (!categories.length)
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        No categories found
      </div>
    );

  return (
    <>
      {/* Inline CSS */}
     <style>{`
  .category-bg {
    background: #e5e3e1;
    padding: 70px 0 25px 0; /* increased top padding */
  }

  .category-swiper {
    padding: 10px 0;
  }

  .category-slide {
    text-align: center;
    cursor: pointer;
  }

  .category-circle {
    width: 110px; /* increased from 90px */
    height: 110px; /* increased from 90px */
    margin: auto;
    border-radius: 50%;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  }

  .category-circle:hover {
    transform: scale(1.05);
  }

  .category-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  .category-title {
    margin-top: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #222;
    text-transform: uppercase;
  }

  @media (max-width: 576px) {
    .category-circle {
      width: 90px; /* increased from 70px */
      height: 90px; /* increased from 70px */
    }

    .category-title {
      font-size: 12px;
    }
  }
`}</style>


      <section className="category-bg">
        <div className="container">
          <Swiper
            slidesPerView={3}
            spaceBetween={20}
            breakpoints={{
              576: { slidesPerView: 4, spaceBetween: 20 },
              768: { slidesPerView: 5, spaceBetween: 25 },
              992: { slidesPerView: 7, spaceBetween: 30 },
            }}
            className="category-swiper"
          >
            {categories.map((cat) => (
              <SwiperSlide
                key={cat._id}
                className="category-slide"
                onClick={() => handleClick(cat.categoryKey)}
              >
                <div className="category-circle">
                  <img
                    src={
                      cat.image
                        ? `${BACKEND_URL}${cat.image}`
                        : "/src/assets/default-category.png"
                    }
                    alt={cat.pageTitle || "category"}
                    className="category-img"
                  />
                </div>
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
