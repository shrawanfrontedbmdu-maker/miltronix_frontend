import React from "react";

const ProductInfo = ({
  product = {},
  selectedVariant = null,
  onAddToCart,
  onBuyNow,
  addingToCart = false,
}) => {
  const price = Number(selectedVariant?.price ?? product.price ?? 0);
  const mrp = Number(
    selectedVariant?.compareAtPrice ?? product.oldPrice ?? product.mrp ?? 0
  );
  const stock = Number(selectedVariant?.stock ?? product.stock ?? -1);

  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const isOutOfStock = stock === 0;

  return (
    <div className="col-12 col-lg-6">
      <h4 className="product-title-new mb-3 mt-2">
        {product.title || product.name}
        {product.description && ` - ${product.description}`}
      </h4>

      <div className="product-price mb-2">
        <span className="fw-bold display-6 price-new me-3">
          ₹{price.toLocaleString("en-IN")}
        </span>

        {mrp > price && (
          <span className="text-decoration-line-through h5 old-price-2">
            MRP ₹{mrp.toLocaleString("en-IN")}
          </span>
        )}
      </div>

      <p className="text-muted mb-3">(Incl. of all taxes)</p>

      {discount > 0 && (
        <span className="badge new-model mb-3 px-3 py-2">
          {discount}% Off
        </span>
      )}

      <ul className="list-unstyled mb-4 product-features">
        {product.emi && (
          <li>
            EMI Starting from ₹
            {Number(product.emi).toLocaleString("en-IN")}/month
          </li>
        )}
        {product.deliveryInfo && <li>{product.deliveryInfo}</li>}
        {discount > 0 && <li>Discount up to {discount}%</li>}
        {product.brand && <li>Brand: {product.brand}</li>}
        {product.warranty && <li>Warranty: {product.warranty}</li>}
        {product.returnPolicy && (
          <li>Return Policy: {product.returnPolicy}</li>
        )}
      </ul>

      <div className="d-flex gap-3">
        <button className="btn shop-card-btn-wishlist">
          <i className="bi bi-heart"></i>
        </button>

        <button
          className="shop-card-btn-cart w-50 me-2"
          onClick={onAddToCart}
          disabled={addingToCart || isOutOfStock}
        >
          <i className="bi bi-cart"></i>
          {addingToCart
            ? " Adding…"
            : isOutOfStock
            ? " Out of Stock"
            : " Add to Cart"}
        </button>

        <button
          className="shop-card-btn-cart w-50 me-2"
          onClick={onBuyNow}
          disabled={isOutOfStock}
        >
          <i className="bi bi-cart"></i> Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
