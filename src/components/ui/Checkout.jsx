

import { useNavigate } from "react-router-dom";
import Footer from "../layout/Footer";
import Header from "../layout/Header";

import "./checkout.css";
import Secendcheck from "./Secendcheck";

const Checkout = () => {
    const navigate = useNavigate();
  const handleclick = () =>{
     navigate('/orderaddress')
  }
  return (
    <>
    <Header/>
  <div className="took"> 
    <div className="container-1">
      {/* TOP SECTION */}
      <div className="product-top-1">
        <div>
          <div className="main-image-1">
            <img
              src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1"
              alt="Smart TV"
            />
          </div>

          <div className="thumbs-1">
            <img src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04" />
            <img src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db" />
            <img src="https://images.unsplash.com/photo-1593784991095-a205069470b6" />
            <img src="https://images.unsplash.com/photo-1542751110-97427bbecf20" />
          </div>
        </div>

        <div className="product-info">
          <h1>Mi Smart TV 40 (Full HD) 2025 Edition</h1>

          <div className="price">
            ₹89,990 <span className="old-price">₹1,07,890</span>
          </div>

          <p className="info-text">Inclusive of all taxes</p>
          <p className="info-text">EMI starting from ₹3000/month</p>
          <p className="info-text">Free Delivery by Tomorrow</p>
          <p className="info-text">1 Year Warranty</p>

          <div className="btn-group">
            <button className="btnk btn-cart">Add to Cart</button>
            <button className="btnk btn-buy" onClick={handleclick}>Buy Now</button>
          </div>
        </div>
      </div>

      {/* KEY FEATURES */}
      <h2>Key Features</h2>
      <div className="features">
        <ul>
          <li>Display: Full HD LED, 1920 × 1080, 60Hz</li>
          <li>Connectivity: 2 HDMI, 2 USB, Wi-Fi</li>
          <li>Operating System: Linux</li>
          <li>Apps: Zee5, Prime Video, SonyLiv, YouTube</li>
          <li>Sound: 20W Speaker Output</li>
          <li>USP: Screen Mirroring, A+ Panel, Smart Remote</li>
        </ul>
      </div>

      {/* SPECIFICATIONS */}
      <h2>Product Specification</h2>
      <div className="spec-box">
        <SpecRow title="Television Category" value="Smart TV" />
        <SpecRow title="Display Resolution" value="Full HD" />
        <SpecRow title="Panel Type" value="Flat Panel" />
        <SpecRow title="Ideal Viewing Distance" value="6 – 10 ft" />
        <SpecRow title="Model Year" value="2025" />
        <SpecRow title="Warranty" value="1 Year Product Warranty" />
      </div>
    </div>
    </div>
    <Secendcheck/>
    <Footer/>
    </>
  );
};

const SpecRow = ({ title, value }) => (
  <div className="spec-row">
    <div className="spec-title">{title}</div>
    <div className="spec-value">{value}</div>
  </div>
);





export default Checkout;
