<template>
  <Marker 
      v-if="data.length > 0 && stationID_List_Length !== 0"
      :data="data" 
      overlay_title="公車站" 
      group='<i class="fas fa-map-marker-alt text-red-500"></i> 交通資訊'
      prefix="StopPosition"
      lat="PositionLat" 
      lng="PositionLon"
      iconClass="fa fa-bus"
      markerColor="#009432"
      :offsetX="-2"  />

</template>

<script>
import {  ref } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import {API_Taoyuan_BusStop, API_Taoyuan_BusStation} from '@/api/api.js'
import Marker from '@/components/Marker'
import { useStore } from 'vuex';
export default {
    name: "Bus",
    components: {
        Marker: Marker,
    },
    setup(){
        const store = useStore();
        // 地圖標記
        const data = ref([]);
        const stationID_List_Length = ref(0);

        onMounted(async()=>{
            await API_Taoyuan_BusStop().then((res)=>{
                let exist = [];
                data.value = res.data.filter((item)=>{
                    // 不存在則加入
                    if(!exist.includes(item.StopName.Zh_tw)){
                        exist.push(item.StopName.Zh_tw);
                    return true;
                    }
                    return false;
                });
            }).catch((err)=>{
                console.log('連線異常:' + err);
            });
            
            const result = {}
            await API_Taoyuan_BusStation().then( (res)=>{
                for (const item of res.data) {
                    result[item.StationID] = item.Stops;
                }
                store.dispatch('module_Bus/set_StationID', result);
            }).catch((err)=>{
                console.log('連線異常:' + err);
            });
            //  console.log(Object.keys(store.state.module_Bus.stationID_List).length);
            //  console.log(Object.keys(store.state.module_Bus.stationID_List).length !== 0);
            stationID_List_Length.value = Object.keys(store.state.module_Bus.stationID_List).length;
        })


        
        

        return {data, stationID_List_Length}
    }
}
</script>

<style>

</style>