import "./check.css";
import { useNavigate } from "react-router-dom";

// ─── Star Display ──────────────────────────────────────────────────
const StarDisplay = ({ rating }) => (
  <span style={{ color: "#f5a623", fontSize: "18px" }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star}>{star <= Math.round(rating) ? "★" : "☆"}</span>
    ))}
  </span>
);

function Secendcheck({ reviews = [], similarProducts = [] }) {
  const navigate = useNavigate();

  // ── Calculate from API reviews ──────────────────────────────────
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
    return { star, count, pct };
  });

  // Collect all images from reviews that have images
  const reviewImages = reviews
    .filter((r) => r.images?.length > 0)
    .flatMap((r) => r.images.map((img) => img.url || img))
    .slice(0, 4);

  // If no reviews and no similar products, render nothing
  if (reviews.length === 0 && similarProducts.length === 0) return null;

  return (
    <div className="container-2">

      {/* ══════════════ CUSTOMER REVIEW SECTION ══════════════ */}
      {reviews.length > 0 && (
        <div className="review-section-2">

          {/* Left — Rating summary */}
          <div className="review-left-2">
            <h3>Customer Review</h3>

            <div className="rating">
              <StarDisplay rating={avgRating} />
              <span>{avgRating} out of 5</span>
            </div>

            <p className="total-review">
              {reviews.length.toLocaleString("en-IN")} global rating{reviews.length !== 1 ? "s" : ""}
            </p>

            {/* Rating bars — dynamic from API */}
            {ratingCounts.map(({ star, pct }) => (
              <div className="rating-bar" key={star}>
                <span>{star} star</span>
                <div className="bar">
                  <div
                    className="fill"
                    style={{ width: `${pct}%`, background: "#f5a623", height: "100%", borderRadius: "4px" }}
                  />
                </div>
                <span>{pct}%</span>
              </div>
            ))}
          </div>

          {/* Right — Customer say + review images */}
          <div className="review-right-2">
            <h4>Customers say</h4>

            {/* Show latest review text as summary, or first few */}
            {reviews.slice(0, 2).map((review) => (
              <div key={review._id} style={{ marginBottom: "10px" }}>
                {(review.userName || review.user?.name) && (
                  <p style={{ fontWeight: "600", fontSize: "13px", color: "#333", margin: "0 0 2px" }}>
                    {review.userName || review.user?.name}
                  </p>
                )}
                {review.reviewText && (
                  <p style={{ fontSize: "14px", color: "#555", margin: 0, lineHeight: "1.6" }}>
                    {review.reviewText.length > 150
                      ? review.reviewText.slice(0, 150) + "..."
                      : review.reviewText}
                  </p>
                )}
              </div>
            ))}

            {/* Review images — only from API reviews that have images */}
            {reviewImages.length > 0 && (
              <div className="review-images-2">
                {reviewImages.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`review-image-${idx + 1}`}
                    style={{ width: "72px", height: "72px", objectFit: "cover", borderRadius: "6px", border: "1px solid #eee" }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════ SIMILAR PRODUCTS — dynamic from API ══════════════ */}
      {similarProducts.length > 0 && (
        <>
          <h2 className="similar-title-2">Similar Product</h2>

          <div className="product-grid-2">
            {similarProducts.map((prod) => {
              const sv       = prod.variants?.[0];
              const simPrice = sv?.price         ?? prod.price ?? 0;
              const simMrp   = sv?.compareAtPrice ?? prod.mrp  ?? 0;
              const simDisc  = simMrp > simPrice ? Math.round(((simMrp - simPrice) / simMrp) * 100) : 0;
              const simImg   = prod.images?.[0]?.url || prod.images?.[0] || "";
              const simName  = prod.name || prod.title || "";

              return (
                <div
                  key={prod._id}
                  className="product-card-2"
                  onClick={() => navigate(`/checkout/${prod._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {simImg ? (
                    <img src={simImg} alt={simName} />
                  ) : (
                    <div style={{
                      width: "100%", height: "120px", background: "#f0f0f0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#ccc", fontSize: "12px", borderRadius: "6px",
                    }}>
                      No Image
                    </div>
                  )}
                  {simName && <p>{simName}</p>}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                    {simPrice > 0 && (
                      <span>₹ {simPrice.toLocaleString("en-IN")}</span>
                    )}
                    {simMrp > simPrice && (
                      <span style={{ fontSize: "11px", color: "#aaa", textDecoration: "line-through" }}>
                        ₹ {simMrp.toLocaleString("en-IN")}
                      </span>
                    )}
                    {simDisc > 0 && (
                      <span style={{ fontSize: "11px", color: "#2a9d8f", fontWeight: "600" }}>
                        {simDisc}% off
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

    </div>
  );
}

export default Secendcheck;