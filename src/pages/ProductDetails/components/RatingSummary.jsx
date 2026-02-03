import React from 'react';
import { ProgressBar } from 'react-bootstrap'; // Using react-bootstrap for progress bars

const starIconFull = '/src/assets/icon 7.svg';
const starIconEmpty = '/src/assets/icon 8.svg';

const RatingSummary = ({ reviews = {} }) => {


  if (!reviews.total || !reviews.distribution) {
    return null; 
  }

  return (
    <div className="col-lg-4 col-md-5 mb-4">
      <h3 className="section-title mb-3 ff2">Customer <em className="ff2" style={{ fontStyle: 'italic' }}>Review</em></h3>

      <div className="d-flex align-items-center mb-2">
        <div className="product-rating1 me-3">
          {[...Array(5)].map((_, i) => (
            <img key={i} src={i < reviews.average ? starIconFull : starIconEmpty} className="star" alt="" />
          ))}
        </div>
        <span className="fs-5 see-more hv">{reviews.average} out of 5</span>
      </div>
      <p className="see-more mb-4 fs-5">{reviews.total.toLocaleString()} global ratings</p>

      {/* Star progress bars */}
      {reviews.distribution.map(item => (
        <div key={item.star} className="mb-2">
          <div className="d-flex align-items-center">
            <p className="see-more fs-5 mb-0 me-2">{item.star} star</p>
            <ProgressBar now={item.percentage} style={{ height: '28px', width: '50%' }} />
            <p className="see-more fs-5 mb-0 ms-2">{item.percentage}%</p>
          </div>
        </div>
      ))}

      <button className="btn bg-light btn-outline-secondary rounded-pill d-flex align-items-center w-75 px-4 py-2 my-4">
        <span className="text-muted me-auto">Write a review</span>
        <i className="bi bi-pencil"></i>
      </button>
    </div>
  );
};

export default RatingSummary;