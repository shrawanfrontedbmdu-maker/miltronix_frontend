import React, { useEffect, useState } from "react";
import DealCard from "../../../components/ui/DealCard";
import { fetchTopDealsApi } from "../../../api/api";

const TopDealsSection = () => {
  const [topDeals, setTopDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopDeals = async () => {
      try {
        const res = await fetchTopDealsApi();

        // ✅ backend se "products" aa raha hai
        setTopDeals(res?.products || []);
      } catch (error) {
        console.error("Failed to fetch top deals", error);
      } finally {
        setLoading(false);
      }
    };

    loadTopDeals();
  }, []);

  if (loading) {
    return <div className="text-center py-5">Loading Top Deals...</div>;
  }

  return (
    <>
      {/* Header */}
      <div className="qled-features">
        <div className="container">
          <div className="row align-items-end heading-row">
            <div className="col-md-4">
              <h2 className="qled-title1 ff2" style={{ position: "relative" }}>
                <div className="qled-top">Top QLED</div>
                <em style={{ top: "-2px" }}>Deals</em>
              </h2>
            </div>

            <div className="col-md-8 d-flex justify-content-between align-items-end">
              <p className="qled-desc mb-0 d-none d-md-block">
                Discover our best-selling QLED TVs at unbeatable prices. Enjoy <br />
                stunning picture quality, vibrant colors, and the latest technology—all <br />
                with exclusive discounts you won't want to miss.
              </p>

              <a href="/category/qled" className="btn custom-btn px-4">
                View All Products
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <section className="product-section">
        <div className="container">
          <div className="row g-4">
            {topDeals.length === 0 ? (
              <p className="text-center">No Top Deals Found</p>
            ) : (
              topDeals.map((deal) => (
                <DealCard key={deal._id} deal={deal} />
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default TopDealsSection;