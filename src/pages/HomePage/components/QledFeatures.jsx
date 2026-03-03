import React, { useEffect, useState } from 'react';
import './qled.css';
import { fetchCategories } from "../../../api/api";

const QledFeatures = () => {
  const [featureImages, setFeatureImages] = useState([]);
  const [title, setTitle] = useState("QLED");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQledCategory = async () => {
      try {
        const categories = await fetchCategories();
        const qled = categories.find((cat) => cat.categoryKey === "qled");

        if (qled) {
          setTitle(qled.features?.title || "QLED");
          setDescription(qled.features?.description || "");
          const images = (qled.features?.images || []).map((src, i) => ({
            src,
            alt: `Feature ${i + 1}`,
          }));
          setFeatureImages(images);
        }
      } catch (error) {
        console.error("Failed to load QLED category:", error);
      } finally {
        setLoading(false);
      }
    };

    loadQledCategory();
  }, []);

 if (loading) {
  return <div className="text-center py-5"></div>;
}

  return (
    <section className="qled-features">
      <div className="container-fluid px-4">

        <div className="row align-items-end heading-row">
          <div className="col-md-4">
            <h2 className="qled-title ff2">
              <div className="qled-top">{title}</div>
              <em>Features</em>
            </h2>
          </div>
          <div className="col-md-8">
            <p className='line'>{description}</p>
          </div>
        </div>

        <div className="features-grid">
          {featureImages.map((icon, index) => (
            <div key={index} className="feature-item">
              <div className="circle">
                <img src={icon.src} alt={icon.alt} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default QledFeatures;