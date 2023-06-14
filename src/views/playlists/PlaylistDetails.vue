<template>
    <!-- <div class="error" v-if="error">{{ error }}</div> -->
			<div v-if="playlist.currentPlaylist" class="playlist-details">

				<!-- playlist information -->
				<div class="playlist-info">
					<div class="cover">
						<img :src="playlist.currentPlaylist.coverUrl">
					</div>
					<h2>{{ playlist.currentPlaylist.title }}</h2>
					<p class="username">Created by {{ playlist.currentPlaylist.userName }}</p>
					<p class="description">{{ playlist.currentPlaylist.description }}</p>
					<button v-if='ownership' @click='handleClick(playlist.currentPlaylist.filePath)'>Delete Playlist</button>
				</div>

				<!-- song list -->
				<div class="song-list">
					<div v-if="!playlist.currentPlaylist.songs">No songs have been added to this playlist yet.</div>
					<div v-for="song in playlist.currentPlaylist.songs" :key="song.id" class="single-song">
						<div class="details">
							<h3>{{ song.title }}</h3>
							<p>{{ song.artist }}</p>
						</div>
						<button v-if="ownership" @click='handleDeleteSong(song.id)'>delete</button>
					</div>
					<AddSong v-if='ownership' :playlist='playlist.currentPlaylist'></AddSong>
				</div>

  </div>
</template>

<script setup>
import { ref,reactive,onMounted,toRaw, computed } from 'vue'
	import {useStorePlaylists} from '@/stores/storePlaylist'
	import {useStoreAuth} from '@/stores/storeAuth'
	import {useStoreStorage} from '@/stores/storeStorage'
	import {useRouter} from 'vue-router'

	import AddSong from '@/components/AddSong.vue'

	// routes
	const router = useRouter()

	const storage = useStoreStorage();
	const playlist = useStorePlaylists();
	const currentPlaylist = toRaw(playlist.currentPlaylist)

	const props = defineProps({
		id: {
			type:String
		}
	})

		// auth
		const storeAuth = useStoreAuth();

		const ownership = computed(() => {
			return playlist.currentPlaylist && storeAuth.user.id && storeAuth.user.id == playlist.currentPlaylist.userId
		})

	onMounted(() => {
		 playlist.getPlaylist(props.id)
	})

	const handleClick = async (filepath) => {
		await storage.deleteImage(filepath)
		await playlist.deletePlaylist(props.id)
		router.push({name:'Home'})
	}

	const handleDeleteSong = async (songId) => {
		let songsLeft = playlist.currentPlaylist.songs.filter(song => song.id != songId)
		let songs = [...songsLeft]
		await playlist.updatePlaylistSongs(playlist.currentPlaylist.id,songs)
	}

</script>

<style>
  .playlist-details {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 80px;
  }
  .cover {
    overflow: hidden;
    border-radius: 20px;
    position: relative;
    padding: 160px;
  }
  .cover img {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    min-width: 100%;
    min-height: 100%;
    max-width: 200%;
    max-height: 200%;
  }
  .playlist-info {
    text-align: center;
  }
  .playlist-info h2 {
    text-transform: capitalize;
    font-size: 28px;
    margin-top: 20px;
  }
  .playlist-info p {
    margin-bottom: 20px;
  }
  .username {
    color: #999;
  }
  .description {
    text-align: center;
  }
	.single-song {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed var(--secondary);
    margin-bottom: 20px;
  }
</style>