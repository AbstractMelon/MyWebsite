<template>
  <div class="project-box" @click="handleClick">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    description: String,
    link: String,
  },
  methods: {
    handleClick() {
      window.open(this.link, "_blank");
    },
  },
};
</script>
