<template>
    <loading v-model:active="isLoading"
      :is-full-page="true"
      loader= "dots"/>
  <section  class="w-full flex flex-col justify-center items-center" >
    <h1 class="text-center text-3xl font-bold my-2">公車資訊查詢</h1>
    <div class="my-3 w-full" v-if="route_Length > 0">
        <div class="w-full my-4 p-1 rounded-full border-2 border-gray-700 flex items-center">
          <label for="searchBar"><i class="fas fa-search p-1 text-lg cursor-pointer w-1/12 hover:text-blue-400"></i></label>
          <input id="searchBar" v-model="filter_Search" type="text" placeholder="查詢路線" class="w-10/12 mx-2 bg-transparent text-black outline-none h-full text-lg"/>
          <i class="fas fa-times p-1 text-lg cursor-pointer w-1/12 hover:text-blue-400" v-if="filter_Search !== ''" @click="filter_Search = ''"></i>
        </div>
          <span v-if="filter_Route().length === 0" class="text-base font-bold mb-4">目前找不到您所搜尋的路線，請重新搜尋。</span>
        <Accordion class="w-full" @tab-open="open_Route" @tab-close="close_Route" :activeIndex="$store.getters['module_Bus/api_Stops_Length'] !==0 ? $store.state.module_Bus.accordion_Active : null">
            <!-- Page逐一顯示，透過總頁數 % 目前一次顯示的數量，=> 假設共138頁，最後一頁 index只會跑到 8 -->
            <AccordionTab v-for="(_,index) in pageRow_Route() " :key="index">
              <!-- Header -->
              <template #header>
                <i class="fas fa-bus"></i>
                <label id="routeName" class="mx-2 mr-6"> {{ filter_Route()[currentPage * 10 + index].RouteName.Zh_tw  }} </label>
                <span>
                  <label>{{filter_Route()[currentPage * 10 + index].SubRoutes[0].Headsign }}</label>
                </span>
              </template>
              <!-- Body -->
                <div v-show="filter_Route().length !== 0">
                    <!-- 用 sticky滾動時會一直存在 -->
                    <div id="route_Header" class="sticky" style="top: 20px">
                        <span class="rounded p-2 bg-purple-700 text-white font-bold text-lg " >下次更新時間: {{update_Count}}</span>
                        <span class="rounded p-2 bg-red-500 text-white font-bold text-lg ml-3 cursor-pointer" @click="refresh_Route_Info(bus_Choose.direction)">刷新</span>
                        <span class="rounded p-2 bg-green-400 text-white font-bold text-lg ml-3 cursor-pointer" @click="direct()">導引</span>
                        <div class="w-full flex justify-center mb-6 mt-4">
                            <Button @click="refresh_Route_Info(0)" :label="'往' + filter_Route()[currentPage * 10 + index].DestinationStopNameZh" class="font-bold p-button-raised"
                            :class="bus_Choose.direction !== 0 ? 'p-button-text' : ''" />
                            <Button @click="refresh_Route_Info(1)" :label="'往' + filter_Route()[currentPage * 10 + index].DepartureStopNameZh" class="font-bold p-button-raised"
                            :class="bus_Choose.direction !== 1 ? 'p-button-text' : ''" />
                        </div>
                    </div>
                    <!-- 一定要有該Object才能顯示，否則會 Error -->
                    <div v-if="object_isEmpty($store.state.module_Bus.esimate_Arrival) === false && isLoading === false">
                        <div v-for="(stop, index) in $store.state.module_Bus.api_StopOfRoute" :key="index">
                        <!-- <div v-for="(stop, index) in bus_Api.bus_Stop" :key="index"> -->
                            <!-- 預估到站時間( 1 min > : 進站中； 3 min >: 準備進站； 3 min<: 正常顯示時間； 沒有預估時間: 顯示目前站點狀況 ) -->
                            <h1 class="my-4">
                                <span 
                                    v-if="$store.state.module_Bus.esimate_Arrival[stop.StopUID].estimateTime >= 0 && Math.ceil($store.state.module_Bus.esimate_Arrival[stop.StopUID].estimateTime / 60) <= 3"
                                    class="px-4 py-1 rounded text-white"
                                    :class="Math.ceil($store.state.module_Bus.esimate_Arrival[stop.StopUID].estimateTime / 60) <= 1 ? 'bg-red-500' : 'bg-yellow-500'"
                                    v-text="Math.ceil($store.state.module_Bus.esimate_Arrival[stop.StopUID].estimateTime / 60) <= 1 ? '進站中' : '準備進站'">
                                </span>
                                <span 
                                    v-else-if="Math.ceil($store.state.module_Bus.esimate_Arrival[stop.StopUID].estimateTime / 60)"
                                    class="px-4 py-1 rounded text-white bg-green-500">
                                    {{Math.ceil($store.state.module_Bus.esimate_Arrival[stop.StopUID].estimateTime / 60) + '分' }}
                                </span>
                                <span 
                                    v-else
                                    class="px-4 py-1 rounded text-white bg-gray-500">
                                    {{ $store.state.module_Bus.esimate_Arrival[stop.StopUID].nextBusTime ? nextBusTimeConfig($store.state.module_Bus.esimate_Arrival[stop.StopUID].nextBusTime) : StopStatus[$store.state.module_Bus.esimate_Arrival[stop.StopUID].stopStatus] }}
                                </span>

                                <label class="ml-2">
                                {{ stop.StopName.Zh_tw }}
                                <span class="p-2 ml-2 rounded bg-indigo-300" 
                                    v-if="current_StopUID_Arr.includes(stop.StopUID) && current_BusInStop">
                                    {{ current_BusInStop[current_StopUID_Arr.indexOf(stop.StopUID)].PlateNumb }}
                                </span>
                                </label>
                            </h1>
                        </div>
                    </div>
                </div>
              </AccordionTab>
        </Accordion>

      <Paginator :pageLinkSize="4" :rows="10" :totalRecords="filter_Route().length" :rowsPerPageOptions="[10,20,30]" @page="onPage($event)"
          template="PrevPageLink PageLinks  NextPageLink RowsPerPageDropdown">
           <template #right="slotProps">
             <h1 class="mt-3">
              單頁顯示數量: {{slotProps.state.rows}}，總路線數量: {{ filter_Route().length }}
             </h1>
          </template>
      </Paginator>
      </div>

  </section>



</template>

<script>
import { computed, reactive, ref } from '@vue/reactivity'
import 'vue-loading-overlay/dist/vue-loading.css';
import 'leaflet-fontawesome-markers';
import "leaflet-fontawesome-markers/L.Icon.FontAwesome.css";
import { API_Bus_Route, API_Bus_DisplayStopOfRoute, API_Bus_EstimatedTimeOfArrival, API_Bus_RealTimeByFrequency,  API_Bus_RealTimeNearStop} from "../api/api.js"; 
import Loading from 'vue-loading-overlay';
import Button from 'primevue/button';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Paginator from 'primevue/paginator';
import { useStore } from 'vuex' // Composition API
import { useRoute } from 'vue-router';
import { onMounted, onUnmounted } from '@vue/runtime-core';

export default {
  components: {
    Loading: Loading,
    Button: Button,
    Accordion: Accordion,
    AccordionTab: AccordionTab,
    Paginator: Paginator,
  },
  setup(){
      const store = useStore();
      const route = useRoute();
      const map = store.state.map;
      // 預估時間
      const esimate_Arrival = reactive({})
      // 搜尋 filter
      const filter_Search = ref('')
      // Page Config
      // const currentPage = ref( 0 );
      // const currentPageRow = ref( 10 ); // 一次顯示幾筆(10/20/30)
      const currentPage = ref( store.state.module_Bus.currentPage.number );
      const currentPageRow = ref( store.state.module_Bus.currentPage.row ); // 一次顯示幾筆(10/20/30)


      // Interval Config
      let updateInterval;
      let updateInterval_Count;
      let update_Time = 30; // 更新時間
      const update_Count = ref(30);  // 更新倒數(扣到0再變回 30)

      // Loading Config
      const isLoading = ref(false);

      const bus_Choose = ref({});
      bus_Choose.value = store.state.module_Bus.bus_Choose;

      // API Respones
      const bus_Api = reactive({
        total_Stops: [],
        bus_stop: [], // 整理過的
      })
      const current_StopUID_Arr = ref([])
      const current_BusInStop = ref([]);
      const current_BusInPos = ref([]);


      const activeIndex = ref(null);
      const route_Length = computed(()=> store.getters['module_Bus/api_Route_Length']);
      onMounted(async()=>{
        if(route_Length.value === 0 ){
          // 載入該縣市所有路線的 API
            await API_Bus_Route(bus_Choose.value.city_en)
              .then( (res)=>{
                store.dispatch('module_Bus/setApiRoute', res.data);
            }).catch( (err)=>{
                console.log('連線異常:' + err);
                error_Request();
            })        
        }else{
          refresh_Route_Info(store.state.module_Bus.bus_Choose.direction);
        }
      })

      // [0:'正常',1:'尚未發車',2:'交管不停靠',3:'末班車已過',4:'今日未營運']   
      const StopStatus  = reactive(['正常', '尚未發車', '暫不停靠', '末班車已過', '今日停駛'])
      
      // 顯示選取路線的所有站點， DisplayStopOfRoute為整理好的總路線站點(只有順行、逆行兩條)
      const get_DisplayStopOfRoute = ()=>{
        // console.log(store.getters['module_Bus/api_Stops_Length']);
        // 預估時間
        for(let index = 0; index < store.getters['module_Bus/api_Stops_Length'] ; index++){
          // 子路線的行駛方向要跟 direction相同，才能紀錄
            if(store.state.module_Bus.api_Stops[index].Direction === bus_Choose.value.direction){
              bus_Api.bus_stop = store.state.module_Bus.api_Stops[index].Stops;
              store.dispatch('module_Bus/setStopOfRoute', bus_Api.bus_stop);
            }
          }
          get_EstimatedTimeOfArrival();
          get_Current_BusPosition();
      }

      // 開啟 Accordion，匯入該路線API資訊
      const open_Route = async (event)=>{
        map.removeLayer(polyLine_Bus);
        bus_Route_Marker.clearLayers();
        

        // 抓取開啟的 Tab =>為陣列中[頁數 *10 + 該頁的第幾個]
        bus_Choose.value.routeUID = filter_Route()[currentPage.value*10 + event.index].RouteUID
        store.commit('module_Bus/setBusAccordionIndex', event.index); // 打開之後透過 Vuex儲存目前第幾個打開
            await API_Bus_DisplayStopOfRoute( {city: bus_Choose.value.city_en, routeUID: bus_Choose.value.routeUID} )
            .then( (res)=>{
              // store.state.module_Bus_api_Stops = res.data; // 儲存所有站點
              store.dispatch('module_Bus/setApiStops', res.data);
              refresh_Route_Info(0);  // 起始載入，行駛方向為順向
              show_Bus_Marker_And_PolyLine();
            }).catch( (err)=>{
                console.log('連線異常:' + err);
                error_Request();
            })
      }

      // 關閉 Accordion(中斷計時、清除地圖座標)
      const close_Route = () =>{
        map.removeLayer(polyLine_Bus);
        bus_Route_Marker.clearLayers();
        Current_Marker_Bus.clearLayers()
        // bus_Choose.value.routeUID = "";
        store.commit('module_Bus/change_BusRouteUID', "");  // 更新行駛方向
        store.commit('module_Bus/setApiStops', []);  // 重新
        clearInterval(updateInterval);
        clearInterval(updateInterval_Count);
      }

      onUnmounted(()=>{
        if(route.path !== '/bus'){
          console.log('out');
          close_Route();
        }
      })

      

      // 觸發條件(1:打開 Accordion、 2: 點擊改變順/逆行按鈕)
      const refresh_Route_Info = (direction)=>{
        Current_Marker_Bus.clearLayers()
        // bus_Choose.value.direction = direction;  // 更新行駛方向
        store.commit('module_Bus/change_BusDirection', direction);  // 更新行駛方向
        // 先刷新資料(重新計時、站點更新、座標清除)
        get_DisplayStopOfRoute();
        clearInterval(updateInterval)
        clearInterval(updateInterval_Count)
        update_Count.value = update_Time; // 重新讀秒
        current_StopUID_Arr.value = [];

        // Loading Animation .5s
        isLoading.value = true;
          setTimeout(()=>{
            // 確定預估時間真的有載入
              isLoading.value = false;

              // 倒數讀秒
              updateInterval_Count = setInterval(()=>{
                  update_Count.value--;
                  //  (這樣只要改 update_Time之後，全部都會改了)
                  if(update_Count.value === 0) update_Count.value = update_Time;
              }, 1000)
              // 刷新站點資訊
              updateInterval = setInterval(()=>{
                get_DisplayStopOfRoute();
                get_Current_BusPosition();
                current_StopUID_Arr.value = [];
              }, update_Time * 1000);
          }, 1000)
      }

      // 將得到的 API新建成一個物件，利用站點的StopUID來去呼叫該站點的資訊(估計時間、車班號)
      const get_EstimatedTimeOfArrival = async()=>{
          await API_Bus_EstimatedTimeOfArrival({
              city: bus_Choose.value.city_en, 
              routeUID: bus_Choose.value.routeUID
          })
              .then( (res)=>{
                Object.entries(res.data).forEach(([, value]) => {
                  // 目前行駛(順行: 1；逆行: 0)；未行駛: 255
                  if(value.Direction == bus_Choose.value.direction || value.Direction == '255'){
                    // 情況1: 沒有在Object中，直接紀錄
                    // 情況2: 有在 Object中，判斷有預估時間或到站時間最短者優先紀錄
                    // 情況3: 有在 Object中，但記錄的時間較短 ->剔除
                    // 情況3: 有在 Object中，無預估時間 ->剔除
                    if( Object.prototype.hasOwnProperty.call(esimate_Arrival, value.StopUID) ){
                      if(esimate_Arrival[value.StopUID] == 'underfined' || esimate_Arrival[value.StopUID].estimateTime < value.EstimateTime){
                        return;
                      }
                    }
                      esimate_Arrival[value.StopUID] = {
                        estimateTime: value.EstimateTime,  // 預估時間
                        stopStatus: value.StopStatus,   // 行駛情況
                        nextBusTime: value.NextBusTime ? value.NextBusTime : ''
                      };
                  }
                });

                store.dispatch('module_Bus/setEstimate', esimate_Arrival);

            }).catch( (err)=>{
                console.log('連線異常:' + err);
                error_Request();
            });
      }

      // let Current_Marker_Bus = new L.layerGroup();
      let Current_Marker_Bus = store.state.module_Bus.current_Marker.bus;

      // 抓到目前公車所在位置
      const get_Current_BusPosition = ()=>{
        // 記得要初始化
        Current_Marker_Bus.clearLayers()
        Promise.all([
          API_Bus_RealTimeByFrequency({
              city : store.state.module_Bus.bus_Choose.city_en, 
              routeUID : store.state.module_Bus.bus_Choose.routeUID,
              direction : store.state.module_Bus.bus_Choose.direction,
          }),
          API_Bus_RealTimeNearStop({
              city : store.state.module_Bus.bus_Choose.city_en, 
              routeUID : store.state.module_Bus.bus_Choose.routeUID,
              direction : store.state.module_Bus.bus_Choose.direction,
          })
        ])
        .then( (response) => {
            current_BusInPos.value = response[0].data
            current_BusInStop.value = response[1].data
            console.log(current_BusInStop.value);
    

            current_BusInStop.value.forEach((data)=>{
              if(data.Direction === store.state.module_Bus.bus_Choose.direction){
                  current_StopUID_Arr.value.push(data.StopUID);
              }
            })
            current_BusInPos.value.forEach((data)=>{
              if(data.Direction === store.state.module_Bus.bus_Choose.direction){
                  L.marker( [data.BusPosition.PositionLat, data.BusPosition.PositionLon],{
                      icon: L.icon.fontAwesome({
                          iconClasses: "fas fa-bus",
                          markerColor: "#eb3b5a",
                          iconColor: "#FFF",
                          // use XY offsets to nudge positioning of icons, negative accepted
                          iconXOffset: -2,
                          iconYOffset: 0
                      })
                  }).addTo(Current_Marker_Bus)
                  .bindPopup(`<h1 class='text-xl font-bold text-red-500'>目前公車位置 - ${data.PlateNumb}</h1>`);
                  Current_Marker_Bus.addTo(map);
              }
            });
        })
      }
      // let bus_Route_Marker = new L.layerGroup();
      // let polyLine_Bus = new L.layerGroup();
      let bus_Route_Marker = store.state.module_Bus.current_Marker.stops;
      let polyLine_Bus = store.state.module_Bus.current_Marker.polyline;

      let marker_PolyLine_arr = [];
      const show_Bus_Marker_And_PolyLine = ()=>{
          marker_PolyLine_arr = []  // 紀錄 PolyLine的 [[緯度1, 經度1], [緯度2, 經度2], ......]
          Object.entries(store.state.module_Bus.api_StopOfRoute).forEach(([, value]) => {
            marker_PolyLine_arr.push([value.StopPosition.PositionLat, value.StopPosition.PositionLon]);
            L.marker([value.StopPosition.PositionLat, value.StopPosition.PositionLon],{
                icon: L.icon.fontAwesome({
                    iconClasses: "fas fa-bus",
                    markerColor: "#4b7bec",
                    iconColor: "#FFF",
                    // use XY offsets to nudge positioning of icons, negative accepted
                    iconXOffset: -2,
                    iconYOffset: 0
                })
            }).bindPopup(`
              <h2 class='text-xl px-4 py-2'>No.${value.StopSequence}_${value.StopName.Zh_tw}</h2>
            `).addTo(bus_Route_Marker);
          }); 
          bus_Route_Marker.addTo(map);
          polyLine_Bus = new L.Polyline(marker_PolyLine_arr, {
              smoothFactor: 1,
              className: 'bus_polyline'
          }).addTo(map);
      }


      // 導引 Click Event
      const direct = ()=>{
        // Stop Array
        const stop = bus_Api.bus_stop
        let start_Lat = stop[0].StopPosition.PositionLat;
        let start_Lng = stop[0].StopPosition.PositionLon;
        let end_Lat =   stop[stop.length - 1].StopPosition.PositionLat;
        let end_Lng =   stop[stop.length - 1].StopPosition.PositionLon;
        map.fitBounds([
          [start_Lat, start_Lng],
          [end_Lat, end_Lng]
        ]);
      }
        // Page Event
        const onPage = (event)=>{
            console.log(event);
            currentPage.value = event.page;
            currentPageRow.value = event.rows;
            store.dispatch('module_Bus/setCurrentPage', {number: currentPage.value, row: currentPageRow.value});
            store.commit('module_Bus/setBusAccordionIndex', null); // 關閉
            close_Route(); // 換頁時也初始化
        }
        
        // PageRow設定: 到最後一頁則顯示 總路線數量 - ( 第幾頁n * 單頁數量m )，其他都以單頁數量顯示
        const pageRow_Route = ()=> filter_Route().length - (currentPage.value * currentPageRow.value) > currentPageRow.value ? currentPageRow.value : filter_Route().length - (currentPage.value * currentPageRow.value)
        const object_isEmpty = (object)=> Object.keys(object).length === 0 ? true : false;
        const error_Request = ()=> confirm('連線異常，請重新整理，造成不便十分抱歉😥') ? location.reload() : ''

        // filter Search (只要搜尋文字有包含在路線名稱、起站、迄站則都會顯示)
        const filter_Route = ()=>  store.state.module_Bus.api_Route.filter((route)=> route.RouteName.Zh_tw.includes(filter_Search.value) || route.DepartureStopNameZh.includes(filter_Search.value) || route.DestinationStopNameZh.includes(filter_Search.value) ) 
        
        const nextBusTimeConfig = (date) => `${new Date(date).getHours()} : ${ new Date(date).getMinutes() >= 10 ? new Date(date).getMinutes() : '0' + new Date(date).getMinutes()}`

    return {isLoading, activeIndex, route_Length,  bus_Choose, bus_Api, currentPage, currentPageRow, StopStatus, esimate_Arrival, filter_Search,  update_Count, current_StopUID_Arr,
             open_Route, close_Route, onPage, object_isEmpty, refresh_Route_Info, direct, filter_Route, pageRow_Route, nextBusTimeConfig, current_BusInStop, current_BusInPos, show_Bus_Marker_And_PolyLine}
  }

}
</script>

<style>
.bus_polyline { 
	stroke: red;
}



</style>