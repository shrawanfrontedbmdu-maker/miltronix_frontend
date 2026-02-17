import React from "react";
import "./orderaddress.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useNavigate } from "react-router-dom";


  

const products = [
  {
    id: 1,
    title: "Mi 55-inch (139 cm) 4K Ultra HD Smart LED TV",
    desc: "Google TV | HDR10+ | Dolby Vision | 60Hz Refresh Rate | Bezel-less Design",
    price: 89990,
    rating: 4,
    image:
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Mi 360° 1080p Full HD Smart Security Camera",
    desc: "AI Motion Detection | Night Vision | 2-Way Audio | WiFi | Alexa Support",
    price: 89990,
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Mi 4A 43-inch Full HD Smart LED TV",
    desc: "Full HD Display | PatchWall | Dolby Audio | 60Hz | Smart Remote",
    price: 89990,
    rating: 4,
    image:
      "https://images.unsplash.com/photo-1601944177325-f8867652837f?auto=format&fit=crop&w=800&q=80",
  },
];

 


function OrderAddress() {
  const navigate = useNavigate()

 const HandleClick = () =>{
    navigate('/secendaddress')
 }
  const total = products.reduce((acc, item) => acc + item.price, 0);

  return (
    <>
    <Header/>
    <div className="container-3">
      <div className="product-section-3">
        {products.map((product) => (
          <div className="card-all" key={product.id}>
            <img src={product.image} alt={product.title} />

            <div className="card-content-3">
              <h3>{product.title}</h3>

              <div className="rating">
                {"★".repeat(product.rating)}
                {"☆".repeat(5 - product.rating)}
              </div>

              <p className="desc">{product.desc}</p>

              <p className="price">
                ₹{product.price.toLocaleString()}
                <span className="tax">(incl. of taxes)</span>
              </p>

              <button>Add to Wish List</button>
            </div>
          </div>
        ))}
      </div>

      <div className="summary-section">
        <div className="summary-card">
          <h3>Order Summary (3 Items)</h3>

          <div className="summary-row">
            <span>Original Price</span>
            <span>₹{total.toLocaleString()}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>

          <button className="checkout-btn" onClick={HandleClick}>Checkout</button>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default OrderAddress;
