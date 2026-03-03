import React, { useState, useEffect } from "react";

const ProductGallery = ({ images = [] }) => {
  const [mainImage, setMainImage] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);

  const getSrc = (img) => {
    if (!img) return "";
    if (typeof img === "string") return img;
    if (typeof img === "object") return img.url || "";
    return "";
  };

  useEffect(() => {
    if (images.length > 0) {
      setMainImage(getSrc(images[0]));
    }
  }, [images]);

  if (!images.length) return null;

  return (
    <div className="col-12 col-lg-6 px-lg-5 px-3 mb-5">
      {/* ================= MAIN DISPLAY ================= */}
      <div 
        className="product-image-container mb-4 position-relative"
        style={{
          backgroundColor: "#D5D4D3", // Miltronix Background Gray
          borderRadius: "24px",
          padding: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          border: "1px solid rgba(97, 109, 107, 0.2)", // Subtle Green-Gray border
          boxShadow: "0 15px 45px rgba(0,0,0,0.03)",
          cursor: "crosshair",
          height: "500px"
        }}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <img
          src={mainImage}
          alt="Premium Product View"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
            transform: isZoomed ? "scale(1.15)" : "scale(1)",
            filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))"
          }}
        />
        
        {/* Subtle Branding Watermark */}
        <span style={{
          position: "absolute",
          bottom: "20px",
          right: "30px",
          color: "#616D6B",
          opacity: "0.2",
          fontSize: "12px",
          letterSpacing: "2px",
          fontWeight: "700"
        }}>MILTRONIX</span>
      </div>

      {/* ================= THUMBNAILS ================= */}
      <div className="d-flex justify-content-center gap-3 flex-wrap">
        {images.map((img, index) => {
          const imgSrc = getSrc(img);
          const isActive = mainImage === imgSrc;

          return (
            <div
              key={index}
              onClick={() => setMainImage(imgSrc)}
              style={{
                width: "90px",
                height: "90px",
                padding: "8px",
                borderRadius: "15px",
                cursor: "pointer",
                backgroundColor: isActive ? "#fff" : "#D5D4D3",
                border: isActive ? "2px solid #616D6B" : "1px solid rgba(97, 109, 107, 0.2)",
                transition: "all 0.4s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isActive ? "0 8px 20px rgba(97, 109, 107, 0.15)" : "none",
                transform: isActive ? "translateY(-5px)" : "none"
              }}
              className="thumb-card"
            >
              <img
                src={imgSrc}
                alt={`View ${index + 1}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  borderRadius: "8px",
                  opacity: isActive ? "1" : "0.6",
                  transition: "opacity 0.3s ease"
                }}
              />
            </div>
          );
        })}
      </div>

      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        .thumb-card:hover {
          border-color: #616D6B !important;
          background-color: #fff !important;
          transform: translateY(-3px);
        }
        .thumb-card:hover img {
          opacity: 1 !important;
        }
        @media (max-width: 768px) {
          .product-image-container {
            height: 350px !important;
            padding: 20px !important;
          }
        }
      `}} />
    </div>
  );
};

export default ProductGallery;
