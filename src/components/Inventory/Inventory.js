import React from 'react';
import './Inventory.css';

const Inventory = ({ items }) => {
  // Group items by name and count them
  const groupedItems = items.reduce((acc, item) => {
    const key = item.name.toLowerCase();
    if (!acc[key]) {
      acc[key] = {
        item: item,
        count: 1
      };
    } else {
      acc[key].count++;
    }
    return acc;
  }, {});

  return (
    <div className="inventory-container">
      <h2>Inventory</h2>
      {items.length === 0 ? (
        <div className="inventory-empty">No items</div>
      ) : (
        <ul className="inventory-list">
          {Object.values(groupedItems).map(({ item, count }, index) => (
            <li key={index} className="inventory-item">
              {item.name}{count > 1 ? ` x${count}` : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Inventory; 