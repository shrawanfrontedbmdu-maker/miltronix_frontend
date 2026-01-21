// import React, { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { useNavigate } from "react-router-dom";
// import { fetchCategories } from "../../api/api";

// function CategorySlider() {
//   const navigate = useNavigate();
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadCategories = async () => {
//       try {
//         const cats = await fetchCategories();
//         setCategories(cats);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadCategories();
//   }, []);

//   const handleClick = (categoryKey) => {
//     navigate(`/category/${categoryKey}`);
//   };

//   if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>Loading categories...</div>;
//   if (!categories.length) return <div style={{ padding: "2rem", textAlign: "center" }}>No categories found</div>;

//   return (
//     <section className="category-bg">
//       <div className="container">
//         <Swiper
//           slidesPerView={3}
//           spaceBetween={20}
//           breakpoints={{
//             768: { slidesPerView: 4, spaceBetween: 30 },
//             992: { slidesPerView: 7, spaceBetween: 30 },
//           }}
//           className="mySwiper"
//         >
//           {categories.map((cat) => (
//             <SwiperSlide
//               key={cat._id}
//               className="text-center"
//               style={{ cursor: "pointer" }}
//               onClick={() => handleClick(cat.categoryKey)}
//             >
//               <img
//                 src={cat.img || "/src/assets/default-category.png"}
//                 alt={cat.pageTitle}
//                 className="category-img"
//               />
//               <p className="category-title">{cat.pageTitle}</p>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </section>
//   );
// }

// export default CategorySlider;
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../../api/api";

// Dummy placeholder images from reliable CDN
const DUMMY_IMAGES = [
  "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop",
];

const BACKEND_URL = "http://localhost:3000"; // Replace with your live backend URL

function CategorySlider() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await fetchCategories();
        setCategories(cats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Helper function to get image URL
  const getImageUrl = (category, index) => {
    // If image failed to load before, return the dummy image
    if (imageErrors[category._id]) {
      return DUMMY_IMAGES[index % DUMMY_IMAGES.length];
    }

    // Check different possible image fields
    const img = category.img || category.image || category.infoSection?.cards?.[0]?.image;

    // If no image, return dummy
    if (!img) {
      return DUMMY_IMAGES[index % DUMMY_IMAGES.length];
    }

    // If it's already a full URL, return it
    if (img.startsWith("http://") || img.startsWith("https://")) {
      return img;
    }

    // Otherwise, prepend backend URL
    return `${BACKEND_URL}/${img.replace(/^\/+/, "")}`;
  };

  // Handle image load errors
  const handleImageError = (categoryId, index) => {
    setImageErrors((prev) => ({
      ...prev,
      [categoryId]: DUMMY_IMAGES[index % DUMMY_IMAGES.length],
    }));
  };

  const handleClick = (categoryKey) => {
    navigate(`/category/${categoryKey}`);
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading categories...
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        No categories found
      </div>
    );
  }

  return (
    <section className="category-bg">
      <div className="container">
        <Swiper
          slidesPerView={3}
          spaceBetween={20}
          breakpoints={{
            768: { slidesPerView: 4, spaceBetween: 30 },
            992: { slidesPerView: 7, spaceBetween: 30 },
          }}
          className="mySwiper"
        >
          {categories.map((cat, index) => (
            <SwiperSlide
              key={cat._id}
              className="text-center"
              style={{ cursor: "pointer" }}
              onClick={() => handleClick(cat.categoryKey)}
            >
              <img
                src={getImageUrl(cat, index)}
                alt={cat.pageTitle || "Category"}
                className="category-img"
                onError={() => handleImageError(cat._id, index)}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <p className="category-title">{cat.pageTitle}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default CategorySlider;