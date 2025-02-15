<script setup>
  import { ref } from "vue";
  import { registerUser } from "@/services/userService"; 
  import { useRouter } from "vue-router";

  const name = ref("");
  const email = ref("");
  const password = ref("");
  const errorMessage = ref("");
  const successMessage = ref("");
  const router = useRouter();

  const handleRegister = async () => {
  errorMessage.value = "";

  if (!name.value.trim() || !email.value.trim() || !password.value.trim()) {
    errorMessage.value = "All fields are required.";
    return;
  }

  const response = await registerUser(email.value.trim(), password.value.trim(), name.value.trim());

  if (response) {
    localStorage.setItem("access_token", response.access_token); 
    alert("Registration successful!");
    router.push("/"); 
  } else {
    errorMessage.value = "Failed to register. Please check your details.";
  }
};



</script>

<template>
  <div class="container mt-5">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input
          v-model="name"
          type="text"
          class="form-control"
          id="name"
          placeholder="Enter your name"
        />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email address</label>
        <input
          v-model="email"
          type="email"
          class="form-control"
          id="email"
          placeholder="Enter your email"
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          id="password"
          placeholder="Enter your password"
        />
      </div>
      <button type="submit" class="btn btn-primary">Register</button>
    </form>
    <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
    <p v-if="successMessage" class="text-success mt-3">{{ successMessage }}</p>
  </div>
</template>

<style scoped>
.container {
  max-width: 400px;
}
</style>
