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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        setLoading(true);
        setError(null);

        const categories = await fetchCategories();

        const category = categories.find(
          (c) =>
            c.categoryKey?.toLowerCase() ===
            decodeURIComponent(categoryName || "").toLowerCase()
        );

        if (!category) {
          setError("Category not found");
          return;
        }

        setPageData(category);
        setProducts(category.products || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load category");
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [categoryName]);

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        {error}
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
                products={products}
                setProducts={setProducts}
              />
            </div>

            <div className="col-md-9">
              <ProductGrid products={products} />
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
