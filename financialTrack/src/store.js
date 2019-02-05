import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isAuthenticated: false,
    transaction: null,
    transactionDate: {year: null, month: null},
    smallScreen: false,
    showLoader: true,
    username: window.localStorage.getItem('username'),
  },
  mutations: {
    setIsAuthenticated(state, payload){
      state.isAuthenticated = payload
    },
    setTransaction(state, payload){
      state.transaction = payload;
    },
    setTransactionDate(state, payload){
      state.transactionDate = payload;
    },
    setSmallScreen(state, payload){
      state.smallScreen = payload <= 992
    },
    setShowLoader(state, payload){
      state.showLoader = payload
    },
    setUsername(state, payload){
      state.username = payload
    }
  },
  actions: {

  }
})
