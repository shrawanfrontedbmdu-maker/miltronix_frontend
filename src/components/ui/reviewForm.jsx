import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { createReviewApi } from "../../api/api";

// ─── Inject styles ─────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --cream: #faf6f1;
    --parchment: #f0e9df;
    --amber: #c4813a;
    --amber-deep: #9e5f1f;
    --amber-glow: rgba(196,129,58,0.12);
    --ink: #1e1710;
    --ink-soft: #5a4a38;
    --ink-faint: #9e8e7a;
    --success: #3d6b4f;
    --error: #b34040;
    --radius: 14px;
    --card-shadow: 0 8px 48px rgba(30,23,16,0.11), 0 1px 0 rgba(196,129,58,0.12);
  }

  .rf-root {
    min-height: 100vh;
    background: var(--cream);
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
    display: flex;
    flex-direction: column;
  }

  .rf-page-body {
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 56px 16px 80px;
    background:
      radial-gradient(ellipse 60% 40% at 80% 8%, rgba(196,129,58,0.09) 0%, transparent 65%),
      radial-gradient(ellipse 45% 35% at 5% 92%, rgba(196,129,58,0.06) 0%, transparent 65%),
      var(--cream);
  }

  /* ── Card ── */
  .rf-card {
    width: 100%;
    max-width: 580px;
    background: #fff;
    border-radius: 22px;
    box-shadow: var(--card-shadow);
    padding: 50px 46px 46px;
    position: relative;
    overflow: hidden;
    animation: rf-fade-up 0.45s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes rf-fade-up {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .rf-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg, var(--amber), #e8a85a, var(--amber-deep));
  }

  /* ── Header ── */
  .rf-head { margin-bottom: 34px; }

  .rf-head h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.2;
    margin-bottom: 5px;
  }

  .rf-head p {
    font-size: 0.875rem;
    color: var(--ink-faint);
    font-weight: 300;
  }

  /* Product badge — shown if product name passed */
  .rf-product-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--amber-glow);
    border: 1px solid rgba(196,129,58,0.22);
    border-radius: 8px;
    padding: 7px 14px;
    margin-top: 14px;
    font-size: 0.82rem;
    color: var(--amber-deep);
    font-weight: 500;
    max-width: 100%;
  }

  .rf-product-badge img {
    width: 32px; height: 32px;
    border-radius: 6px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .rf-product-badge span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /* ── Warn ── */
  .rf-warn {
    background: #fff8ee;
    border: 1px solid rgba(196,129,58,0.28);
    border-radius: 10px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.875rem;
    color: var(--amber-deep);
    margin-bottom: 26px;
    flex-wrap: wrap;
  }
  .rf-warn span { flex: 1; }
  .rf-warn button {
    background: var(--amber);
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 5px 14px;
    font-size: 0.82rem;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.18s;
  }
  .rf-warn button:hover { background: var(--amber-deep); }

  /* ── Field ── */
  .rf-field { margin-bottom: 26px; }

  .rf-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--ink-soft);
    margin-bottom: 10px;
  }

  /* ── Stars ── */
  .rf-star-row {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 0;
  }

  .rf-star {
    font-size: 2.1rem;
    cursor: pointer;
    transition: transform 0.14s, color 0.14s;
    user-select: none;
    line-height: 1;
  }
  .rf-star.on  { color: var(--amber); }
  .rf-star.off { color: var(--parchment); }
  .rf-star:hover { transform: scale(1.2); }

  .rf-rating-pill {
    margin-left: 4px;
    background: #fff7ee;
    border: 1px solid rgba(196,129,58,0.22);
    color: var(--amber-deep);
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    border-radius: 20px;
    padding: 3px 12px;
  }

  /* ── Textarea ── */
  .rf-textarea {
    width: 100%;
    min-height: 130px;
    border: 1.5px solid var(--parchment);
    border-radius: var(--radius);
    padding: 14px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    color: var(--ink);
    background: #fdfaf7;
    resize: vertical;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    outline: none;
    line-height: 1.65;
  }
  .rf-textarea:focus {
    border-color: var(--amber);
    box-shadow: 0 0 0 3px rgba(196,129,58,0.10);
    background: #fff;
  }
  .rf-textarea::placeholder { color: var(--ink-faint); }

  .rf-char-count {
    display: block;
    text-align: right;
    font-size: 0.73rem;
    color: var(--ink-faint);
    margin-top: 5px;
  }

  /* ── Upload tabs ── */
  .rf-upload-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }

  .rf-tab {
    flex: 1;
    padding: 9px 0;
    border: 1.5px solid var(--parchment);
    border-radius: 10px;
    background: #fdfaf7;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--ink-soft);
    cursor: pointer;
    transition: all 0.18s;
    text-align: center;
  }
  .rf-tab.active {
    border-color: var(--amber);
    background: var(--amber-glow);
    color: var(--amber-deep);
  }
  .rf-tab:hover:not(.active) {
    border-color: rgba(196,129,58,0.35);
    background: #fdfaf7;
  }

  /* ── Upload zone ── */
  .rf-upload-zone {
    border: 2px dashed var(--parchment);
    border-radius: var(--radius);
    padding: 22px;
    text-align: center;
    position: relative;
    background: #fdfaf7;
    transition: border-color 0.2s, background 0.2s;
    cursor: pointer;
  }
  .rf-upload-zone:hover,
  .rf-upload-zone.drag-over {
    border-color: var(--amber);
    background: #fff8f0;
  }
  .rf-upload-zone input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
  .rf-upload-icon { font-size: 1.6rem; display: block; margin-bottom: 5px; }
  .rf-upload-hint { font-size: 0.82rem; color: var(--ink-faint); }
  .rf-upload-hint strong { color: var(--amber); font-weight: 500; }

  /* ── Previews ── */
  .rf-previews {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 14px;
  }

  .rf-preview {
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(30,23,16,0.12);
    animation: rf-pop 0.25s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes rf-pop {
    from { opacity: 0; transform: scale(0.7); }
    to   { opacity: 1; transform: scale(1); }
  }
  .rf-preview img,
  .rf-preview video {
    width: 100%; height: 100%; object-fit: cover;
  }
  .rf-preview-remove {
    position: absolute;
    top: 3px; right: 3px;
    width: 20px; height: 20px;
    border-radius: 50%;
    background: rgba(30,23,16,0.65);
    color: #fff;
    border: none;
    font-size: 0.75rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
  }
  .rf-preview-remove:hover { background: var(--error); }

  /* video overlay */
  .rf-preview-video-icon {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    pointer-events: none;
    text-shadow: 0 2px 6px rgba(0,0,0,0.5);
  }

  /* ── Divider ── */
  .rf-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--parchment), transparent);
    margin: 26px 0;
  }

  /* ── Error ── */
  .rf-error {
    background: #fff5f5;
    border: 1px solid rgba(179,64,64,0.22);
    color: var(--error);
    border-radius: 10px;
    padding: 11px 16px;
    font-size: 0.875rem;
    margin-bottom: 20px;
    animation: rf-fade-up 0.2s ease both;
  }

  /* ── Submit btn ── */
  .rf-btn {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, var(--amber) 0%, var(--amber-deep) 100%);
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: 0.03em;
    border: none;
    border-radius: var(--radius);
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 18px rgba(196,129,58,0.35);
    margin-top: 8px;
    position: relative;
    overflow: hidden;
  }
  .rf-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%);
  }
  .rf-btn:hover:not(:disabled) {
    opacity: 0.93;
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(196,129,58,0.42);
  }
  .rf-btn:active:not(:disabled) { transform: translateY(0); }
  .rf-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  /* ── Loading spinner inside btn ── */
  .rf-spinner {
    display: inline-block;
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: rf-spin 0.7s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
  }
  @keyframes rf-spin { to { transform: rotate(360deg); } }

  /* ── Success ── */
  .rf-success-page {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 60px 16px;
    text-align: center;
    animation: rf-fade-up 0.5s ease both;
  }

  .rf-success-circle {
    width: 78px; height: 78px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4caf78, #2d8c54);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.2rem;
    color: #fff;
    box-shadow: 0 8px 28px rgba(61,107,79,0.3);
    margin-bottom: 8px;
  }
  .rf-success-page h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    color: var(--ink);
  }
  .rf-success-page p { color: var(--ink-soft); font-size: 1rem; font-weight: 300; }
  .rf-success-page button {
    margin-top: 12px;
    padding: 13px 32px;
    background: linear-gradient(135deg, var(--amber), var(--amber-deep));
    color: #fff;
    border: none;
    border-radius: var(--radius);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 4px 18px rgba(196,129,58,0.3);
    transition: opacity 0.2s, transform 0.15s;
  }
  .rf-success-page button:hover { opacity: 0.9; transform: translateY(-1px); }

  @media (max-width: 600px) {
    .rf-card { padding: 36px 22px 32px; }
    .rf-card h2 { font-size: 1.65rem; }
  }
`;

if (typeof document !== "undefined" && !document.getElementById("rf-styles-v2")) {
  const t = document.createElement("style");
  t.id = "rf-styles-v2";
  t.textContent = STYLES;
  document.head.appendChild(t);
}

const LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

// ─── StarRating ────────────────────────────────────────────────────────────────
const StarRating = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;
  return (
    <div className="rf-star-row">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={`rf-star ${s <= active ? "on" : "off"}`}
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
        >★</span>
      ))}
      {value > 0 && <span className="rf-rating-pill">{LABELS[value]}</span>}
    </div>
  );
};

// ─── ReviewForm ────────────────────────────────────────────────────────────────
const ReviewForm = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { id }    = useParams();

  const product   = location.state?.product || null;
  const productId = id || product?._id || "";

  const [rating,     setRating]     = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [images,     setImages]     = useState([]);
  const [imgPrev,    setImgPrev]    = useState([]);
  const [videos,     setVideos]     = useState([]);
  const [vidPrev,    setVidPrev]    = useState([]);
  const [mediaTab,   setMediaTab]   = useState("image"); // "image" | "video"
  const [loading,    setLoading]    = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [error,      setError]      = useState("");
  const [drag,       setDrag]       = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  // cleanup object URLs
  useEffect(() => {
    return () => {
      imgPrev.forEach(URL.revokeObjectURL);
      vidPrev.forEach(URL.revokeObjectURL);
    };
  }, [imgPrev, vidPrev]);

  const openLogin = () => window.dispatchEvent(new Event("openLoginModal"));

  // ── Image handler ────────────────────────────────────────────────
  const handleImageChange = (files) => {
    const arr = Array.from(files);
    if (arr.length > 5)               { setError("Maximum 5 images allowed."); return; }
    const valid = arr.filter((f) => f.size <= 2 * 1024 * 1024);
    if (valid.length !== arr.length)  { setError("Each image must be under 2 MB."); return; }
    setError("");
    setImages(valid);
    setImgPrev(valid.map((f) => URL.createObjectURL(f)));
  };

  // ── Video handler ────────────────────────────────────────────────
  const handleVideoChange = (files) => {
    const arr = Array.from(files);
    if (arr.length > 2)                { setError("Maximum 2 videos allowed."); return; }
    const valid = arr.filter((f) => f.size <= 50 * 1024 * 1024);
    if (valid.length !== arr.length)   { setError("Each video must be under 50 MB."); return; }
    setError("");
    setVideos(valid);
    setVidPrev(valid.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (i) => {
    setImages((p) => p.filter((_, x) => x !== i));
    setImgPrev((p) => p.filter((_, x) => x !== i));
  };

  const removeVideo = (i) => {
    setVideos((p) => p.filter((_, x) => x !== i));
    setVidPrev((p) => p.filter((_, x) => x !== i));
  };

  // ── Drag & drop ──────────────────────────────────────────────────
  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const files = e.dataTransfer.files;
    if (mediaTab === "image") handleImageChange(files);
    else handleVideoChange(files);
  };

  const isFormValid = rating > 0 && reviewText.trim().length >= 5;

  // ── Submit ───────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setError("");
    if (!isLoggedIn) { openLogin(); return; }
    if (!isFormValid) { setError("Please select a rating and write at least 5 characters."); return; }
    try {
      setLoading(true);
      await createReviewApi({
        product:    productId,
        reviewText: reviewText.trim(),
        rating,
        images: images.length ? images : undefined,
        videos: videos.length ? videos : undefined,
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ───────────────────────────────────────────────
  if (success) {
    return (
      <div className="rf-root">
        <Header />
        <div className="rf-success-page">
          <div className="rf-success-circle">✓</div>
          <h2>Review Submitted!</h2>
          <p>Thank you — your review is under moderation and will be live soon.</p>
          <button onClick={() => navigate(productId ? `/checkout/${productId}` : "/")}>
            Back to Product
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="rf-root">
      <Header />
      <div className="rf-page-body">
        <div className="rf-card">

          {/* ── Head ── */}
          <div className="rf-head">
            <h2>Write a Review</h2>
            <p>Share your honest experience with this product</p>

            {/* Show product name/image if passed via location.state */}
            {product && (
              <div className="rf-product-badge">
                {(product.images?.[0]?.url || product.images?.[0]) && (
                  <img
                    src={product.images[0]?.url || product.images[0]}
                    alt={product.name || product.title}
                  />
                )}
                <span>{product.name || product.title}</span>
              </div>
            )}
          </div>

          {/* ── Login warning ── */}
          {!isLoggedIn && (
            <div className="rf-warn">
              <span>⚠️ Please login to submit your review.</span>
              <button onClick={openLogin}>Login</button>
            </div>
          )}

          {/* ── Rating ── */}
          <div className="rf-field">
            <label className="rf-label">Your Rating *</label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div className="rf-divider" />

          {/* ── Review text ── */}
          <div className="rf-field">
            <label className="rf-label">Your Review *</label>
            <textarea
              className="rf-textarea"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="What did you love? What could be better?"
              maxLength={500}
            />
            <span className="rf-char-count">{reviewText.length} / 500</span>
          </div>

          <div className="rf-divider" />

          {/* ── Media upload ── */}
          <div className="rf-field">
            <label className="rf-label">Add Media (optional)</label>

            {/* Tabs */}
            <div className="rf-upload-tabs">
              <button
                className={`rf-tab ${mediaTab === "image" ? "active" : ""}`}
                onClick={() => setMediaTab("image")}
              >
                📷 Photos {images.length > 0 && `(${images.length})`}
              </button>
              <button
                className={`rf-tab ${mediaTab === "video" ? "active" : ""}`}
                onClick={() => setMediaTab("video")}
              >
                🎥 Videos {videos.length > 0 && `(${videos.length})`}
              </button>
            </div>

            {/* Upload zone */}
            <div
              className={`rf-upload-zone ${drag ? "drag-over" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={onDrop}
            >
              <input
                type="file"
                multiple
                accept={mediaTab === "image" ? "image/*" : "video/*"}
                onChange={(e) => mediaTab === "image"
                  ? handleImageChange(e.target.files)
                  : handleVideoChange(e.target.files)
                }
              />
              <span className="rf-upload-icon">{mediaTab === "image" ? "📷" : "🎥"}</span>
              <p className="rf-upload-hint">
                <strong>Click to upload</strong> or drag &amp; drop<br />
                {mediaTab === "image"
                  ? "Up to 5 images · Max 2 MB each"
                  : "Up to 2 videos · Max 50 MB each"}
              </p>
            </div>

            {/* Image previews */}
            {mediaTab === "image" && imgPrev.length > 0 && (
              <div className="rf-previews">
                {imgPrev.map((src, i) => (
                  <div key={i} className="rf-preview">
                    <img src={src} alt={`img-${i}`} />
                    <button className="rf-preview-remove" onClick={() => removeImage(i)}>×</button>
                  </div>
                ))}
              </div>
            )}

            {/* Video previews */}
            {mediaTab === "video" && vidPrev.length > 0 && (
              <div className="rf-previews">
                {vidPrev.map((src, i) => (
                  <div key={i} className="rf-preview">
                    <video src={src} muted />
                    <div className="rf-preview-video-icon">▶️</div>
                    <button className="rf-preview-remove" onClick={() => removeVideo(i)}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Error ── */}
          {error && <div className="rf-error">⚠ {error}</div>}

          {/* ── Submit ── */}
          <button
            className="rf-btn"
            onClick={handleSubmit}
            disabled={!isFormValid || loading}
          >
            {loading && <span className="rf-spinner" />}
            {loading ? "Submitting…" : "Submit Review"}
          </button>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReviewForm;