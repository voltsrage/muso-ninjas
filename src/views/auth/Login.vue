<template>
  <form @submit.prevent="handleSubmit">
    <h3>Login</h3>
    <input type="email" placeholder="Email" v-model="credentials.email">
    <input type="password" placeholder="Password" v-model="credentials.password">
    <div v-if="storeAuth.error" class="error">{{ storeAuth.error }}</div>
    <button v-if="!storeAuth.IsPending">Login</button>
		<button v-if="storeAuth.IsPending">Loading</button>
  </form>
</template>

<script setup>
import {useStoreAuth} from '@/stores/storeAuth'
import {ref,reactive} from 'vue'
import {useRouter} from 'vue-router'

// auth
const storeAuth = useStoreAuth();

	// routes
	const router = useRouter()

// credentials

const credentials = reactive({
	email:'',
	password: '',
})

const handleSubmit = () => {
	if(!credentials.email || !credentials.password){
		alert("Email and password are both required")
	}
	storeAuth.loginUser(credentials)
	//router.push({name:'UserPlaylists'})
}


</script>