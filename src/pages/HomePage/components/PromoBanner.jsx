import React, { useEffect, useState } from "react";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/autoplay";

// ✅ correct import path (adjust if needed)
import { fetchBanners } from "../../../api/api";

const PromoBanner = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const res = await fetchBanners();
        setBanners(res?.banners || []);
      } catch (err) {
        console.error("Failed to load banners", err);
      }
    };

    loadBanners();
  }, []);

  if (!banners.length) return null; 

  return (
    <section className="category-bg1">
      <div className="container-fluid px-0">

        {/* Desktop Grid */}
        <div className="row g-0 d-none d-md-flex">
          {banners.slice(0, 4).map((banner, index) => (
            <div key={banner._id} className="col-md-3 image-grid1">
              <img
                src={banner.bennerimg}
                className="w-100 h-100 object-fit-cover"
                alt={banner.title || `Promo Banner ${index + 1}`}
              />
            </div>
          ))}
        </div>

        {/* Mobile Swiper */}
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
            {banners.map((banner, index) => (
              <SwiperSlide key={banner._id}>
                <img
                  src={banner.bennerimg}
                  className="w-100"
                  alt={banner.title || `Promo Banner ${index + 1}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
};

export default PromoBanner;
