<template>
  <div>
        <button 
            v-show="$route.path != '/'"
            class="bg-gray-500 text-white rounded px-4 py-2 font-bold hover:bg-gray-700" 
            @click="$router.push('/')">
            <i class="fas fa-arrow-alt-circle-left mr-3"></i>回上一頁</button>
        <router-view />
    </div>
</template>

<script>
export default {
    name: 'Transport',
    setup(){
        
        return{}
    }
}
</script>

<style>

</style>