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
import { onMounted } from '@vue/runtime-core';


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

        onMounted(()=>{
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

        })

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
                case "公車站":{
                    let html = "";
                    let list = store.state.module_Bus.stationID_List[info.data.StationID];
                    list.forEach((item, index)=>{
                      html = html +  `<p class = 'text-base font-bold m-0'>行經路線${index+1} : ${item.RouteName.Zh_tw}</p>`
                    })
                    layer.bindPopup(`
                        <h1>${info.data.StopName.Zh_tw}</h1>
                        ${html}
                    `);
                    break;
                }
                case "景點":
                    layer.bindPopup(`
                        <h1 class = 'text-xl font-bold w-full bg-info'>${info.data.Name}</h1>
                        <a class = 'text-base' href="${info.data.TYWebsite}" target="_blank">網站連結</a>
                        <p class = 'text-base font-bold'>地址: ${info.data.Add}</p>
                        <p class = 'text-base font-bold'>開放時間: ${info.data.Opentime}</p>
                        <p class = 'text-base font-bold'>停車資訊: ${info.data.Parkinginfo}</p>
                        <p class = 'text-base font-bold'>票價資訊: ${info.data.Ticketinfo}</p>
                        <p class = 'text-base font-bold'>連絡電話: ${info.data.Tel}</p>
                        <p class = 'text-base font-bold'>備註: ${info.data.Remarks}</p>
                    `);
                    break;
                
                case "住宿":
                    layer.bindPopup(`
                         <h1 class = 'text-xl font-bold w-full bg-info'>${info.data.Name}</h1>
                          <a class = 'text-base' href="${info.data.TYWebsite}" target="_blank">網站連結</a>
                          <p class = 'text-base font-bold'>地址: ${info.data.Add}</p>
                          <p class = 'text-base font-bold'>開放時間: ${info.data.Opentime}</p>
                          <p class = 'text-base font-bold'>停車資訊: ${info.data.Parkinginfo ? info.data.Parkinginfo : '未提供'}</p>
                          <p class = 'text-base font-bold'>連絡電話: ${info.data.Tel}</p>
                          <p class = 'text-base font-bold'>價位: ${info.data.Charge ? info.data.Charge : '未提供'}</p>
                          <p class = 'text-base font-bold'>備註: ${info.data.Remarks ? info.data.Remarks : '無'}</p>
                    `);
                    break;
                case "消費":
                    layer.bindPopup(`
                         <h1 class = 'text-xl font-bold w-full bg-info'>${info.data.Name}</h1>
                          <a class = 'text-base' href="${info.data.TYWebsite}" target="_blank">網站連結</a>
                          <p class = 'text-base font-bold'>地址: ${info.data.Add}</p>
                          <p class = 'text-base font-bold'>開放時間: ${info.data.Opentime}</p>
                          <p class = 'text-base font-bold'>停車資訊: ${info.data.Parkinginfo ? info.data.Parkinginfo : '未提供'}</p>
                          <p class = 'text-base font-bold'>票價資訊: ${info.data.Ticketinfo ? info.data.Ticketinfo : '未提供'}</p>
                          <p class = 'text-base font-bold'>連絡電話: ${info.data.Tel}</p>
                          <p class = 'text-base font-bold'>備註: ${info.data.Remarks ? info.data.Remarks : '無'}</p>
                    `);
                    break;
                case "火車站":
                    layer.bindPopup(`
                        <h1>${info.data.StationName.Zh_tw}火車站</h1>
                        <p class = 'text-base font-bold'>連絡電話: ${info.data.StationPhone}</p>
                    `);
                    break;
                case "高鐵站":
                    layer.bindPopup(`
                        <h1>${info.data.StationName.Zh_tw}高鐵站</h1>
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