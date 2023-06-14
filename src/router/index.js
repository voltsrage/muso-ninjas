import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/auth/Login.vue'
import Signup from '../views/auth/Signup.vue'
import CreatePlaylist from '../views/playlists/CreatePlaylist.vue'
import PlaylistDetails from '../views/playlists/PlaylistDetails.vue'
import UserPlaylists from '../views/playlists/UserPlaylists.vue'
import { useStoreAuth } from '@/stores/storeAuth'


const requireAuth = (to, from, next) => {
    // auth
    const storeAuth = useStoreAuth();
    if (!storeAuth.user.id) {
        next({ name: 'Login' })
    } else {
        next()
    }

}

const routes = [{
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/signup',
        name: 'Signup',
        component: Signup
    },
    {
        path: '/playlists/create',
        name: 'CreatePlaylist',
        component: CreatePlaylist,
        beforeEnter: requireAuth
    },
    {
        path: '/playlists/:id',
        name: 'PlaylistDetails',
        component: PlaylistDetails,
        beforeEnter: requireAuth,
        props: true
    },
    {
        path: '/playlists/user',
        name: 'UserPlaylists',
        component: UserPlaylists,
        beforeEnter: requireAuth
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router