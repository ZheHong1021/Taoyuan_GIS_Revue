import Vuex from 'vuex';
import L from 'leaflet';
const store = new Vuex.Store({//使用Vuex.Store 取得之
  state: {
     map: null,
     controlLayer: null,
  },
  actions: {
      setInitMap({commit}, payload){
        commit("setInitMap", payload);
      },
      addMarker({commit}, payload){
        commit("addMarker", payload);
      },
      setControlLayer({commit}, payload){
        commit("setControlLayer", payload);
      },
      addOverlayMaps({commit}, payload){
        commit("addOverlayMaps", payload);
      },
  },
  mutations: {
    setInitMap(state, payload){
      state.map = payload;
    },
    addMarker(state, payload){
      state.map.addLayer(payload);
    },
    setControlLayer(state, payload){
      // 將 baseMaps跟 overlayMaps載入到地圖中
      state.controlLayer = L.control.layers(
        payload.baseMaps, 
        payload.overlayMaps,{ 
          collapsed: false,
        }
      ).addTo(state.map);
    },
    addOverlayMaps(state, payload){
      state.controlLayer.addOverlay(payload.layer, payload.title)
    }
  },
});

export default store;