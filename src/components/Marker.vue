<template>
<slot></slot>
</template>

<script>
import {useStore} from 'vuex';

// 引入 leaflet.markercluster
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import "leaflet.markercluster";

// 解決默認 marker 無法顯示的問題
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import 'leaflet-fontawesome-markers';
import "leaflet-fontawesome-markers/L.Icon.FontAwesome.css";

export default {
    name: 'Marker',
    props: {
      data: { // 資料
        type: Array,
        required: true,
      },
      prefix: {  // 經緯度前的值
        type: String,
        default: ""
      },
      lat: {  // 緯度(看資料的緯度在哪)
        type: String,
        default: "lat"
      },
      lng: {  // 經度(看資料的經度在哪)
        type: String,
        default: "lng"
      },
      open: { // 預設是否打開
        type: Boolean,
        default: false
      },
      overlay_title:{
        type: String, 
        required: true,
      },
      group:{
        type: String, 
        required: true,
      },
      iconClass:{
        type: String,
        required: true,
      },
      markerColor:{
        type: String,
        default: '#000'
      },
      iconColor:{
        type: String,
        default: '#fff'
      },
      offsetX:{
        type: Number,
        default: 0
      },
      offsetY:{
        type: Number,
        default: 0
      },

    },
    setup(props){
      
      // 解決默認 marker 無法顯示的問題
        let DefaultIcon = L.icon({
          iconUrl: icon,
          shadowUrl: iconShadow
          });
        L.Marker.prototype.options.icon = DefaultIcon;


        const store = useStore();

        let markerGroup = L.markerClusterGroup();
        props.data.forEach(item => {
            let coordinate = props.prefix == "" ? [item[props.lng], item[props.lat]] : [item[props.prefix][props.lng], item[props.prefix][props.lat]];
            let properties = {};
            for(let i = 0 ; i < Object.keys(item).length ; i++){
              properties[Object.keys(item)[i]] = Object.values(item)[i]
            }
          let geojsonFeature = {
              "type": "Feature",
              "properties": {
                "category": props.overlay_title,
                "data": properties,
              },
              "geometry": {
                  "type": "Point",
                  "coordinates": coordinate // 實際座標位置
              }
          };
          L.geoJSON(geojsonFeature,{
            onEachFeature: onEachFeature,
             pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {
                  icon: L.icon.fontAwesome({ 
                      iconClasses: props.iconClass, // you _could_ add other icon classes, not tested.
                      markerColor: props.markerColor,
                      iconColor: props.iconColor,
                      iconXOffset: props.offsetX,
                      iconYOffset: props.offsetY,
                  })
                });
              },
          }).addTo(markerGroup);
        });

        // 看預設要不要開啟
        if(props.open){
          store.dispatch("addLayer", markerGroup); 
        }
        store.dispatch("addOverlayMaps", {
          layer: markerGroup, 
          title: props.overlay_title, 
          group: props.group,
          icon: props.iconClass,
        });


        function onEachFeature(feature, layer) {
            // 確認是否有該屬性，有則啟動Popup功能
            if (feature.properties) {
              let info = feature.properties;
              switch (info.category){
                case "公車站":
                    layer.bindPopup(`
                        <h1>${info.data.StopName.Zh_tw}</h1>
                        <p>${info.data.StopUID}</p>
                    `);
                    break;
                default:
                    layer.bindPopup(`
                        ${info.data.StationName.Zh_tw}
                    `);
                    break;
                }
            }
        }
        

        return {markerGroup};
    }
}
</script>

<style>
.leaflet-popup-content-wrapper {
	padding: 0;
  width: 100%;
  min-width: 10rem;
	overflow: hidden;
}

.leaflet-popup-content-wrapper .leaflet-popup-content {
	margin: 0;
  width: 100%;
}

.leaflet-popup-content-wrapper h1 {
  width: 100%;
	padding: 0.6rem;
	background: #ff6804;
	color: #fff;
	font-size: 18px;
	font-weight: bolder;
}

.leaflet-popup-content-wrapper p {
	font-size: 14px;
	padding: 0 10px;
	font-weight: bolder;
}

</style>