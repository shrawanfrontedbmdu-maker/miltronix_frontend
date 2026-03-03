// src/components/ui/FilterSidebar.jsx
import React, { useState, useEffect, useMemo } from "react";
import API from "../../../api/api";

const FilterSidebar = ({ categoryId, filterGroups = [], setProducts, setTotal }) => {
  // filterGroups ab parent (ProductListingPage) se aata hai — koi fetch nahi

  // Transform filterGroups to UI format
  const filters = useMemo(() => {
    if (!filterGroups.length) return null;

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
    return formatted;
  }, [filterGroups]);

  const [selected, setSelected] = useState({});

  // Jab filters ready ho tab initial selected set karo
  useEffect(() => {
    if (!filters) return;
    const initialSelected = {};
    Object.keys(filters).forEach((key) => {
      initialSelected[key] = filters[key].type === "range" ? filters[key].max : [];
    });
    setSelected(initialSelected);
  }, [filters]);

  // Filtered products fetch — sirf jab user filter change kare
  useEffect(() => {
    if (!categoryId || !setProducts || !filters) return;

    const fetchFilteredProducts = async () => {
      try {
        const params = { category: categoryId };
        const allSelectedIds = [];

        Object.keys(selected).forEach((key) => {
          if (Array.isArray(selected[key]) && selected[key].length > 0) {
            allSelectedIds.push(...selected[key]);
          } else if (typeof selected[key] === "number") {
            params.maxPrice = selected[key];
          }
        });

        if (allSelectedIds.length > 0) {
          params.filterOptions = allSelectedIds.join(",");
        }

        const res = await API.get("/products", { params });
        setProducts(res.data.products || []);
        if (setTotal) setTotal(res.data.total || 0);
      } catch (err) {
        console.error("Filter error:", err);
      }
    };

    fetchFilteredProducts();
  }, [selected, categoryId, filters, setProducts, setTotal]);

  const toggleFilter = (type, id) => {
    setSelected((prev) => {
      if (Array.isArray(prev[type])) {
        const exists = prev[type].includes(id);
        return {
          ...prev,
          [type]: exists ? prev[type].filter((v) => v !== id) : [...prev[type], id],
        };
      }
      return prev;
    });
  };

  if (!filters) return null;

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
                    onChange={() => toggleFilter(key, item._id)}
                    checked={selected[key]?.includes(item._id) || false}
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