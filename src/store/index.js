import Vuex from 'vuex';

const store = new Vuex.Store({//使用Vuex.Store 取得之
  state: {
     map: null,
     controlLayer: null,
     here_API: {
        key: "qcwHTsJura1qAf9AT75Nvl5DoolyvxQdAJmu-1wGTWQ", // 您的 HERE APIKEY
        dataHubReadToken: "APa7WWjkRhGKor_kt7QPQQA", // 您的 Data Hub Token
        distrcitSpaceId: "5b0dSwmn", // 鄉鎮區界 Space ID
     },
  },
  actions: {
      setInitMap({commit}, payload){
        commit("setInitMap", payload);
      },
      addLayer({commit}, payload){
        commit("addLayer", payload);
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
    addLayer(state, payload){
      state.map.addLayer(payload);
    },
    setControlLayer(state, payload){
      state.controlLayer = L.control.panelLayers(
        payload.baseMaps, 
        payload.overMaps).addTo(state.map);
     },

    addOverlayMaps(state, payload){
      state.controlLayer.addOverlay({
        icon: `<i class="${payload.icon} text-lg"></i>`,
        layer: payload.layer,
      }, payload.title, payload.group);
    }
  },


});

export default store;