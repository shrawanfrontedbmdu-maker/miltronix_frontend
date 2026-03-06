import React, { useState } from "react";

const CF_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Arapey:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');

  .cf-wrap { font-family: 'Bricolage Grotesque', sans-serif; }

  /* ── Heading ── */
  .cf-heading-wrap {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 20px;
  }
  .cf-heading-badge {
    width: 42px; height: 42px; border-radius: 12px;
    background: linear-gradient(135deg, #2d3a38, #4a5856);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; box-shadow: 0 4px 12px rgba(45,58,56,0.2);
  }
  .cf-heading {
    font-family: 'Arapey', serif;
    font-size: clamp(20px, 2.8vw, 26px);
    font-weight: 700; color: #616D6B;
    letter-spacing: -0.4px; margin: 0; line-height: 1;
  }
  .cf-heading em { font-style: italic; font-weight: 400; color: #616D6B; }
  .cf-heading-line {
    flex: 1; height: 1.5px;
    background: linear-gradient(90deg, #e2e8f0, transparent);
    border-radius: 2px;
  }
  .cf-see-more {
    font-size: 12.5px; font-weight: 600; color: #616D6B;
    text-decoration: none; white-space: nowrap;
    display: flex; align-items: center; gap: 4px;
    padding: 5px 12px; border: 1.5px solid #e2e8f0;
    border-radius: 20px; transition: all 0.18s; background: #fff;
    flex-shrink: 0;
  }
  .cf-see-more:hover {
    border-color: #616D6B; color: #616D6B;
    box-shadow: 0 2px 8px rgba(97,109,107,0.1);
  }

  /* ── Quote block ── */
  .cf-quote-block {
    position: relative;
    background: linear-gradient(135deg, #2d3a38 0%, #4a5856 100%);
    border-radius: 16px; padding: 22px 24px 20px;
    margin-bottom: 24px; overflow: hidden;
  }
  .cf-quote-block::before {
    content: '"';
    position: absolute; top: -10px; left: 16px;
    font-family: 'Arapey', serif;
    font-size: 100px; color: rgba(255,255,255,0.07);
    line-height: 1; pointer-events: none;
  }
  .cf-quote-text {
    font-size: 13.5px; color: rgba(255,255,255,0.85);
    line-height: 1.75; font-style: italic; position: relative; z-index: 1;
    margin: 0 0 14px;
  }
  .cf-quote-meta {
    display: flex; align-items: center; gap: 12px;
    flex-wrap: wrap; position: relative; z-index: 1;
  }
  .cf-review-count {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11.5px; font-weight: 600; color: rgba(255,255,255,0.5);
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
    padding: 3px 10px; border-radius: 20px;
  }

  /* ── Stars ── */
  .cf-stars { display: flex; gap: 2px; }
  .cf-star-filled { color: #fbbf24; font-size: 14px; }
  .cf-star-empty  { color: rgba(255,255,255,0.2); font-size: 14px; }

  /* ── Sub heading ── */
  .cf-sub-heading {
    font-family: 'Arapey', serif;
    font-size: 16px; font-weight: 600; color: #616D6B;
    margin: 0 0 14px; display: flex; align-items: center; gap: 8px;
  }
  .cf-sub-heading em { font-style: italic; font-weight: 400; color: #616D6B; }

  /* ── Image carousel ── */
  .cf-carousel-wrap { position: relative; }

  .cf-img-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }
  @media (max-width: 640px) {
    .cf-img-grid { grid-template-columns: repeat(2, 1fr); }
  }

  .cf-img-card {
    height: 140px;
    border-radius: 12px;
    overflow: hidden;
    border: 1.5px solid #e2e8f0;
    background: linear-gradient(145deg, #f8fafc, #eef2f7);
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }
  .cf-img-card:hover {
    border-color: #616D6B;
    box-shadow: 0 6px 18px rgba(97,109,107,0.15);
    transform: translateY(-2px) scale(1.02);
  }
  .cf-img-card img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.3s;
  }
  .cf-img-card:hover img { transform: scale(1.06); }

  /* overlay on hover */
  .cf-img-card::after {
    content: '';
    position: absolute; inset: 0;
    background: rgba(45,58,56,0);
    transition: background 0.2s;
    border-radius: 12px;
  }
  .cf-img-card:hover::after { background: rgba(45,58,56,0.08); }

  /* ── Carousel nav ── */
  .cf-nav-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 14px;
  }
  .cf-dots {
    display: flex; gap: 6px; align-items: center;
  }
  .cf-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #e2e8f0; transition: all 0.2s; cursor: pointer;
    border: none;
  }
  .cf-dot.active {
    background: #616D6B; width: 18px; border-radius: 4px;
  }
  .cf-nav-btns { display: flex; gap: 8px; }
  .cf-nav-btn {
    width: 34px; height: 34px; border-radius: 10px;
    border: 1.5px solid #e2e8f0; background: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.18s; color: #616D6B;
  }
  .cf-nav-btn:hover:not(:disabled) {
    border-color: #616D6B; background: #616D6B; color: #fff;
  }
  .cf-nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  /* ── Lightbox ── */
  .cf-lightbox {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,0.92);
    display: flex; align-items: center; justify-content: center;
    animation: cf-fadeIn 0.2s ease;
  }
  .cf-lightbox img {
    max-width: 85vw; max-height: 88vh;
    object-fit: contain; border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    animation: cf-zoomIn 0.2s ease;
  }
  .cf-lb-close {
    position: absolute; top: 20px; right: 20px;
    width: 40px; height: 40px; border-radius: 50%;
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
    color: #fff; font-size: 18px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .cf-lb-close:hover { background: rgba(255,255,255,0.22); }

  @keyframes cf-fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes cf-zoomIn { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
`;

const StarRating = ({ rating = 5 }) => (
  <div style={{ display: "flex", gap: "2px" }}>
    {[1,2,3,4,5].map(i => (
      <svg key={i} width="14" height="14" viewBox="0 0 24 24"
        fill={i <= Math.round(rating) ? "#fbbf24" : "none"}
        stroke={i <= Math.round(rating) ? "#fbbf24" : "rgba(255,255,255,0.25)"}
        strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
  </div>
);

const CHUNK_SIZE = 4;

const CustomerFeedback = ({ reviews }) => {
  const [page, setPage] = useState(0);
  const [lightboxSrc, setLightboxSrc] = useState(null);

  const safeReviews = Array.isArray(reviews) ? reviews : [];
  if (!safeReviews.length) return null;

  const allImages = safeReviews.flatMap((r) =>
    Array.isArray(r.images)
      ? r.images.map((img) => (typeof img === "string" ? img : img?.url)).filter(Boolean)
      : []
  );
  if (!allImages.length) return null;

  // Summary from first 4 reviews
  const summaryText = safeReviews
    .slice(0, 4)
    .map((r) => r?.reviewText)
    .filter(Boolean)
    .join(" ")
    .slice(0, 360);

  // Average rating
  const avgRating = safeReviews.reduce((acc, r) => acc + (r.rating || 5), 0) / safeReviews.length;

  // Paginate images in chunks of 4
  const chunks = [];
  for (let i = 0; i < allImages.length; i += CHUNK_SIZE) {
    chunks.push(allImages.slice(i, i + CHUNK_SIZE));
  }
  const totalPages = chunks.length;
  const currentChunk = chunks[page] || [];

  return (
    <>
      <style>{CF_STYLE}</style>

      <div className="cf-wrap col-lg-8 col-md-7">

        {/* ── Heading ── */}
        <div className="cf-heading-wrap">
          <div className="cf-heading-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h3 className="cf-heading">
            Customer <em>Reviews</em>
          </h3>
          <div className="cf-heading-line" />
          <a href="#" className="cf-see-more">
            See all
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </a>
        </div>

        {/* ── Quote / Summary block ── */}
        {summaryText && (
          <div className="cf-quote-block">
            <p className="cf-quote-text">
              {summaryText}{summaryText.length >= 360 ? "…" : ""}
            </p>
            <div className="cf-quote-meta">
              <StarRating rating={Math.round(avgRating)} />
              <span className="cf-review-count">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                {safeReviews.length} verified review{safeReviews.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}

        {/* ── Review images ── */}
        <div className="cf-sub-heading">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#616D6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          Review <em style={{ fontStyle: "italic", color: "#616D6B", marginLeft: "5px" }}>Photos</em>
          <span style={{
            fontSize: "11.5px", color: "#94a3b8", fontWeight: 500,
            background: "#f1f5f9", border: "1px solid #e2e8f0",
            padding: "2px 8px", borderRadius: "20px", marginLeft: "4px",
          }}>{allImages.length}</span>
        </div>

        <div className="cf-carousel-wrap">
          <div className="cf-img-grid">
            {currentChunk.map((src, i) => (
              <div
                key={i}
                className="cf-img-card"
                onClick={() => setLightboxSrc(src)}
              >
                <img
                  src={src}
                  alt={`Review photo ${page * CHUNK_SIZE + i + 1}`}
                  onError={(e) => { e.target.parentElement.style.display = "none"; }}
                />
              </div>
            ))}
          </div>

          {/* Nav row */}
          {totalPages > 1 && (
            <div className="cf-nav-row">
              <div className="cf-dots">
                {chunks.map((_, i) => (
                  <button
                    key={i}
                    className={`cf-dot${i === page ? " active" : ""}`}
                    onClick={() => setPage(i)}
                  />
                ))}
              </div>
              <div className="cf-nav-btns">
                <button
                  className="cf-nav-btn"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </button>
                <button
                  className="cf-nav-btn"
                  disabled={page === totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxSrc && (
        <div className="cf-lightbox" onClick={() => setLightboxSrc(null)}>
          <button className="cf-lb-close" onClick={() => setLightboxSrc(null)}>✕</button>
          <img src={lightboxSrc} alt="Review enlarged" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
};

export default CustomerFeedback;