<template>
  <Marker 
      v-if="data.length > 0"
      :data="data" 
      overlay_title="公車站" 
      group='<i class="fas fa-map-marker-alt text-blue-500"></i> 交通資訊'
      prefix="StopPosition"
      lat="PositionLat" 
      lng="PositionLon"
      iconClass="fa fa-bus"
      markerColor="#009432"
      :offsetX="-2"  />

</template>

<script>
import { ref } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import {API_Taoyuan_BusStation} from '@/api/api.js'
import Marker from '@/components/Marker'
export default {
    name: "Bus",
    components: {
        Marker: Marker,
    },
    setup(){
        // 地圖標記
        const data = ref([])
        onMounted(async()=>{
            API_Taoyuan_BusStation().then((res)=>{
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
        })


        
        

        return{data}
    }
}
</script>

<style>

</style>