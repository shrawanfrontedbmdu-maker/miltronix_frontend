import React from "react";
import { Carousel } from "react-bootstrap";

const nextIcon = "/src/assets/Frame 239.png";

const CustomerFeedback = ({ reviews }) => {
  // Safe conversion: only array
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  if (!safeReviews.length) return null;

  // Flatten all images
  const allImages = safeReviews.flatMap((r) =>
    Array.isArray(r.images)
      ? r.images
          .map((img) => (typeof img === "string" ? img : img?.url))
          .filter(Boolean)
      : []
  );

  if (!allImages.length) return null;

  // Summary text: first 4 reviews max, 480 chars
  const summaryText = safeReviews
    .slice(0, 4)
    .map((r) => r?.reviewText)
    .filter(Boolean)
    .join(" ")
    .slice(0, 480);

  // Chunk images into groups of 4
  const chunkedImages = allImages.reduce((result, item, index) => {
    const chunkIndex = Math.floor(index / 4);
    if (!result[chunkIndex]) result[chunkIndex] = [];
    result[chunkIndex].push(item);
    return result;
  }, []);

  if (!chunkedImages.length) return null;

  return (
    <div className="col-lg-8 col-md-7">
      {/* Section Header */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4 className="section-title mb-0 ff2">
          Customer <em className="ff2" style={{ fontStyle: "italic" }}>say</em>
        </h4>
        <a href="#" className="small see-more">see more reviews</a>
      </div>

      {/* Summary Text */}
      {summaryText && (
        <p className="text-muted mb-4">
          "{summaryText}{summaryText.length >= 480 ? "…" : ""}"
        </p>
      )}

      {/* Review Images Carousel */}
      <h5 className="section-title mb-3 ff2">
        Review <em className="ff2" style={{ fontStyle: "italic" }}>with image</em>
      </h5>

      <Carousel
        indicators={false}
        nextIcon={<img src={nextIcon} alt="Next" className="custom-next-icon" />}
        prevIcon={null}
      >
        {chunkedImages.map((chunk, index) => (
          <Carousel.Item key={index}>
            <div className="row g-3">
              {chunk.map((imgSrc, imgIndex) => (
                <div key={imgIndex} className="col-6 col-md-3">
                  <img
                    src={imgSrc}
                    className="img-fluid rounded img-width"
                    alt={`Review image ${imgIndex + 1}`}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default CustomerFeedback;
