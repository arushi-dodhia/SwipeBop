import React, { useState, useRef, useEffect } from 'react';

const ProductSwiper = () => {
  // State for products from backend
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Grid swipe state
  const [gridPosition, setGridPosition] = useState(0);
  const gridSwipeRef = useRef(null);
  const gridStartX = useRef(0);
  const gridDeltaX = useRef(0);
  const gridIsSwiping = useRef(false);

  // Individual item swipe states
  const [itemPositions, setItemPositions] = useState({});
  const itemSwipeRefs = useRef({});
  const itemStartX = useRef({});
  const itemDeltaX = useRef({});
  const itemIsSwiping = useRef({});

  // Constants
  const SWIPE_THRESHOLD = 100;
  const MAX_GRID_POSITION = 200;

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        // Fallback data in case API fails
        setProducts([
          { id: 1, image: '/api/placeholder/200/250', title: "Overcoat in Shearling", price: "$548.00" },
          { id: 2, image: '/api/placeholder/200/250', title: "Oversized Sweater", price: "$160.00" },
          { id: 3, image: '/api/placeholder/200/250', title: "Relaxed Fit Denim", price: "$90.00" },
          { id: 4, image: '/api/placeholder/200/250', title: "Classic Lace Sneakers", price: "$80.00" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Grid swipe handlers
  const handleGridTouchStart = (e) => {
    gridStartX.current = e.touches[0].clientX;
    gridIsSwiping.current = true;
  };

  const handleGridTouchMove = (e) => {
    if (!gridIsSwiping.current) return;
    
    const currentX = e.touches[0].clientX;
    gridDeltaX.current = currentX - gridStartX.current;
    
    const newPosition = gridPosition + gridDeltaX.current;
    
    // Apply transform with limits
    if (gridSwipeRef.current) {
      const limitedPosition = Math.max(Math.min(newPosition, MAX_GRID_POSITION), -MAX_GRID_POSITION);
      gridSwipeRef.current.style.transform = `translateX(${limitedPosition}px)`;
    }
  };

  const handleGridTouchEnd = () => {
    if (!gridIsSwiping.current) return;
    
    let newPosition = gridPosition;
    
    // Determine if swipe should snap to a position
    if (gridDeltaX.current > SWIPE_THRESHOLD) {
      newPosition = Math.min(gridPosition + 200, MAX_GRID_POSITION);
    } else if (gridDeltaX.current < -SWIPE_THRESHOLD) {
      newPosition = Math.max(gridPosition - 200, -MAX_GRID_POSITION);
    }
    
    // Animate to the new position
    if (gridSwipeRef.current) {
      gridSwipeRef.current.style.transition = 'transform 0.3s ease';
      gridSwipeRef.current.style.transform = `translateX(${newPosition}px)`;
      
      // Reset transition after animation
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
    e.stopPropagation(); // Prevent triggering parent grid swipe
    
    if (!itemIsSwiping.current[id]) return;
    
    const currentPosition = itemPositions[id] || 0;
    let newPosition = currentPosition;
    
    // Determine if swipe should snap to a position
    if (itemDeltaX.current[id] > SWIPE_THRESHOLD) {
      newPosition = 100; // Swiped right
      handleProductAction(id, 'like');
    } else if (itemDeltaX.current[id] < -SWIPE_THRESHOLD) {
      newPosition = -100; // Swiped left
      handleProductAction(id, 'discard');
    } else {
      newPosition = 0; // Return to center
    }
    
    // Animate to the new position
    if (itemSwipeRefs.current[id]) {
      itemSwipeRefs.current[id].style.transition = 'transform 0.3s ease';
      itemSwipeRefs.current[id].style.transform = `translateX(${newPosition}px)`;
      
      // Reset transition after animation
      setTimeout(() => {
        if (itemSwipeRefs.current[id]) {
          itemSwipeRefs.current[id].style.transition = '';
        }
      }, 300);
    }
    
    // Update position state
    setItemPositions(prev => ({
      ...prev,
      [id]: newPosition
    }));
    
    itemIsSwiping.current[id] = false;
  };

  // Handle product actions (like/discard)
  const handleProductAction = async (productId, action) => {
    try {
      // Replace with your actual API endpoint
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
      
      // Optional: You could remove the product from the list after action
      // setTimeout(() => {
      //   setProducts(products.filter(p => p.id !== productId));
      // }, 300);
      
    } catch (err) {
      console.error(`Error ${action} product:`, err);
      // You might want to show an error notification here
    }
  };

  // Action buttons that appear on swipe
  const renderSwipeActions = (id, position) => {
    const leftVisible = position > 50;
    const rightVisible = position < -50;
    
    return (
      <>
        <div 
          className={`absolute left-0 top-0 h-full w-16 bg-green-500 flex items-center justify-center transition-opacity ${leftVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <span className="text-white text-2xl">❤️</span>
        </div>
        <div 
          className={`absolute right-0 top-0 h-full w-16 bg-red-500 flex items-center justify-center transition-opacity ${rightVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <span className="text-white text-2xl">✕</span>
        </div>
      </>
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
        className="relative bg-white shadow-lg rounded-lg overflow-hidden"
        onTouchStart={handleGridTouchStart}
        onTouchMove={handleGridTouchMove}
        onTouchEnd={handleGridTouchEnd}
      >
        <div className="grid grid-cols-2 gap-4 p-4">
          {products.map(product => (
            <div 
              key={product.id}
              className="relative overflow-hidden"
            >
              <div
                ref={el => itemSwipeRefs.current[product.id] = el}
                className="relative bg-white"
                onTouchStart={(e) => handleItemTouchStart(e, product.id)}
                onTouchMove={(e) => handleItemTouchMove(e, product.id)}
                onTouchEnd={(e) => handleItemTouchEnd(e, product.id)}
              >
                {renderSwipeActions(product.id, itemPositions[product.id] || 0)}
                <img 
                  src={product.image || '/api/placeholder/200/250'} 
                  alt={product.title} 
                  className="w-full h-32 object-cover mb-2" 
                />
                <h3 className="text-sm font-medium">{product.title}</h3>
                <p className="text-sm font-bold">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Swipe individual items left/right or swipe the entire container left/right</p>
        <div className="flex justify-center mt-2 space-x-4">
          <div className="flex items-center">
            <span className="mr-1">❤️</span> Like
          </div>
          <div className="flex items-center">
            <span className="mr-1">✕</span> Discard
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSwiper;