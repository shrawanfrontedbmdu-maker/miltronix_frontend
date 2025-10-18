import React from 'react';

const ResolutionInfo = ({ info = {} }) => {
  // Guard clause: If there's no data or no cards, don't render anything.
  if (!info.cards || info.cards.length === 0) {
    return null;
  }

  return (
    <>
      {/* Header Section */}
      <section className="qled-features1">
        <div className="container-fluid px-4">
          <div className="row align-items-end heading-row">
            <div className="col-md-5">
              <h2 className="qled-title ff2">
                <div className="qled-top">{info.title}</div>
                <em>{info.subtitle}</em>
              </h2>
            </div>
            <div className="col-md-6">
              <p className="qled-desc d-none d-md-block">
                {info.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="resolution-section py-4">
        <div className="container">
          <div className="row g-3">
            {info.cards.map((card) => (
              <div key={card.title} className="col-12 col-md-6 col-lg-3">
                <div className="resolution-card text-center mb-3">
                  <img src={card.image} alt={card.alt} className="img-fluid resolution-img mb-3" />
                  <h5 className="fw-bold green-head text-uppercase mb-1">{card.title}</h5>
                  <p className="text-center mb-1">{card.description}</p>
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