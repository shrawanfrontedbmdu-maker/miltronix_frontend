import React from 'react';
import { Carousel } from 'react-bootstrap';

const nextIcon = '/src/assets/Frame 239.png';

// 👇 1. Set a default value for the reviews prop
const CustomerFeedback = ({ reviews = {} }) => {

  // 👇 2. Add a "guard clause" to check if the images array exists before using it
  if (!reviews.images || !Array.isArray(reviews.images) || reviews.images.length === 0) {
    return null; // Or render a "No images" message
  }

  // Helper to chunk images into groups of 4 for the carousel
  const chunkedImages = reviews.images.reduce((resultArray, item, index) => { 
    const chunkIndex = Math.floor(index/4);
    if(!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);

  return (
    <div className="col-lg-8 col-md-7">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4 className="section-title mb-0 ff2">Customer <em className="ff2" style={{ fontStyle: 'italic' }}>say</em></h4>
        <a href="#" className="small see-more">see more reviews</a>
      </div>
      <p className="text-muted mb-4">{reviews.summaryText}</p>
      <h5 className="section-title mb-3 ff2">Review <em className="ff2" style={{ fontStyle: 'italic' }}>with image</em></h5>
      
      <Carousel 
        indicators={false}
        nextIcon={<img src={nextIcon} alt="Next" className="custom-next-icon" />}
        prevIcon={null}
      >
        {chunkedImages.map((chunk, index) => (
          <Carousel.Item key={index}>
            <div className="row g-3">
              {chunk.map((imgSrc, imgIndex) => (
                <div key={imgIndex} className="col-6 col-md-3">
                  <img src={imgSrc} className="img-fluid rounded img-width" alt={`Review image ${imgIndex + 1}`} />
                </div>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default CustomerFeedback;