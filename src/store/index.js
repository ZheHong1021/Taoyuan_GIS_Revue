import Vuex from 'vuex';
import module_Bus from './modules/bus/index';

const store = new Vuex.Store({//使用Vuex.Store 取得之
  modules: {
    module_Bus: module_Bus,
  },
  state: {
     map: null,
     controlLayer: null,
     here_API: {
        key: "qcwHTsJura1qAf9AT75Nvl5DoolyvxQdAJmu-1wGTWQ", // 您的 HERE APIKEY
        dataHubReadToken: "APa7WWjkRhGKor_kt7QPQQA", // 您的 Data Hub Token
        distrcitSpaceId: "5b0dSwmn", // 鄉鎮區界 Space ID
     },
     tourism_Data: {
       type: 'bar',
       data: '門票收入',
       month: '八月'
     },
     train: [],
     new_train: [],
     high_Speed_Rail: [],
     new_high_Speed_Rail: [],
     train_Choose: {
      origin_Station_id : "",
      destinate_Station_id : "",
      choose_Date: "",
     },
     thsr_Choose: {
      origin_Station_id : "",
      destinate_Station_id : "",
      choose_Date: "",
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
      changeTourismMonth({commit}, payload){
        commit("changeTourismMonth", payload);
      },
      changeTourismTypeData({commit}, payload){
        commit("changeTourismTypeData", payload);
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
    },
    changeTourismMonth(state, payload){
      state.tourism_Data.month = payload;
    },
    changeTourismTypeData(state, payload){
      state.tourism_Data.type = payload.type;
      state.tourism_Data.data = payload.data;
    },


    setTrainStation(state, payload){
      state.train = payload;
    },
    setHighSpeedStation(state, payload){
      state.high_Speed_Rail = payload;
    },
    setNewStation(state, payload){
        const category = payload == 'train' ? state.train : state.high_Speed_Rail
        const new_arr = payload == 'train' ? state.new_train : state.new_high_Speed_Rail
        // 火車想要做GroupDropDown，所以必須列出該車站的所在城市，其他種類則不用
        if( payload === 'train'){
          let city_include = []
          Object.keys(category).forEach(function (key) {
            const city_name = category[key].LocationCity.substr(0,2)
            if(city_include.includes(city_name) ){
              new_arr[city_include.length - 1].station.push({
                name: category[key].StationName.Zh_tw, 
                id: category[key].StationID,
              })
            }else{
            new_arr.push({
              city: city_name,
              station: [{
                name: category[key].StationName.Zh_tw, 
                id: category[key].StationID,
              }]
            })
            city_include.push(city_name)
          }
        })
      }else{
        Object.keys(category).forEach(function (key) {
            new_arr.push({
              name: category[key].StationName.Zh_tw, 
              id: category[key].StationID,
            })
          })
      }
    }
  },

  getters:{
    get_NewTrainArr_Length(state){
      return state.new_train.length === 0;
    },
    get_NewThsrArr_Length(state){
      return state.new_high_Speed_Rail.length === 0;
    },
  },


});

export default store;