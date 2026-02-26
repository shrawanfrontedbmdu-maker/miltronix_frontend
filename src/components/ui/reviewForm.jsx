import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { createReviewApi } from "../../api/api";

// ─── Inject styles ─────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Arapey:ital@0;1&display=swap');

  :root {
    --bg:         #D5D4D3;
    --card-bg:    #dddddc;
    --accent:     #616D6B;
    --accent-deep:#4e5954;
    --accent-glow:rgba(97,109,107,0.10);
    --text:       #2d2a2a;
    --text-soft:  #4e5954;
    --text-faint: #7a8280;
    --border:     #b8bcbb;
    --radius:     10px;
    --error:      #b34040;
    --success:    #3d6b4f;
  }

  .rf-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Bricolage Grotesque', sans-serif;
    color: var(--text);
    display: flex;
    flex-direction: column;
  }

  .rf-page-body {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px 32px;
    background: var(--bg);
  }

  /* ── Card ── */
  .rf-card {
    width: 100%;
    max-width: 640px;
    background: var(--card-bg);
    border-radius: 16px;
    border: 1px solid #c8cac9;
    box-shadow: 0 4px 24px rgba(97,109,107,0.10);
    padding: 28px 32px 24px;
    position: relative;
    overflow: hidden;
    animation: rf-fade-up 0.4s cubic-bezier(0.22,1,0.36,1) both;
    margin-top:220px;
  }

  @keyframes rf-fade-up {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .rf-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--accent), var(--accent-deep), var(--accent));
    border-radius: 16px 16px 0 0;
  }

  /* ── Head ── */
  .rf-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 18px;
    gap: 12px;
    flex-wrap: wrap;
  }

  .rf-head-left h2 {
    font-family: 'Arapey', serif;
    font-size: 1.7rem;
    font-weight: 400;
    font-style: italic;
    color: var(--accent);
    line-height: 1.15;
    margin: 0 0 2px;
    letter-spacing: -0.5px;
  }

  .rf-head-left p {
    font-size: 0.78rem;
    color: var(--text-faint);
    font-weight: 400;
    margin: 0;
  }

  /* Product badge */
  .rf-product-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: rgba(97,109,107,0.08);
    border: 1px solid rgba(97,109,107,0.22);
    border-radius: 7px;
    padding: 5px 10px;
    font-size: 0.75rem;
    color: var(--accent-deep);
    font-weight: 600;
    max-width: 220px;
    flex-shrink: 0;
  }

  .rf-product-badge img {
    width: 28px; height: 28px;
    border-radius: 5px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .rf-product-badge span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /* ── Two-col layout ── */
  .rf-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 20px;
  }

  /* ── Warn ── */
  .rf-warn {
    background: rgba(97,109,107,0.07);
    border: 1px solid rgba(97,109,107,0.25);
    border-radius: 8px;
    padding: 9px 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.8rem;
    color: var(--accent-deep);
    margin-bottom: 14px;
    flex-wrap: wrap;
  }
  .rf-warn span { flex: 1; }
  .rf-warn button {
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 4px 12px;
    font-size: 0.78rem;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.18s;
  }
  .rf-warn button:hover { background: var(--accent-deep); }

  /* ── Field ── */
  .rf-field { margin-bottom: 14px; }

  .rf-label {
    display: block;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--text-soft);
    margin-bottom: 6px;
  }

  /* ── Stars ── */
  .rf-star-row {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2px 0;
  }

  .rf-star {
    font-size: 1.75rem;
    cursor: pointer;
    transition: transform 0.12s, color 0.12s;
    user-select: none;
    line-height: 1;
  }
  .rf-star.on  { color: var(--accent); }
  .rf-star.off { color: #b8bcbb; }
  .rf-star:hover { transform: scale(1.18); }

  .rf-rating-pill {
    margin-left: 6px;
    background: rgba(97,109,107,0.10);
    border: 1px solid rgba(97,109,107,0.22);
    color: var(--accent-deep);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    border-radius: 20px;
    padding: 2px 10px;
  }

  /* ── Textarea ── */
  .rf-textarea {
    width: 100%;
    min-height: 90px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 10px 13px;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 0.88rem;
    color: var(--text);
    background: #e8e9e8;
    resize: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    outline: none;
    line-height: 1.6;
    box-sizing: border-box;
  }
  .rf-textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(97,109,107,0.10);
    background: #e0e2e1;
  }
  .rf-textarea::placeholder { color: var(--text-faint); }

  .rf-char-count {
    display: block;
    text-align: right;
    font-size: 0.68rem;
    color: var(--text-faint);
    margin-top: 3px;
  }

  /* ── Upload tabs ── */
  .rf-upload-tabs {
    display: flex;
    gap: 7px;
    margin-bottom: 9px;
  }

  .rf-tab {
    flex: 1;
    padding: 6px 0;
    border: 1.5px solid var(--border);
    border-radius: 8px;
    background: #e8e9e8;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-soft);
    cursor: pointer;
    transition: all 0.18s;
    text-align: center;
  }
  .rf-tab.active {
    border-color: var(--accent);
    background: rgba(97,109,107,0.10);
    color: var(--accent-deep);
  }
  .rf-tab:hover:not(.active) { border-color: var(--accent); }

  /* ── Upload zone ── */
  .rf-upload-zone {
    border: 2px dashed var(--border);
    border-radius: var(--radius);
    padding: 14px;
    text-align: center;
    position: relative;
    background: #e8e9e8;
    transition: border-color 0.2s, background 0.2s;
    cursor: pointer;
  }
  .rf-upload-zone:hover,
  .rf-upload-zone.drag-over {
    border-color: var(--accent);
    background: rgba(97,109,107,0.06);
  }
  .rf-upload-zone input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
  .rf-upload-icon { font-size: 1.3rem; display: block; margin-bottom: 3px; }
  .rf-upload-hint { font-size: 0.75rem; color: var(--text-faint); margin: 0; }
  .rf-upload-hint strong { color: var(--accent); font-weight: 600; }

  /* ── Previews ── */
  .rf-previews {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-top: 9px;
  }

  .rf-preview {
    position: relative;
    width: 60px; height: 60px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(97,109,107,0.15);
    animation: rf-pop 0.22s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes rf-pop {
    from { opacity: 0; transform: scale(0.7); }
    to   { opacity: 1; transform: scale(1); }
  }
  .rf-preview img, .rf-preview video {
    width: 100%; height: 100%; object-fit: cover;
  }
  .rf-preview-remove {
    position: absolute;
    top: 2px; right: 2px;
    width: 17px; height: 17px;
    border-radius: 50%;
    background: rgba(30,23,16,0.6);
    color: #fff;
    border: none;
    font-size: 0.7rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
  }
  .rf-preview-remove:hover { background: var(--error); }

  .rf-preview-video-icon {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    pointer-events: none;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  }

  /* ── Divider ── */
  .rf-divider {
    height: 1px;
    background: var(--border);
    margin: 14px 0;
    opacity: 0.5;
  }

  /* ── Error ── */
  .rf-error {
    background: #f9ecec;
    border: 1px solid rgba(179,64,64,0.22);
    color: var(--error);
    border-radius: 8px;
    padding: 8px 13px;
    font-size: 0.8rem;
    margin-bottom: 12px;
    animation: rf-fade-up 0.2s ease both;
  }

  /* ── Submit btn ── */
  .rf-btn {
    width: 100%;
    padding: 12px;
    background: var(--accent);
    color: #fff;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    border: none;
    border-radius: var(--radius);
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 3px 14px rgba(97,109,107,0.25);
    margin-top: 4px;
  }
  .rf-btn:hover:not(:disabled) {
    background: var(--accent-deep);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(97,109,107,0.3);
  }
  .rf-btn:active:not(:disabled) { transform: translateY(0); }
  .rf-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  /* spinner */
  .rf-spinner {
    display: inline-block;
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: rf-spin 0.7s linear infinite;
    margin-right: 7px;
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
    gap: 12px;
    padding: 60px 16px;
    text-align: center;
    animation: rf-fade-up 0.5s ease both;
  }
  .rf-success-circle {
    width: 68px; height: 68px;
    border-radius: 50%;
    background: var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: #fff;
    box-shadow: 0 6px 24px rgba(97,109,107,0.3);
    margin-bottom: 6px;
  }
  .rf-success-page h2 {
    font-family: 'Arapey', serif;
    font-size: 1.9rem;
    font-style: italic;
    color: var(--accent);
    margin: 0;
  }
  .rf-success-page p { color: var(--text-soft); font-size: 0.9rem; margin: 0; }
  .rf-success-page button {
    margin-top: 10px;
    padding: 11px 28px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: var(--radius);
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(97,109,107,0.25);
    transition: background 0.2s, transform 0.15s;
  }
  .rf-success-page button:hover { background: var(--accent-deep); transform: translateY(-1px); }

  @media (max-width: 600px) {
    .rf-card { padding: 22px 16px 20px; }
    .rf-two-col { grid-template-columns: 1fr; }
    .rf-product-badge { max-width: 100%; }
  }
`;

if (typeof document !== "undefined" && !document.getElementById("rf-miltronix-styles")) {
  const t = document.createElement("style");
  t.id = "rf-miltronix-styles";
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
  const [mediaTab,   setMediaTab]   = useState("image");
  const [loading,    setLoading]    = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [error,      setError]      = useState("");
  const [drag,       setDrag]       = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    return () => {
      imgPrev.forEach(URL.revokeObjectURL);
      vidPrev.forEach(URL.revokeObjectURL);
    };
  }, [imgPrev, vidPrev]);

  const openLogin = () => window.dispatchEvent(new Event("openLoginModal"));

  const handleImageChange = (files) => {
    const arr = Array.from(files);
    if (arr.length > 5) { setError("Maximum 5 images allowed."); return; }
    const valid = arr.filter((f) => f.size <= 2 * 1024 * 1024);
    if (valid.length !== arr.length) { setError("Each image must be under 2 MB."); return; }
    setError("");
    setImages(valid);
    setImgPrev(valid.map((f) => URL.createObjectURL(f)));
  };

  const handleVideoChange = (files) => {
    const arr = Array.from(files);
    if (arr.length > 2) { setError("Maximum 2 videos allowed."); return; }
    const valid = arr.filter((f) => f.size <= 50 * 1024 * 1024);
    if (valid.length !== arr.length) { setError("Each video must be under 50 MB."); return; }
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

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const files = e.dataTransfer.files;
    if (mediaTab === "image") handleImageChange(files);
    else handleVideoChange(files);
  };

  const isFormValid = rating > 0 && reviewText.trim().length >= 5;

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
            <div className="rf-head-left">
              <h2>Write a Review</h2>
              <p>Share your honest experience with this product</p>
            </div>
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

          {/* ── Two-column: Rating + Media ── */}
          <div className="rf-two-col">

            {/* Left col: Rating + Review text */}
            <div>
              <div className="rf-field">
                <label className="rf-label">Your Rating *</label>
                <StarRating value={rating} onChange={setRating} />
              </div>

              <div className="rf-divider" />

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
            </div>

            {/* Right col: Media upload */}
            <div>
              <div className="rf-field">
                <label className="rf-label">Add Media (optional)</label>

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
                    onChange={(e) =>
                      mediaTab === "image"
                        ? handleImageChange(e.target.files)
                        : handleVideoChange(e.target.files)
                    }
                  />
                  <span className="rf-upload-icon">{mediaTab === "image" ? "📷" : "🎥"}</span>
                  <p className="rf-upload-hint">
                    <strong>Click to upload</strong> or drag &amp; drop<br />
                    {mediaTab === "image"
                      ? "Up to 5 images · Max 2 MB"
                      : "Up to 2 videos · Max 50 MB"}
                  </p>
                </div>

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
            </div>
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