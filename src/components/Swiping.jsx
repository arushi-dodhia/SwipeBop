

import React, { useState, useRef, useEffect } from 'react';

const Swiping = () => {
  const [products, setProducts] = useState({
    accessories: [],
    pants: [],
    shirts: [],
    shoes: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [gridPosition, setGridPosition] = useState(0);
  const gridSwipeRef = useRef(null);
  const gridStartX = useRef(0);
  const gridDeltaX = useRef(0);
  const gridIsSwiping = useRef(false);

  const [itemPositions, setItemPositions] = useState({});
  const itemSwipeRefs = useRef({});
  const itemStartX = useRef({});
  const itemDeltaX = useRef({});
  const itemIsSwiping = useRef({});

  const SWIPE_THRESHOLD = 100;
  const MAX_GRID_POSITION = 200;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const categories = [
          { type: 'accessories', query: 'accessories' },
          { type: 'pants', query: 'pants' },
          { type: 'shirts', query: 'shirts' },
          { type: 'shoes', query: 'shoes' }
        ];

        const fetchedProducts = {};

        for (const category of categories) {
          const queryParams = new URLSearchParams({
            lang: 'en-US',
            currency: 'USD',
            q: category.query,
            limit: 10,
            minPrice: 25,
            maxPrice: 500,
            siteId: 1006,
            allowOutOfStockItems: 'false',
            dept: 'WOMENS'
          });

          const response = await fetch(`http://3.142.196.127:5000/swipebop/browse?${queryParams}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Client-Id': 'Shopbop-UW-Team2-2024', 
              'Client-Version': '1.0.0'
            }
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch ${category.type} products`);
          }

          const data = await response.json();
          
          if (Array.isArray(data.products)) {
            // Select the first product for each category
            fetchedProducts[category.type] = data.products[0] || null;
          }
        }

        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleGridTouchStart = (e) => {
    gridStartX.current = e.touches[0].clientX;
    gridIsSwiping.current = true;        
  };

  const handleGridTouchMove = (e) => {
    if (!gridIsSwiping.current) return;
    
    const currentX = e.touches[0].clientX;
    gridDeltaX.current = currentX - gridStartX.current;
    
    const newPosition = gridPosition + gridDeltaX.current;
    
    if (gridSwipeRef.current) {
      const limitedPosition = Math.max(Math.min(newPosition, MAX_GRID_POSITION), -MAX_GRID_POSITION);
      gridSwipeRef.current.style.transform = `translateX(${limitedPosition}px)`;
    }
  };

  const handleGridTouchEnd = () => {
    if (!gridIsSwiping.current) return;
    
    let newPosition = gridPosition;
    
    if (gridDeltaX.current > SWIPE_THRESHOLD) {
      newPosition = Math.min(gridPosition + 200, MAX_GRID_POSITION);
    } else if (gridDeltaX.current < -SWIPE_THRESHOLD) {
      newPosition = Math.max(gridPosition - 200, -MAX_GRID_POSITION);
    }
    
    if (gridSwipeRef.current) {
      gridSwipeRef.current.style.transition = 'transform 0.3s ease';
      gridSwipeRef.current.style.transform = `translateX(${newPosition}px)`;
      
      setTimeout(() => {
        if (gridSwipeRef.current) {
          gridSwipeRef.current.style.transition = '';
        }
      }, 300);
    }
    
    setGridPosition(newPosition);
    gridIsSwiping.current = false;
  };

  // Individual item swipe handlers
  const handleItemTouchStart = (e, id) => {
    e.stopPropagation(); // Prevent triggering parent grid swipe
    itemStartX.current[id] = e.touches[0].clientX;
    itemIsSwiping.current[id] = true;
  };

  const handleItemTouchMove = (e, id) => {
    e.stopPropagation(); // Prevent triggering parent grid swipe
    
    if (!itemIsSwiping.current[id]) return;
    
    const currentX = e.touches[0].clientX;
    itemDeltaX.current[id] = currentX - itemStartX.current[id];
    
    const currentPosition = itemPositions[id] || 0;
    const newPosition = currentPosition + itemDeltaX.current[id];
    
    // Apply transform with limits
    if (itemSwipeRefs.current[id]) {
      const limitedPosition = Math.max(Math.min(newPosition, 100), -100);
      itemSwipeRefs.current[id].style.transform = `translateX(${limitedPosition}px)`;
    }
  };

  const handleItemTouchEnd = (e, id) => {
    e.stopPropagation(); 
    
    if (!itemIsSwiping.current[id]) return;
    
    const currentPosition = itemPositions[id] || 0;
    let newPosition = currentPosition;
    
    if (itemDeltaX.current[id] > SWIPE_THRESHOLD) {
      newPosition = 100; // Swiped right
      handleProductAction(id, 'like');
    } else if (itemDeltaX.current[id] < -SWIPE_THRESHOLD) {
      newPosition = -100; // Swiped left
      handleProductAction(id, 'discard');
    } else {
      newPosition = 0; // Return to center
    }
    
    if (itemSwipeRefs.current[id]) {
      itemSwipeRefs.current[id].style.transition = 'transform 0.3s ease';
      itemSwipeRefs.current[id].style.transform = `translateX(${newPosition}px)`;
      
      setTimeout(() => {
        if (itemSwipeRefs.current[id]) {
          itemSwipeRefs.current[id].style.transition = '';
        }
      }, 300);
    }
    
    setItemPositions(prev => ({
      ...prev,
      [id]: newPosition
    }));
    
    itemIsSwiping.current[id] = false;
  };

  const handleProductAction = async (productId, action) => {
    try {
      const response = await fetch('/api/products/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          action
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${action} product`);
      }
      
    } catch (err) {
      console.error(`Error ${action} product:`, err);
    }
  };

  const renderSwipeActions = (id, position) => {
    const leftVisible = position > 50;
    const rightVisible = position < -50;
    const renderProductCard = (product, category) => {
        if (!product) return null;
    
        return (
          <div 
            key={`${category}-${product.id}`}
            className="relative overflow-hidden bg-white shadow-md rounded-lg"
          >
            <div
              ref={el => itemSwipeRefs.current[product.id] = el}
              className="relative"
              onTouchStart={(e) => handleItemTouchStart(e, product.id)}
              onTouchMove={(e) => handleItemTouchMove(e, product.id)}
              onTouchEnd={(e) => handleItemTouchEnd(e, product.id)}
            >
              {renderSwipeActions(product.id, itemPositions[product.id] || 0)}
              
              <div className="relative">
                <img 
                  src={product.images && product.images[0]} 
                  alt={product.title} 
                  className="w-full h-48 object-cover" 
                />
                <div className="absolute top-2 left-2 bg-white/75 px-2 py-1 rounded">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </div>
              </div>
              
              <div className="p-3">
                <h3 className="text-sm font-medium truncate">{product.title}</h3>
                <p className="text-sm font-bold">${product.price}</p>
              </div>
            </div>
          </div>
        );
      };
    
      if (loading) {
        return <div className="flex justify-center items-center h-64">Loading products...</div>;
      }
    
      if (error) {
        return <div className="text-red-500 text-center p-4">Error: {error}</div>;
      }
    
      return (
        <div className="max-w-lg mx-auto p-4">
          <h2 className="text-xl font-bold mb-4">Swipeable Products</h2>
          
          <div 
            ref={gridSwipeRef}
            className="relative bg-gray-100 shadow-lg rounded-lg overflow-hidden"
            onTouchStart={handleGridTouchStart}
            onTouchMove={handleGridTouchMove}
            onTouchEnd={handleGridTouchEnd}
          >
            <div className="grid grid-cols-2 gap-4 p-4">
              {Object.entries(products).map(([category, product]) => (
                product ? (
                  <div 
                    key={`${category}-${product.id}`}
                    ref={(el) => itemSwipeRefs.current[product.id] = el}
                    className="relative bg-white shadow-md rounded-lg overflow-hidden"
                    onTouchStart={(e) => handleItemTouchStart(e, product.id)}
                    onTouchMove={(e) => handleItemTouchMove(e, product.id)}
                    onTouchEnd={(e) => handleItemTouchEnd(e, product.id)}
                  >
                    {renderSwipeActions(product.id, itemPositions[product.id] || 0)}
                    
                    <div className="relative">
                      <img 
                        src={product.images && product.images[0]} 
                        alt={product.title} 
                        className="w-full h-48 object-cover" 
                      />
                      <div className="absolute top-2 left-2 bg-white/75 px-2 py-1 rounded">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <h3 className="text-sm font-medium truncate">{product.title}</h3>
                      <p className="text-sm font-bold">${product.price}</p>
                    </div>
                  </div>
                ) : null
              ))}
            </div>
          </div>
        </div>
      );
    }
  }
    
export default Swiping;
