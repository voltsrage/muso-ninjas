<template>
  <div class="user-playlists">
    <h2>My Playlists</h2>
		<div v-if="playlist.userPlaylists">
      <ListView :playlists="playlist.userPlaylists" />
    </div>
		<router-link :to="{ name: 'CreatePlaylist' }" class="btn">Create a New Playlist</router-link>
  </div>
</template>

<script setup>
import ListView from '@/components/ListView.vue'
	import { ref,onMounted } from 'vue'
	import {useStorePlaylists} from '@/stores/storePlaylist'
	import {useStoreAuth} from '@/stores/storeAuth'

	// auth
	const storeAuth = useStoreAuth();

	const playlist = useStorePlaylists();

	onMounted(() => {
		playlist.getUserPlaylist()
	})

</script>

<style scoped>
  h2 {
    padding-bottom: 10px;
    margin-bottom: 30px;
    border-bottom: 1px solid var(--secondary)
  }
  .btn {
    margin-top: 20px;
  }
</style>