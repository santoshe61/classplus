<template>
  <v-app>
    <v-app-bar
      app
      fixed
      color="black"
      elevate-on-scroll
      scroll-target="#scrolling-start"
      height="150"
    >
      <!-- Search bar header component -->
      <app-bar v-model="searchKeyword"></app-bar>
    </v-app-bar>
    <v-main class="ma-3">
      <!-- Gallery component -->
      <photo-gallery :query="searchKeyword"></photo-gallery>
    </v-main>

    <v-footer app> </v-footer>
  </v-app>
</template>

<script>
import photoGallery from "./components/photoGallery.vue";
import appBar from "./components/subs/app-bar.vue";
export default {
  name: "App",
  components: {
    photoGallery,
    appBar,
  },
  data() {
    return {
      searchKeyword: "",
    };
  },
};
</script>
