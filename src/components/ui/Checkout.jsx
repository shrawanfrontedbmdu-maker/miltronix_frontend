import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import Secendcheck from "./Secendcheck";
import {
  fetchProductById,
  fetchProducts,
  addItemToCart,
  getReviewsByProductApi,
} from "../../api/api";
import "./checkout.css";

// ─── Review styles ─────────────────────────────────────────────────────────────
const REVIEW_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --rv-amber: #c4813a;
    --rv-amber-deep: #9e5f1f;
    --rv-amber-pale: #fff8f0;
    --rv-amber-border: rgba(196,129,58,0.22);
    --rv-ink: #1e1710;
    --rv-ink-soft: #5a4a38;
    --rv-ink-faint: #9e8e7a;
    --rv-parchment: #f0e9df;
    --rv-cream: #faf6f1;
    --rv-radius: 14px;
  }

  .rv-section { margin: 48px 0 0; font-family: 'DM Sans', sans-serif; }

  .rv-section-head {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 12px; margin-bottom: 24px;
  }

  .rv-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.55rem; font-weight: 700; color: var(--rv-ink); margin: 0;
  }

  .rv-write-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 22px;
    background: linear-gradient(135deg, var(--rv-amber), var(--rv-amber-deep));
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem; font-weight: 500; border: none;
    border-radius: 10px; cursor: pointer;
    transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
    box-shadow: 0 4px 16px rgba(196,129,58,0.32); white-space: nowrap;
  }
  .rv-write-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(196,129,58,0.42); opacity: 0.93; }
  .rv-write-btn:active { transform: translateY(0); }

  .rv-summary {
    display: flex; align-items: center; gap: 28px;
    background: var(--rv-amber-pale); border: 1px solid var(--rv-amber-border);
    border-radius: 16px; padding: 22px 26px; margin-bottom: 24px; flex-wrap: wrap;
  }

  .rv-score-block { text-align: center; min-width: 76px; }
  .rv-score-num {
    font-family: 'Playfair Display', serif;
    font-size: 3rem; font-weight: 700; color: var(--rv-amber); line-height: 1; letter-spacing: -1px;
  }
  .rv-score-stars { margin: 5px 0 3px; }
  .rv-score-label { font-size: 0.75rem; color: var(--rv-ink-faint); font-weight: 300; }

  .rv-bars { flex: 1; min-width: 160px; }
  .rv-bar-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .rv-bar-label { width: 8px; font-size: 0.78rem; color: var(--rv-ink-soft); font-weight: 500; text-align: right; flex-shrink: 0; }
  .rv-bar-star { font-size: 0.72rem; color: var(--rv-amber); flex-shrink: 0; }
  .rv-bar-track { flex: 1; height: 7px; background: var(--rv-parchment); border-radius: 4px; overflow: hidden; }
  .rv-bar-fill { height: 100%; background: linear-gradient(90deg, var(--rv-amber), var(--rv-amber-deep)); border-radius: 4px; transition: width 0.6s cubic-bezier(0.22,1,0.36,1); }
  .rv-bar-count { width: 18px; font-size: 0.73rem; color: var(--rv-ink-faint); text-align: right; flex-shrink: 0; }

  .rv-list { display: flex; flex-direction: column; gap: 14px; }

  .rv-card {
    background: #fff; border: 1px solid #f0ece6; border-radius: var(--rv-radius);
    padding: 18px 22px; box-shadow: 0 2px 12px rgba(30,23,16,0.05);
    transition: box-shadow 0.2s, transform 0.2s;
    animation: rv-in 0.35s ease both;
  }
  .rv-card:hover { box-shadow: 0 6px 24px rgba(30,23,16,0.09); transform: translateY(-1px); }
  @keyframes rv-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

  .rv-card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 10px; }
  .rv-reviewer { display: flex; align-items: center; gap: 10px; }
  .rv-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, var(--rv-amber), var(--rv-amber-deep));
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-weight: 600; font-size: 0.9rem; flex-shrink: 0;
  }
  .rv-reviewer-name { font-size: 0.9rem; font-weight: 600; color: var(--rv-ink); }
  .rv-reviewer-stars { margin-top: 2px; }
  .rv-date { font-size: 0.75rem; color: var(--rv-ink-faint); white-space: nowrap; flex-shrink: 0; margin-top: 4px; }
  .rv-review-title { font-weight: 600; font-size: 0.95rem; color: var(--rv-ink); margin-bottom: 5px; }
  .rv-review-text { font-size: 0.9rem; color: var(--rv-ink-soft); line-height: 1.65; margin: 0; font-weight: 300; }

  .rv-status {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 0.7rem; font-weight: 500; padding: 2px 10px;
    border-radius: 20px; margin-top: 8px;
  }
  .rv-status.pending  { background:#fff8ee; color:#c4813a; border:1px solid rgba(196,129,58,0.25); }
  .rv-status.approved { background:#eefaf3; color:#3d6b4f; border:1px solid rgba(61,107,79,0.25); }
  .rv-status.rejected { background:#fff5f5; color:#b34040; border:1px solid rgba(179,64,64,0.22); }

  .rv-media-grid { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
  .rv-media-thumb {
    width: 68px; height: 68px; border-radius: 8px; object-fit: cover;
    border: 1px solid #f0ece6; cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .rv-media-thumb:hover { transform: scale(1.05); box-shadow: 0 4px 12px rgba(30,23,16,0.14); }
  .rv-video-thumb {
    width: 68px; height: 68px; border-radius: 8px; border: 1px solid #f0ece6;
    position: relative; overflow: hidden; cursor: pointer; background: #1e1710;
  }
  .rv-video-thumb video { width:100%; height:100%; object-fit:cover; opacity:0.7; }
  .rv-video-play { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:1.2rem; }

  .rv-empty {
    background: var(--rv-cream); border: 2px dashed var(--rv-parchment);
    border-radius: 16px; padding: 36px 24px; text-align: center;
  }
  .rv-empty-icon { font-size: 2.2rem; margin-bottom: 10px; display: block; }
  .rv-empty-title { font-size: 1rem; font-weight: 600; color: var(--rv-ink); margin-bottom: 5px; }
  .rv-empty-sub { font-size: 0.85rem; color: var(--rv-ink-faint); font-weight: 300; }

  .rv-loading { display:flex; align-items:center; gap:10px; color:var(--rv-ink-faint); font-size:0.875rem; padding:16px 0; }
  .rv-loading-dot { width:8px; height:8px; border-radius:50%; background:var(--rv-amber); animation:rv-pulse 1.2s ease-in-out infinite; }
  .rv-loading-dot:nth-child(2) { animation-delay:0.2s; }
  .rv-loading-dot:nth-child(3) { animation-delay:0.4s; }
  @keyframes rv-pulse { 0%,100%{opacity:0.3;transform:scale(0.8);} 50%{opacity:1;transform:scale(1);} }

  .rv-lightbox { position:fixed; inset:0; background:rgba(20,14,8,0.88); z-index:9999; display:flex; align-items:center; justify-content:center; animation:rv-lb-in 0.2s ease both; }
  @keyframes rv-lb-in { from{opacity:0} to{opacity:1} }
  .rv-lightbox img { max-width:90vw; max-height:88vh; border-radius:10px; object-fit:contain; }
  .rv-lightbox-close { position:absolute; top:20px; right:20px; width:40px; height:40px; border-radius:50%; background:rgba(255,255,255,0.15); border:none; color:#fff; font-size:1.2rem; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.15s; }
  .rv-lightbox-close:hover { background:rgba(255,255,255,0.25); }
`;

if (typeof document !== "undefined" && !document.getElementById("rv-styles")) {
  const t = document.createElement("style");
  t.id = "rv-styles";
  t.textContent = REVIEW_STYLES;
  document.head.appendChild(t);
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
const StarDisplay = ({ rating, size = 15 }) => (
  <span style={{ color: "#c4813a", fontSize: size }}>
    {[1,2,3,4,5].map((s) => <span key={s}>{s <= Math.round(rating) ? "★" : "☆"}</span>)}
  </span>
);

const SpecRow = ({ title, value }) => (
  <div className="spec-row">
    <div className="spec-title">{title}</div>
    <div className="spec-value">{value}</div>
  </div>
);

// ─── Reviews Section ───────────────────────────────────────────────────────────
const ReviewsSection = ({ productId, product, navigate }) => {
  const [reviews,        setReviews]        = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [lightboxSrc,    setLightboxSrc]    = useState(null);

  useEffect(() => {
    if (!productId) return;
    (async () => {
      try {
        setReviewsLoading(true);
        const data = await getReviewsByProductApi(productId);
        // ✅ FIXED: parse { reviews, averageRating, totalReviews }
        // ✅ NO status filter — pending reviews bhi dikhao
        setReviews(data?.reviews || data || []);
      } catch (_) {
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    })();
  }, [productId]);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const ratingCounts = [5,4,3,2,1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  const getName = (r) => r.customer?.fullName || r.userName || r.user?.name || "User";
  const getInit = (r) => getName(r).charAt(0).toUpperCase();

  return (
    <div className="rv-section">
      <div className="rv-section-head">
        <h2 className="rv-section-title">Customer Reviews</h2>
        <button className="rv-write-btn" onClick={() => navigate(`/review/${productId}`, { state: { product } })}>
          ✏️ Write a Review
        </button>
      </div>

      {reviewsLoading ? (
        <div className="rv-loading">
          <div className="rv-loading-dot" /><div className="rv-loading-dot" /><div className="rv-loading-dot" />
          <span>Loading reviews…</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="rv-empty">
          <span className="rv-empty-icon">💬</span>
          <p className="rv-empty-title">No reviews yet</p>
          <p className="rv-empty-sub">Be the first to share your experience!</p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="rv-summary">
            <div className="rv-score-block">
              <div className="rv-score-num">{avgRating}</div>
              <div className="rv-score-stars"><StarDisplay rating={avgRating} size={16} /></div>
              <div className="rv-score-label">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</div>
            </div>
            <div className="rv-bars">
              {ratingCounts.map(({ star, count, pct }) => (
                <div key={star} className="rv-bar-row">
                  <span className="rv-bar-label">{star}</span>
                  <span className="rv-bar-star">★</span>
                  <div className="rv-bar-track"><div className="rv-bar-fill" style={{ width: `${pct}%` }} /></div>
                  <span className="rv-bar-count">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cards */}
          <div className="rv-list">
            {reviews.map((review, idx) => (
              <div key={review._id} className="rv-card" style={{ animationDelay: `${idx * 0.06}s` }}>
                <div className="rv-card-top">
                  <div className="rv-reviewer">
                    <div className="rv-avatar">{getInit(review)}</div>
                    <div>
                      <div className="rv-reviewer-name">{getName(review)}</div>
                      <div className="rv-reviewer-stars"><StarDisplay rating={review.rating} size={13} /></div>
                    </div>
                  </div>
                  <span className="rv-date">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                  </span>
                </div>

                {review.title && <p className="rv-review-title">{review.title}</p>}
                {review.reviewText && <p className="rv-review-text">{review.reviewText}</p>}

                {(review.images?.length > 0 || review.videos?.length > 0) && (
                  <div className="rv-media-grid">
                    {review.images?.map((img, i) => (
                      <img key={i} src={img.url || img} alt={`img-${i}`} className="rv-media-thumb" onClick={() => setLightboxSrc(img.url || img)} />
                    ))}
                    {review.videos?.map((vid, i) => (
                      <div key={i} className="rv-video-thumb">
                        <video src={vid.url || vid} muted />
                        <div className="rv-video-play">▶️</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className={`rv-status ${review.status}`}>
                  {review.status === "pending"  && "⏳ Under Review"}
                  {review.status === "approved" && "✓ Verified"}
                  {review.status === "rejected" && "✗ Not Published"}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {lightboxSrc && (
        <div className="rv-lightbox" onClick={() => setLightboxSrc(null)}>
          <button className="rv-lightbox-close" onClick={() => setLightboxSrc(null)}>×</button>
          <img src={lightboxSrc} alt="preview" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

// ─── Main Checkout ─────────────────────────────────────────────────────────────
const Checkout = () => {
  const navigate = useNavigate();
  const { id }   = useParams();

  const [product,         setProduct]         = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [addingToCart,    setAddingToCart]     = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage,   setSelectedImage]   = useState("");
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        setSimilarProducts([]);
        const res  = await fetchProductById(id);
        const prod = res?.product || res;
        setProduct(prod);
        setSelectedVariant(prod?.variants?.[0] || null);
        const firstImg = prod?.images?.[0];
        setSelectedImage(firstImg?.url || firstImg || "");
        const catId = typeof prod?.category === "object" ? prod.category?._id : prod?.category;
        if (catId) {
          try {
            const simRes = await fetchProducts({ category: catId, limit: 10 });
            const all = simRes?.products || simRes?.data || simRes || [];
            setSimilarProducts(all.filter((p) => p._id !== prod._id).slice(0, 5));
          } catch (_) {}
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setAddingToCart(true);
      await addItemToCart({ productId: product._id, sku: selectedVariant?.sku || product?.sku || "", quantity: 1 });
      navigate("/cart");
    } catch (err) {
      alert(err?.message || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => navigate("/orderaddress", { state: { product, selectedVariant } });

  if (loading) return (<><Header /><div style={{ minHeight:"60vh",display:"flex",alignItems:"center",justifyContent:"center" }}><p style={{ color:"#888" }}>Loading product...</p></div><Footer /></>);
  if (!product) return (<><Header /><div style={{ minHeight:"60vh",display:"flex",alignItems:"center",justifyContent:"center" }}><p style={{ color:"#e63946" }}>Product not found.</p></div><Footer /></>);

  const imageList    = product.images || [];
  const categoryName = typeof product.category === "object" ? product.category?.categoryKey || product.category?.pageTitle || "" : product.category || "";
  const price        = selectedVariant?.price         ?? product.price ?? 0;
  const mrp          = selectedVariant?.compareAtPrice ?? product.mrp  ?? 0;
  const stock        = selectedVariant?.stock          ?? product.stock ?? null;
  const sku          = selectedVariant?.sku             || product.sku  || "";
  const discount     = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const isOutOfStock = stock !== null && stock !== undefined && Number(stock) <= 0;

  const infoFields = [
    { label: "SKU",           value: sku || null },
    { label: "Brand",         value: product.brand || null },
    { label: "Warranty",      value: product.warranty || product.warrantyInfo || null },
    { label: "EMI",           value: product.emi ? `₹${Number(product.emi).toLocaleString("en-IN")}/month onwards` : product.emiInfo || null },
    { label: "Delivery",      value: product.deliveryInfo || product.delivery || null },
    { label: "Return Policy", value: product.returnPolicy || null },
    { label: "In the Box",    value: product.inTheBox || product.boxContents || null },
    { label: "Origin",        value: product.countryOfOrigin || null },
    { label: "Seller",        value: product.seller || product.sellerName || null },
  ].filter((f) => f.value);

  const variantAttributeKeys = product.variants?.length > 0 && product.variants[0]?.attributes ? Object.keys(product.variants[0].attributes) : [];
  const groupedByAttribute = {};
  variantAttributeKeys.forEach((key) => {
    const seen = new Set();
    groupedByAttribute[key] = product.variants
      .filter((v) => { const val = v.attributes?.[key]; if (val===undefined||seen.has(val)) return false; seen.add(val); return true; })
      .map((v) => ({ value: v.attributes[key], variant: v }));
  });

  const handleVariantSelect = (attrKey, newValue) => {
    const matched = product.variants.find((v) => {
      if (!v.attributes) return false;
      return Object.keys(v.attributes).every((k) =>
        k === attrKey ? String(v.attributes[k])===String(newValue) : String(v.attributes[k])===String(selectedVariant?.attributes?.[k]??"")
      );
    });
    if (matched) setSelectedVariant(matched);
  };

  return (
    <>
      <Header />
      <div className="took">
        <div className="container-1">

          <div className="product-top-1">
            {/* Images */}
            <div>
              <div className="main-image-1">
                {selectedImage
                  ? <img src={selectedImage} alt={product.name || product.title} />
                  : <div style={{ width:"100%",height:"300px",background:"#f0f0f0",display:"flex",alignItems:"center",justifyContent:"center",color:"#bbb",borderRadius:"8px" }}>No Image</div>
                }
              </div>
              {imageList.length > 1 && (
                <div className="thumbs-1">
                  {imageList.map((img, i) => {
                    const src = img?.url || img;
                    return <img key={i} src={src} alt={`t-${i}`} onClick={() => setSelectedImage(src)} style={{ cursor:"pointer",border:selectedImage===src?"2px solid #e63946":"2px solid transparent",borderRadius:"4px",opacity:selectedImage===src?1:0.65,transition:"opacity 0.2s,border 0.2s" }} />;
                  })}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="product-info">
              {categoryName && <p style={{ color:"#888",fontSize:"13px",marginBottom:"4px" }}>{categoryName}</p>}
              <h1>{product.name || product.title}</h1>
              {product.description && <p style={{ color:"#555",fontSize:"14px",margin:"8px 0 12px",lineHeight:"1.65" }}>{product.description}</p>}

              <div className="price" style={{ display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap" }}>
                {price > 0 && <span>₹{price.toLocaleString("en-IN")}</span>}
                {mrp > price && <><span className="old-price">₹{mrp.toLocaleString("en-IN")}</span><span style={{ color:"#2a9d8f",fontSize:"14px",fontWeight:"600" }}>{discount}% off</span></>}
              </div>

              {infoFields.map((f, i) => <p key={i} className="info-text"><strong>{f.label}:</strong> {f.value}</p>)}

              {stock !== null && stock !== undefined && (
                <p style={{ fontSize:"14px",fontWeight:"600",margin:"8px 0",color:isOutOfStock?"#e63946":Number(stock)<=5?"#f4a261":"#2a9d8f" }}>
                  {isOutOfStock?"Out of Stock":Number(stock)<=5?`Only ${stock} left!`:"In Stock"}
                </p>
              )}

              {variantAttributeKeys.length > 0 ? (
                <div style={{ marginTop:"16px" }}>
                  {variantAttributeKeys.map((attrKey) => (
                    <div key={attrKey} style={{ marginBottom:"14px" }}>
                      <p style={{ fontWeight:"600",fontSize:"14px",color:"#333",marginBottom:"8px" }}>{attrKey}: <span style={{ fontWeight:"400",color:"#666" }}>{String(selectedVariant?.attributes?.[attrKey]??"")}</span></p>
                      <div style={{ display:"flex",flexWrap:"wrap",gap:"8px" }}>
                        {groupedByAttribute[attrKey]?.map((item, i) => {
                          const isSel = String(selectedVariant?.attributes?.[attrKey])===String(item.value);
                          return <button key={i} onClick={() => handleVariantSelect(attrKey, item.value)} style={{ padding:"6px 16px",border:isSel?"2px solid #e63946":"2px solid #ddd",borderRadius:"6px",background:isSel?"#fff0f1":"#fff",color:isSel?"#e63946":"#444",fontWeight:isSel?"700":"400",cursor:"pointer",fontSize:"13px",transition:"all 0.15s" }}>{String(item.value)}</button>;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : product.variants?.length > 1 ? (
                <div style={{ marginTop:"16px" }}>
                  <p style={{ fontWeight:"600",marginBottom:"8px" }}>Select Variant:</p>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:"8px" }}>
                    {product.variants.map((v, i) => {
                      const isSel = selectedVariant?.sku===v.sku;
                      return <button key={i} onClick={() => setSelectedVariant(v)} style={{ padding:"6px 16px",border:isSel?"2px solid #e63946":"2px solid #ddd",borderRadius:"6px",background:isSel?"#fff0f1":"#fff",color:isSel?"#e63946":"#444",fontWeight:isSel?"700":"400",cursor:"pointer",fontSize:"13px",transition:"all 0.15s" }}>{v.sku}{v.price>0&&<span style={{ display:"block",fontSize:"11px",color:"#888" }}>₹{v.price.toLocaleString("en-IN")}</span>}</button>;
                    })}
                  </div>
                </div>
              ) : null}

              <div className="btn-group" style={{ marginTop:"20px" }}>
                <button className="btnk btn-cart" onClick={handleAddToCart} disabled={addingToCart||isOutOfStock}>
                  {addingToCart?"Adding...":isOutOfStock?"Out of Stock":"Add to Cart"}
                </button>
                <button className="btnk btn-buy" onClick={handleBuyNow} disabled={isOutOfStock}>Buy Now</button>
              </div>
            </div>
          </div>

          {product.keyFeatures?.length > 0 && (<><h2>Key Features</h2><div className="features"><ul>{product.keyFeatures.map((f,i)=><li key={i}><strong>{f.key}:</strong> {String(f.value)}</li>)}</ul></div></>)}
          {product.specifications?.length > 0 && (<><h2>Product Specification</h2><div className="spec-box">{product.specifications.map((s,i)=><SpecRow key={i} title={s.key} value={String(s.value)} />)}</div></>)}

          {/* ✅ Reviews Section */}
          <ReviewsSection productId={id} product={product} navigate={navigate} />

          {similarProducts.length > 0 && (
            <>
              <h2 style={{ marginTop:"48px" }}>Similar Products</h2>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))",gap:"16px",marginBottom:"40px" }}>
                {similarProducts.map((prod) => {
                  const sv=prod.variants?.[0], sP=sv?.price??prod.price??0, sM=sv?.compareAtPrice??prod.mrp??0, sD=sM>sP?Math.round(((sM-sP)/sM)*100):0;
                  const sImg=prod.images?.[0]?.url||prod.images?.[0]||"", sName=prod.name||prod.title||"";
                  return (
                    <div key={prod._id} onClick={()=>navigate(`/checkout/${prod._id}`)}
                      style={{ background:"#fff",borderRadius:"10px",padding:"12px",border:"1px solid #eee",cursor:"pointer",transition:"box-shadow 0.2s,transform 0.2s",boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}
                      onMouseEnter={(e)=>{e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.12)";e.currentTarget.style.transform="translateY(-3px)";}}
                      onMouseLeave={(e)=>{e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.04)";e.currentTarget.style.transform="translateY(0)";}}>
                      {sImg?<img src={sImg} alt={sName} style={{ width:"100%",height:"140px",objectFit:"contain",borderRadius:"6px",marginBottom:"10px",background:"#f9f9f9" }} />:<div style={{ width:"100%",height:"140px",background:"#f0f0f0",borderRadius:"6px",marginBottom:"10px",display:"flex",alignItems:"center",justifyContent:"center",color:"#ccc",fontSize:"12px" }}>No Image</div>}
                      {sName&&<p style={{ fontSize:"13px",fontWeight:"600",color:"#222",margin:"0 0 6px",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical" }}>{sName}</p>}
                      <div style={{ display:"flex",alignItems:"center",gap:"6px",flexWrap:"wrap" }}>
                        {sP>0&&<span style={{ fontWeight:"700",color:"#e63946",fontSize:"14px" }}>₹{sP.toLocaleString("en-IN")}</span>}
                        {sM>sP&&<span style={{ fontSize:"11px",color:"#aaa",textDecoration:"line-through" }}>₹{sM.toLocaleString("en-IN")}</span>}
                        {sD>0&&<span style={{ fontSize:"11px",color:"#2a9d8f",fontWeight:"600" }}>{sD}% off</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

        </div>
      </div>
      <Secendcheck />
      <Footer />
    </>
  );
};

export default Checkout;