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

import {
  fetchCategories,
  fetchSubcategories,
  fetchProducts,
  getFilterGroupsByCategory,
} from "../../api/api";

const ProductListingPage = () => {
  const { categoryName } = useParams();

  const [pageData, setPageData] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [filterGroups, setFilterGroups] = useState([]);

  const [products, setProducts] = useState([]); // ⭐ shared state
  const [total, setTotal] = useState(0); // ⭐ total added

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        setLoading(true);
        setError(null);

        const categories = await fetchCategories();

        const category = categories.find(
          (c) =>
            c.categoryKey?.toLowerCase() ===
            decodeURIComponent(categoryName || "").toLowerCase()
        );

        if (!category) throw new Error("Category not found");

        setPageData(category);

        const subRes = await fetchSubcategories(category._id);
        setSubcategories(subRes?.subcategories || []);

        // ⭐ Initial products load
        const productRes = await fetchProducts({
          category: category._id,
          limit: 12,
        });
        setProducts(productRes?.products || []);
        setTotal(productRes?.total || 0); // ⭐ total set

        const recommendedRes = await fetchProducts({
          category: category._id,
          isRecommended: true,
          limit: 8,
        });
        setRecommendations(recommendedRes?.products || []);

        const filters = await getFilterGroupsByCategory(category._id);
        setFilterGroups(filters || []);
      } catch (err) {
        console.error("🔥 Error loading category page:", err);
        setError(err.message || "Failed to load category");
      } finally {
        setLoading(false);
      }
    };

    loadCategoryData();
  }, [categoryName]);

  return (
    <>
      <Header />

      <main style={{ backgroundColor: "#D5D4D3" }}>
        <CategorySlider />

        {error && (
          <div className="container text-center py-5">
            <div className="alert alert-danger">{error}</div>
          </div>
        )}

        {!error && (
          <>
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
                    setProducts={setProducts}   // ⭐ important
                    setTotal={setTotal}         // ⭐ total pass kiya
                  />
                </div>

                <div className="col-md-9">
                  <ProductGrid
                    categoryId={pageData?._id}
                    products={products}        // ⭐ important
                    setProducts={setProducts}
                    total={total}              // ⭐ total pass kiya
                  />
                </div>

              </div>
            </div>

            {subcategories.length > 0 && (
              <ResolutionInfo
                info={{
                  title: pageData?.pageTitle,
                  subtitle: "Sub Categories",
                  description: pageData?.description,
                  cards: subcategories.map((sub) => ({
                    _id: sub._id,
                    title: sub.name,
                    description: sub.description,
                    image: sub.image,
                  })),
                }}
              />
            )}

            {recommendations.length > 0 && (
              <RecommendationSection products={recommendations} />
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
};

export default ProductListingPage;