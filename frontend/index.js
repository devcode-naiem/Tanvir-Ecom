// Initialize cart from localStorage (or set to an empty array if no items are stored)
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let user = JSON.parse(localStorage.getItem("user")) || {};
let userName = user.Name;
console.log(cart);
// Function to update cart count in the navbar
function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  cartCount.textContent = cart.length;
}

// Function to add a product to the cart
function addToCart(product) {
  console.log(product);
  cart.push(product);
  updateCartCount();
  // Save the updated cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
  //alert(`Added "${product.name}" to cart!`);
}

// Function to create the product HTML
function createProductHTML(product) {
  const productDiv = document.createElement("div");
  productDiv.classList.add("pro");
  productDiv.setAttribute("data-id", product.id);

  const productHTML = `
        <a href="sproduct.html?id=${product.id}">
            <img src="${product.image}" alt="${product.name}">
            <div class="des">
                <span>${product.author}</span>
                <h5>${product.name}</h5>
                <h4>$${product.price.toFixed(2)}</h4>
            </div>
        </a>
         <button class="add-to-cart" id="cartButton">Add to Cart</button>
    `;

  productDiv.innerHTML = productHTML;

  // Add event listener for the 'Add to Cart' button
  const addToCartButton = productDiv.querySelector(".add-to-cart");
  addToCartButton.addEventListener("click", () => addToCart(product));

  return productDiv;
}

// Fetch product data from JSON
fetch("./products.json")
  .then((response) => response.json())
  .then((products) => {
    const productContainer = document.querySelector(".pro-container");
    productContainer.innerHTML = ""; // Clear any existing content

    // Loop through products and create HTML for each product
    products.forEach((product) => {
      const productDiv = createProductHTML(product);
      productContainer.appendChild(productDiv);
    });
  })
  .catch((error) => console.error("Error fetching product data:", error));

// Initialize cart count on page load
updateCartCount();

// Check if the user is logged in
function checkLoginStatus() {
  const user = JSON.parse(localStorage.getItem("user")); // Retrieve user info from localStorage

  const loginLink = document.getElementById("login-link");
  const signupLink = document.getElementById("signup-link");
  const userDropdown = document.getElementById("user-dropdown");
  const userNameSpan = document.getElementById("user-name");

  if (user) {
    // Hide the login and signup links
    loginLink.classList.add("hidden");
    signupLink.classList.add("hidden");

    // Show the user dropdown with the user's name
    userNameSpan.textContent = user.name; // Display the user's name
    userDropdown.classList.remove("hidden");
  } else {
    // Show login and signup links, hide user dropdown
    loginLink.classList.remove("hidden");
    signupLink.classList.remove("hidden");
    userDropdown.classList.add("hidden");
  }
}

// Logout function
function logout() {
  // Remove user info from localStorage and reload the page
  localStorage.removeItem("user");
  document.cookie = "auth_token=; path=/; max-age=0;"; // Clear the auth token cookie
  window.location.reload(); // Reload the page to reflect changes
}

// Attach event listener to the logout link
document.getElementById("logout").addEventListener("click", logout);

// Call checkLoginStatus on page load
checkLoginStatus();
