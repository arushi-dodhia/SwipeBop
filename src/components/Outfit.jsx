import React from 'react';
  
const Outfit = ({ outfits, onRemove }) => {
  return (
    <div className="card-container-2">
      {outfits.map((outfit) => (
        <div key={outfit.outfit_id} className="outfit-group-2">
        <div className="outfit-header-2">
          <h2 style={{ color: '#DB3B14', textAlign: 'center' }}>
            Outfit created on: {new Date(outfit.timestamp).toLocaleString()}
          </h2>
          <button
              className="remove-button"
              onClick={() => onRemove(outfit.outfit_id)}
              title="Delete Outfit"
            >
              ✕
            </button>
            </div>
          <div className="card-grid-2">
            {outfit.outfit.map((product) => (
              <div key={product.id} className="product-card-2">
                <div className="product-image-2">
                  <a href={product.url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                  />
                  </a>
                </div>
                <div className="product-info-2">
                  <p className="brand-2">{product.brand}</p>
                  <h3 className="name-2">{product.name}</h3>
                  <p className="price-2">{product.price}</p>
                  <p className="category-2" style={{ color: '#666' }}>
                    Category: {product.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Outfit;
