import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ShopCard from "../../../components/ui/ShopCard";
import { fetchProducts } from "../../../api/api";

const ProductGrid = ({ categoryId }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "latest";
  const page = Number(searchParams.get("page")) || 1;

  const limit = 12;

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userId = JSON.parse(localStorage.getItem("user") || "null")?._id || "";

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {
          page,
          limit,
        };

        if (search) params.search = search;
        if (sort) params.sort = sort;

        if (categoryId) {
          params.category = categoryId;
        }

        const data = await fetchProducts(params);

        if (data.success) {
          setProducts(data.products || []);
          setTotal(data.total || 0);
        } else {
          setProducts([]);
          setTotal(0);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to load products");
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryId, search, sort, page]);

  const updateSearchParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      updateSearchParams({ search, sort, page: page - 1 });
    }
  };

  const handleNextPage = () => {
    if (products.length === limit) {
      updateSearchParams({ search, sort, page: page + 1 });
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* SORT & COUNT */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <p className="mb-0">
          Showing <strong>{products.length}</strong> of <strong>{total}</strong> products
        </p>

        <select
          className="form-select w-auto"
          value={sort}
          onChange={(e) => updateSearchParams({ search, sort: e.target.value, page: 1 })}
        >
          <option value="latest">Latest</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
        </select>
      </div>

      {/* PRODUCT GRID */}
      <div className="row g-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ShopCard
              key={product._id}
              product={product}
              userId={userId}  // ← FIX: userId pass kiya
            />
          ))
        ) : (
          <div className="col-12">
            <p style={{ textAlign: "center", padding: "2rem" }}>
              No products match your filters.
            </p>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {total > limit && (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-5">
          <button
            className="btn btn-outline-primary"
            disabled={page === 1}
            onClick={handlePrevPage}
          >
            Previous
          </button>

          <span className="fw-bold">
            Page {page} of {Math.ceil(total / limit)}
          </span>

          <button
            className="btn btn-outline-primary"
            disabled={products.length < limit || page >= Math.ceil(total / limit)}
            onClick={handleNextPage}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;