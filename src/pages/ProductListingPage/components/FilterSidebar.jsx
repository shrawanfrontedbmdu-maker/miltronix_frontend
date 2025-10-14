import React from 'react';

const FilterSidebar = ({ options, filters, setFilters }) => {

  const handleCheckboxChange = (filterType, value) => {
    // This function will be more complex to handle adding/removing from arrays
    // but for now, we'll just log it.
    console.log(`Toggling ${filterType}: ${value}`);
  };

  const handlePriceChange = (event) => {
    setFilters({ ...filters, price: parseInt(event.target.value) });
  };

  return (
    <div className="filter-card p-4">
      <h4 className="filter-title mb-4 ff2">Filter</h4>

      {/* Availability */}
      <div className="mb-4">
        <h6 className="filter-subtitle hv">Availability</h6>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="outOfStock" />
          <label className="form-check-label hv" htmlFor="outOfStock">
            Include Out of stock
          </label>
        </div>
      </div>
      <hr />

      {/* Resolution */}
      <div className="mb-4">
        <h6 className="filter-subtitle hv">Resolution</h6>
        {options.resolutions.map(res => (
          <div className="form-check" key={res.id}>
            <input className="form-check-input" type="checkbox" id={res.id} />
            <label className="form-check-label hv" htmlFor={res.id}>{res.label}</label>
          </div>
        ))}
      </div>
      <hr />

      {/* Price */}
      <div className="mb-4">
        <h6 className="filter-subtitle hv">Price</h6>
        <input 
            type="range" 
            className="form-range" 
            min={options.price.min} 
            max={options.price.max} 
            step={options.price.step} 
            id="priceRange"
            value={filters.price} // Controlled by parent state
            onChange={handlePriceChange} // Reports changes to parent
        />
        <div className="d-flex justify-content-between price-labels">
          <span>₹{options.price.min.toLocaleString()}</span>
          <span>₹{filters.price.toLocaleString()}</span>
        </div>
      </div>
      <hr />

      {/* Screen Size */}
      <div>
        <h6 className="filter-subtitle hv">Screen Size</h6>
        {options.screenSizes.map(size => (
            <div className="form-check" key={size.id}>
                <input className="form-check-input" type="checkbox" id={size.id} />
                <label className="form-check-label hv" htmlFor={size.id}>{size.label}</label>
            </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;