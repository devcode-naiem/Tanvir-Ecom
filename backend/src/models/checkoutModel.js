const db = require("../config/database");

// Create a checkout record
const createCheckout = (userId, totalPrice, callback) => {
    const query = `INSERT INTO checkouts (user_id, total_price) VALUES (?, ?)`;
    db.query(query, [userId, totalPrice], (err, results) => {
        if (err) return callback(err);
        callback(null, results.insertId); // Return the newly created checkout ID
    });
};

// Add checkout details
const addCheckoutDetails = (checkoutId, details, callback) => {
    const {
        fullName,
        address,
        city,
        state,
        zipCode,
        bkashNumber,
        transactionId,
    } = details;

    const query = `
        INSERT INTO checkout_details (checkout_id, full_name, address, city, state, zip_code, bkash_number, transaction_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
        query,
        [checkoutId, fullName, address, city, state, zipCode, bkashNumber, transactionId],
        (err, results) => {
            if (err) return callback(err);
            callback(null);
        }
    );
};

// Add product list to the checkout
const addCheckoutProductList = (checkoutId, productList, callback) => {
    const query = `
        INSERT INTO checkout_product_list (checkout_id, product_id, name, price, quantity)
        VALUES ?
    `;

    const values = productList.map((product) => [
        checkoutId,
        product.id,
        product.name,
        product.price,
        product.quantity,
    ]);

    db.query(query, [values], (err, results) => {
        if (err) return callback(err);
        callback(null);
    });
};

module.exports = {
    createCheckout,
    addCheckoutDetails,
    addCheckoutProductList,
};
