<template>
  <div id="map"></div>

  <Map :init="init_Map" :here_Key="here_API"/>

    <Marker 
      v-if="data.train.length > 0"
      :data="data.train" 
      overlay_title="火車站" 
      prefix="StationPosition"
      lat="PositionLat" 
      lng="PositionLon"
      iconClass="fa fa-train"
      :offsetX="-1" />

    <Marker 
      v-if="data.thsr.length > 0"
      :data="data.thsr" 
      overlay_title="高鐵站" 
      prefix="StationPosition"
      lat="PositionLat" 
      lng="PositionLon"
      iconClass="fas fa-subway"
      markerColor="#8e44ad"
      :offsetX="-1" />

    <Marker 
      v-if="data.bus.length > 0"
      :data="data.bus" 
      overlay_title="公車站" 
      prefix="StopPosition"
      lat="PositionLat" 
      lng="PositionLon"
      iconClass="fa fa-bus"
      markerColor="#009432"
      :offsetX="-2"  />


</template>

<script>
import "leaflet/dist/leaflet.css";
import Map from '@/components/Map'
import Marker from '@/components/Marker'
import {  reactive } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core';
import {API_Train_Station, API_THSR_Station, API_Taoyuan_BusStation} from '@/api/api.js'

export default {
  name: "App",
  components: {
    Map: Map,
    Marker: Marker,
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

    const here_API = reactive({
      key: "qcwHTsJura1qAf9AT75Nvl5DoolyvxQdAJmu-1wGTWQ", // 您的 HERE APIKEY
      dataHubReadToken: "APa7WWjkRhGKor_kt7QPQQA", // 您的 Data Hub Token
      distrcitSpaceId: "5b0dSwmn", // 鄉鎮區界 Space ID
    })

    onMounted(async()=>{
      await get_Train();
      await get_Bus();
      await get_Thsr();
    })

    // 地圖標記
    const data = reactive({
      bus: [],
      train: [],
      thsr: [],
    })

    const get_Bus = ()=>{
      API_Taoyuan_BusStation().then((res)=>{
          let exist = [];
          data.bus = res.data.filter((item)=>{
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
    }
    const get_Train = ()=>{
      API_Train_Station().then((res)=>{
          data.train = res.data;
      }).catch((err)=>{
          console.log('連線異常:' + err);
      });
    }
    const get_Thsr = ()=>{
      API_THSR_Station().then((res)=>{
          data.thsr = res.data;
      }).catch((err)=>{
          console.log('連線異常:' + err);
      });
    }



    return {init_Map, here_API, data}
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
}
</style>