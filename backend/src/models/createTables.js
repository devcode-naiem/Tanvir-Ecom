const db = require("../config/database");

const createUserTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS signUp_Info (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(query, (err) => {
    if (err) {
      console.error("Error creating signUp_Info table:", err);
    } else {
      console.log("signUp_Info table created or already exists");
    }
  });
};

const createCheckoutsTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS checkouts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES signUp_Info(id)
    )
  `;
  db.query(query, (err) => {
    if (err) {
      console.error("Error creating checkouts table:", err);
    } else {
      console.log("checkouts table created or already exists");
    }
  });
};

const createCheckoutDetailsTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS checkout_details (
      id INT AUTO_INCREMENT PRIMARY KEY,
      checkout_id INT NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      address TEXT NOT NULL,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(100) NOT NULL,
      zip_code VARCHAR(20) NOT NULL,
      bkash_number VARCHAR(20) NOT NULL,
      transaction_id VARCHAR(50) NOT NULL,
      FOREIGN KEY (checkout_id) REFERENCES checkouts(id)
    )
  `;
  db.query(query, (err) => {
    if (err) {
      console.error("Error creating checkout_details table:", err);
    } else {
      console.log("checkout_details table created or already exists");
    }
  });
};

const createCheckoutProductListTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS checkout_product_list (
      id INT AUTO_INCREMENT PRIMARY KEY,
      checkout_id INT NOT NULL,
      product_id VARCHAR(50) NOT NULL,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      quantity INT NOT NULL,
      FOREIGN KEY (checkout_id) REFERENCES checkouts(id)
    )
  `;
  db.query(query, (err) => {
    if (err) {
      console.error("Error creating checkout_product_list table:", err);
    } else {
      console.log("checkout_product_list table created or already exists");
    }
  });
};

// Create all tables
const createTables = () => {
  createUserTable();
  createCheckoutsTable();
  createCheckoutDetailsTable();
  createCheckoutProductListTable();
};

module.exports = { createTables };
