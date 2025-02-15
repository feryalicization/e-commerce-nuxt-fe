<script setup>
import { ref, onMounted } from "vue";
import { getProducts, getProductById } from "@/services/productsService";

const products = ref([]);
const searchQuery = ref("");
const selectedProduct = ref(null);
const showModal = ref(false);

const fetchProducts = async () => {
  products.value = await getProducts(searchQuery.value);
};

const fetchProductDetails = async (id) => {
  selectedProduct.value = await getProductById(id);
  showModal.value = true;
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
              <button @click="fetchProductDetails(product.id)" class="btn btn-primary w-50 me-2">
                Details
              </button>
              <a href="#" class="btn btn-success w-50">Order</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p v-else class="text-muted text-center">No products available.</p>
  </div>

  <!-- Product Detail Modal -->
  <div class="modal fade" :class="{ show: showModal }" :style="{ display: showModal ? 'block' : 'none' }" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ selectedProduct?.name }}</h5>
          <button type="button" class="btn-close" @click="showModal = false"></button>
        </div>
        <div class="modal-body">
          <img :src="selectedProduct?.image_url" class="img-fluid mb-3" alt="Product Image" style="height: 200px; object-fit: cover;">
          <p><strong>Price:</strong> ${{ selectedProduct?.price }}</p>
          <p><strong>Description:</strong> {{ selectedProduct?.description }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" @click="showModal = false">Close</button>
          <a href="#" class="btn btn-success">Order Now</a>
        </div>
      </div>
    </div>
  </div>
</template>
