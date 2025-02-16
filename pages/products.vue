<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getProducts, updateProduct, createProduct, deleteProduct } from "@/services/productsService";
import { getCategories } from "@/services/categoryService";

const router = useRouter();
const products = ref([]);
const categories = ref([]);
const showEditModal = ref(false);
const showAddModal = ref(false);
const token = ref("");
const searchQuery = ref("");
const minPrice = ref(null);
const maxPrice = ref(null);
const showDropdown = ref(false); 
const isLoggedIn = ref(false);

const selectedProduct = ref({
  id: null,
  name: "",
  description: "",
  price: null,
  stock: null,
  category_id: null,
  image_url: "",
});

const newProduct = ref({
  name: "",
  description: "",
  price: null,
  stock: null,
  category_id: null,
  image_url: "",
});


const fetchProducts = async () => {
  token.value = localStorage.getItem("access_token") || "";
  products.value = await getProducts(searchQuery.value, minPrice.value, maxPrice.value);
};

onMounted(async () => {
  checkUserLogin(); 
  token.value = localStorage.getItem("access_token") || "";
  await fetchProducts()
  categories.value = await getCategories(token.value);
});

const openEditModal = (product) => {
  selectedProduct.value = { ...product };
  showEditModal.value = true;
};

const openAddModal = () => {
  newProduct.value = { name: "", description: "", price: null, stock: null, category_id: null, image_url: "" };
  showAddModal.value = true;
};

const closeEditModal = () => showEditModal.value = false;
const closeAddModal = () => showAddModal.value = false;

const saveProduct = async () => {
  if (!selectedProduct.value.id) return;
  
  const response = await updateProduct(selectedProduct.value.id, selectedProduct.value, token.value);
  if (response) {
    alert("Product updated successfully!");
    closeEditModal();
    products.value = await getProducts();
  } else {
    alert("Failed to update product.");
  }
};

const addProduct = async () => {
  const response = await createProduct(token.value, newProduct.value);
  if (response) {
    alert("Product created successfully!");
    closeAddModal();
    products.value = await getProducts();
  } else {
    alert("Failed to create product.");
  }
};

const removeProduct = async (productId) => {
  if (confirm("Are you sure you want to delete this product?")) {
    const response = await deleteProduct(token.value, productId);
    if (response) {
      alert("Product deleted successfully!");
      products.value = await getProducts();
    } else {
      alert("Failed to delete product.");
    }
  }
};


const checkUserLogin = () => {
  const token = localStorage.getItem("access_token"); 
  isLoggedIn.value = token !== null; 
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

    window.location.href = "/login";
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
            Admin Dashboard
          </a>
        </div>
       
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
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

    <ul class="nav justify-content-center">
      <li class="nav-item">
        <a class="nav-link active" href="#" @click.prevent="router.push('/products')"><strong><h5>Products</h5></strong></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" @click.prevent="router.push('/category')"><strong><h5>Category Products</h5></strong></a>
      </li>
    </ul>

    <br /><br />
    <h5>List Products</h5>
    <div class="d-flex justify-content-between align-items-center">

      <form class="d-flex" role="filter" @submit.prevent="fetchProducts">
        <input v-model="minPrice" class="form-control me-2" type="number" placeholder="Min Price" />
        <input v-model="maxPrice" class="form-control me-2" type="number" placeholder="Max Price" />
        <button class="btn btn-outline-primary" type="submit">Filter</button>
      </form>


      <form class="d-flex" role="search" @submit.prevent="fetchProducts">
        <input v-model="searchQuery" class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
      <button class="btn btn-success mb-3" @click="openAddModal">+ Add Product</button>
    </div>
    <br />

    <table class="table">
      <thead>
        <tr style="text-align: center;">
          <th scope="col">No</th>
          <th scope="col">Name</th>
          <th scope="col">Description</th>
          <th scope="col">Price</th>
          <th scope="col">Stock</th>
          <th scope="col">Category</th>
          <th scope="col">Image</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, index) in products" :key="product.id" style="text-align: center;">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ product.name }}</td>
          <td>{{ product.description }}</td>
          <td>{{ product.price }}</td>
          <td>{{ product.stock }}</td>
          <td>{{ product.category }}</td>
          <td>
            <img :src="product.image_url" alt="Product Image" width="50" height="50" />
          </td>
          <td>
            <div class="d-flex justify-content-between mt-auto">
              <button class="btn btn-primary w-50 me-2" @click="openEditModal(product)">Edit</button>
              <button class="btn btn-danger w-50" @click="removeProduct(product.id)">Delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Edit Product Modal -->
    <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Product</h5>
            <button type="button" class="btn-close" @click="closeEditModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveProduct">
              <div class="mb-3">
                <label class="form-label">Category</label>
                <select v-model="selectedProduct.category_id" class="form-control" required>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input v-model="selectedProduct.name" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea v-model="selectedProduct.description" class="form-control" required></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Price</label>
                <input v-model="selectedProduct.price" type="number" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Stock</label>
                <input v-model="selectedProduct.stock" type="number" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Image</label>
                <input v-model="selectedProduct.image_url" type="text" class="form-control" required />
              </div>
              <div class="d-flex justify-content-between">
                <button type="button" class="btn btn-secondary w-45" @click="closeEditModal">Close</button>
                <button type="submit" class="btn btn-success w-45">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Product Modal -->
    <div v-if="showAddModal" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add Product</h5>
            <button type="button" class="btn-close" @click="closeAddModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addProduct">
              <div class="mb-3">
                <label class="form-label">Category</label>
                <select v-model="newProduct.category_id" class="form-control" required>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input v-model="newProduct.name" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea v-model="newProduct.description" class="form-control" required></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Price</label>
                <input v-model="newProduct.price" type="number" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Stock</label>
                <input v-model="newProduct.stock" type="number" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Image</label>
                <input v-model="newProduct.image_url" type="text" class="form-control" required />
              </div>
              <button type="submit" class="btn btn-success w-100">Create Product</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
