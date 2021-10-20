<template>
<slot></slot>
</template>

<script>
import {useStore} from 'vuex';
export default {
    name: 'Map',
    props: {
      init:{
        type: Object,
        required: true,
      },
    },
    setup(props){
        const store = useStore();

        // 初始化地圖
        let map = L.map('map',{
          maxZoom: 18,
          preferCanvas: true,
          renderer: L.canvas(),
          drawControl: true 
        });

        map.setView({
            lng: props.init.center.lng, // longitude(經度)
            lat: props.init.center.lat, // latitude(緯度)
          }, props.init.zoom // zoom(地圖的縮放，值越大->放大；反之縮小)
        );

        store.dispatch("setInitMap", map);

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

    

        return {}
    }
}
</script>

<style>
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
