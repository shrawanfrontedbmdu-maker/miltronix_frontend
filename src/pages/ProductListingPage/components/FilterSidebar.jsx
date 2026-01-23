import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const FilterSidebar = ({ categoryId, filters, products, setProducts }) => {
  const [options, setOptions] = useState(filters || null);

  useEffect(() => {
    if (!categoryId) return;
    setOptions(filters);
  }, [filters, categoryId]);

  const applyFilter = (filterType, value) => {
    if (!products) return;

    const filtered = products.filter((p) => {
      if (filterType === "price") return p.price <= value;
      if (filterType === "resolution") return value.includes(p.resolution);
      if (filterType === "screenSize") return value.includes(p.screenSize);
      if (filterType === "availability") return value.includes(p.inStock ? "In Stock" : "Out of Stock");
      return true;
    });

    setProducts(filtered);
  };

  if (!options) return <div>Loading filters...</div>;

  return (
    <div className="filter-card p-4">
      <h4 className="filter-title mb-4 ff2">Filter</h4>

      {options.price && (
        <div className="mb-4">
          <h6 className="filter-subtitle hv">Price</h6>
          <input
            type="range"
            min={options.price.min}
            max={options.price.max}
            onChange={(e) => applyFilter("price", Number(e.target.value))}
            className="form-range"
          />
          <div className="d-flex justify-content-between">
            <span>₹{options.price.min}</span>
            <span>₹{options.price.max}</span>
          </div>
        </div>
      )}

      {["resolution", "screenSize", "availability"].map((key) => {
        const filter = options[key];
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
                  onChange={(e) =>
                    applyFilter(key, e.target.checked ? [item.label] : [])
                  }
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