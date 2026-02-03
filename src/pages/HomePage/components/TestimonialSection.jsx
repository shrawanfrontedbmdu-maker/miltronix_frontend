import React from 'react';

// Import Swiper React components and modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Import the data
import { customerReviews } from '../../../data/mockData';

// Assume you have the star icon in your assets
const starIcon = '/src/assets/icon 7.svg';

const TestimonialSection = () => {
  return (
    <section className="reviews-section">
      <h2 className="reviews-title">
        Customer <em style={{ fontStyle: 'italic' }}>Reviews</em>
      </h2>
      <p className="reviews-subtitle hv">
        See what our customers are saying about their shopping experience
      </p>

      <div className="container">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1} // Start with 1 slide per view on mobile
          pagination={{ clickable: true }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            768: { // On tablets and larger
              slidesPerView: 3,
              autoplay: false, // Stop autoplay on larger screens
            },
          }}
          className="reviewsSwiper"
        >
          {customerReviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="review-card h-100">
                <div className="product-rating1">
                  {/* Create 5 stars */}
                  {[...Array(5)].map((_, i) => (
                    <img key={i} src={starIcon} className="star" alt="Star" />
                  ))}
                </div>
                <p className="review-text hv">{review.text}</p>
                <div className="review-author">
                  <img src={review.author.avatar} alt={review.author.name} />
                  <div>
                    <p className="review-author-name ff2">{review.author.name}</p>
                    <p className="review-author-role hv">{review.author.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialSection;