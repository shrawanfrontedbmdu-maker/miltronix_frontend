import React from "react";

const KeyFeatures = ({ features }) => {
  // features ko safe array me convert karna
  const safeFeatures = Array.isArray(features)
    ? features.map((feat) => {
        // agar string format "Label: Value" hai to split kar do
        if (typeof feat === "string") {
          const parts = feat.split(/:(.*)/s);
          return { key: parts[0].trim(), value: parts[1]?.trim() || "" };
        }
        // agar object {key, value} hai to waise hi use karo
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
    <section className="key-features-section py-5">
      <div className="container">
        <h3 className="key-features-title mb-4">
          <span className="fw-light ff2">Key</span>{" "}
          <em className="ff2" style={{ fontStyle: "italic" }}>
            Features
          </em>
        </h3>

        <ul className="key-features-list list-unstyled">
          {safeFeatures.map((feature, index) => (
            <li key={index} className="hv">
              <strong>{feature.key}:</strong> {feature.value}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default KeyFeatures;
