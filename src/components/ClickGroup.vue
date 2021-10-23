<template>
  <div class="absolute top-3 right-56 flex flex-col" style='z-index: 2'>
      <button 
            class="text-white text-xl font-bold rounded px-4 py-2" 
            :class="is_Tourism_Dialog ? 'bg-green-600' : 'bg-green-400'"
            @click="is_Tourism_Dialog = !is_Tourism_Dialog">
            景點旅客數據
        </button>
      <button 
            class="text-white text-xl font-bold rounded px-4 py-2 mt-2"
            :class="is_Transport_Dialog ? 'bg-red-600' : 'bg-red-400'"
            @click="is_Transport_Dialog = !is_Transport_Dialog">
            交通資訊
        </button>
  </div>

  <Dialog header="110年桃園觀光景點旅客數據" v-model:visible="is_Tourism_Dialog"  :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}">
        <div class="mb-2">
            <button @click="changeTourismMonth('八月')" class="mx-2 rounded px-4 py-2 text-white" :class="tourism_prop.month === '八月'? 'bg-red-500' : 'bg-red-300'" >八月</button>
            <button @click="changeTourismMonth('七月')" class="mx-2 rounded px-4 py-2 text-white" :class="tourism_prop.month === '七月'? 'bg-red-500' : 'bg-red-300'" >七月</button>
            <button @click="changeTourismMonth('六月')" class="mx-2 rounded px-4 py-2 text-white" :class="tourism_prop.month === '六月'? 'bg-red-500' : 'bg-red-300'" >六月</button>
            <button @click="changeTourismMonth('五月')" class="mx-2 rounded px-4 py-2 text-white" :class="tourism_prop.month === '五月'? 'bg-red-500' : 'bg-red-300'" >五月</button>
            <button @click="changeTourismMonth('四月')" class="mx-2 rounded px-4 py-2 text-white" :class="tourism_prop.month === '四月'? 'bg-red-500' : 'bg-red-300'" >四月</button>
        </div>
        <div class="mb-2">
            <button @click="changeTourismTypeData('bar', '門票收入')" class="mx-2 rounded px-4 py-2 text-white" :class="tourism_prop.data === '門票收入'? 'bg-green-600' : 'bg-green-400'">門票收入</button>
            <button @click="changeTourismTypeData('line', '遊客人次')" class="mx-2 rounded px-4 py-2 text-white" :class="tourism_prop.data === '遊客人次'? 'bg-blue-600' : 'bg-blue-400'">遊客人次</button>
        </div>
         <TourismData :tourism_prop="tourism_prop"/>
    </Dialog>


    <Dialog header="桃園交通工具" v-model:visible="is_Transport_Dialog"  :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}">
        <Transport />
    </Dialog>

</template>

<script>
import { computed, ref } from '@vue/reactivity'
import Dialog from 'primevue/dialog';
import TourismData from '@/components/Tourism/TourismData';
import Transport from '@/components/Transport';
import { useStore } from 'vuex';
export default {
    name: 'ClickGroup',
    components:{
        Dialog: Dialog,
        TourismData: TourismData,
        Transport: Transport,
    },
    setup(){
        const store = useStore();
        const is_Tourism_Dialog = ref(false);
        const is_Transport_Dialog = ref(false);

        const tourism_prop = computed(()=> store.state.tourism_Data);
        
        const changeTourismMonth = (month)=>{
            store.dispatch("changeTourismMonth", month);
        }
        const changeTourismTypeData = (type, data)=>{
            store.dispatch("changeTourismTypeData", {type: type, data: data});
        }

        return {tourism_prop, is_Tourism_Dialog, is_Transport_Dialog, changeTourismMonth, changeTourismTypeData}
    }
}
</script>

<style>

</style>