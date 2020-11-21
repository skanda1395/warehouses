import Vue from 'vue'
import Vuex from 'vuex'

import warehouses from '../data/warehouses.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    warehouseList: warehouses
  },
  getters: {
   getWarehouseList(state) {
     return state.warehouseList
   },
   getWarehouseById: (state) => (id) => {
    return state.warehouseList.find(warehouse => warehouse.id == id);
   }
  },
  mutations: {
    editWarehouseData(state, payload) { 
      let warehouseToUpdate = this.getters.getWarehouseById(payload.id)
      for(let prop in warehouseToUpdate) {
        warehouseToUpdate[prop] = payload[prop];
      }
    }
  },
  actions: {
    updateWarehouseData(context, payload) {
      context.commit("editWarehouseData", payload)
    }
  },
  modules: {
  }
})
