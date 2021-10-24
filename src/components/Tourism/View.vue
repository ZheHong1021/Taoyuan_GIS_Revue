<template>
    <Marker 
      v-if="length.view > 0"
      :data="Taoyuan_view.infos" 
      overlay_title="景點" 
      group='<i class="fas fa-map-marker-alt text-blue-500"></i> 旅遊資訊'
      lat="Py" 
      lng="Px"
      iconClass="fa fa-suitcase-rolling"
      markerColor="#2980b9"
        />

    <Marker 
      v-if="length.hotel > 0"
      :data="Taoyuan_hotel.infos" 
      overlay_title="住宿" 
      group='<i class="fas fa-map-marker-alt text-blue-500"></i> 旅遊資訊'
      lat="Py" 
      lng="Px"
      iconClass="fas fa-hotel"
      markerColor="#9b59b6"
      :offsetX="-3"  />
    
    <Marker 
      v-if="length.custom > 0"
      :data="Taoyuan_Custom.infos" 
      overlay_title="消費" 
      group='<i class="fas fa-map-marker-alt text-blue-500"></i> 旅遊資訊'
      lat="Py" 
      lng="Px"
      iconClass="fas fa-hand-holding-usd"
      markerColor="#ff793f"
      :offsetX="-3"  />

    <Marker 
      v-if="length.shopping_Area > 0"
      :data="shopping_Area" 
      overlay_title="商圈" 
      group='<i class="fas fa-map-marker-alt text-blue-500"></i> 旅遊資訊'
      lat="longitude" 
      lng="latitude"
      iconClass="fa fa-shopping-bag"
      markerColor="#f7b731"
      :offsetX="-1"  />
    



</template>

<script>
import Taoyuan_view from '@/assets/data/Taoyuan_view.json';
import Taoyuan_hotel from '@/assets/data/Taoyuan_Hotel.json';
import Taoyuan_Custom from '@/assets/data/Taoyuan_Custom.json';
import Marker from "@/components/Marker";
import { onMounted, reactive, ref } from '@vue/runtime-core';
import axios from 'axios';
export default {
    name: "View",
    components:{
        Marker: Marker,
    },
    setup(){
        const length = reactive({
          view: 0,
          hotel: 0,
          custom: 0,
          shopping_Area: 0,
        })

        const shopping_Area = ref();
        onMounted(()=>{
          length.view = Taoyuan_view.infos.length; 
          length.hotel = Taoyuan_hotel.infos.length; 
          length.custom = Taoyuan_Custom.infos.length; 
          
          // console.log(length);

          // 商圈
          axios.get('https://arcane-citadel-34528.herokuapp.com/api/shopping')
          .then(response => {
              shopping_Area.value = response.data.data;
              length.shopping_Area = shopping_Area.value.length; 
          })
          .catch( err => {
              console.log('error=' + err);
          })

        })

        return {Taoyuan_view, Taoyuan_hotel, Taoyuan_Custom, length, shopping_Area}
    }
}
</script>

<style>

</style>