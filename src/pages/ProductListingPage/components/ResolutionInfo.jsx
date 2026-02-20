import React from "react";

const ResolutionInfo = ({ info }) => {
  if (!info || !info.cards?.length) return null;

  return (
    <section className="resolution-section py-4">
      <div className="container">
        <div className="mb-3 text-center">
          <h3>{info.title}</h3>
          <p>{info.description}</p>
        </div>

        <div className="row g-3">
          {info.cards.map((card) => (
            <div key={card._id} className="col-12 col-md-6 col-lg-3">
              <div className="resolution-card text-center">
                <img
                  src={card.image}
                  alt={card.title}
                  className="img-fluid mb-3"
                />
                <h5>{card.title}</h5>
                <p>{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResolutionInfo;