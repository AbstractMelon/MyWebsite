<template>
  <div class="not-found">
    <h1>404 - Page Not Found</h1>
    <p>
      The page you are looking for might have been removed or is temporarily
      unavailable.
    </p>
    <p>Go back to <router-link to="/">Homepage</router-link>.</p>
  </div>
</template>

<script>
export default {
  name: "NotFound",
};
</script>

<style scoped>
body {
  background-color: #1f1f1f;
  color: #ffffff;
  font-family: Arial, sans-serif;
  text-align: center;
  padding: 50px;
  margin: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h1 {
  font-size: 3em;
  margin-bottom: 20px;
}

p {
  font-size: 1.2em;
  margin-bottom: 30px;
}

a {
  color: #ffffff;
  text-decoration: none;
  border-bottom: 1px dashed #ffffff;
  transition: border-bottom 0.3s ease;
}

a:hover {
  border-bottom: 1px solid #ffffff;
}
</style>
