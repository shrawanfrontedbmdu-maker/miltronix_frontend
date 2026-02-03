import React, { useState } from 'react';

const ProductGallery = ({ images = [] }) => {
  // State to keep track of the currently displayed main image
  const [mainImage, setMainImage] = useState(images[0] || '');

  if (!images.length) {
    return null; // Don't render if there are no images
  }

  return (
    <div className="col-12 col-lg-6">
      <div className="product-image-container text-center">
        <img src={mainImage} alt="Main product view" className="img-fluid product-main-img mb-3" />
      </div>

      <div className="d-flex justify-content-center gap-3 product-thumbnails">
        {images.map((imgSrc, index) => (
          <img
            key={index}
            src={imgSrc}
            className={`img-thumbnail thumb-img ${mainImage === imgSrc ? 'active' : ''}`}
            alt={`Thumbnail ${index + 1}`}
            onClick={() => setMainImage(imgSrc)} // Update the main image on click
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;