import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const RS_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Arapey:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');

  .rs-wrap { font-family: 'Bricolage Grotesque', sans-serif; }

  /* ── Heading ── */
  .rs-heading-wrap {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 20px;
  }
  .rs-heading-badge {
    width: 40px; height: 40px; border-radius: 11px;
    background: linear-gradient(135deg, #2d3a38, #4a5856);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; box-shadow: 0 4px 12px rgba(45,58,56,0.2);
  }
  .rs-heading {
    font-family: 'Arapey', serif;
    font-size: clamp(18px, 2.5vw, 22px);
    font-weight: 700; color: #616D6B;
    letter-spacing: -0.3px; margin: 0; line-height: 1;
  }
  .rs-heading em { font-style: italic; font-weight: 400; color: #616D6B; }
  .rs-heading-line {
    flex: 1; height: 1.5px;
    background: linear-gradient(90deg, #e2e8f0, transparent);
  }

  /* ── Big score card ── */
  .rs-score-card {
    background: linear-gradient(135deg, #2d3a38 0%, #4a5856 100%);
    border-radius: 16px; padding: 20px 22px;
    margin-bottom: 20px; position: relative; overflow: hidden;
    display: flex; align-items: center; gap: 20px;
  }
  .rs-score-card::before {
    content: '';
    position: absolute; top: -30px; right: -30px;
    width: 110px; height: 110px; border-radius: 50%;
    background: rgba(255,255,255,0.05); pointer-events: none;
  }
  .rs-score-card::after {
    content: '';
    position: absolute; bottom: -20px; left: 40px;
    width: 70px; height: 70px; border-radius: 50%;
    background: rgba(255,255,255,0.04); pointer-events: none;
  }

  .rs-big-score {
    font-family: 'Arapey', serif;
    font-size: 52px; font-weight: 700; color: #fff;
    letter-spacing: -2px; line-height: 1; position: relative; z-index: 1;
  }
  .rs-big-score span {
    font-size: 20px; font-weight: 400; color: rgba(255,255,255,0.4);
    letter-spacing: 0;
  }

  .rs-score-right { position: relative; z-index: 1; }
  .rs-stars-row { display: flex; gap: 3px; margin-bottom: 5px; }
  .rs-total-label {
    font-size: 12px; color: rgba(255,255,255,0.45); font-weight: 500;
  }

  /* ── Distribution bars ── */
  .rs-dist-row {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 8px; cursor: pointer;
  }
  .rs-dist-row:hover .rs-bar-fill { filter: brightness(1.15); }

  .rs-dist-label {
    font-size: 12px; font-weight: 600; color: #64748b;
    width: 38px; flex-shrink: 0; display: flex; align-items: center; gap: 4px;
  }
  .rs-star-mini {
    color: #fbbf24; font-size: 11px;
  }

  .rs-bar-track {
    flex: 1; height: 8px; border-radius: 6px;
    background: #f1f5f9; overflow: hidden;
    border: 1px solid #e2e8f0;
  }
  .rs-bar-fill {
    height: 100%; border-radius: 6px;
    background: linear-gradient(90deg, #616D6B, #4a5856);
    transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
    position: relative;
  }
  /* Shimmer on bar */
  .rs-bar-fill::after {
    content: '';
    position: absolute; top: 0; left: -60px;
    width: 40px; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
    animation: rs-shimmer 2.4s infinite;
  }
  @keyframes rs-shimmer {
    0%   { left: -60px; }
    100% { left: 120%; }
  }

  .rs-pct {
    font-size: 11.5px; font-weight: 600; color: #94a3b8;
    width: 32px; text-align: right; flex-shrink: 0;
  }
  .rs-dist-count {
    font-size: 11px; color: #cbd5e1; width: 22px; flex-shrink: 0;
  }

  /* ── Write review button ── */
  .rs-write-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; padding: 12px 20px; margin-top: 20px;
    border-radius: 12px; border: 2px solid #e2e8f0;
    background: #fff; color: #616D6B;
    font-size: 13.5px; font-weight: 700; font-family: 'Bricolage Grotesque', sans-serif;
    cursor: pointer; transition: all 0.2s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  }
  .rs-write-btn:hover {
    border-color: #616D6B; background: #2d3a38; color: #fff;
    box-shadow: 0 4px 14px rgba(45,58,56,0.18);
    transform: translateY(-1px);
  }
  .rs-write-btn:hover svg { stroke: #fff; }
`;

const StarFull = () => (
  <svg width="15" height="15" viewBox="0 0 24 24"
    fill="#fbbf24" stroke="#fbbf24" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const StarHalf = () => (
  <svg width="15" height="15" viewBox="0 0 24 24"
    fill="none" stroke="#fbbf24" strokeWidth="1.5">
    <defs>
      <linearGradient id="half">
        <stop offset="50%" stopColor="#fbbf24"/>
        <stop offset="50%" stopColor="transparent"/>
      </linearGradient>
    </defs>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#half)"/>
  </svg>
);
const StarEmpty = () => (
  <svg width="15" height="15" viewBox="0 0 24 24"
    fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const StarRow = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<StarFull key={i} />);
    else if (rating >= i - 0.5) stars.push(<StarHalf key={i} />);
    else stars.push(<StarEmpty key={i} />);
  }
  return <div style={{ display: "flex", gap: "2px" }}>{stars}</div>;
};

const RatingSummary = ({ reviews = [], product = null }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  if (!reviews.length) return null;

  const productId = product?._id || id;

  const avg = (
    reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length
  );
  const avgDisplay = avg.toFixed(1);

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Number(r.rating) === star).length;
    return {
      star,
      count,
      percentage: Math.round((count / reviews.length) * 100),
    };
  });

  return (
    <>
      <style>{RS_STYLE}</style>

      <div className="rs-wrap col-lg-4 col-md-5 mb-4">

        {/* ── Heading ── */}
        <div className="rs-heading-wrap">
          <div className="rs-heading-badge">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
              stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <h3 className="rs-heading">Customer <em>Review</em></h3>
          <div className="rs-heading-line" />
        </div>

        {/* ── Score card ── */}
        <div className="rs-score-card">
          <div className="rs-big-score">
            {avgDisplay}<span>/5</span>
          </div>
          <div className="rs-score-right">
            <StarRow rating={avg} />
            <div className="rs-total-label" style={{ marginTop: "6px" }}>
              {reviews.length.toLocaleString()} global rating{reviews.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* ── Distribution ── */}
        <div style={{ marginBottom: "4px" }}>
          {distribution.map((item) => (
            <div key={item.star} className="rs-dist-row">
              <div className="rs-dist-label">
                <span className="rs-star-mini">★</span>
                {item.star}
              </div>
              <div className="rs-bar-track">
                <div
                  className="rs-bar-fill"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <div className="rs-pct">{item.percentage}%</div>
              <div className="rs-dist-count">{item.count}</div>
            </div>
          ))}
        </div>

        {/* ── Write review button ── */}
        <button
          className="rs-write-btn"
          onClick={() => navigate(`/review/${productId}`, { state: { product } })}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="#616D6B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Write a Review
        </button>

      </div>
    </>
  );
};

export default RatingSummary;