import React from "react";
import { ProgressBar } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const starIconFull = "/src/assets/icon7.svg";
const starIconEmpty = "/src/assets/icon8.svg";

const RatingSummary = ({ reviews = [], product = null }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  if (!reviews.length) return null;

  const productId = product?._id || id;

  // Average rating
  const avg = (
    reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length
  ).toFixed(1);

  // Distribution 5→1 stars
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    percentage: Math.round(
      (reviews.filter((r) => Number(r.rating) === star).length / reviews.length) *
        100
    ),
  }));

  return (
    <div className="col-lg-4 col-md-5 mb-4">
      {/* Section Heading */}
      <h3 className="section-title mb-3 ff2">
        Customer <em className="ff2" style={{ fontStyle: "italic" }}>Review</em>
      </h3>

      {/* Average Rating */}
      <div className="d-flex align-items-center mb-2">
        <div className="product-rating1 me-3">
          {[...Array(5)].map((_, i) => (
            <img
              key={i}
              src={i < Math.round(avg) ? starIconFull : starIconEmpty}
              className="star"
              alt=""
            />
          ))}
        </div>
        <span className="fs-5 see-more hv">{avg} out of 5</span>
      </div>

      {/* Total Ratings */}
      <p className="text-muted mb-4 fs-5">{reviews.length.toLocaleString()} global ratings</p>

      {/* Star Distribution */}
      {distribution.map((item) => (
        <div key={item.star} className="mb-2">
          <div className="d-flex align-items-center">
            <p className="see-more fs-5 mb-0 me-2">{item.star} star</p>
            <ProgressBar now={item.percentage} style={{ height: "28px", width: "50%" }} />
            <p className="see-more fs-5 mb-0 ms-2">{item.percentage}%</p>
          </div>
        </div>
      ))}

      {/* Write a Review Button */}
      <button
        className="btn bg-light btn-outline-secondary rounded-pill d-flex align-items-center w-75 px-4 py-2 my-4"
        onClick={() => navigate(`/review/${productId}`, { state: { product } })}
      >
        <span className="text-muted me-auto">Write a review ✏️</span>
      </button>
    </div>
  );
};

export default RatingSummary;