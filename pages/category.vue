<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/services/categoryService";

const router = useRouter();
const categories = ref([]);
const showEditModal = ref(false);
const showAddModal = ref(false);
const token = ref("");
const searchQuery = ref("");
const showDropdown = ref(false); 
const isLoggedIn = ref(false);

const selectedCategory = ref({
  id: null,
  name: "",
  description: "",
});

const newCategory = ref({
  name: "",
  description: "",
});

const fetchCategories = async () => {
  token.value = localStorage.getItem("access_token") || "";
  categories.value = await getCategories(token.value, searchQuery.value);
};

onMounted(() => {
  fetchCategories();
  checkUserLogin();
});


const openEditModal = (category) => {
  selectedCategory.value = { ...category };
  showEditModal.value = true;
};

const openAddModal = () => {
  newCategory.value = { name: "", description: "" };
  showAddModal.value = true;
};

const closeEditModal = () => (showEditModal.value = false);
const closeAddModal = () => (showAddModal.value = false);

const saveCategory = async () => {
  if (!selectedCategory.value.id) return;
  const response = await updateCategory(
    token.value,
    selectedCategory.value.id,
    selectedCategory.value.name,
    selectedCategory.value.description
  );

  if (response) {
    alert("Category updated successfully!");
    closeEditModal();
    categories.value = await getCategories(token.value);
  } else {
    alert("Failed to update category.");
  }
};



const addCategory = async () => {
  if (!newCategory.value.name || !newCategory.value.description) {
    alert("Please fill in all fields.");
    return;
  }

  const response = await createCategory(token.value, newCategory.value.name, newCategory.value.description);
  if (response) {
    alert("Category created successfully!");
    closeAddModal();
    await fetchCategories();
  } else {
    alert("Failed to create category.");
  }
};


const removeCategory = async (categoryId) => {
  if (confirm("Are you sure you want to delete this category?")) {
    const response = await deleteCategory(token.value, categoryId);
    if (response) {
      alert("Category deleted successfully!");
      await fetchCategories();
    } else {
      alert("Failed to delete category.");
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
        <a class="nav-link" href="#" @click.prevent="router.push('/products')"><strong>Products</strong></a>
      </li>
      <li class="nav-item">
        <a class="nav-link active" href="#" @click.prevent="router.push('/category')"><strong>Category Products</strong></a>
      </li>
    </ul>

    <br /><br />
    <h5>Category Products</h5>
    <div class="d-flex justify-content-between align-items-center">
      <form class="d-flex" role="search" @submit.prevent="fetchCategories">
        <input v-model="searchQuery" class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
      <button class="btn btn-success mb-3" @click="openAddModal">+ Add Category</button>
    </div>
    <br />

    <table class="table">
      <thead>
        <tr style="text-align: center;">
          <th scope="col">No</th>
          <th scope="col">Name</th>
          <th scope="col">Description</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category, index) in categories" :key="category.id" style="text-align: center;">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ category.name }}</td>
          <td>{{ category.description }}</td>
          <td>
            <div class="d-flex justify-content-between">
              <button class="btn btn-primary w-50 me-2" @click="openEditModal(category)">Edit</button>
              <button class="btn btn-danger w-50" @click="removeCategory(category.id)">Delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Edit Category Modal -->
    <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Category</h5>
            <button type="button" class="btn-close" @click="closeEditModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveCategory">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input v-model="selectedCategory.name" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea v-model="selectedCategory.description" class="form-control" required></textarea>
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

    <!-- Add Category Modal -->
    <div v-if="showAddModal" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add Category</h5>
            <button type="button" class="btn-close" @click="closeAddModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addCategory">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input v-model="newCategory.name" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea v-model="newCategory.description" class="form-control" required></textarea>
              </div>
              <button type="submit" class="btn btn-success w-100">Create Category</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
