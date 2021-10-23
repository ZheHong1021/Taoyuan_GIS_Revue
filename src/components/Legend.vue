<template>
    <div class="absolute px-4 py-2 rounded bg-white bottom-3 left-3" style='z-index: 2'>
            <div class="mb-4">
                <h1 class="text-lg font-bold"><i class="fas fa-child text-xl text-yellow-400 mr-2"></i>鄉鎮區界線(人口數)</h1>
                <hr class="border-2 mb-2">
                <!-- 人口數顏色區塊 -->
                <div id="district_block" class="flex" v-for="(item, index) in lengend_Style" :key="index">
                    <div  class="w-4 h-4 border-2 my-1" :style="{ background: item.bg_color }" ></div>
                    <label class="text-base mx-2" v-html="item.content"></label>
                </div>
            </div>
        </div>
</template>
<script>
import { reactive } from '@vue/reactivity'
export default {
    name: 'Legend',
    setup(){
        const lengend_Style = reactive([
            {bg_color: "#ff3838", content: "&gt; 400000"},
            {bg_color: "#3742fa", content: "&gt; 200000"},
            {bg_color: "#fff200", content: "&gt; 100000"},
            {bg_color: "#c56cf0", content: "&gt; 50000"},
            {bg_color: "#7efff5", content: "&lt; 50000"},
        ])
        return {lengend_Style, }
    }

}
</script>

<style>

</style>