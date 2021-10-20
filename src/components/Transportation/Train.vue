<template>
  <Marker 
      v-if="data.length > 0"
      :data="data" 
      overlay_title="火車站" 
      group='<i class="fas fa-map-marker-alt text-blue-500"></i> 交通資訊'
      prefix="StationPosition"
      lat="PositionLat" 
      lng="PositionLon"
      iconClass="fa fa-train"
      :offsetX="-1" />

</template>

<script>
import { ref } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import {API_Train_Station} from '@/api/api.js'
import Marker from '@/components/Marker'
export default {
    name: "Train",
    components: {
        Marker: Marker,
    },
    setup(){

        // 地圖標記
        const data = ref([])
        onMounted(async()=>{
            API_Train_Station().then((res)=>{
                data.value = res.data;
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