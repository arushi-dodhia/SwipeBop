import React, { useState, useRef, useEffect } from "react";
import { getCurrentUser } from "@aws-amplify/auth";
import "./Swipe.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Item from "./Item";

const SwipeBop = () => {
  const [products, setProducts] = useState({
    accessories: [],
    pants: [],
    shirts: [],
    shoes: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productIds, setProductIds] = useState([]);
  const cardRefs = useRef({});
  const startX = useRef({});
  const currentX = useRef({});
  const isSwiping = useRef({});
  const SWIPE_THRESHOLD = 100;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setIsLoggedIn(user);
        setUserID(user.username);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const categories = ["accessories", "pants", "shirts", "shoes"];
        const fetchedProducts = {};

        for (const category of categories) {
          const queryParams = new URLSearchParams({
            lang: "en-US",
            currency: "USD",
            q: category,
            limit: 10,
            minPrice: 25,
            maxPrice: 500,
            siteId: 1006,
            allowOutOfStockItems: "false",
            dept: "WOMENS",
          });

          const response = await fetch(
            `http://18.118.186.108:5000/swipebop/images?${queryParams}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Client-Id": "Shopbop-UW-Team2-2024",
                "Client-Version": "1.0.0",
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch ${category} products`);
          }

          const data = await response.json();
          
          if (data && typeof data === "object") {
            console.log(data);
            const ids = Object.keys(data);
            setProductIds(ids);
            console.log("Fetched product IDs:", ids);

            const productArray = Object.entries(data).map(([id, product]) => {
              if (typeof product === "object") {
                return {
                  id,
                  imageUrl: product.imageUrl || product.image,
                  name: product.name || "Product Name",
                  brand: product.brand || "Brand Name",
                  price: product.price || "$0.00",
                  category,
                };
              } else {
                return {
                  id,
                  imageUrl: product,
                  name: `${
                    category.charAt(0).toUpperCase() + category.slice(1)
                  } Item`,
                  brand: "Fashion Brand",
                  price: "$99.00",
                  category,
                };
              }
            });

            fetchedProducts[category] = productArray.slice(0, 5);
          } else if (Array.isArray(data.products)) {
            fetchedProducts[category] = data.products
              .slice(0, 5)
              .map((product) => ({
                ...product,
                category,
              }));
          } else {
            fetchedProducts[category] = [];
          }
        }

        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (productIds.length === 0) return;

      try {
        const detailsData = {}; // Object to store details of each product

        for (const productId of productIds) {
          const response = await fetch(`http://18.118.186.108:5000/swipebop/search`, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Client-Id': 'Shopbop-UW-Team2-2024',
              'Client-Version': '1.0.0',
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch product ${productId}`);
          }

          const data = await response.json();
          console.log(data);
          detailsData[productId] = data; 
        }

        //setProductDetails(detailsData);
      } catch (err) {
        console.error("Error fetching product details:", err);
      }
    };

    fetchProductDetails();
  }, [productIds]);

  const handleTouchStart = (e, id) => {
    startX.current[id] = e.touches[0].clientX;
    isSwiping.current[id] = true;
    cardRefs.current[id].style.transition = "";
  };

  const handleTouchMove = (e, id) => {
    if (!isSwiping.current[id]) return;

    const touchX = e.touches[0].clientX;
    const deltaX = touchX - startX.current[id];
    currentX.current[id] = deltaX;

    const limitedDelta = Math.min(Math.max(deltaX, -150), 150);

    cardRefs.current[
      id
    ].style.transform = `translateX(${limitedDelta}px) rotate(${
      limitedDelta * 0.05
    }deg)`;

    const card = cardRefs.current[id];
    if (deltaX > 0) {
      // Liking - show green overlay
      card.querySelector(".like-overlay").style.opacity = Math.min(
        deltaX / 100,
        0.8
      );
      card.querySelector(".dislike-overlay").style.opacity = 0;
    } else if (deltaX < 0) {
      // Disliking - show red overlay
      card.querySelector(".dislike-overlay").style.opacity = Math.min(
        -deltaX / 100,
        0.8
      );
      card.querySelector(".like-overlay").style.opacity = 0;
    } else {
      // Reset overlays
      card.querySelector(".like-overlay").style.opacity = 0;
      card.querySelector(".dislike-overlay").style.opacity = 0;
    }
  };

  const handleTouchEnd = (e, id) => {
    if (!isSwiping.current[id]) return;

    const deltaX = currentX.current[id];
    const card = cardRefs.current[id];
    card.style.transition = "transform 0.3s ease";

    if (deltaX > SWIPE_THRESHOLD) {
      // Swiped right - like
      card.style.transform = "translateX(1000px) rotate(30deg)";
      console.log(`Liked product ${id}`);
      setTimeout(() => removeCard(id), 300);
    } else if (deltaX < -SWIPE_THRESHOLD) {
      // Swiped left - dislike
      card.style.transform = "translateX(-1000px) rotate(-30deg)";
      console.log(`Disliked product ${id}`);
      setTimeout(() => removeCard(id), 300);
    } else {
      // Return to center
      card.style.transform = "translateX(0) rotate(0)";
      card.querySelector(".like-overlay").style.opacity = 0;
      card.querySelector(".dislike-overlay").style.opacity = 0;
    }

    isSwiping.current[id] = false;
  };

  const removeCard = (id) => {
    setProducts((prevProducts) => {
      const updatedProducts = { ...prevProducts };

      // Find which category contains this product
      for (const category in updatedProducts) {
        const index = updatedProducts[category].findIndex(
          (product) => product.id === id
        );
        if (index !== -1) {
          updatedProducts[category] = [
            ...updatedProducts[category].slice(0, index),
            { ...updatedProducts[category][index], hidden: true },
            ...updatedProducts[category].slice(index + 1),
          ];
          break;
        }
      }

      return updatedProducts;
    });
  };

  const handleDislike = (productId) => {
    const card = cardRefs.current[productId];
    if (!card) return;
    
    card.style.transition = 'transform 0.3s ease';
    card.style.transform = 'translateX(-1000px) rotate(-30deg)';
    setTimeout(() => removeCard(productId), 300);
  };
  
  const handleReset = (productId) => {
    const card = cardRefs.current[productId];
    if (!card) return;
    
    card.style.transition = 'transform 0.3s ease';
    card.style.transform = 'translateX(0) rotate(0)';
    card.querySelector('.like-overlay').style.opacity = 0;
    card.querySelector('.dislike-overlay').style.opacity = 0;
  };
  
  const handleShare = (productId) => {
    // Implement your share/save functionality here
    console.log(`Saving product ${productId} to closet`);

  };
  
  const handleLike = (productId) => {
    const card = cardRefs.current[productId];
    if (!card) return;
    
    card.style.transition = 'transform 0.3s ease';
    card.style.transform = 'translateX(1000px) rotate(30deg)';
    setTimeout(() => removeCard(productId), 300);
  };

  const handleButtonAction = (action) => {
    // Get all product ids
    const visibleProductIds = [];
    Object.values(products).forEach((categoryProducts) => {
      categoryProducts.forEach((product) => {
        if (!product.hidden) visibleProductIds.push(product.id);
      });
    });

    visibleProductIds.forEach((id) => {
      switch(action) {
        case 'dislike':
          handleDislike(id);
          break;
        case 'reset':
          handleReset(id);
          break;
        case 'like':
          handleLike(id);
          break;
        case 'save':
          handleShare(id);
          break;
        default:
          break;
      }
    });
  };

  const getSelectedProducts = () => {
    const selectedProducts = [];

    // Get one product from each category
    const categories = ["shirts", "accessories", "pants", "shoes"];
    categories.forEach((category) => {
      const visibleProducts = products[category].filter((p) => !p.hidden);
      if (visibleProducts.length > 0) {
        selectedProducts.push(visibleProducts[0]);
      }
    });

    return selectedProducts;
  };

  const handleSaveOutfit = async () => {
    if (!isLoggedIn) {
      alert("Please log in to save outfits.");
      return;
    }

    const outfits = getSelectedProducts();

    if (outfits.length === 0) {
      alert("No products selected");
      return;
    }

    try {
      const res = await fetch(
        "http://18.118.186.108:5000/swipebop/outfits/insert",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            outfit: outfits,
            user_id: userID,
          }),
        }
      );
      if (res.ok) {
        const result = await res.json();
        alert("Outfit saved successfully!");
        console.log(result);
        handleButtonAction("save");
      } else {
        const error = await res.json();
        alert(`Failed to save outfit: ${error.error}`);
        console.error(error);
      }
    } catch (error) {
      console.error("Error saving outfit:", error);
      alert("Error saving outfit. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="swipebop-container">
        {loading ? (
          <div className="loading-container">
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className="error-message">Error: {error}</div>
        ) : (
          <div className="card-container">
            <div className="card-grid">
              {getSelectedProducts().map((product) => (
                <Item
                  key={product.id}
                  ref={(el) => (cardRefs.current[product.id] = el)}
                  className="product-card"
                  onTouchStart={(e) => handleTouchStart(e, product.id)}
                  onTouchMove={(e) => handleTouchMove(e, product.id)}
                  onTouchEnd={(e) => handleTouchEnd(e, product.id)}
                  style={{ touchAction: "pan-y" }}
                  productId={product.id}
                  handleDislike={handleDislike}
                  handleReset={handleReset}
                  handleShare={handleShare}
                  handleLike={handleLike}
                >
                  <div className="dislike-overlay"></div>
                  <div className="like-overlay"></div>

                  <div className="product-image">
                    <img
                      src={product.imageUrl || "/api/placeholder/400/320"}
                      alt={`${product.name} image`}
                    />
                  </div>

                  <div className="product-info">
                    <p className="brand">{product.brand || "Brand"}</p>
                    <h3 className="name">{product.name || "Product Name"}</h3>
                    <p className="price">{product.price || "$0.00"}</p>
                  </div>
                </Item>
              ))}
            </div>
          </div>
        )}

        <div className="action-buttons">
          <button
            onClick={() => handleButtonAction("dislike")}
            className="action-button dislike"
          >
            <span>✕</span>
          </button>

          <button
            onClick={() => handleSaveOutfit()}
            className="action-button save"
          >
            <span>→</span>
          </button>

          <button
            onClick={() => handleButtonAction("like")}
            className="action-button like"
          >
            <span>♥</span>
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SwipeBop;