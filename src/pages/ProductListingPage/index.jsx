// src/pages/products/ProductListingPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import CategorySlider from "../../components/ui/CategorySlider";
import Breadcrumb from "../../components/ui/Breadcrumb";

import FilterSidebar from "./components/FilterSidebar";
import ProductGrid from "./components/ProductGrid";
import PageHeader from "./components/PageHeader";
import ResolutionInfo from "./components/ResolutionInfo";

import { fetchCategories, fetchProducts, getCartItems } from "../../api/api";

const ProductListingPage = () => {
  const { categoryName } = useParams();

  const [pageData, setPageData] = useState(null);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // ===== Load Products & Categories =====
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);

        setAllProducts(productsData);
        setCategories(categoriesData);

        if (categoryName) {
          // Find matching category
          const category = categoriesData.find(
            (c) =>
              c.categoryKey?.toLowerCase() ===
              decodeURIComponent(categoryName).toLowerCase()
          );

          if (!category) {
            setError("Category not found");
            setProducts([]);
            setPageData(null);
            return;
          }

          setPageData(category);

          // Filter products by categoryKey (for dynamic products)
          const filteredProducts = productsData.filter(
            (p) => p.categoryKey === category.categoryKey
          );
          setProducts(filteredProducts);
        } else {
          setPageData(null);
          setProducts(productsData);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load products or categories");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [categoryName]);

  // ===== Cart items =====
  useEffect(() => {
    const loadCart = async () => {
      try {
        const cart = await getCartItems();
        setCartItems(cart);
      } catch (err) {
        console.error("Failed to fetch cart items", err);
      }
    };
    loadCart();
  }, []);

  // ===== Handle cart update =====
  const handleCartUpdate = (updatedCart) => {
    setCartItems(updatedCart);
  };

  if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>;
  if (error) return <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>{error}</div>;

  return (
    <>
      <Header />

      <main style={{ backgroundColor: "#D5D4D3" }}>
        <CategorySlider categories={categories} />

        {pageData && <Breadcrumb path={pageData?.breadcrumb || []} />}

        {pageData && (
          <PageHeader
            title={pageData?.pageTitle}
            subtitle={pageData?.pageSubtitle}
            description={pageData?.description}
          />
        )}

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
              <ProductGrid
                products={products}
                onCartUpdate={handleCartUpdate}
                pageSize={12}
              />
            </div>
          </div>
        </div>

        {pageData?.infoSection && <ResolutionInfo info={pageData.infoSection} />}
      </main>

      <Footer />
    </>
  );
};

export default ProductListingPage;
