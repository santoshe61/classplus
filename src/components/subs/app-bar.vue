<template>
  <div class="mx-auto mt-3 max-width-50vw">
    <h3 class="white--text text-center mb-1">Search Photos</h3>
    <v-combobox
      :items="searchHistory"
      :search-input.sync="query"
      clearable
      solo
      label="Search Keyword"
      placeholder="Enter text to search"
      class="width-200px"
    ></v-combobox>
    <v-btn text color="error" @click="clearHistory" class="clear-history">
      Clear History
    </v-btn>
  </div>
</template>

<script>
export default {
  props: ["value"],
  data() {
    return {
      query: this.value,
    };
  },
  methods: {
    clearHistory() {
      this.$store.dispatch("clearHistory");
    },
  },
  computed: {
    searchHistory() {
      let history = this.$store.state.searchHistory;
      if (!history.length) return [];
      return [
        { header: "or select from your search history" },
        ...this.$store.state.searchHistory,
      ];
    },
  },
  watch: {
    query(val) {
      this.$emit("input", val);
    },
  },
};
</script>

<style>
.max-width-50vw {
  max-width: 50vw;
}
.width-200px {
  width: 350px;
}
.clear-history {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>