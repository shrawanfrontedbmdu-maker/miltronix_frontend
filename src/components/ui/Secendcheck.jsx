import "./check.css";

function Secendcheck() {
  return (
    <div className="container-2">
      {/* Customer Review Section */}
      <div className="review-section-2">
        <div className="review-left-2">
          <h3>Customer Review</h3>
          <div className="rating">
            ⭐⭐⭐⭐☆ <span>4 out of 5</span>
          </div>
          <p className="total-review">2,000 global ratings</p>

          <div className="rating-bar">
            <span>5 star</span>
            <div className="bar"><div className="fill w60"></div></div>
            <span>60%</span>
          </div>

          <div className="rating-bar">
            <span>4 star</span>
            <div className="bar"><div className="fill w20"></div></div>
            <span>20%</span>
          </div>

          <div className="rating-bar">
            <span>3 star</span>
            <div className="bar"><div className="fill w8"></div></div>
            <span>8%</span>
          </div>

          <div className="rating-bar">
            <span>2 star</span>
            <div className="bar"><div className="fill w2"></div></div>
            <span>2%</span>
          </div>

          <div className="rating-bar">
            <span>1 star</span>
            <div className="bar"><div className="fill w10"></div></div>
            <span>10%</span>
          </div>
        </div>

        <div className="review-right-2">
          <h4>Customers say</h4>
          <p>
            Customers praise the TV's picture quality, particularly its 4K
            ultra HD dynamic display and colors. Sound quality is clear and
            immersive, though some mention remote response could improve.
          </p>

          <div className="review-images-2">
            <img src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04" />
            <img src="https://images.unsplash.com/photo-1593642532400-2682810df593" />
            <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36" />
            <img src="https://images.unsplash.com/photo-1618220179428-22790b461013" />
          </div>
        </div>
      </div>

      {/* Similar Products */}
      <h2 className="similar-title-2">Similar Product</h2>

      <div className="product-grid-2">
        <div className="product-card-2">
          <img src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db" />
          <p>QLED 40 inches</p>
          <span>₹ 19,999</span>
        </div>

        <div className="product-card-2">
          <img src="https://images.unsplash.com/photo-1542751110-97427bbecf20" />
          <p>QLED 43 inches</p>
          <span>₹ 29,999</span>
        </div>

        <div className="product-card-2">
          <img src="https://images.unsplash.com/photo-1593784991095-a205069470b6" />
          <p>QLED 50 inches</p>
          <span>₹ 51,500</span>
        </div>

        <div className="product-card-2">
          <img src="https://images.unsplash.com/photo-1583225214464-9296029427aa" />
          <p>QLED 65 inches</p>
          <span>₹ 60,000</span>
        </div>
      </div>
    </div>
  );
}

export default Secendcheck;
