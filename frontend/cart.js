//var tempValue = 0;
// Initialize cart from localStorage with proper structure
let cart = [];
try {
    const savedCart = localStorage.getItem('cart');
    cart = savedCart ? JSON.parse(savedCart) : [];
} catch (e) {
    console.error('Error loading cart from localStorage:', e);
    cart = [];
}

// Function to save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Function to add item to cart (to be used across pages)
function addToCart(product) {
    const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
    };

    cart.push(cartItem);
    saveCart();
}

// Function to count the quantity of each unique product
function countProductQuantities(cart) {
    const productCount = {};

    cart.forEach(item => {
        if (productCount[item.id]) {
            productCount[item.id].quantity += 1;
        } else {
            productCount[item.id] = {
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: 1
            };
        }
    });

    return Object.values(productCount);
}

// Function to display cart items
function displayCartItems() {
    const cartContainer = document.querySelector('.cart-container');
    const totalPriceElement = document.getElementById('total-price');

    if (!cartContainer) return;

    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        totalPriceElement.textContent = '0.00';
        localStorage.setItem('totalPrice', '0.00'); // Save to localStorage
        return;
    }

    let totalPrice = 0;
    const uniqueCartItems = countProductQuantities(cart);

    uniqueCartItems.forEach(item => {
        const price = Number(item.price);
        totalPrice += price * item.quantity;

        const cartItemHTML = `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h5>${item.name}</h5>
                    <p>Price: $${price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="decrease-qty">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="increase-qty">+</button>
                    </div>
                </div>
                <button class="remove-item">Remove</button>
            </div>
        `;

        cartContainer.innerHTML += cartItemHTML;
    });

    totalPriceElement.textContent = totalPrice.toFixed(2);
    localStorage.setItem('totalPrice', totalPrice.toFixed(2)); // Save to localStorage
}


// Function to handle quantity changes
function updateQuantity(productId, operation) {
    const numericProductId = Number(productId);
    const currentItems = cart.filter(item => item.id === numericProductId);

    if (operation === 'increase') {
        // Add one more instance of the item to the cart
        const itemToAdd = {...currentItems[0] };
        cart.push(itemToAdd);
    } else if (operation === 'decrease') {
        // Remove one instance of the item from the cart
        const index = cart.findIndex(item => item.id === numericProductId);
        if (index !== -1) {
            cart.splice(index, 1);
        }
    }

    saveCart();
    displayCartItems();
}

// Function to remove all instances of a product
function removeCartItem(productId) {
    const numericProductId = Number(productId);
    cart = cart.filter(item => item.id !== numericProductId);
    saveCart();
    displayCartItems();
}

// Function to update cart count in the navbar
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Event delegation for cart interactions
function attachEventListeners() {
    const cartContainer = document.querySelector('.cart-container');

    // Only attach if we're on the cart page
    if (!cartContainer) return;

    cartContainer.addEventListener('click', (event) => {
        const target = event.target;
        const cartItemElement = target.closest('.cart-item');

        if (!cartItemElement) return;

        const productId = cartItemElement.getAttribute('data-id');

        if (target.classList.contains('remove-item')) {
            removeCartItem(productId);
        } else if (target.classList.contains('increase-qty')) {
            updateQuantity(productId, 'increase');
        } else if (target.classList.contains('decrease-qty')) {
            updateQuantity(productId, 'decrease');
        }
    });
}

// Initialize the cart
document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();
    attachEventListeners();
    updateCartCount();
});