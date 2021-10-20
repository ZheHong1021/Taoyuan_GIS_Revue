<template>

    <transition name="fade">
      <Loading style="z-index: 1001;" v-if="showLoading"></Loading>
    </transition>

    <div id="map" v-show="!showLoading"></div>
  <District />
  <Map :init="init_Map"/>
  <Thsr />
  <Bus />
  <Train />
</template>

<script>
import {  reactive, ref } from '@vue/reactivity'
import Map from '@/components/Map'
import District from '@/components/District'
import Loading from '@/components/Loading';
import { onMounted } from '@vue/runtime-core';
import Thsr from '@/components/Transportation/Thsr';
import Bus from '@/components/Transportation/Bus';
import Train from '@/components/Transportation/Train';

export default {
  name: "App",
  components: {
    Map: Map,
    District: District,
    Loading: Loading,
    Thsr: Thsr,
    Bus: Bus,
    Train: Train,
  },
  setup(){

    // 地圖初始設定
    const init_Map = reactive({
      center: {
        lat: 24.926199764623497, 
        lng: 121.43325805664064
      },
      zoom: 10,
      maxZoom: 18,
    })

  const showLoading = ref(false);
  const loading_Time = 2; 
  onMounted(()=>{
    showLoading.value = true;
    setTimeout(() => {
      showLoading.value = false;
    }, loading_Time * 1000);
  })

    return {init_Map, showLoading}
  }
}
</script>

<style>
*{
  padding: 0;
  margin: 0;
}

#map{
  width: 100%;
  height: 100vh;
  z-index: 1;
}


.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-leave, .fade-enter-to {
  opacity: 1;
}

.fade-enter-active {
  transition: all 0.3s ease;
}
.fade-leave-active {
  transition: all 0.8s ;
}

</style>