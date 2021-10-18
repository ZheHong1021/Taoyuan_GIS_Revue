<template>
<slot></slot>
</template>

<script>
import L from 'leaflet';
import {useStore} from 'vuex';
export default {
    name: 'Map',
    props: {
      init:{
        type: Object,
        required: true,
      },
      here_Key:{
        type: Object,
      },
    },
    setup(props){
        const store = useStore();

        // 初始化地圖
        let map = L.map('map',{
          maxZoom: 18,
          preferCanvas: true,
          renderer: L.canvas(),
        });

        map.setView({
            lng: props.init.center.lng, // longitude(經度)
            lat: props.init.center.lat, // latitude(緯度)
          }, props.init.zoom // zoom(地圖的縮放，值越大->放大；反之縮小)
        );

        store.dispatch("setInitMap", map);
        
         let hereNormal = L.tileLayer(`https://{s}.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?lg=cht&ppi=72&pois&apiKey=${props.here_Key.key}`, {
            attribution: "© 2020 HERE",
            subdomains: [1, 2, 3, 4],
          }) // 一般地圖

          let hereHybrid = L.tileLayer(`https://{s}.aerial.maps.ls.hereapi.com/maptile/2.1/maptile/newest/hybrid.day/{z}/{x}/{y}/256/png8?lg=cht&ppi=72&pois&apiKey=${props.here_Key.key}`, {
            attribution: '© 2020 HERE',
            subdomains: [1, 2, 3, 4]
          }); // 衛星影像混合地圖

          let hereTerrain = L.tileLayer(`https://{s}.aerial.maps.ls.hereapi.com/maptile/2.1/maptile/newest/terrain.day/{z}/{x}/{y}/256/png8?lg=cht&ppi=72&pois&apiKey=${props.here_Key.key}`, {
            attribution: '© 2020 HERE',
            subdomains: [1, 2, 3, 4]
            }
          ); // 地形圖

        // 預設開啟的圖磚
        hereNormal.addTo(map);

        store.dispatch("setControlLayer", {
            baseMaps: {
              "HERE 標準地圖": hereNormal,
              "HERE 衛星影像": hereHybrid,
              "HERE 地形圖": hereTerrain
            },
            overlayMaps: {},
        })
          
         

        return {}
    }
}
</script>
