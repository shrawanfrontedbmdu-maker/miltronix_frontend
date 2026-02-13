import React from 'react';

// Import Swiper React components and modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';

// --- Data for the images ---
const promoImages = [
  '/src/assets/Header image 1.png',
  '/src/assets/Header image 2.png',
  '/src/assets/Header image 3.png',
  '/src/assets/Header image 4.png',
];

const PromoBanner = () => {
  return (
    <section className="category-bg1">
      <div className="container-fluid px-0">

        {/* Desktop Grid (Visible on medium screens and up) */}
        <div className="row g-0 d-none d-md-flex">
          {promoImages.map((src, index) => (
            <div key={index} className="col-md-3 image-grid1">
              <img 
                src={src} 
                className="w-100 h-100 object-fit-cover" 
                alt={`Promo Banner ${index + 1}`} 
              />
            </div>
          ))}
        </div>

        {/* Mobile Swiper (Hidden on medium screens and up) */}
        <div className="d-md-none">
          <Swiper
            modules={[Autoplay]}
            slidesPerView={1}
            spaceBetween={0}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            className="fourImageSwiper"
          >
            {promoImages.map((src, index) => (
              <SwiperSlide key={index}>
                <img src={src} className="w-100" alt={`Promo Banner ${index + 1}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
      </div>
    </section>
  );
};

export default PromoBanner;