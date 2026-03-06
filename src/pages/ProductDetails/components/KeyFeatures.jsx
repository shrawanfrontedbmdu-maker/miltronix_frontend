import React from "react";

const KF_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Arapey:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');

  .kf-section {
    padding: 52px 0 44px;
    font-family: 'Bricolage Grotesque', sans-serif;
    background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  }

  /* ── Heading ── */
  .kf-heading-wrap {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 28px;
  }
  .kf-heading-badge {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: linear-gradient(135deg, #2d3a38, #4a5856);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(45,58,56,0.2);
  }
  .kf-heading {
    font-family: 'Arapey', serif;
    font-size: clamp(22px, 3vw, 28px);
    font-weight: 700;
    color: #616D6B;
    letter-spacing: -0.4px;
    margin: 0;
    line-height: 1;
  }
  .kf-heading em {
    font-style: italic;
    font-weight: 400;
    color: #616D6B;
  }
  .kf-heading-line {
    flex: 1;
    height: 1.5px;
    background: linear-gradient(90deg, #e2e8f0, transparent);
    border-radius: 2px;
  }

  /* ── Grid ── */
  .kf-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 12px;
  }

  /* ── Card ── */
  .kf-item {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 16px 18px;
    background: #ffffff;
    border: 1.5px solid #e8edf2;
    border-radius: 14px;
    transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
    cursor: default;
    position: relative;
    overflow: hidden;
  }
  /* left accent bar */
  .kf-item::before {
    content: '';
    position: absolute;
    left: 0; top: 16%; bottom: 16%;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: linear-gradient(180deg, #616D6B, #4a5856);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .kf-item:hover {
    border-color: #c8d4dc;
    box-shadow: 0 6px 20px rgba(97,109,107,0.1);
    transform: translateY(-3px);
    background: #fafcff;
  }
  .kf-item:hover::before {
    opacity: 1;
  }

  /* ── Icon circle ── */
  .kf-icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #f1f5f9, #e8edf3);
    border: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s;
  }
  .kf-item:hover .kf-icon-wrap {
    background: linear-gradient(135deg, #4a5856, #2d3a38);
    border-color: #4a5856;
  }
  .kf-item:hover .kf-icon-wrap svg {
    stroke: #fff;
  }

  /* ── Text ── */
  .kf-key {
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    color: #94a3b8;
    margin-bottom: 3px;
    display: block;
    transition: color 0.2s;
  }
  .kf-item:hover .kf-key {
    color: #616D6B;
  }
  .kf-value {
    font-size: 13.5px;
    font-weight: 600;
    color: #616D6B;
    line-height: 1.45;
  }

  /* ── Count badge ── */
  .kf-count {
    font-size: 12px;
    color: #94a3b8;
    font-weight: 500;
    margin-left: 6px;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    padding: 2px 9px;
    border-radius: 20px;
    vertical-align: middle;
  }
`;

/* Map common feature keys to icons */
const ICON_MAP = {
  default: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#616D6B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  display: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#616D6B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  resolution: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#616D6B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  processor: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#616D6B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  ),
  ram: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#616D6B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 12h.01M10 12h.01M14 12h.01M18 12h.01" />
    </svg>
  ),
  storage: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#616D6B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  battery: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#616D6B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="6" width="18" height="12" rx="2" />
      <line x1="23" y1="13" x2="23" y2="11" />
      <line x1="7" y1="12" x2="11" y2="8" />
      <polyline points="11 8 13 8 13 12 17 12 17 16 13 16 13 16" />
    </svg>
  ),
  camera: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#616D6B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  connectivity: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#616D6B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  ),
  refresh: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#616D6B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  ),
};

const getIcon = (key = "") => {
  const k = key.toLowerCase();
  if (k.includes("display") || k.includes("screen") || k.includes("size"))
    return ICON_MAP.display;
  if (k.includes("resolution") || k.includes("pixel"))
    return ICON_MAP.resolution;
  if (k.includes("processor") || k.includes("cpu") || k.includes("chip"))
    return ICON_MAP.processor;
  if (k.includes("ram") || k.includes("memory")) return ICON_MAP.ram;
  if (k.includes("storage") || k.includes("rom") || k.includes("ssd"))
    return ICON_MAP.storage;
  if (k.includes("battery") || k.includes("power")) return ICON_MAP.battery;
  if (k.includes("camera") || k.includes("photo")) return ICON_MAP.camera;
  if (
    k.includes("wifi") ||
    k.includes("connect") ||
    k.includes("bluetooth") ||
    k.includes("network")
  )
    return ICON_MAP.connectivity;
  if (k.includes("refresh") || k.includes("hz") || k.includes("rate"))
    return ICON_MAP.refresh;
  return ICON_MAP.default;
};

const KeyFeatures = ({ features }) => {
  const safeFeatures = Array.isArray(features)
    ? features.map((feat) => {
        if (typeof feat === "string") {
          const parts = feat.split(/:(.*)/s);
          return { key: parts[0].trim(), value: parts[1]?.trim() || "" };
        }
        if (typeof feat === "object" && feat !== null) {
          return { key: feat.key || "Feature", value: feat.value || "" };
        }
        return { key: "Feature", value: String(feat) };
      })
    : typeof features === "object" && features !== null
      ? Object.entries(features).map(([key, value]) => ({ key, value }))
      : [];

  if (!safeFeatures.length) return null;

  return (
    <>
      <style>{KF_STYLE}</style>
      <section className="kf-section">
        <div className="container">
          {/* Heading */}
          <div className="kf-heading-wrap">
            <div className="kf-heading-badge">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h3 className="kf-heading">
              Key <em>Features</em>
              <span className="kf-count">{safeFeatures.length}</span>
            </h3>
            <div className="kf-heading-line" />
          </div>

          {/* Grid */}
          <div className="kf-grid">
            {safeFeatures.map((feature, index) => (
              <div key={index} className="kf-item">
                <div className="kf-icon-wrap">{getIcon(feature.key)}</div>
                <div style={{ minWidth: 0 }}>
                  <span className="kf-key">{feature.key}</span>
                  <span className="kf-value">{feature.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default KeyFeatures;
