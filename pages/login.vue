
<script setup>
  import { ref } from "vue";
  import { loginUser, registerUser } from "@/services/userService"; 
  import { useRouter } from "vue-router";

  const email = ref("");
  const password = ref("");
  const rememberMe = ref(false);
  const errorMessage = ref("");
  const router = useRouter();

  const handleLogin = async () => {
    errorMessage.value = ""; 

    if (!email.value || !password.value) {
      errorMessage.value = "Please enter both email and password.";
      return;
    }

    const response = await loginUser(email.value, password.value);

    if (response) {
      localStorage.setItem("access_token", response.access_token); 

      if (rememberMe.value) {
        localStorage.setItem("rememberMe", "true");
      }

      if (response.user.role === "superuser" || response.user.role === "admin") {
        router.push("/products"); 
      } else {
        router.push("/");  
      }
    } else {
      errorMessage.value = "Invalid credentials, please try again.";
    }
  };
</script>


<template>
    <div class="container mt-5">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
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
        <div class="text-end mt-1">
          <router-link to="/register" class="text-primary">Don't have an account?</router-link>
        </div>
        <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="rememberMe" v-model="rememberMe" />
          <label class="form-check-label" for="rememberMe">Remember me</label>
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
      </form>
      <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
    </div>
  </template>
  
 
  
  <style scoped>
  .container {
    max-width: 400px;
  }
  </style>
  