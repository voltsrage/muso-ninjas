<template>
	<Navbar/>
  <div class="content">
    <router-view/>
  </div>

</template>

<script setup>

/* Imports */
import Navbar from '@/components/Navbar.vue'
import {useStoreAuth} from '@/stores/storeAuth'
import { onMounted,onBeforeMount } from 'vue';

// auth
const storeAuth = useStoreAuth();

onBeforeMount(() => {
	storeAuth.init()
})
</script>

<style>
.content  {
	margin: 0 auto;
	max-width: 1200px;
	padding: 0 20px;
}
</style>
