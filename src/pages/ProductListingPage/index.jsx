import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import CategorySlider from '../../components/ui/CategorySlider';
import Breadcrumb from '../../components/ui/Breadcrumb';
import FilterSidebar from './components/FilterSidebar';
import ProductGrid from './components/ProductGrid';
import RecommendationSection from './components/RecommendationSection';
import { categoriesData } from '../../data/mockData';
import PageHeader from './components/PageHeader';
import ResolutionInfo from './components/ResolutionInfo';
import { useParams } from 'react-router-dom';

const ProductListingPage = () => {
  const { categoryName } = useParams();
  const pageData = categoriesData[categoryName];
  
  const [filters, setFilters] = useState({
    resolution: [],
    screenSize: [],
    price: 1449000,
    includeOutOfStock: false,
  });

  const [filteredProducts, setFilteredProducts] = useState(pageData.products);

  useEffect(() => {
    let products = pageData.products;

    products = products.filter(p => parseInt(p.price.replace(/,/g, '')) <= filters.price);

    if (filters.resolution.length > 0) {
      products = products.filter(p => filters.resolution.includes(p.resolution));
    }
    setFilteredProducts(products);
  }, [filters, pageData]);

   if (!pageData) {
    return <div>Category not found.</div>;
  }


  return (
    <>
      <Header />
      <main style={{backgroundColor: '#D5D4D3'}}>
        <CategorySlider />
        <Breadcrumb path={pageData.breadcrumb} />
        <section className="qled-features1">
            <PageHeader title={pageData.pageTitle} subtitle={pageData.pageSubtitle} description={pageData.description} />
        </section>

        <div className="container">
          <div className="row">
            <div className="col-md-3">
              {/* The FilterSidebar receives the current filters and the function to update them */}
              <FilterSidebar 
                options={pageData.filterOptions} 
                filters={filters} 
                setFilters={setFilters} 
              />
            </div>
            <div className="col-md-9">
              {/* The ProductGrid receives the filtered list of products to display */}
              <ProductGrid products={filteredProducts} />
            </div>
          </div>
        </div>

       <ResolutionInfo info={pageData.infoSection} />
        <RecommendationSection products={pageData.recommendations} />

      </main>
      <Footer />
    </>
  );
};

export default ProductListingPage;