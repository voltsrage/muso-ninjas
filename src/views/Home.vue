<template>
    <div class="home">
    <div v-if="playlist.error" class="error">Could not fetch the data</div>
    <div v-if="playlist.playlists">
      <ListView :playlists="playlist.playlists" />
    </div>
  </div>
</template>

<script setup>
import { ref ,onMounted} from 'vue'
import {useStorePlaylists} from '@/stores/storePlaylist'
import ListView from '@/components/ListView.vue'

const playlist = useStorePlaylists();

onMounted(() => {
	playlist.getPlaylists()
})
</script>
