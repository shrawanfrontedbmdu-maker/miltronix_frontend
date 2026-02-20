// src/components/ui/FilterSidebar.jsx
import React, { useState, useEffect } from "react";
import API, { getFilterGroupsByCategory } from "../../../api/api";

const FilterSidebar = ({ categoryId, setProducts }) => {
  const [filters, setFilters] = useState(null);
  const [selected, setSelected] = useState({});

  // Fetch filter groups on mount or category change
  useEffect(() => {
    if (!categoryId) return;

    const fetchFilters = async () => {
      try {
        const filterGroups = await getFilterGroupsByCategory(categoryId);

        // Transform API filterGroups to easier format for UI
        const formatted = {};
        filterGroups.forEach((group) => {
          if (group.filterType === "range") {
            const [min, max] = group.options[0].value.split("-").map(Number);
            formatted[group.name] = { type: "range", min, max };
          } else {
            formatted[group.name] = {
              type: "checkbox",
              title: group.displayName,
              items: group.options.map((opt) => ({ _id: opt._id, label: opt.label })),
            };
          }
        });

        setFilters(formatted);

        // Initialize selected filters state
        const initialSelected = {};
        Object.keys(formatted).forEach((key) => {
          initialSelected[key] = formatted[key].type === "range" ? formatted[key].max : [];
        });
        setSelected(initialSelected);
      } catch (err) {
        console.error("Error fetching filters:", err);
      }
    };

    fetchFilters();
  }, [categoryId]);

  // Fetch products whenever selected filters change
  useEffect(() => {
    if (!categoryId || !setProducts || !filters) return;

    const fetchFilteredProducts = async () => {
      try {
        const params = { category: categoryId };

        Object.keys(selected).forEach((key) => {
          if (Array.isArray(selected[key]) && selected[key].length > 0) {
            params[key] = selected[key].join(",");
          } else if (typeof selected[key] === "number") {
            params.maxPrice = selected[key];
          }
        });

        const res = await API.get("/products", { params });
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Filter error:", err);
      }
    };

    fetchFilteredProducts();
  }, [selected, categoryId, filters, setProducts]);

  const toggleFilter = (type, value) => {
    setSelected((prev) => {
      if (Array.isArray(prev[type])) {
        const exists = prev[type].includes(value);
        return {
          ...prev,
          [type]: exists ? prev[type].filter((v) => v !== value) : [...prev[type], value],
        };
      }
      return prev;
    });
  };

  if (!filters) return <div>Loading filters...</div>;

  return (
    <div className="filter-card p-4">
      <h4 className="filter-title mb-4 ff2">Filter</h4>

      {/* PRICE FILTER */}
      {filters.price && (
        <div className="mb-4">
          <h6 className="filter-subtitle hv">Price</h6>
          <input
            type="range"
            min={filters.price.min}
            max={filters.price.max}
            value={selected.price || filters.price.max}
            onChange={(e) => setSelected((p) => ({ ...p, price: Number(e.target.value) }))}
            className="form-range"
          />
          <div className="d-flex justify-content-between">
            <span>₹{filters.price.min}</span>
            <span>₹{filters.price.max}</span>
          </div>
        </div>
      )}

      {/* CHECKBOX FILTERS */}
      {Object.keys(filters)
        .filter((key) => filters[key].type === "checkbox")
        .map((key) => {
          const filter = filters[key];
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
                    checked={selected[key]?.includes(item.label)}
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