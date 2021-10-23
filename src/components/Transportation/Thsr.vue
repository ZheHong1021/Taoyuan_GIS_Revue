<template>
    <Marker 
      v-if="data.length > 0"
      :data="data" 
      overlay_title="高鐵站" 
      group='<i class="fas fa-map-marker-alt text-red-500"></i> 交通資訊'
      prefix="StationPosition"
      lat="PositionLat" 
      lng="PositionLon"
      iconClass="fas fa-subway"
      markerColor="#8e44ad"
      :offsetX="-1" />


</template>

<script>
import { ref } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import {API_THSR_Station} from '@/api/api.js'
import Marker from '@/components/Marker'
import { useStore } from 'vuex';
export default {
    name: "Thsr",
    components: {
        Marker: Marker,
    },
    setup(){
        const store = useStore();
        // 地圖標記
        const data = ref([])
        onMounted(async()=>{
            API_THSR_Station().then((res)=>{
                store.commit('setHighSpeedStation', res.data);
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