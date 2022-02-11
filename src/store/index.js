import Vue from "vue";
import Vuex from "vuex";
import { storage } from "../plugins/core";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    message: "",
    searchHistory: storage("searchHistory") || [],
  },
  mutations: {
    UPDATE(state, query) {
      if (query) {
        state.searchHistory.unshift(query);
        storage("searchHistory", query, true);
      } else {
        state.searchHistory = [];
        storage("searchHistory", []);
      }
    },
    POST_MESSAGE(state, message) {
      state.message = message;
    },
  },
  actions: {
    addHistory({ commit }, query) {
      commit("UPDATE", query);
    },
    clearHistory({ commit }) {
      commit("UPDATE", false);
    },
    message({ commit }, payload) {
      commit("POST_MESSAGE", payload);
    },
  },
});
