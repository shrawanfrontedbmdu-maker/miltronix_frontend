import React, { useState } from "react";

const PS_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Arapey:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');

  .ps-section {
    padding: 52px 0 44px;
    font-family: 'Bricolage Grotesque', sans-serif;
    background: #fff;
  }

  /* ── Heading ── */
  .ps-heading-wrap {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 28px;
  }
  .ps-heading-badge {
    width: 42px; height: 42px;
    border-radius: 12px;
    background: linear-gradient(135deg, #2d3a38, #4a5856);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(45,58,56,0.2);
  }
  .ps-heading {
    font-family: 'Arapey', serif;
    font-size: clamp(22px, 3vw, 28px);
    font-weight: 700;
    color: #616D6B;
    letter-spacing: -0.4px;
    margin: 0;
    line-height: 1;
  }
  .ps-heading em { font-style: italic; font-weight: 400; color: #616D6B; }
  .ps-heading-line {
    flex: 1; height: 1.5px;
    background: linear-gradient(90deg, #e2e8f0, transparent);
    border-radius: 2px;
  }
  .ps-count {
    font-size: 12px; color: #94a3b8; font-weight: 500;
    background: #f1f5f9; border: 1px solid #e2e8f0;
    padding: 2px 9px; border-radius: 20px;
    margin-left: 6px; vertical-align: middle;
  }

  /* ── Search / Filter bar ── */
  .ps-search-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .ps-search-box {
    display: flex; align-items: center; gap: 8px;
    background: #f8fafc; border: 1.5px solid #e2e8f0;
    border-radius: 10px; padding: 8px 14px;
    flex: 1; min-width: 200px; max-width: 360px;
    transition: border-color 0.18s;
  }
  .ps-search-box:focus-within {
    border-color: #616D6B;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(97,109,107,0.08);
  }
  .ps-search-input {
    border: none; outline: none; background: transparent;
    font-size: 13px; font-family: 'Bricolage Grotesque', sans-serif;
    color: #616D6B; width: 100%;
  }
  .ps-search-input::placeholder { color: #94a3b8; }

  /* ── Table wrapper ── */
  .ps-table-wrap {
    border: 1.5px solid #e2e8f0;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  }

  /* ── Table ── */
  .ps-table {
    width: 100%;
    border-collapse: collapse;
  }
  .ps-table thead tr {
    background: linear-gradient(135deg, #2d3a38 0%, #4a5856 100%);
  }
  .ps-table thead th {
    padding: 14px 20px;
    font-size: 11px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.8px;
    color: rgba(255,255,255,0.7);
    font-family: 'Bricolage Grotesque', sans-serif;
    text-align: left;
  }
  .ps-table thead th:last-child { color: #fff; }

  .ps-table tbody tr {
    border-bottom: 1px solid #f1f5f9;
    transition: background 0.15s;
  }
  .ps-table tbody tr:last-child { border-bottom: none; }
  .ps-table tbody tr:nth-child(even) { background: #fafbfc; }
  .ps-table tbody tr:hover { background: #f0f7ff; }

  .ps-table td {
    padding: 13px 20px;
    vertical-align: middle;
    font-family: 'Bricolage Grotesque', sans-serif;
  }

  .ps-spec-key {
    font-size: 12px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.5px;
    color: #64748b;
    width: 38%;
  }
  .ps-spec-key-inner {
    display: flex; align-items: center; gap: 8px;
  }
  .ps-spec-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #616D6B; flex-shrink: 0; opacity: 0.6;
  }

  .ps-spec-value {
    font-size: 13.5px; font-weight: 500; color: #616D6B;
    line-height: 1.5;
  }

  /* ── No results ── */
  .ps-empty {
    text-align: center; padding: 40px 20px;
    color: #94a3b8; font-size: 14px;
  }

  /* ── Show more ── */
  .ps-show-more {
    display: flex; align-items: center; justify-content: center;
    gap: 6px; width: 100%; padding: 13px;
    background: #f8fafc; border: none; border-top: 1.5px solid #e2e8f0;
    font-size: 13px; font-weight: 600; color: #616D6B;
    cursor: pointer; font-family: 'Bricolage Grotesque', sans-serif;
    transition: all 0.18s;
  }
  .ps-show-more:hover {
    background: #f0f4f8; color: #616D6B;
  }
`;

const INITIAL_SHOW = 8;

const ProductSpecs = ({ specs }) => {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const safeSpecs = Array.isArray(specs)
    ? specs.map((spec) => {
        if (typeof spec === "string") {
          const parts = spec.split(/:(.*)/s);
          return { key: parts[0].trim(), value: parts[1]?.trim() || "" };
        }
        if (typeof spec === "object" && spec !== null) {
          return { key: spec.key || "Spec", value: spec.value || "" };
        }
        return { key: "Spec", value: String(spec) };
      })
    : typeof specs === "object" && specs !== null
    ? Object.entries(specs).map(([key, value]) => ({ key, value }))
    : [];

  if (!safeSpecs.length) return null;

  const filtered = query.trim()
    ? safeSpecs.filter(
        (s) =>
          s.key.toLowerCase().includes(query.toLowerCase()) ||
          String(s.value).toLowerCase().includes(query.toLowerCase())
      )
    : safeSpecs;

  const displayed = showAll ? filtered : filtered.slice(0, INITIAL_SHOW);
  const hasMore = filtered.length > INITIAL_SHOW && !showAll;

  return (
    <>
      <style>{PS_STYLE}</style>
      <section className="ps-section">
        <div className="container">

          {/* ── Heading ── */}
          <div className="ps-heading-wrap">
            <div className="ps-heading-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </div>
            <h3 className="ps-heading">
              Product <em>Specification</em>
              <span className="ps-count">{safeSpecs.length}</span>
            </h3>
            <div className="ps-heading-line" />
          </div>

          {/* ── Search bar ── */}
          {safeSpecs.length > 6 && (
            <div className="ps-search-wrap">
              <div className="ps-search-box">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  className="ps-search-input"
                  type="text"
                  placeholder="Search specifications…"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setShowAll(false); }}
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#94a3b8", display: "flex" }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                )}
              </div>
              {query && (
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          )}

          {/* ── Table ── */}
          <div className="ps-table-wrap">
            {filtered.length === 0 ? (
              <div className="ps-empty">No specifications found for "{query}"</div>
            ) : (
              <>
                <table className="ps-table">
                  <thead>
                    <tr>
                      <th>Specification</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayed.map((spec, index) => (
                      <tr key={index}>
                        <td className="ps-spec-key">
                          <div className="ps-spec-key-inner">
                            <span className="ps-spec-dot" />
                            {spec.key}
                          </div>
                        </td>
                        <td className="ps-spec-value">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Show more / less */}
                {(hasMore || (showAll && filtered.length > INITIAL_SHOW)) && (
                  <button
                    className="ps-show-more"
                    onClick={() => setShowAll((p) => !p)}
                  >
                    {showAll ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="18 15 12 9 6 15"/>
                        </svg>
                        Show Less
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                        Show {filtered.length - INITIAL_SHOW} More Specifications
                      </>
                    )}
                  </button>
                )}
              </>
            )}
          </div>

        </div>
      </section>
    </>
  );
};

export default ProductSpecs;