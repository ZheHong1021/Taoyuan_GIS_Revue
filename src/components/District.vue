<template>
    <!-- 區界 -->
    <DistrictPopup 
        v-show="show_district" 
        :district="district"
        :population="population"
        class="absolute px-4 py-2 rounded bg-white left-16 top-3"
    />
</template>
<script>
import axios from 'axios';
import { useStore } from 'vuex';
import DistrictPopup from '@/components/DistrictPopup';
import { onMounted, ref } from '@vue/runtime-core';
export default {
    name: 'District',
    components:{
        DistrictPopup: DistrictPopup,
    },
    setup(){
        const store = useStore();
        const show_district = ref(false);
        const district = ref([]);
        const population = ref([]);
        onMounted(async()=>{
            await axios.get('https://arcane-citadel-34528.herokuapp.com/api/population')
                .then(response => {
                    population.value = response.data.data;
                })
                .catch( err => {
                    console.log('error=' + err);
            });

            
            await readDistrict();
        });

        const getSinglePopulation = (single_district)=>  population.value.length > 0 ? population.value.find( element =>element.district == single_district)['total'] : 0;
    

        const readDistrict = ()=>{
            $.getJSON(
            `https://xyz.api.here.com/hub/spaces/${store.state.here_API.distrcitSpaceId}/iterate?clip=true&access_token=${store.state.here_API.dataHubReadToken}`,
                (value) => {
                value.features.forEach((element) => {
                    const single_population = getSinglePopulation(element.properties.TOWNNAME);
                    var bg_color = "#7efff5";
                    if(single_population > 400000){ bg_color = "#ff3838";}
                    else if(single_population > 200000){ bg_color = "#3742fa";}
                    else if(single_population > 100000){bg_color = "#fff200";}
                    else if(single_population > 50000){bg_color = "#c56cf0";}
                    else{bg_color = "#7efff5";}
                    
                    let district_Area = L.geoJSON(element, {
                        style: {
                            fillColor: bg_color,
                            color: "#0032ff",
                            weight: 2,
                            fill: true,
                        },
                        // 移動的顏色
                        onEachFeature(feature, layer) {
                            layer.on("mouseover", function () {
                                show_district.value = true;
                                district.value = feature;
                                this.setStyle({
                                    fillColor: "#40407a",
                                    weight: 5,
                                });
                            });
                            layer.on("mouseout", function () {
                                show_district.value = false;
                                district.value = [];
                                this.setStyle({
                                    fillColor: bg_color,
                                    weight: 3,
                                });
                            });
                        },
                    });
                    store.dispatch("addLayer", district_Area); 
                });
                }
            );
        }

            


        return {show_district, district, population}
    }
}
</script>

<style>

</style>