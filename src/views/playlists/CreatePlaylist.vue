
<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <h4>Create a New Playlist</h4>
      <input type="text" required placeholder="Playlist title" v-model="title">
      <textarea required placeholder="Playlist description..." v-model="description"></textarea>
      <!-- upload playlist image -->
      <label>Upload Playlist Cover Image</label>
      <input type="file" accept="image/png, image/jpg, image/jpeg" @change='handleChange'>
      <div class="error">{{ fileError }}</div>

      <button v-if='!isPending'>Create</button>
			<button v-if='isPending' disabled>Saving ...</button>
    </form>
  </div>
</template>

<script setup>
	import { ref } from 'vue'
	import {useStoreStorage} from '@/stores/storeStorage'
	import {useStorePlaylists} from '@/stores/storePlaylist'
	import {useStoreAuth} from '@/stores/storeAuth'
	import {useRouter} from 'vue-router'

	// auth
	const storeAuth = useStoreAuth();

	// routes
	const router = useRouter()

	const storage = useStoreStorage();
	const playlist = useStorePlaylists();

	const title = ref('')
  const description = ref('')
	const file = ref(null)
	const fileError = ref(null)

	const isPending = ref(false)

	const handleSubmit = async () => {
		if(file.value){
			isPending.value = true
			await storage.uploadImage(file.value).then( async () => {
				let playlistToSave = {
					title: title.value,
					description: description.value,
					userId: storeAuth.user.id,
					userName: storeAuth.user.displayName,
					coverUrl: storage.url,
					filePath: storage.filePath,
					songs:[],
					createdAt: Date.parse(new Date())
				}
					let res = await playlist.addPlaylist(playlistToSave)
					isPending.value = false
					if(!playlist.error){
						router.push({name:'PlaylistDetails', params: {id:res.id}})
					}
			})



		}

  }

	// allowed file types

	const types = ['image/png','image/jpeg','image/jpg']

	const handleChange = (e) => {

		const selected = e.target.files
		if(selected && types.includes(selected[0].type)){
			file.value = selected
			fileError.value = null
		}
		else {
			file.value = null
			fileError.value ="Please select an image file (png or jpg)"
		}
	}

</script>

<style>
  form {
    background: white;
  }
  input[type="file"] {
    border: 0;
    padding: 0;
  }
  label {
    font-size: 12px;
    display: block;
    margin-top: 30px;
  }
  button {
    margin-top: 20px;
  }
</style>