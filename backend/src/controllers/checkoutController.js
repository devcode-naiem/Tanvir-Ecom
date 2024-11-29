const {
    createCheckout,
    addCheckoutDetails,
    addCheckoutProductList,
} = require("../models/checkoutModel");

exports.processCheckout = (req, res) => {
    const userId = req.user.userId; // Extract user ID from authenticated token
    const { totalPrice, productList, ...details } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is missing from the request" });
    }

    // Step 1: Create checkout record
    createCheckout(userId, totalPrice, (err, checkoutId) => {
        if (err) {
            console.error("Error creating checkout:", err);
            return res.status(500).json({ message: "Failed to process checkout" });
        }

        // Step 2: Add checkout details
        addCheckoutDetails(checkoutId, details, (err) => {
            if (err) {
                console.error("Error adding checkout details:", err);
                return res.status(500).json({ message: "Failed to process checkout details" });
            }

            // Step 3: Add product list
            addCheckoutProductList(checkoutId, productList, (err) => {
                if (err) {
                    console.error("Error adding checkout product list:", err);
                    return res.status(500).json({ message: "Failed to process product list" });
                }

                // Success response
                res.status(201).json({
                    message: "Checkout completed successfully",
                    orderId: checkoutId,
                });
            });
        });
    });
};
