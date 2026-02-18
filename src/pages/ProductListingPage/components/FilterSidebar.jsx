// src/components/ui/FilterSidebar.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const FilterSidebar = ({ categoryId, filters, setProducts }) => {
  const [selected, setSelected] = useState({
    resolution: [],
    screenSize: [],
    availability: [],
    price: null,
  });

  useEffect(() => {
    if (!categoryId || !setProducts) return;
    fetchFilteredProducts();
    // eslint-disable-next-line
  }, [selected, categoryId]);

  const fetchFilteredProducts = async () => {
    try {
      const params = {
        category: categoryId,
        resolution: selected.resolution.join(","),
        screenSize: selected.screenSize.join(","),
        availability: selected.availability.join(","),
        maxPrice: selected.price,
      };

      const res = await axios.get(`${BASE_URL}/products`, { params });
      setProducts(res.data.products || []); // ✅ ensure array
    } catch (err) {
      console.error("Filter error:", err);
    }
  };

  const toggleFilter = (type, value) => {
    setSelected((prev) => {
      const exists = prev[type].includes(value);
      return {
        ...prev,
        [type]: exists
          ? prev[type].filter((v) => v !== value)
          : [...prev[type], value],
      };
    });
  };

  if (!filters) return <div>Loading filters...</div>;

  return (
    <div className="filter-card p-4">
      <h4 className="filter-title mb-4 ff2">Filter</h4>

      {/* PRICE */}
      {filters.price && (
        <div className="mb-4">
          <h6 className="filter-subtitle hv">Price</h6>
          <input
            type="range"
            min={filters.price.min}
            max={filters.price.max}
            value={selected.price || filters.price.max}
            onChange={(e) =>
              setSelected((p) => ({ ...p, price: Number(e.target.value) }))
            }
            className="form-range"
          />
          <div className="d-flex justify-content-between">
            <span>₹{filters.price.min}</span>
            <span>₹{filters.price.max}</span>
          </div>
        </div>
      )}

      {/* OTHER FILTERS */}
      {["resolution", "screenSize", "availability"].map((key) => {
        const filter = filters[key];
        if (!filter) return null;

        return (
          <div key={key} className="mb-4">
            <h6 className="filter-subtitle hv">{filter.title}</h6>
            {filter.items.map((item) => (
              <div className="form-check" key={item._id}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={item._id}
                  onChange={() => toggleFilter(key, item.label)}
                  checked={selected[key].includes(item.label)}
                />
                <label className="form-check-label hv" htmlFor={item._id}>
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default FilterSidebar;
