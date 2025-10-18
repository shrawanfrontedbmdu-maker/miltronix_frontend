import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ path = [] }) => {
  return (
    <section className="profile-container1 py-0">
      <div className="container breadcrumb-bg">
        <div className="breadcrumb-bar1 hv">
          <div className="breadcrumb-custom hv ">
            {path.map((item, index) => (
              <span key={index}>
                {/* If it's not the last item, make it a link */}
                {index < path.length - 1 ? (
                  <>
                    <Link to="#" className="text-decoration-none">{item}</Link> &nbsp;&gt;&nbsp;
                  </>
                ) : (
                  // The last item is just text
                  <span className="hv">{item}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Breadcrumb;