<template>
    <Marker 
      :data="Taoyuan_view.infos" 
      overlay_title="景點" 
      group='<i class="fas fa-map-marker-alt text-blue-500"></i> 旅遊資訊'
      lat="Py" 
      lng="Px"
      iconClass="fa fa-suitcase-rolling"
      markerColor="#2980b9"
        />

    <Marker 
      :data="Taoyuan_hotel.infos" 
      overlay_title="住宿" 
      group='<i class="fas fa-map-marker-alt text-blue-500"></i> 旅遊資訊'
      lat="Py" 
      lng="Px"
      iconClass="fas fa-hotel"
      markerColor="#9b59b6"
      :offsetX="-3"  />
    
    <Marker 
      :data="Taoyuan_Custom.infos" 
      overlay_title="消費" 
      group='<i class="fas fa-map-marker-alt text-blue-500"></i> 旅遊資訊'
      lat="Py" 
      lng="Px"
      iconClass="fas fa-hand-holding-usd"
      markerColor="#ff793f"
      :offsetX="-3"  />
    



</template>

<script>
import Taoyuan_view from '@/assets/data/Taoyuan_view.json';
import Taoyuan_hotel from '@/assets/data/Taoyuan_Hotel.json';
import Taoyuan_Custom from '@/assets/data/Taoyuan_Custom.json';
import Marker from "@/components/Marker";
export default {
    name: "View",
    components:{
        Marker: Marker,
    },
    setup(){
        


        return {Taoyuan_view, Taoyuan_hotel, Taoyuan_Custom}
    }
}
</script>

<style>

</style>