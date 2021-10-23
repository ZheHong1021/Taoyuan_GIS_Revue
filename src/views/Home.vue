<template>
  <div class="flex flex-row w-full p-3 justify-center">
        <div 
            class="mx-8 rounded shadow-lg p-3 py-5 font-bold text-2xl hover:bg-gray-400"
            v-for="(route, index) in route_List" 
            :class="route.bg_color"
            :key="index">
              <router-link :to='route.to' :href='route.href' role="tab">
                <div class="text-center flex flex-col items-center">
                    {{ route.title }}
                    <img :src="route.img" alt="" class="w-1/2 my-3">
                </div>
            </router-link>
        </div>
    </div>
</template>

<script>
import { reactive } from '@vue/reactivity'
export default {
    setup(){
        const route_List = reactive([
            {id:'train', title: '台鐵資訊', to: '/train', bg_color: 'bg-green-400', img: require('@/assets/img/rail.png')},
            {id:'thsr', title: '高鐵資訊', to: '/thsr', bg_color: 'bg-blue-400', img: require('@/assets/img/high-speed-train.png')},
            {id:'bus', title: '公車資訊', to: '/bus', bg_color: 'bg-red-400', img: require('@/assets/img/bus.png')},
        ])

     
        return { route_List }
    }

}
</script>