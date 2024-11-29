// Extract product ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

// Fetch product data from JSON
fetch("products.json")
  .then((response) => response.json())
  .then((products) => {
    // Find the product with the matching ID
    const product = products.find((p) => p.id == productId);

    if (product) {
      // Update the HTML elements with product details
      document.getElementById("productName").textContent = product.name;
      document.getElementById(
        "productAuthor"
      ).textContent = `Author: ${product.author}`;
      document.getElementById(
        "productPrice"
      ).textContent = `Price: $${product.price.toFixed(2)}`;
      document.getElementById("productDescription").textContent =
        product.description;
      document.getElementById("productImage").src = product.image;
      document.getElementById("productImage").alt = product.name;

      // Add event listener to "Add to Cart" button
      const addToCartButton = document.querySelector(".buttonCart");
      addToCartButton.addEventListener("click", () => {
        const cartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        };

        cart.push(cartItem);
        saveCart();
        const messageElement = document.createElement("div");
        messageElement.textContent = `Added to cart sucessfully`;
        messageElement.classList.add("cart-message");
        document.body.appendChild(messageElement);

        // Remove message after 1.5 seconds
        setTimeout(() => {
          messageElement.remove();
        }, 1500);
      });
    } else {
      console.error("Product not found");
    }
  })
  .catch((error) => console.error("Error fetching product data:", error));
