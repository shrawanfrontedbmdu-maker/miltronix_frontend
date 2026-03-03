import React from "react";
import { useSearchParams } from "react-router-dom";
import ShopCard from "../../../components/ui/ShopCard";

const ProductGrid = ({ categoryId, products = [], setProducts, total = 0 }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "latest";
  const page = Number(searchParams.get("page")) || 1;
  const limit = 12;

  const userId = JSON.parse(localStorage.getItem("user") || "null")?._id || "";

  const updateSearchParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    setSearchParams(params);
  };

  const handlePrevPage = () => {
    if (page > 1) updateSearchParams({ search, sort, page: page - 1 });
  };

  const handleNextPage = () => {
    if (products.length === limit) updateSearchParams({ search, sort, page: page + 1 });
  };

  return (
    <div>
      <div className="row g-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ShopCard key={product._id} product={product} userId={userId} />
          ))
        ) : (
          <div className="col-12">
            {/* <p style={{ textAlign: "center", padding: "2rem" }}>
              No products match your filters.
            </p> */}
          </div>
        )}
      </div>

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
