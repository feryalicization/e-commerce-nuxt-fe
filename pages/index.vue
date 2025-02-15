<script setup>
import { ref, onMounted } from "vue";
import { getProducts } from "@/services/productsService";

const products = ref([]);
const searchQuery = ref("");
const fetchProducts = async () => {
  products.value = await getProducts(searchQuery.value);
};


onMounted(async () => {
  products.value = await getProducts();
});
</script>

<template>
  
  <div class="container mt-5">
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            <img src="https://getbootstrap.com//docs/5.3/assets/brand/bootstrap-logo.svg" alt="Logo" width="30" height="24" class="d-inline-block align-text-top">
            Bootstrap
          </a>
        </div>
       
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <form class="d-flex" role="search" @submit.prevent="fetchProducts">
            <input v-model="searchQuery" class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success" type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>

    <h1 class="text-center mb-4">Product List</h1>
    <div v-if="products.length > 0" class="row">
      <div v-for="product in products" :key="product.id" class="col-md-4 mb-3">
        <div class="card h-100" style="width: 18rem;">
          <img :src="product.image_url" class="card-img-top" alt="..." style="height: 200px; object-fit: cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text text-muted flex-grow-1">Price: ${{ product.price }}</p>
            <div class="d-flex justify-content-between mt-auto">
              <a href="#" class="btn btn-primary w-50 me-2">Details</a>
              <a href="#" class="btn btn-success w-50">Order</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p v-else class="text-muted text-center">No products available.</p>
  </div>
  
  
</template>
