import React from 'react';
import './Inventory.css';

const Inventory = ({ items }) => {
  return (
    <div className="inventory-container">
      <h2>Inventory</h2>
      {items.length === 0 ? (
        <div className="inventory-empty">No items</div>
      ) : (
        <ul className="inventory-list">
          {items.map((item, index) => (
            <li key={index} className="inventory-item">
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Inventory; 