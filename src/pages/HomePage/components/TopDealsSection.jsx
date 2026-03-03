import React, { useEffect, useState } from "react";
import DealCard from "../../../components/ui/DealCard";
import { fetchTopDealProducts } from "../../../api/api";

// ─── Global cache ─────────────────────────────────────────────────────────────
let topDealsCache = null;

const TopDealsSection = () => {
  const [topDeals, setTopDeals] = useState(topDealsCache?.products || []);
  const [deal, setDeal] = useState(topDealsCache || null);
  const [loading, setLoading] = useState(!topDealsCache);

  useEffect(() => {
    if (topDealsCache) {
      setDeal(topDealsCache);
      setTopDeals(topDealsCache.products || []);
      setLoading(false);
      return;
    }

    const loadTopDeals = async () => {
      try {
        const res = await fetchTopDealProducts();
        if (res?.deal) {
          topDealsCache = res.deal;
          setDeal(res.deal);
          setTopDeals(res.deal.products || []);
        }
      } catch (error) {
        console.error("Failed to fetch top deals", error);
      } finally {
        setLoading(false);
      }
    };

    loadTopDeals();
  }, []);

  if (loading || !deal) return null;

  return (
    <>
      <div className="qled-features">
        <div className="container">
          <div className="row align-items-end heading-row">
            <div className="col-md-4">
              <h2 className="qled-title1 ff2" style={{ position: "relative" }}>
                <div className="qled-top">{deal.title}</div>
                <em style={{ top: "-2px" }}>Deals</em>
              </h2>
            </div>
            <div className="col-md-8 d-flex justify-content-between align-items-end">
              <p className="qled-desc mb-0 d-none d-md-block">
                {deal.description}
              </p>
              <a
                href="/category/qled"
                className="btn custom-btn"
                style={{ minWidth: "200px", padding: "12px 20px", textAlign: "center" }}
              >
                View All Products
              </a>
            </div>
          </div>
        </div>
      </div>

      <section className="product-section">
        <div className="container">
          <div className="row g-4">
            {topDeals.length === 0 ? (
              <p className="text-center">No Top Deals Found</p>
            ) : (
              topDeals.map((product) => (
                <DealCard key={product._id} deal={product} />
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default TopDealsSection;