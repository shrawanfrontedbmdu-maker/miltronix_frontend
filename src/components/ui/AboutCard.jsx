import React from 'react';

const decoVector = '/src/assets/Vector 17.svg';
const linkIcon = '/src/assets/Frame 52.png';

const AboutCard = ({ card }) => {
  return (
    <div className="col-12 col-sm-6 col-lg-4">
      <div className="custom-card p-3 h-100">
        <img src={decoVector} width="90px" alt="" className="position-absolute top-0 end-0" />
        <h6 className="card-top mb-5 hv">
          {card.title.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </h6>
        <span className="icon-circle">
          <img src={linkIcon} alt="Link Icon" />
        </span>
        <img src={card.image} className="img-fluid rounded" alt={card.alt} />
      </div>
    </div>
  );
};

export default AboutCard;