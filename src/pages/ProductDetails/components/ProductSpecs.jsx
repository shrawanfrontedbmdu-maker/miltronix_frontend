import React from "react";

const ProductSpecs = ({ specs }) => {
  // Safe conversion: array / object / empty
  const safeSpecs = Array.isArray(specs)
    ? specs.map((spec) => {
        if (typeof spec === "string") {
          // agar string "Label: Value" format me ho
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

  return (
    <>
      <div>
        <h2 className="qled-title1 ff2 px-3">
          <div
            className="qled-top text-lg-start"
            style={{ position: "relative" }}
          >
            Product Specification
          </div>
        </h2>
      </div>

      <div className="details-card">
        <div className="row mb-2">
          {safeSpecs.map((spec, index) => (
            <div key={index} className="col-md-4 col-sm-6 mb-3">
              <div className="details-label">{spec.key}</div>
              <div className="details-value">{spec.value}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductSpecs;