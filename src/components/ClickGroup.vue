<template>
  <div class="absolute top-3 right-56 flex flex-col" style='z-index: 2'>
      <button 
            class="text-white text-xl font-bold rounded px-4 py-2" 
            :class="is_Tourism_Dialog ? 'bg-green-600' : 'bg-green-400'"
            @click="is_Tourism_Dialog = !is_Tourism_Dialog">
            景點旅客數據
        </button>
      <button 
            class="text-white text-xl font-bold rounded px-4 py-2 mt-2"
            :class="is_Transport_Dialog ? 'bg-red-600' : 'bg-red-400'"
            @click="is_Transport_Dialog = !is_Transport_Dialog">
            交通資訊
        </button>
      <button 
            class="text-white text-xl font-bold rounded px-4 py-2 mt-2"
            :class="is_NearBy_Dialog ? 'bg-blue-600' : 'bg-blue-400'"
            @click="is_NearBy_Dialog = !is_NearBy_Dialog">
            附近的交通工具
        </button>
  </div>

  <Dialog header="110年桃園觀光景點旅客數據" v-model:visible="is_Tourism_Dialog"  :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}">
        <div class="mb-2">
            <button @click="changeTourismMonth('九月')" class="mx-2 rounded px-4 py-2 text-white" :class="tourism_prop.month === '九月'? 'bg-red-500' : 'bg-red-300'" >九月</button>
            <button @click="changeTourismMonth('八月')" class="mx-2 rounded px-4 py-2 text-white" :class="tourism_prop.month === '八月'? 'bg-red-500' : 'bg-red-300'" >八月</button>
            <button @click="changeTourismMonth('七月')" class="mx-2 rounded px-4 py-2 text-white" :class="tourism_prop.month === '七月'? 'bg-red-500' : 'bg-red-300'" >七月</button>
            <button @click="changeTourismMonth('六月')" class="mx-2 rounded px-4 py-2 text-white" :class="tourism_prop.month === '六月'? 'bg-red-500' : 'bg-red-300'" >六月</button>
            <button @click="changeTourismMonth('五月')" class="mx-2 rounded px-4 py-2 text-white" :class="tourism_prop.month === '五月'? 'bg-red-500' : 'bg-red-300'" >五月</button>
            <button @click="changeTourismMonth('四月')" class="mx-2 rounded px-4 py-2 text-white" :class="tourism_prop.month === '四月'? 'bg-red-500' : 'bg-red-300'" >四月</button>
        </div>
        <div class="mb-2">
            <button @click="changeTourismTypeData('bar', '門票收入')" class="mx-2 rounded px-4 py-2 text-white" :class="tourism_prop.data === '門票收入'? 'bg-green-600' : 'bg-green-400'">門票收入</button>
            <button @click="changeTourismTypeData('line', '遊客人次')" class="mx-2 rounded px-4 py-2 text-white" :class="tourism_prop.data === '遊客人次'? 'bg-blue-600' : 'bg-blue-400'">遊客人次</button>
        </div>
         <TourismData :tourism_prop="tourism_prop"/>
    </Dialog>


    <Dialog header="桃園交通工具" v-model:visible="is_Transport_Dialog"  :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}">
        <Transport />
    </Dialog>

    <Dialog header="附近的交通工具" v-model:visible="is_NearBy_Dialog"  :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}">
        <section style="height: 100%; min-height: 640px;" class="flex flex-col items-center">
            <div class="my-4">
                <span class="bg-black text-white font-bold px-4 py-2 rounded-md mr-2">範圍</span>
                <Dropdown 
                    v-model="selectDistance" 
                    :options="distance" 
                    optionLabel="name" 
                    optionValue="code" 
                    placeholder="請輸入想搜尋的距離範圍" />
                <i v-if="is_search & selectDistance === ''" class="fas fa-exclamation-circle text-red-600 text-2xl cursor-pointer ml-2" title="必須選擇想搜尋的距離範圍"></i>
            </div>

            <div class="my-4 flex flex-col items-center">
                <div>
                    <button class="px-4 py-2 bg-green-300 rounded-md font-bold transition duration-300 hover:bg-green-600 hover:text-white" @click="search">開始搜尋</button>
                    <button class="ml-4 px-4 py-2 bg-gray-300 rounded-md font-bold transition duration-300 hover:bg-gray-600 hover:text-white" @click="clearSearch">清除搜尋</button>
                </div>
                <!-- <div class="my-4">
                    <button class="bg-blue-500 text-white font-bold px-4 py-2 mx-4 rounded-md">火車</button>
                    <button class="bg-blue-500 text-white font-bold px-4 py-2 mx-4 rounded-md">火車</button>
                    <button class="bg-blue-500 text-white font-bold px-4 py-2 mx-4 rounded-md">火車</button>
                </div> -->
            </div>

            <div class="w-full">
                <div class="my-4" v-if="neayBy_Station.train.length > 0">
                    <h1 class="mb-4"> <span class="text-white bg-blue-700 rounded-md px-4 py-2 font-bold">火車站</span></h1>    
                      
                    <p class="text-base font-bold my-2"
                        v-for="(item, index) in neayBy_Station.train" 
                        :key="index" >
                        {{item.StationName.Zh_tw}}火車站
                        <i  @click="goTo(item.StationPosition.PositionLat, item.StationPosition.PositionLon)"
                            class="fas fa-directions text-xl cursor-pointer hover:text-indigo-300 transition duration-500" title="前往該站牌"></i>
                    </p>
                </div>
                

                <div class="my-2" v-if="neayBy_Station.thsr.length > 0">
                    <h1 class="mb-4"> <span class="text-white bg-blue-700 rounded-md px-4 py-2 font-bold w-auto">高鐵站</span></h1>  
                    <p class="text-base font-bold my-2"
                        v-for="(item, index) in neayBy_Station.thsr" 
                        :key="index" >
                        {{item.StationName.Zh_tw}}高鐵站
                        <i  @click="goTo(item.StationPosition.PositionLat, item.StationPosition.PositionLon)"
                            class="fas fa-directions text-xl cursor-pointer hover:text-indigo-300 transition duration-500" title="前往該站牌"></i>
                    </p>
                </div>

                <div class="my-2" v-if="neayBy_Station.bus.length > 0">
                    <h1 class="mb-4"> <span class="text-white bg-blue-700 rounded-md px-4 py-2 font-bold w-auto">公車站牌</span></h1>  
                    <p class="text-base font-bold my-2"
                        v-for="(item, index) in neayBy_Station.bus" 
                        :key="index" >
                        {{item.StopName.Zh_tw}}公車站
                        <i  @click="goTo(item.StopPosition.PositionLat, item.StopPosition.PositionLon)"
                            class="fas fa-directions text-xl cursor-pointer hover:text-indigo-300 transition duration-500" title="前往該站牌"></i>
                    </p>
                </div>
            </div>

        </section>

    </Dialog>
</template>

<script>
import { computed, reactive, ref } from '@vue/reactivity'
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import TourismData from '@/components/Tourism/TourismData';
import Transport from '@/components/Transportation/Transport';
import { useStore } from 'vuex';
import 'leaflet-fontawesome-markers';
import "leaflet-fontawesome-markers/L.Icon.FontAwesome.css";
import {API_Train_NearByStation, API_THSR_NearByStation, API_Taoyuan_NearByBusStop} from '@/api/api.js'
export default {
    name: 'ClickGroup',
    components:{
        Dialog: Dialog,
        Dropdown: Dropdown,
        TourismData: TourismData,
        Transport: Transport,
    },
    setup(){
        const store = useStore();
        const is_Tourism_Dialog = ref(false);
        const is_Transport_Dialog = ref(false);
        const is_NearBy_Dialog = ref(false);


        const selectDistance = ref('');
        const distance = ref([
            {name: '200公尺', code: 200},
            {name: '500公尺', code: 500},
            {name: '1公里', code: 1000},
            {name: '1500公尺', code: 1500},
            {name: '2公里', code: 2000},
        ]);

        const neayBy_Station = reactive({
            train: [],
            thsr: [],
            bus: [],
        });

        const tourism_prop = computed(()=> store.state.tourism_Data);
        
        const changeTourismMonth = (month)=>{
            store.dispatch("changeTourismMonth", month);
        }
        const changeTourismTypeData = (type, data)=>{
            store.dispatch("changeTourismTypeData", {type: type, data: data});
        }

        const is_search = ref(false);

        let train_Marker = L.layerGroup();
        let thsr_Marker = L.layerGroup();
        let bus_Marker = L.layerGroup();
        let pos_circle = new L.circle();
        const clearSearch = ()=>{
            is_search.value = false;
            selectDistance.value = '';
            neayBy_Station.train = [];
            neayBy_Station.thsr = [];
            neayBy_Station.bus = [];
            resetSearch();
        }

        const resetSearch = ()=>{
            train_Marker.clearLayers();
            thsr_Marker.clearLayers();
            bus_Marker.clearLayers();
            store.state.map.removeLayer(pos_circle);
        }
        const search = ()=>{
            resetSearch();
            is_search.value = true;
            if(selectDistance.value !== ""){
                pos_circle = new L.circle(store.state.user_Pos, {
                    color: '#f5cd79',  // 邊框顏色
                    fillColor: '#f7d794', // 填滿顏色
                    fillOpacity: 0.5, // 填滿透明度
                    radius: selectDistance.value + 50  // 圓的半徑
                }).addTo(store.state.map);
    
                Promise.all([
                    API_Train_NearByStation({
                        lat: store.state.user_Pos.lat,
                        lng: store.state.user_Pos.lng,
                        distance: selectDistance.value,
                    }),
                    API_THSR_NearByStation({
                        lat: store.state.user_Pos.lat,
                        lng: store.state.user_Pos.lng,
                        distance: selectDistance.value,
                    }),
                    API_Taoyuan_NearByBusStop({
                        lat: store.state.user_Pos.lat,
                        lng: store.state.user_Pos.lng,
                        distance: selectDistance.value,
                    }),
                ]).then( (res) => {
                    console.log(res);
                        neayBy_Station.train = res[0].data;
                        neayBy_Station.thsr = res[1].data;

                        neayBy_Station.train.forEach((item)=>{
                            L.marker([item.StationPosition.PositionLat, item.StationPosition.PositionLon],{
                                    icon: L.icon.fontAwesome({
                                        iconClasses: "fa fa-train",
                                        markerColor: "#eb4d4b",
                                        iconColor: "#FFF",
                                        // use XY offsets to nudge positioning of icons, negative accepted
                                        iconXOffset: -1,
                                        iconYOffset: 0
                                    })
                                })
                            .bindPopup(`
                                <h1>${item.StationName.Zh_tw}火車站</h1>
                            `).addTo(train_Marker);
                        })
                        neayBy_Station.thsr.forEach((item)=>{
                            L.marker([item.StationPosition.PositionLat, item.StationPosition.PositionLon],{
                                    icon: L.icon.fontAwesome({
                                        iconClasses: "fas fa-subway",
                                        markerColor: "#be2edd",
                                        iconColor: "#FFF",
                                        // use XY offsets to nudge positioning of icons, negative accepted
                                        iconXOffset: -1,
                                        iconYOffset: 0
                                    })
                                })
                            .bindPopup(`
                                <h1>${item.StationName.Zh_tw}高鐵站</h1>
                            `).addTo(thsr_Marker);
                        })
    
                        let exist = [];
                        neayBy_Station.bus = res[2].data.filter((item)=>{
                            // 不存在則加入
                            if(!exist.includes(item.StopName.Zh_tw)){
                                let html = "";
                                let list = store.state.module_Bus.stationID_List[item.StationID];
                                list.forEach((element, index)=>{
                                    html = html +  `<p class = 'text-base font-bold m-0 p-0'>行經路線${index+1} : ${element.RouteName.Zh_tw}</p>`
                                })
                                exist.push(item.StopName.Zh_tw);
                                L.marker([item.StopPosition.PositionLat, item.StopPosition.PositionLon],{
                                    icon: L.icon.fontAwesome({
                                        iconClasses: "fa fa-bus",
                                        markerColor: "#778ca3",
                                        iconColor: "#FFF",
                                        iconXOffset: -2,
                                        iconYOffset: 0
                                    })
                                }).bindPopup(`
                                    <h1>${item.StopName.Zh_tw} 公車站牌</h1>
                                    ${html}
                                `)
                                .addTo(bus_Marker);
                            return true;
                            }
                            return false;
                        });

                        train_Marker.addTo(store.state.map);
                        thsr_Marker.addTo(store.state.map);
                        bus_Marker.addTo(store.state.map);
    
                    }).catch( (err)=>{
                        console.log(err);
                    })
            }
        }
        
        const goTo = (lat, lng)=>{
            store.state.map.flyTo([lat, lng]);
        }

        return {tourism_prop, is_Tourism_Dialog, is_Transport_Dialog, is_NearBy_Dialog, neayBy_Station, selectDistance, distance, is_search,
            changeTourismMonth, changeTourismTypeData, search, clearSearch, goTo}
    }
}
</script>

<style>

</style>