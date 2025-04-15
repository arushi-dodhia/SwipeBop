import React, { useState, forwardRef } from 'react';
import { Modal, Button } from 'react-bootstrap';

const Item = forwardRef(({ 
  children, 
  onTouchStart, 
  onTouchMove, 
  onTouchEnd, 
  className, 
  style,
  productId,
  handleDislike,
  handleLike,
  isLoggedIn,
}, ref) => {
  const [showModal, setShowModal] = useState(false);
  
  const handleOpen = (e) => {
    if (e.target.closest('.like-overlay, .dislike-overlay')) {
      return;
    }
    setShowModal(true);
  };
  
  const handleClose = () => setShowModal(false);
  
  let productInfo = {};
  let imageUrl = '';
  let productName = '';
  let brand = '';
  let price = '';
  
  React.Children.forEach(children, child => {
    if (React.isValidElement(child)) {
      if (child.type === 'div' && child.props.className === 'product-image') {
        const imgElement = React.Children.toArray(child.props.children).find(
          grandChild => React.isValidElement(grandChild) && grandChild.type === 'img'
        );
        if (imgElement) {
          imageUrl = imgElement.props.src;
        }
      }
      if (child.type === 'div' && child.props.className === 'product-info') {
        // Extract product details
        React.Children.forEach(child.props.children, infoChild => {
          if (React.isValidElement(infoChild)) {
            if (infoChild.props.className === 'brand') {
              brand = infoChild.props.children;
            }
            if (infoChild.props.className === 'name') {
              productName = infoChild.props.children;
            }
            if (infoChild.props.className === 'price') {
              price = infoChild.props.children;
            }
          }
        });
      }
    }
  });

  const onDislike = () => {
    if (!isLoggedIn) {
      alert("Please log in to discard item.");
      return;
    }
    handleDislike(productId);
  };

  // const onShare = () => {
  //   if (!isLoggedIn) {
  //     alert("Please log in to save item to closet.");
  //     return;
  //   }
  // };

  const onLike = () => {
    if (!isLoggedIn) {
      alert("Please log in to like item.");
      return;
    }
    handleLike(productId);
  };
  
  return (
    <>
      <div 
        ref={ref}
        className={className}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={style}
        onClick={handleOpen}
      >
        {children}
      </div>
      
      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{productName}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img 
            src={imageUrl} 
            alt={productName} 
            style={{ width: "100%", maxHeight: "500px", objectFit: "contain" }}
          />
          <h5 className="mt-3 brand-name">{brand}</h5>
          <p className="price">{price}</p>
          
          <div className="action-buttons mt-4">
            <Button 
              variant="danger" 
              className="action-button dislike"
              onClick={onDislike}
            >
              <span>✕</span> 
            </Button>
{/*             
            <Button 
              variant="info" 
              className="action-button share"
              onClick={onShare}
            >
              <span>→</span>
            </Button> */}
            
            <Button 
              variant="success" 
              className="action-button like"
              onClick={onLike}
            >
              <span>♥</span>
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
});

export default Item;