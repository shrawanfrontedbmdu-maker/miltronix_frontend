import React, { useState, useEffect } from "react";
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

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [reviews, setReviews] = useState([]);

  // ================= FETCH PRODUCT =================
  useEffect(() => {
    if (!id) return;

    window.scrollTo(0, 0);

    const loadProduct = async () => {
      try {
        setLoading(true);

        const res = await fetchProductById(id);
        const prod = res?.product || res;

        if (!prod) {
          setProduct(null);
          return;
        }

        setProduct(prod);
        setSelectedVariant(prod?.variants?.[0] || null);

        // Fetch Similar Products
        const catId =
          typeof prod?.category === "object"
            ? prod.category?._id
            : prod?.category;

        if (catId) {
          const simRes = await fetchProducts({ category: catId, limit: 10 });
          const allProducts = simRes?.products || simRes?.data || [];

          const filtered = allProducts.filter(
            (p) => p._id !== prod._id
          );

          setSimilarProducts(filtered.slice(0, 6));
        }
      } catch (error) {
        console.error("Product fetch error:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // ================= FETCH REVIEWS =================
  useEffect(() => {
    if (!id) return;

    const loadReviews = async () => {
      try {
        const data = await getReviewsByProductApi(id);
        setReviews(data?.reviews || data || []);
      } catch (error) {
        console.error("Review fetch error:", error);
        setReviews([]);
      }
    };

    loadReviews();
  }, [id]);

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
  if (loading) {
    return (
      <>
        <Header />
        <div style={{ minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <p>Loading product...</p>
        </div>
        <Footer />
      </>
    );
  }

  // ================= NOT FOUND =================
  if (!product) {
    return (
      <>
        <Header />
        <div style={{ minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                addingToCart={addingToCart}
              />

              <KeyFeatures features={product.keyFeatures || []} />

              <ProductSpecs specs={product.specifications || []} />

              <RatingSummary reviews={reviews} product={product} />

              <CustomerFeedback reviews={reviews} />

              <SimilarProducts products={similarProducts} />

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ProductDetailPage;