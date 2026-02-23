import React, { useState, useEffect } from "react";

const ProductGallery = ({ images = [] }) => {

  const getSrc = (img) => {
    if (!img) return "";
    if (typeof img === "string") return img;
    if (typeof img === "object") return img.url || "";
    return "";
  };

  const [mainImage, setMainImage] = useState("");

  // jab images API se aaye tab first image set ho
  useEffect(() => {
    if (images.length > 0) {
      setMainImage(getSrc(images[0]));
    }
  }, [images]);

  if (!images.length) {
    return null;
  }

  return (
    <div className="col-12 col-lg-6">
      <div className="product-image-container text-center">
        <img
          src={mainImage}
          alt="Main product view"
          className="img-fluid product-main-img mb-3"
        />
      </div>

      <div className="d-flex justify-content-center gap-3 product-thumbnails">
        {images.map((img, index) => {
          const imgSrc = getSrc(img);

          return (
            <img
              key={index}
              src={imgSrc}
              className={`img-thumbnail thumb-img ${
                mainImage === imgSrc ? "active" : ""
              }`}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => setMainImage(imgSrc)}
              style={{ cursor: "pointer" }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProductGallery;