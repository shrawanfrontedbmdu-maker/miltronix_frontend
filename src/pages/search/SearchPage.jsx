import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import API from "../../api/api";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

function SearchPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const q = params.get("q");
  const category = params.get("category");
  const page = params.get("page") || 1;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const res = await API.get(
        `/products/search?q=${q}&category=${category || ""}&page=${page}`,
      );

      setProducts(res.data.products);
      setLoading(false);
    };

    fetchProducts();
  }, [location.search]);

  return (
    <>
      <Header />
      <div className="container-fluid my-5 py-5 ">
      <div className="container py-5 my-5 display-flex flex-column align-items-center">
        <h4>
          Results for "<strong>{q}</strong>"
        </h4>

        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No products found</p>
        ) : (
          <div className="row">
            {products.map((product) => {
              const firstVariant = product.variants?.[0];

              const price = firstVariant?.price || 0;

              const image =
                firstVariant?.images?.[0]?.url ||
                product.images?.[0]?.url ||
                "";

              return (
                <div key={product._id} className="col-md-3 mb-4">
                  <div className="card p-2 h-100 d-flex flex-column">
                    <img src={image} alt={product.name} className="img-fluid" />
                    <h6>{product.name}</h6>
                    <p>₹{price}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
      </div>
    </>
  );
}

export default SearchPage;
