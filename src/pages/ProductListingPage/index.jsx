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
  fetchProducts,
  getFilterGroupsByCategory,
  fetchSubcategories,
} from "../../api/api";

// ─── Simple in-memory cache ───────────────────────────────────────────────────
const pageCache = {};

const ProductListingPage = () => {
  const { categoryName } = useParams();

  const [pageData, setPageData] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [filterGroups, setFilterGroups] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!categoryName) return;

    window.scrollTo(0, 0);

    const key = categoryName.toLowerCase();

    // Cache hit — instant load
    if (pageCache[key]) {
      const c = pageCache[key];
      setPageData(c.pageData);
      setProducts(c.products);
      setTotal(c.total);
      setRecommendations(c.recommendations);
      setFilterGroups(c.filterGroups);
      setSubcategories(c.subcategories || []);
      return;
    }

    const load = async () => {
      try {
        // Step 1: category fetch (fast, small payload)
        const categories = await fetchCategories();
        const category = categories.find(
          (c) =>
            c.categoryKey?.toLowerCase() ===
            decodeURIComponent(categoryName).toLowerCase()
        );

        if (!category) return;
        setPageData(category); // ← page header turant dikhao

        // Step 2: baaki sab parallel
        const [productRes, recRes, filters, subRes] = await Promise.all([
          fetchProducts({ category: category._id, limit: 12 }),
          fetchProducts({ category: category._id, isRecommended: true, limit: 8 }),
          getFilterGroupsByCategory(category._id),
          fetchSubcategories(category._id),
        ]);

        const prods = productRes?.products || [];
        const tot = productRes?.total || 0;
        const recs = recRes?.products || [];
        const filt = filters || [];
        const subs = subRes?.subcategories || [];

        setProducts(prods);
        setTotal(tot);
        setRecommendations(recs);
        setFilterGroups(filt);
        setSubcategories(subs);

        // Cache mein save karo
        pageCache[key] = {
          pageData: category,
          products: prods,
          total: tot,
          recommendations: recs,
          filterGroups: filt,
          subcategories: subs,
        };
      } catch (err) {
        console.error("ProductListingPage load error:", err);
      }
    };

    load();
  }, [categoryName]);

  return (
    <>
      <Header />

      <main style={{ backgroundColor: "#D5D4D3" }}>
        <CategorySlider />

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
                  filterGroups={filterGroups}
                  setProducts={setProducts}
                  setTotal={setTotal}
                />
              </div>

              <div className="col-md-9">
                <ProductGrid
                  categoryId={pageData?._id}
                  products={products}
                  setProducts={setProducts}
                  total={total}
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
      </main>

      <Footer />
    </>
  );
};

export default ProductListingPage;