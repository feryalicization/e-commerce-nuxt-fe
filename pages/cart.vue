<script setup>
import { ref, onMounted, nextTick } from "vue";
import { getCart, updateCartItem, deleteCartItem } from "@/services/cartService"; 
import { createOrder } from "@/services/orderService"; 

const cartItems = ref([]);
const isLoggedIn = ref(false);
const isLoading = ref(false); 
const error = ref(""); 
const token = ref(""); 
const showDropdown = ref(false); 

if (process.client) {
  token.value = localStorage.getItem("access_token"); 
}

// Fetch Cart Items
const fetchCart = async () => {
  isLoading.value = true;
  error.value = "";
  if (isLoggedIn.value && token.value) {
    const data = await getCart(token.value);
    if (data) {
      cartItems.value = data.cart_items; 
    } else {
      error.value = "Failed to fetch cart items.";
    }
  }
  isLoading.value = false;
};

onMounted(async () => {
  isLoggedIn.value = localStorage.getItem("authToken") !== null;
  if (isLoggedIn.value && token.value) {
    await fetchCart();
  }
});

// Handle Quantity Update
const handleQuantityChange = async (cartId, quantityChange) => {
  if (!isLoggedIn.value) {
    alert("You must be logged in to update the cart!");
    return;
  }

  isLoading.value = true; 
  const currentItem = cartItems.value.find(item => item.id === cartId);
  if (!currentItem) return;

  const newQuantity = currentItem.quantity + quantityChange;

  if (newQuantity < 1) return;

  const response = await updateCartItem(cartId, newQuantity, token.value);

  if (response) {
    currentItem.quantity = newQuantity; 
  } else {
    alert("Failed to update cart.");
  }

  isLoading.value = false; 
};

const handleDeleteCartItem = async (cartId) => {
  if (!isLoggedIn.value) {
    alert("You must be logged in to delete items from the cart!");
    return;
  }

  isLoading.value = true;
  const response = await deleteCartItem(cartId, token.value);

  if (response) {
    cartItems.value = cartItems.value.filter(item => item.id !== cartId);
  } else {
    alert("Failed to delete cart item.");
  }

  isLoading.value = false;
};

const handleOrder = async () => {
  if (!isLoggedIn.value) {
    alert("You must be logged in to place an order!");
    return;
  }

  isLoading.value = true;

  const orderResponse = await createOrder(token.value);

  if (orderResponse) {
    alert("Order placed successfully!");
    window.location.reload();
  } else {
    alert("Failed to create order.");
  }

  isLoading.value = false; 
};

// Calculate Total Cart
const calculateTotal = () => {
  return cartItems.value.reduce((total, item) => {
    return total + parseInt(item.product.price) * item.quantity;
  }, 0);
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
};

const toggleDropdown = () => {
  console.log('ferys')
  if (isLoggedIn.value) {
    showDropdown.value = !showDropdown.value; 
  } else {
    router.push({ name: "login" }); 
  }
};

const toggleLogin = async () => {
  if (!isLoggedIn.value) {
    router.push("/login"); 
  } else {
    localStorage.removeItem("access_token"); 
    isLoggedIn.value = false; 
    showDropdown.value = false; 
    alert("You have been logged out.");

    window.location.href = "/";
  }
};

</script>

<template>
  <div class="container mt-5">

    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            <img src="https://getbootstrap.com//docs/5.3/assets/brand/bootstrap-logo.svg" alt="Logo" width="30" height="24" class="d-inline-block align-text-top">
            Cart
          </a>
        </div>
       
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <form class="d-flex" role="search" @submit.prevent="fetchProducts">
            <input v-model="searchQuery" class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success" type="submit">Search</button>
          </form>
          
          <div class="position-relative d-inline-block">
            <font-awesome-icon 
              :icon="['fas', 'user']" 
              size="2x"
              class="cursor-pointer text-primary ms-3" 
              @click="toggleDropdown"
              role="button" 
              tabindex="0" 
            />

            <div v-if="isLoggedIn">
              <div v-show="showDropdown" class="dropdown-menu show position-absolute start-0 mt-2">
                <a class="dropdown-item" href="#" @click="toggleLogin">Logout</a>
              </div>
            </div>
          </div>

          <!-- Cart Icon -->
          <router-link to="/">
            <font-awesome-icon 
            :icon="['fas', 'house']" 
              size="2x"
              class="cursor-pointer text-warning ms-3" 
              @click="homePage"
              role="button" 
              tabindex="0" 
            />
          </router-link>
      
        </div>
      </div>
    </nav>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center">
      <p>Loading cart...</p>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="text-center text-danger">
      <p>{{ error }}</p>
    </div>

    <br><br>
    
    <!-- Cart Items -->
    <div v-if="cartItems.length > 0" class="row">
      <div v-for="item in cartItems" :key="item.id" class="col-md-4 mb-4">
        <div class="card">
          <img :src="item.product.image_url" class="card-img-top" alt="Product Image" style="height: 200px; object-fit: cover;">
          <div class="card-body">
            <h5 class="card-title">{{ item.product.name }}</h5>
            <p class="card-text">Quantity: {{ item.quantity }}</p>
            <p class="card-text">Subtotal: {{ item.subtotal }}</p> 

            <div class="d-flex justify-content-between align-items-center">

            <!-- Right Button: Minus Text -->
              <button 
                type="button" 
                class="btn btn-outline-warning rounded-circle p-3" 
                style="width: 50px; height: 50px; display: flex; justify-content: center; align-items: center;" 
                @click="handleQuantityChange(item.id, -1)"
              >
                <p style="font-size: 20px; margin: 0;">-</p>
              </button>

              <!-- Quantity Display -->
              <span style="font-size: 20px; margin: 0; padding: 0 20px;">{{ item.quantity }}</span>

                <!-- Left Button: Plus Text -->
                <button 
                    type="button" 
                    class="btn btn-outline-primary rounded-circle p-3" 
                    style="width: 50px; height: 50px; display: flex; justify-content: center; align-items: center;" 
                    @click="handleQuantityChange(item.id, 1)"
                >
                    <p style="font-size: 20px; margin: 0;">+</p>
                </button>

              <!-- Delete Button (Same Line) -->
              <button 
                type="button" 
                class="btn btn-outline-danger rounded-circle p-3 ms-3" 
                style="width: 50px; height: 50px; display: flex; justify-content: center; align-items: center;" 
                @click="handleDeleteCartItem(item.id)"
              >
                <p style="font-size: 20px; margin: 0;">🗑️</p> <!-- Trash icon for delete -->
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- If Cart is Empty -->
    <div v-else class="text-center text-muted">
      <p>Your cart is empty.</p>
    </div>

    <br><br><br>

    <!-- Total Cart and Order Button -->
    <div class="cart-footer fixed-bottom d-flex justify-content-between align-items-center p-3 bg-white shadow-sm">
      <div class="text-left">
        <p style="font-size: 20px; font-weight: bold;">Total Cart: 
          {{ formatCurrency(calculateTotal()) }}
        </p>
      </div>
      <div class="text-right">
        <button 
          type="button" 
          class="btn btn-primary" 
          @click="handleOrder"
        >
          Order
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-footer {
  z-index: 999;
}
</style>
