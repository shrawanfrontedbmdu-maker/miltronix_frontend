import React from 'react';

const FilterSidebar = ({ options, filters, setFilters }) => {
  
  const handleCheckboxChange = (filterType, value) => {
    const currentValues = filters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];
    
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: newValues
    }));
  };

  const handlePriceChange = (event) => {
    setFilters({ ...filters, price: parseInt(event.target.value) });
  };

  // Add a guard clause for safety
  if (!options) {
      return <div>Loading filters...</div>
  }

  return (
    <div className="filter-card p-4">
      <h4 className="filter-title mb-4 ff2">Filter</h4>
      
      {Object.keys(options).map(filterKey => {
        const filter = options[filterKey];

        // If the current filter is 'price', render the slider and RETURN.
        // This prevents it from falling through to the checkbox code below.
        if (filterKey === 'price') {
          return (
            <React.Fragment key="price-filter">
              <div className="mb-4">
                <h6 className="filter-subtitle hv">Price</h6>
                <input type="range" className="form-range" min={filter.min} max={filter.max} value={filters.price} onChange={handlePriceChange} />
                <div className="d-flex justify-content-between price-labels">
                  <span>₹{filter.min.toLocaleString()}</span>
                  <span>₹{filters.price.toLocaleString()}</span>
                </div>
              </div>
              <hr />
            </React.Fragment>
          );
        }

        // This code will now only run for non-price filters that have an 'items' array.
        return (
          <React.Fragment key={filterKey}>
            <div className="mb-4">
              <h6 className="filter-subtitle hv">{filter.title}</h6>
              {filter.items.map(item => (
                <div className="form-check" key={item.id}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={item.id}
                    checked={filters[filterKey]?.includes(item.label) || false}
                    onChange={() => handleCheckboxChange(filterKey, item.label)}
                  />
                  <label className="form-check-label hv" htmlFor={item.id}>{item.label}</label>
                </div>
              ))}
            </div>
            <hr />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default FilterSidebar;