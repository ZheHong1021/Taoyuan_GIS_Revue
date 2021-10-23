export default {
    namespaced: true,
    state:{
        bus_Choose:  {
            city: '桃園市',
            city_en: 'Taoyuan',
            routeUID: '',
            direction: 0,  // 預設順行
        },
        currentPage:{
            number: 0,
            row: 10,
        },
        api_Route: [],
        api_Stops: [],
        api_StopOfRoute: [],
        accordion_Active: null,
        esimate_Arrival: {},
        current_Marker: {
            bus: new L.layerGroup(),
            polyline: new L.layerGroup(),
            stops: new L.layerGroup(),
        }
    },
    actions:{
        setApiRoute({commit}, payload){
            commit("setApiRoute", payload);
        },
        setApiStops({commit}, payload){
            commit("setApiStops", payload);
        },
        setStopOfRoute({commit}, payload){
            commit("setStopOfRoute", payload);
        },
        setEstimate({commit}, payload){
            commit("setEstimate", payload);
        },
        setCurrentPage({commit}, payload){
            commit("setCurrentPage", payload);
        },
    },
    mutations:{
        setApiRoute(state, payload){
            state.api_Route = payload;
        },
        setApiStops(state, payload){
            state.api_Stops = payload;
        },
        setStopOfRoute(state, payload){
            state.api_StopOfRoute = payload;
        },
        setEstimate(state, payload){
            state.esimate_Arrival = payload;
        },
        setCurrentPage(state, payload){
            state.currentPage.number = payload.number;
            state.currentPage.row = payload.row;
        },
        setBusAccordionIndex(state, payload){
            state.accordion_Active = payload;
          },
        change_BusDirection(state, payload){
            state.bus_Choose.direction = payload;
        },
        change_BusRouteUID(state, payload){
            state.bus_Choose.routeUID = payload;
        },

    },
    getters:{
        api_Route_Length(state){
            return state.api_Route.length;
        },
        api_Stops_Length(state){
            return state.api_Stops.length;
        },
    },
  }