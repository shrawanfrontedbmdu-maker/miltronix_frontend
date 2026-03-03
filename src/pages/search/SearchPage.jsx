import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `${baseUrl}/products/search?q=${encodeURIComponent(query)}`
        );
        setProducts(res.data.products || []);
      } catch (err) {
        console.error(err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <>
      <Header />

      <main style={{ backgroundColor: "#D5D4D3", minHeight: "80vh", paddingTop: "120px" }}>
        <div className="container py-4">

          {/* Search Heading */}
          <h5 className="mb-4">
            Search results for: <strong>"{query}"</strong>
            {!loading && (
              <span className="text-muted ms-2" style={{ fontSize: "14px" }}>
                ({products.length} products found)
              </span>
            )}
          </h5>

          {/* Loading */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
              <p className="mt-2">Searching...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {/* No Results */}
          {!loading && !error && products.length === 0 && (
            <div className="text-center py-5">
              <h5>No products found for "{query}"</h5>
              <p className="text-muted">Try different keywords</p>
            </div>
          )}

          {/* Product Grid */}
          {!loading && products.length > 0 && (
            <div className="row g-3">
              {products.map((product) => {
                const firstVariant = product.variants?.[0];
                const price = firstVariant?.price || 0;
                const image =
                  firstVariant?.images?.[0]?.url ||
                  product.images?.[0]?.url ||
                  "";

                return (
                  <div
                    key={product._id}
                    className="col-6 col-md-4 col-lg-3"
                    onClick={() => navigate(`/product/${product._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      className="bg-white rounded shadow-sm h-100"
                      style={{ overflow: "hidden", transition: "transform 0.2s" }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                      {/* Product Image */}
                      <div
                        style={{
                          height: "180px",
                          overflow: "hidden",
                          backgroundColor: "#f5f5f5",
                        }}
                      >
                        <img
                          src={image}
                          alt={product.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            padding: "10px",
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="p-3">
                        <p
                          className="mb-1 fw-semibold"
                          style={{
                            fontSize: "14px",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {product.name}
                        </p>

                        {product.brand && (
                          <p className="text-muted mb-1" style={{ fontSize: "12px" }}>
                            {product.brand}
                          </p>
                        )}

                        <p className="fw-bold mb-0" style={{ color: "#e63946" }}>
                          ₹{price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
};

export default SearchPage;
