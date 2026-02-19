import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import CategorySlider from "../../components/ui/CategorySlider";
import Breadcrumb from "../../components/ui/Breadcrumb";

import FilterSidebar from "./components/FilterSidebar";
import ProductGrid from "./components/ProductGrid";
import RecommendationSection from "./components/RecommendationSection";
import PageHeader from "./components/PageHeader";
import ResolutionInfo from "./components/ResolutionInfo";

import { fetchCategories } from "../../api/api";

const ProductListingPage = () => {
  const { categoryName } = useParams();

  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("🔍 URL categoryName:", categoryName);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        setLoading(true);
        setError(null);

        const categories = await fetchCategories();
        console.log("📦 All Categories:", categories);

        // ✅ categoryKey se match karo
        const category = categories.find(
          (c) =>
            c.categoryKey?.toLowerCase() ===
            decodeURIComponent(categoryName || "").toLowerCase()
        );

        console.log("✅ Matched Category:", category);

        if (!category) {
          setError("Category not found");
          return;
        }

        setPageData(category);
      } catch (err) {
        console.error("🔥 Error:", err);
        setError("Failed to load category");
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [categoryName]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="mt-3">Loading category...</h5>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />

      <main style={{ backgroundColor: "#D5D4D3" }}>
        <CategorySlider />

        <Breadcrumb path={pageData?.breadcrumb || []} />

        <PageHeader
          title={pageData?.pageTitle}
          subtitle={pageData?.pageSubtitle}
          description={pageData?.description}
        />

        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <FilterSidebar
                categoryId={pageData?._id}
                filters={pageData?.filterOptions}
              />
            </div>

            <div className="col-md-9">
              {/* ✅ categoryId pass karo, not products */}
              <ProductGrid categoryId={pageData?._id} />
            </div>
          </div>
        </div>

        {pageData?.infoSection && (
          <ResolutionInfo info={pageData.infoSection} />
        )}

        {pageData?.recommendations?.length > 0 && (
          <RecommendationSection products={pageData.recommendations} />
        )}
      </main>

      <Footer />
    </>
  );
};

export default ProductListingPage;
