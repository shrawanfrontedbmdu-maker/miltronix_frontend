import React, { useState, useEffect, useRef } from "react";

const ProductGallery = ({ images = [], variantImageUrl = null }) => {
  const [mainIndex, setMainIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [lightbox, setLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareRef = useRef(null);

  const VISIBLE_THUMBS = 4;

  const getSrc = (img) => {
    if (!img) return "";
    if (typeof img === "string") return img;
    if (typeof img === "object") return img.url || "";
    return "";
  };

  const mainSrc = variantImageUrl || getSrc(images[mainIndex]);

  useEffect(() => {
    if (variantImageUrl) {
      const idx = images.findIndex((img) => getSrc(img) === variantImageUrl);
      if (idx !== -1) {
        setMainIndex(idx);
        if (idx < thumbStart || idx >= thumbStart + VISIBLE_THUMBS) {
          setThumbStart(
            Math.max(
              0,
              Math.min(idx, Math.max(0, images.length - VISIBLE_THUMBS)),
            ),
          );
        }
      }
    }
  }, [variantImageUrl, images]);

  useEffect(() => {
    const handler = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target))
        setShareOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e) => {
      if (e.key === "ArrowRight")
        setLightboxIndex((p) => (p + 1) % images.length);
      if (e.key === "ArrowLeft")
        setLightboxIndex((p) => (p - 1 + images.length) % images.length);
      if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, images.length]);

  if (!images.length && !variantImageUrl) return null;

  const visibleThumbs = images.slice(thumbStart, thumbStart + VISIBLE_THUMBS);
  const canUp = thumbStart > 0;
  const canDown = thumbStart + VISIBLE_THUMBS < images.length;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = "Check out this product!";
    const links = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    };
    if (platform === "copy") {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
      return;
    }
    window.open(links[platform], "_blank");
    setShareOpen(false);
  };

  const shareItems = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
    {
      id: "facebook",
      label: "Facebook",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      id: "twitter",
      label: "Twitter / X",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#000">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      id: "copy",
      label: copied ? "Copied! ✓" : "Copy Link",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#616D6B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <div
        className="col-12 col-lg-6"
        style={{
          paddingLeft: "16px",
          paddingRight: "16px",
          alignSelf: "flex-start",
          position: "sticky",
          top: "76px",
          /*
            ── Z-INDEX FIX ──
            Sticky element ka z-index LOW rakhna hai (1 ya auto)
            taaki neeche wale sections (KeyFeatures, Spec etc.)
            scroll karte waqt GALLERY KE UPAR se nikal jaayein,
            NEECHE se jaayein.
            Agar z-index zyada hota hai toh content gallery ke
            upar float karta dikh ta hai.
          */
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
          {/* ══ Vertical Thumbnails ══ */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
              flexShrink: 0,
            }}
          >
            {/* Up */}
            <button
              onClick={() => setThumbStart((p) => Math.max(0, p - 1))}
              disabled={!canUp}
              style={{
                width: "58px",
                height: "22px",
                background: canUp ? "#616D6B" : "#f1f5f9",
                border: `1px solid ${canUp ? "#616D6B" : "#e2e8f0"}`,
                borderRadius: "7px",
                cursor: canUp ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: canUp ? 1 : 0.35,
                transition: "all 0.2s",
              }}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke={canUp ? "#fff" : "#94a3b8"}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>

            {/* Thumbs */}
            {visibleThumbs.map((img, idx) => {
              const realIdx = thumbStart + idx;
              const thumbSrc = getSrc(img);
              const isActive = variantImageUrl
                ? thumbSrc === variantImageUrl || mainIndex === realIdx
                : mainIndex === realIdx;

              return (
                <div
                  key={realIdx}
                  onClick={() => setMainIndex(realIdx)}
                  style={{
                    width: "58px",
                    height: "58px",
                    padding: "5px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    background: isActive
                      ? "#fff"
                      : "linear-gradient(145deg,#f8fafc,#f1f5f9)",
                    border: isActive
                      ? "2px solid #616D6B"
                      : "1.5px solid #e2e8f0",
                    transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: isActive
                      ? "0 0 0 3px rgba(97,109,107,0.15), 0 4px 10px rgba(97,109,107,0.1)"
                      : "0 1px 3px rgba(0,0,0,0.04)",
                    transform: isActive ? "scale(1.05)" : "scale(1)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = "#616D6B";
                      e.currentTarget.style.transform = "scale(1.03)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = "#e2e8f0";
                      e.currentTarget.style.transform = "scale(1)";
                    }
                  }}
                >
                  <img
                    src={thumbSrc}
                    alt={`View ${realIdx + 1}`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      borderRadius: "6px",
                      opacity: isActive ? 1 : 0.6,
                      transition: "opacity 0.2s",
                    }}
                  />
                </div>
              );
            })}

            {/* Down */}
            <button
              onClick={() =>
                setThumbStart((p) =>
                  Math.min(images.length - VISIBLE_THUMBS, p + 1),
                )
              }
              disabled={!canDown}
              style={{
                width: "58px",
                height: "22px",
                background: canDown ? "#616D6B" : "#f1f5f9",
                border: `1px solid ${canDown ? "#616D6B" : "#e2e8f0"}`,
                borderRadius: "7px",
                cursor: canDown ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: canDown ? 1 : 0.35,
                transition: "all 0.2s",
              }}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke={canDown ? "#fff" : "#94a3b8"}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>

          {/* ══ Main Image ══ */}
          <div style={{ flex: 1, position: "relative" }}>
            <div
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
              onClick={() => {
                setLightboxIndex(mainIndex);
                setLightbox(true);
              }}
              style={{
                background: "linear-gradient(145deg, #f8fafc 0%, #eef2f7 100%)",
                borderRadius: "20px",
                padding: "28px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                border: "1.5px solid #e2e8f0",
                boxShadow:
                  "0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
                cursor: isZoomed ? "crosshair" : "zoom-in",
                height: "400px",
                position: "relative",
              }}
            >
              {/* dot pattern */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "20px",
                  backgroundImage:
                    "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                  opacity: 0.18,
                  pointerEvents: "none",
                }}
              />

              <img
                src={mainSrc}
                alt="Product"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  transition: "transform 0.4s cubic-bezier(0.25,1,0.5,1)",
                  transform: isZoomed ? "scale(1.2)" : "scale(1)",
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.1))",
                  pointerEvents: "none",
                  position: "relative",
                  zIndex: 1,
                }}
              />

              {/* Expand hint */}
              <div
                style={{
                  position: "absolute",
                  bottom: "12px",
                  right: "12px",
                  background: "rgba(255,255,255,0.88)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(97,109,107,0.15)",
                  borderRadius: "8px",
                  padding: "4px 9px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "11px",
                  color: "#616D6B",
                  fontWeight: "600",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                  opacity: isZoomed ? 0 : 1,
                  transition: "opacity 0.2s",
                  zIndex: 2,
                }}
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#616D6B"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
                View Full
              </div>

              {/* Watermark */}
              <span
                style={{
                  position: "absolute",
                  bottom: "12px",
                  left: "14px",
                  color: "#616D6B",
                  opacity: 0.13,
                  fontSize: "10px",
                  letterSpacing: "3px",
                  fontWeight: "700",
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              >
                MILTRONIX
              </span>
            </div>

            {/* Counter + Share */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "10px",
                paddingInline: "2px",
              }}
            >
              <span
                style={{
                  fontSize: "11.5px",
                  color: "#94a3b8",
                  fontWeight: "500",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "20px",
                  padding: "3px 10px",
                }}
              >
                {variantImageUrl &&
                !images.some((img) => getSrc(img) === variantImageUrl)
                  ? "Variant Image"
                  : `${mainIndex + 1} / ${images.length}`}
              </span>

              <div ref={shareRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setShareOpen((p) => !p)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "5px 13px",
                    borderRadius: "20px",
                    border: `1.5px solid ${shareOpen ? "#616D6B" : "#e2e8f0"}`,
                    background: shareOpen ? "#616D6B" : "#fff",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: shareOpen ? "#fff" : "#616D6B",
                    transition: "all 0.2s",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={shareOpen ? "#fff" : "#616D6B"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  Share
                </button>

                {shareOpen && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "42px",
                      right: 0,
                      background: "#fff",
                      borderRadius: "14px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.11)",
                      border: "1px solid #e2e8f0",
                      padding: "8px",
                      zIndex: 100,
                      minWidth: "158px",
                      animation: "pg-fadeInUp 0.15s ease",
                    }}
                  >
                    {shareItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleShare(item.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          width: "100%",
                          padding: "8px 12px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          borderRadius: "9px",
                          fontSize: "13px",
                          fontWeight: "500",
                          color: "#374151",
                          transition: "background 0.12s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#f8fafc")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "none")
                        }
                      >
                        {item.icon} {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile thumbnails */}
        <div className="d-flex d-lg-none justify-content-center gap-2 flex-wrap mt-3">
          {images.map((img, index) => {
            const isActive = mainIndex === index;
            return (
              <div
                key={index}
                onClick={() => setMainIndex(index)}
                style={{
                  width: "52px",
                  height: "52px",
                  padding: "5px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  background: isActive
                    ? "#fff"
                    : "linear-gradient(145deg,#f8fafc,#f1f5f9)",
                  border: isActive
                    ? "2px solid #616D6B"
                    : "1.5px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  boxShadow: isActive
                    ? "0 0 0 3px rgba(97,109,107,0.12)"
                    : "none",
                }}
              >
                <img
                  src={getSrc(img)}
                  alt={`View ${index + 1}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    opacity: isActive ? 1 : 0.6,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ══ LIGHTBOX ══ */}
      {lightbox && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightbox(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999 /* lightbox is always on top */,
            background: "rgba(0,0,0,0.93)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "pg-fadeIn 0.2s ease",
          }}
        >
          <button
            onClick={() => setLightbox(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "17px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
            }
          >
            ✕
          </button>

          {images.length > 1 && (
            <button
              onClick={() =>
                setLightboxIndex((p) => (p - 1 + images.length) % images.length)
              }
              style={{
                position: "absolute",
                left: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
              }
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          <img
            src={
              variantImageUrl && lightboxIndex === mainIndex
                ? variantImageUrl
                : getSrc(images[lightboxIndex])
            }
            alt="Enlarged"
            style={{
              maxWidth: "80vw",
              maxHeight: "85vh",
              objectFit: "contain",
              borderRadius: "14px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              animation: "pg-zoomIn 0.2s ease",
            }}
          />

          {images.length > 1 && (
            <button
              onClick={() => setLightboxIndex((p) => (p + 1) % images.length)}
              style={{
                position: "absolute",
                right: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
              }
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}

          <div
            style={{
              position: "absolute",
              bottom: "22px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "center",
              maxWidth: "80vw",
            }}
          >
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  border:
                    lightboxIndex === idx
                      ? "2px solid #fff"
                      : "2px solid rgba(255,255,255,0.15)",
                  opacity: lightboxIndex === idx ? 1 : 0.38,
                  transition: "all 0.2s",
                  background: "rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                }}
              >
                <img
                  src={getSrc(img)}
                  alt={`${idx + 1}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            ))}
          </div>

          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              color: "rgba(255,255,255,0.5)",
              fontSize: "12.5px",
              fontWeight: "500",
              background: "rgba(255,255,255,0.08)",
              padding: "4px 14px",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes pg-fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes pg-fadeInUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pg-zoomIn   { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
        @media (max-width: 991px) {
          .col-12.col-lg-6[style*="sticky"] { position: static !important; top: auto !important; }
        }
      `,
        }}
      />
    </>
  );
};

export default ProductGallery;
