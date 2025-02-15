<script setup>
    import { useRouter } from "vue-router";

    const router = useRouter();

    const navigateTo = (path) => {
    router.push(path);
    };
</script>

<template>
  <div class="container mt-5">
    <ul class="nav justify-content-center">
      <li class="nav-item">
        <a class="nav-link active" aria-current="page" href="#" @click.prevent="navigateTo('/products')">
            <strong><h5>Products</h5></strong>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" @click.prevent="navigateTo('/category')">
            <strong><h5>Category Products</h5></strong>
        </a>
      </li>
    </ul>
  </div>
</template>
