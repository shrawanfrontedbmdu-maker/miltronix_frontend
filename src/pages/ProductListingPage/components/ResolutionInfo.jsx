import React from 'react';
import { resolutionInfo } from '../../../data/mockData';

const ResolutionInfo = () => {
  return (
    <>
      {/* Header Section */}
      <section className="qled-features1">
        <div className="container-fluid px-4">
          <div className="row align-items-end heading-row">
            <div className="col-md-5">
              <h2 className="qled-title ff2">
                <div className="qled-top">Right Resolution</div>
                <em>For You</em>
              </h2>
            </div>
            <div className="col-md-6">
              <p className="qled-desc d-none d-md-block">
                A QLED TV uses quantum dot technology to produce brighter,
                more vivid colours. It delivers sharp detail and excellent
                picture quality, especially for 4K and HDR.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="resolution-section py-4">
        <div className="container">
          <div className="row g-3">
            {resolutionInfo.map((card) => (
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