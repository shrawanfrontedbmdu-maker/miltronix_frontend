import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../../data/mockData';

function CategorySlider() {
  const navigate = useNavigate();

  const handleCategoryClick = (link) => {
    navigate(link);
  };

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
          {categories.map((category) => (
            <SwiperSlide 
              key={category.name} 
              className="text-center" 
              style={{ cursor: 'pointer' }}
              onClick={() => handleCategoryClick(category.link)}
            >
              <img src={category.img} className="category-img" alt={category.name} />
              <p className="category-title">{category.name}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default CategorySlider;