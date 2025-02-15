<script setup>
import { ref, onMounted } from 'vue';
import { getProducts } from '@/services/productsService';

const products = ref([]);

onMounted(async () => {
  products.value = await getProducts();
});
</script>

<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Product List</h1>
    <div v-if="products.length > 0" class="row">
      <div v-for="product in products" :key="product.id" class="col-md-4 mb-3">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text text-muted">Price: ${{ product.price }}</p>
          </div>
        </div>
      </div>
    </div>
    <p v-else class="text-muted text-center">No products available.</p>
  </div>
</template>
