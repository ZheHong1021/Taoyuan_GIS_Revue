<template>
<slot></slot>
</template>

<script>
import { onMounted } from '@vue/runtime-core';
import {useStore} from 'vuex';
import '@ansur/leaflet-pulse-icon'
export default {
    name: 'Map',
    
    setup(){
        const store = useStore();
         let hereNormal = L.tileLayer(`https://{s}.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?lg=cht&ppi=72&pois&apiKey=${store.state.here_API.key}`, {
            attribution: "© 2020 HERE",
            subdomains: [1, 2, 3, 4],
          }) // 一般地圖

          let hereHybrid = L.tileLayer(`https://{s}.aerial.maps.ls.hereapi.com/maptile/2.1/maptile/newest/hybrid.day/{z}/{x}/{y}/256/png8?lg=cht&ppi=72&pois&apiKey=${store.state.here_API.key}`, {
            attribution: '© 2020 HERE',
            subdomains: [1, 2, 3, 4]
          }); // 衛星影像混合地圖

          let hereTerrain = L.tileLayer(`https://{s}.aerial.maps.ls.hereapi.com/maptile/2.1/maptile/newest/terrain.day/{z}/{x}/{y}/256/png8?lg=cht&ppi=72&pois&apiKey=${store.state.here_API.key}`, {
            attribution: '© 2020 HERE',
            subdomains: [1, 2, 3, 4]
            }
          ); // 地形圖
        const error_Position = {lat: 24.9932736, lng: 121.2999763};
        const blueMarker = L.marker(error_Position, {
            icon: L.icon.pulse({
              iconSize: [20, 20],
              color: '#9c88ff',
              fillColor: '#30336b'
            }),
            title: '目前位置', 
            opacity: 1.0
          }).bindPopup(`<h2 class="text-xl text-center font-bold my-4 mx-2">目前位置</h2>`);

        // 抓不到定位時
        function errorHandler(e) {
          console.log("e", e);
          window.alert('無法判斷您的所在位置，無法使用此功能。預設地點將為 「桃園市政府」');
          map.setView(error_Position, 17); // 中心移到高雄市政府
          store.dispatch('setUserPos', error_Position);
        }

        // 抓到使用者提供的位置
        let foundHandler = function(e) {
          let myLocation = e.latlng // 使用者位置
          // 記錄到 Vuex
          store.dispatch('setUserPos', myLocation);
          blueMarker.setLatLng(myLocation); // 座標定位在該位置
        }

        let map;
        onMounted(async()=>{
            // 初始化地圖
              map = L.map('map',{
              maxZoom: 18,
              preferCanvas: true,
              renderer: L.canvas(),
              drawControl: true 
            });

            store.dispatch("setInitMap", map);
            store.dispatch("setControlLayer", {
                baseMaps: [
                  {
                    group: '<i class="fas fa-map-marked-alt text-green-600"></i> 地圖轉換區',
                    layers:[
                      {
                        active: true,
                        name: "HERE 標準地圖",
                        layer: hereNormal,
                      },
                      {
                        name: "HERE 衛星影像",
                        layer:	hereHybrid
                      },
                      {
                        name: "HERE 地形圖",
                        layer:	hereTerrain
                      },
                    ]
                  }
                ],
                overlayMaps: [],
            })
            blueMarker.addTo(map);
            map.locate({ setView: true, watch: false, maxZoom: 18, enableHighAccuracy: true });
            map.on('locationfound', foundHandler);
            map.on('locationerror', errorHandler);

        })

    

        return {}
    }
}
</script>

<style>
@import 'https://cdn.jsdelivr.net/npm/leaflet-pulse-icon@0.1.0/src/L.Icon.Pulse.css';

.leaflet-panel-layers{
  background: rgba(255, 255, 255, .8);
}

.leaflet-panel-layers-list{
    padding: 0.35rem;
}

/* 一般 title */
.leaflet-panel-layers-title span{
  margin-left: 0.5rem;
  font-size: 1.025rem;
}

.leaflet-panel-layers-item{
  margin: 10px;
}

.leaflet-panel-layers-item,
.leaflet-panel-layers-item i{
    transition: .5s ;
}
.leaflet-panel-layers-item:hover,
.leaflet-panel-layers-item:hover i{
    background: #fa0;
    font-weight: bold;
}

.leaflet-panel-layers-group{
    padding: 0.725rem;
    border-radius: .5rem;
}

/* 群組 title */
.leaflet-panel-layers-grouplabel span{
    font-size: 1.25rem;
    font-weight: bold;
}
</style>
