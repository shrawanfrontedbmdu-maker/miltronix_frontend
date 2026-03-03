import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import CategorySlider from "../../components/ui/CategorySlider";
import Breadcrumb from "../../components/ui/Breadcrumb";

import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";
import KeyFeatures from "./components/KeyFeatures";
import ProductSpecs from "./components/ProductSpecs";
import RatingSummary from "./components/RatingSummary";
import CustomerFeedback from "./components/CustomerFeedback";
import SimilarProducts from "./components/SimilarProducts";

import {
  fetchProductById,
  fetchProducts,
  addItemToCart,
  getReviewsByProductApi,
} from "../../api/api";

// ─── Simple in-memory cache ────────────────────────────────────────────────────
const productCache = {};

// ─── Skeleton (only shown if load takes > 300ms) ──────────────────────────────
const skeletonBox = (extraStyle = {}) => ({
  background: "linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.4s infinite",
  borderRadius: 8,
  ...extraStyle,
});

const SkeletonLoader = () => (
  <>
    <style>{`
      @keyframes shimmer {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
    <Header />
    <main>
      <CategorySlider />
      <section className="product-detail-section">
        <div className="container">
          <div style={skeletonBox({ width: 220, height: 18, marginBottom: 20 })} />
          <div className="row g-4">
            <div className="col-lg-6">
              <div style={skeletonBox({ width: "100%", aspectRatio: "1/1" })} />
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} style={skeletonBox({ width: 70, height: 70 })} />
                ))}
              </div>
            </div>
            <div className="col-lg-6" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={skeletonBox({ width: "80%", height: 32 })} />
              <div style={skeletonBox({ width: "60%", height: 22 })} />
              <div style={skeletonBox({ width: 130, height: 30 })} />
              <div style={{ display: "flex", gap: 8 }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={skeletonBox({ width: 60, height: 36 })} />
                ))}
              </div>
              {[100, 90, 70].map((w, i) => (
                <div key={i} style={skeletonBox({ width: `${w}%`, height: 16 })} />
              ))}
              <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                <div style={skeletonBox({ width: 150, height: 48 })} />
                <div style={skeletonBox({ width: 150, height: 48 })} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

// ──────────────────────────────────────────────────────────────────────────────

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(() => productCache[id] || null);
  const [showSkeleton, setShowSkeleton] = useState(!productCache[id]); // skeleton sirf tab jab cache nahi
  const [selectedVariant, setSelectedVariant] = useState(
    () => productCache[id]?.variants?.[0] || null
  );
  const [addingToCart, setAddingToCart] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [reviews, setReviews] = useState([]);

  const skeletonTimerRef = useRef(null);

  // ================= FETCH PRODUCT =================
  useEffect(() => {
    if (!id) return;

    window.scrollTo(0, 0);

    // Agar cache mein hai toh skeleton mat dikhao
    if (productCache[id]) {
      setProduct(productCache[id]);
      setSelectedVariant(productCache[id]?.variants?.[0] || null);
      setShowSkeleton(false);
      // Background mein reviews load karo
      loadReviews(id);
      loadSimilar(productCache[id]);
      return;
    }

    // 300ms ke baad hi skeleton dikhao (fast connections pe flash nahi hoga)
    skeletonTimerRef.current = setTimeout(() => {
      setShowSkeleton(true);
    }, 300);

    const loadProduct = async () => {
      try {
        setSimilarProducts([]);

        const res = await fetchProductById(id);
        const prod = res?.product || res;

        clearTimeout(skeletonTimerRef.current);

        if (!prod) {
          setProduct(null);
          setShowSkeleton(false);
          return;
        }

        // Cache mein save karo
        productCache[id] = prod;

        setProduct(prod);
        setSelectedVariant(prod?.variants?.[0] || null);
        setShowSkeleton(false);

        loadSimilar(prod);
      } catch (error) {
        clearTimeout(skeletonTimerRef.current);
        console.error("Product fetch error:", error);
        setProduct(null);
        setShowSkeleton(false);
      }
    };

    loadProduct();
    loadReviews(id);

    return () => clearTimeout(skeletonTimerRef.current);
  }, [id]);

  // ================= FETCH REVIEWS (separate function) =================
  const loadReviews = async (productId) => {
    try {
      const data = await getReviewsByProductApi(productId);
      setReviews(data?.reviews || data || []);
    } catch (error) {
      console.error("Review fetch error:", error);
      setReviews([]);
    }
  };

  // ================= FETCH SIMILAR (separate function) =================
  const loadSimilar = async (prod) => {
    const catId =
      typeof prod?.category === "object"
        ? prod.category?._id?.toString()
        : prod?.category?.toString();

    if (!catId) return;

    try {
      const simRes = await fetchProducts({ category: catId });
      const allProducts =
        simRes?.products || simRes?.data?.products || simRes?.data || [];

      const filtered = allProducts.filter(
        (p) => p._id?.toString() !== prod._id?.toString()
      );

      setSimilarProducts(filtered.slice(0, 6));
    } catch (simErr) {
      console.error("[SimilarProducts] fetch failed:", simErr);
      setSimilarProducts([]);
    }
  };

  // ================= ADD TO CART =================
  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setAddingToCart(true);
      await addItemToCart({
        productId: product._id,
        sku: selectedVariant?.sku || product?.sku || "",
        quantity: 1,
      });
      navigate("/cart");
    } catch (error) {
      alert(error?.message || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  // ================= BUY NOW =================
  const handleBuyNow = () => {
    navigate("/orderaddress", {
      state: { product, selectedVariant },
    });
  };

  // ================= LOADING =================
  if (showSkeleton && !product) return <SkeletonLoader />;

  // ================= NOT FOUND =================
  if (!product) {
    return (
      <>
        <Header />
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ color: "red", fontWeight: "bold" }}>Product not found</p>
        </div>
        <Footer />
      </>
    );
  }

  // ================= RENDER =================
  return (
    <>
      <Header />

      <main>
        <CategorySlider />

        <section className="product-detail-section">
          <Breadcrumb path={product?.category?.pageTitle || ""} />

          <div className="container">
            <div className="row g-4">

              <ProductGallery images={product.images || []} />

              <ProductInfo
                product={product}
                selectedVariant={selectedVariant}
                onVariantChange={setSelectedVariant}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                addingToCart={addingToCart}
              />

              <KeyFeatures features={product.keyFeatures || []} />

              <ProductSpecs specs={product.specifications || []} />

              <RatingSummary reviews={reviews} product={product} />

              <CustomerFeedback reviews={reviews} />

              {similarProducts.length > 0 && (
                <SimilarProducts products={similarProducts} />
              )}

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ProductDetailPage;