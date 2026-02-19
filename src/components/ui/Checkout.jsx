import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import Secendcheck from "./Secendcheck";
import { fetchProductById, addItemToCart } from "../../api/api"; // ✅ addItemToCart import
import "./checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  // -------- Fetch Product --------
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const res = await fetchProductById(id);
        setProduct(res.product || res);
      } catch (error) {
        console.error("Product fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  // -------- Add to Cart Handler --------
  const handleAddToCart = async () => {
    try {
      if (!product) return;

      const variant = product.variants?.[0];

      const payload = {
        productId: product._id,
        sku: variant?.sku || product.sku,
        quantity: 1,
      };

      setAddingToCart(true);
      await addItemToCart(payload);

      navigate("/cart"); // navigate to cart after adding
    } catch (error) {
      console.error("Add to cart error", error);
      alert("Failed to add product to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  // -------- Buy Now Handler --------
  const handleBuyNow = () => {
    navigate("/orderaddress", { state: { product } });
  };

  if (loading || !product) return <p>Loading...</p>;

  // -------- Images --------
  const imageList = product.images || [];
  const mainImage = imageList[0]?.url || imageList[0] || "";

  // -------- Category --------
  const categoryName =
    typeof product.category === "object"
      ? product.category.categoryKey || product.category.pageTitle
      : product.category || "N/A";

  // -------- Price --------
  const variant = product.variants?.[0];
  const price = variant?.price || product.price || 0;
  const mrp = variant?.compareAtPrice || product.mrp || 0;

  return (
    <>
      <Header />

      <div className="took">
        <div className="container-1">

          {/* TOP SECTION */}
          <div className="product-top-1">
            <div>
              <div className="main-image-1">
                <img src={mainImage} alt={product.name || product.title} />
              </div>

              <div className="thumbs-1">
                {imageList.map((img, index) => (
                  <img
                    key={index}
                    src={img.url || img}
                    alt={`thumb ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="product-info">
              <h1>{product.name || product.title}</h1>

              <div className="price">
                ₹{price.toLocaleString("en-IN")}
                {mrp > price && (
                  <span className="old-price">₹{mrp.toLocaleString("en-IN")}</span>
                )}
              </div>

              <p className="info-text">Inclusive of all taxes</p>
              <p className="info-text">
                EMI starting from ₹{product.emi || "3000"}/month
              </p>
              <p className="info-text">Free Delivery by Tomorrow</p>
              <p className="info-text">
                {product.warranty || "1 Year Warranty"}
              </p>

              <div className="btn-group">
                <button
                  className="btnk btn-cart"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </button>

                <button className="btnk btn-buy" onClick={handleBuyNow}>
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* KEY FEATURES */}
          <h2>Key Features</h2>
          <div className="features">
            <ul>
              {product.keyFeatures?.length > 0 ? (
                product.keyFeatures.map((feature, i) => (
                  <li key={i}>
                    <strong>{feature.key}:</strong> {String(feature.value)}
                  </li>
                ))
              ) : (
                <li>No features available</li>
              )}
            </ul>
          </div>

          {/* PRODUCT SPECIFICATION */}
          <h2>Product Specification</h2>
          <div className="spec-box">
            {product.specifications?.length > 0 ? (
              product.specifications.map((spec, i) => (
                <SpecRow key={i} title={spec.key} value={String(spec.value)} />
              ))
            ) : (
              <SpecRow title="N/A" value="No specifications available" />
            )}
          </div>

        </div>
      </div>

      <Secendcheck />
      <Footer />
    </>
  );
};

const SpecRow = ({ title, value }) => (
  <div className="spec-row">
    <div className="spec-title">{title}</div>
    <div className="spec-value">{value}</div>
  </div>
);

export default Checkout;
