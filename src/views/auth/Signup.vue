<template>
  <form @submit.prevent="handleSubmit">
    <h3>Sign Up</h3>
		<input type="text" required placeholder="display name" v-model="credentials.displayName">
    <input type="email" placeholder="Email" v-model="credentials.email">
    <input type="password" placeholder="Password" v-model="credentials.password">
    <div v-if="storeAuth.error" class="error">{{ storeAuth.error }}</div>
    <button v-if="!storeAuth.IsPending">Sign up</button>
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
	displayName: ''
})

const handleSubmit = () => {
	if(!credentials.email || !credentials.password){
		alert("Email and password are both required")
	}
	storeAuth.registerUser(credentials)
	//router.push({name:'UserPlaylists'})
}


</script>