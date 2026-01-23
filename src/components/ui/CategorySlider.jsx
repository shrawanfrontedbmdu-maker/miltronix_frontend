import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../../api/api";

const BACKEND_URL = "http://localhost:3000";

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
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading categories...</div>;

  if (!categories.length)
    return <div style={{ padding: "2rem", textAlign: "center" }}>No categories found</div>;

  return (
    <section className="category-bg">
      <div className="container">
        <Swiper
          slidesPerView={3}
          spaceBetween={20}
          breakpoints={{
            768: { slidesPerView: 4, spaceBetween: 30 },
            992: { slidesPerView: 7, spaceBetween: 30 },
          }}
          className="mySwiper"
        >
          {categories.map((cat) => (
            <SwiperSlide
              key={cat._id}
              className="text-center"
              style={{ cursor: "pointer" }}
              onClick={() => handleClick(cat.categoryKey)}
            >
              <img
                src={
                  cat.image
                    ? `${BACKEND_URL}${cat.image}`
                    : "/src/assets/default-category.png"
                }
                alt={cat.pageTitle || "category"}
                className="category-img"
              />
              <p className="category-title">{cat.pageTitle}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default CategorySlider;
