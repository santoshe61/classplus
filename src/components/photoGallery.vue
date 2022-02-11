<template>
  <v-container class="pa-0" id="scrolling-start">
    <!-- Notification to show error whiile fetching result from api -->
    <v-snackbar v-model="isError" top>
      {{ error }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="isError = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-row>
      <v-col cols="12">
        <v-banner class="mb-2">
          <!-- If has query then show search -->
          <h3 v-if="query">
            Search result for
            <v-chip class="ma-2">
              {{ query }}
            </v-chip>
          </h3>
          <!-- Else show recent items -->
          <h3 v-else>Recent Photos</h3>
          <!-- If query result has items then show count -->
          <p v-if="photos.photo.length">
            Showing 0-{{ photos.page * photos.perpage }} photos, found more than
            {{ photos.total }} results.
          </p>
          <!-- If query result dont have items -->
          <p v-else-if="photos.total === 0" class="red--text">
            No result found for the entered keyword, please try with different
            search
          </p>
          <!-- Fetching loader -->
          <p v-else>
            Fetching results ...
            <v-progress-linear
              :active="true"
              :indeterminate="true"
              :query="true"
            ></v-progress-linear>
          </p>
        </v-banner>
      </v-col>
      <!-- Adding index to key because sometimes we got duplicate images -->
      <v-col
        v-for="(photo, index) in photos.photo"
        :key="photo.id + index"
        class="d-flex child-flex"
        cols="12"
        md="3"
        sm="4"
        xs="6"
      >
        <v-img
          :src="`http://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`"
          :lazy-src="`http://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`"
          aspect-ratio="1"
          @click="modal(photo)"
          class="grey lighten-2 clickable"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-col>
    </v-row>
    <v-row v-if="photos.total !== 0" v-intersect="debouncedFetch">
      <v-col
        v-for="photo in per_page"
        :key="photo"
        class="d-flex child-flex"
        cols="12"
        md="3"
        sm="4"
        xs="6"
      >
        <v-sheet color="grey lighten-4" class="pa-3">
          <v-skeleton-loader class="mx-auto" type="image"></v-skeleton-loader>
        </v-sheet>
      </v-col>
    </v-row>
    <!-- popup dialog -->
    <v-dialog v-model="showDialog" width="600">
      <v-card>
        <v-toolbar dense color="elevation-0">
          <p class="ma-0">{{ picture.title }}</p>
          <v-spacer></v-spacer>
          <v-btn icon color="red" @click.native="showDialog = false"> X </v-btn>
        </v-toolbar>
        <v-row no-gutters>
          <v-col cols="12">
            <v-row no-gutters align="center" justify="center">
              <v-img
                :src="`http://farm${picture.farm}.staticflickr.com/${picture.server}/${picture.id}_${picture.secret}.jpg`"
                :lazy-src="`http://farm${picture.farm}.staticflickr.com/${picture.server}/${picture.id}_${picture.secret}.jpg`"
                aspect-ratio="1"
                class="grey lighten-2"
              ></v-img>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { debounce } from "../plugins/core";
export default {
  props: ["query"],
  data() {
    return {
      showDialog: false,
      isError: false,
      error: "",
      endPage: false,
      isLoading: false,
      flicker_key: "72f59f373774da4d4764a85ce03bf3fc",
      per_page: 30,
      fetchedPages: 1,
      photos: {
        photo: [],
      },
      picture: {},
    };
  },
  watch: {
    query() {
      this.fetchedPages = 1;
      this.photos = {
        photo: [],
      };
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      this.debouncedFetch();
    },
  },
  methods: {
    fetch(entries) {
      // check if skeleton is in viewpoint, if yes then fetch from api
      if (entries && !entries?.[0]?.isIntersecting) return;
      let api_url;
      // if have query then search otherwise show recent items
      if (this.query) {
        // add query to history
        this.$store.dispatch("addHistory", this.query);
        api_url = `https://api.flickr.com/services/rest/?format=json&method=flickr.photos.search&api_key=${this.flicker_key}&tags=${this.query}&page=${this.fetchedPages}&per_page=${this.per_page}&safe_search=1&nojsoncallback=?`;
      } else {
        api_url = `https://api.flickr.com/services/rest/?format=json&method=flickr.photos.getRecent&api_key=${this.flicker_key}&page=${this.fetchedPages}&per_page=${this.per_page}&safe_search=1&nojsoncallback=?`;
      }
      return fetch(api_url)
        .then((res) => res.json())
        .then((res) => {
          if (this.fetchedPages++ > 1) {
            this.photos.photo.push(...res.photos.photo);
            this.photos.page = res.photos.page;
            this.photos.pages = res.photos.pages;
            this.photos.perpage = res.photos.perpage;
          } else this.photos = res.photos;
          return res;
        })
        .catch((Err) => {
          console.log(Err);
          this.isError = true;
          this.$store.dispatch(
            "message",
            "Unable to fetch result, error in connection"
          );
        });
    },
    modal(picture) {
      this.showDialog = true;
      this.picture = picture;
    },
  },
  created() {
    this.debouncedFetch = debounce(this.fetch, 700);
  },
};
</script>

<style>
.clickable {
  cursor: pointer;
}
</style>