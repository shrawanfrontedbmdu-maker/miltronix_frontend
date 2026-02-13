import React from "react";

const BACKEND_URL = "https://miltronix-backend-1.onrender.com";

const ResolutionInfo = ({ info = {} }) => {
  if (!info.cards || info.cards.length === 0) return null;

  return (
    <>
      {/* Header Section */}
      <section className="qled-features1 py-4">
        <div className="container-fluid px-4">
          <div className="row align-items-end heading-row">
            <div className="col-md-5">
              <h2 className="qled-title ff2">
                <div className="qled-top">{info.title || "Features"}</div>
                <em>{info.subtitle || ""}</em>
              </h2>
            </div>
            <div className="col-md-6">
              <p className="qled-desc d-none d-md-block">
                {info.description || ""}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="resolution-section py-4">
        <div className="container">
          <div className="row g-3">
            {info.cards.map((card, idx) => (
              <div key={card._id || idx} className="col-12 col-md-6 col-lg-3">
                <div className="resolution-card text-center mb-3">
                  <img
                    src={card.image ? `${BACKEND_URL}${card.image}` : "/src/assets/default-card.png"}
                    alt={card.alt || card.title || "Card Image"}
                    className="img-fluid resolution-img mb-3"
                  />
                  <h5 className="fw-bold green-head text-uppercase mb-1">
                    {card.title || "Title"}
                  </h5>
                  <p className="text-center mb-1">
                    {card.description || ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ResolutionInfo;
