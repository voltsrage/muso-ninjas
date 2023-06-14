import { defineStore } from 'pinia'
import { collection, addDoc, doc, onSnapshot, deleteDoc, updateDoc, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db, auth } from '@/firebase/config'
import { toRaw } from 'vue'
import { useStoreAuth } from '@/stores/storeAuth'

let playlistsCollectionRef = collection(db, "playlists");
let getPlaylistsSnapshot = null;
let getPlaylistSnapshot = null
let userPlaylistQuerySnapshot = null

export const useStorePlaylists = defineStore('storePlaylists', {
    state: () => {
        return {
            playlists: [],
            playlistsLoaded: false,
            currentPlaylist: {},
            userPlaylists: []
        }
    },
    actions: {
        init() {
            // auth
            playlistsCollectionRef = collection(db, "playlists");
            this.getPlaylists()
        },
        async getPlaylists() {
            // live updates
            this.playlistsLoaded = false

            const q = query(playlistsCollectionRef, orderBy('createdAt', 'asc'))
            getPlaylistsSnapshot = onSnapshot(q, (querySnapshot) => {
                let playlists = []
                querySnapshot.forEach((doc) => {
                    let playlist = {
                        id: doc.id,
                        title: doc.data().title,
                        description: doc.data().description,
                        userId: doc.data().userId,
                        userName: doc.data().userName,
                        coverUrl: doc.data().coverUrl,
                        filePath: doc.data().filePath,
                        createdAt: doc.data().createdAt,
                        songs: doc.data().songs
                    }
                    playlists.push(playlist)
                });
                this.playlists = playlists
            }, error => {
                console.log('error.message', error.message)
                error = error.message
            });
            this.playlistsLoaded = true
        },
        async getUserPlaylist() {

            // auth
            const storeAuth = useStoreAuth();
            const q = query(playlistsCollectionRef, where('userId', '==', storeAuth.user.id))

            userPlaylistQuerySnapshot = await getDocs(q);
            let playlists = []
            userPlaylistQuerySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                let playlist = {
                    id: doc.id,
                    title: doc.data().title,
                    description: doc.data().description,
                    userId: doc.data().userId,
                    userName: doc.data().userName,
                    coverUrl: doc.data().coverUrl,
                    filePath: doc.data().filePath,
                    createdAt: doc.data().createdAt,
                    songs: doc.data().songs
                }
                playlists.push(playlist)
            });
            this.userPlaylists = playlists

        },
        getPlaylist(playlistId) {
            if (getPlaylistSnapshot) getPlaylistSnapshot();
            getPlaylistSnapshot = onSnapshot(doc(playlistsCollectionRef, playlistId), (doc) => {
                if (doc.data()) {
                    this.currentPlaylist = toRaw({...doc.data(), id: doc.id });
                }

            })
        },
        clearPlaylists() {
            this.playlists = []
            if (getPlaylistsSnapshot) getPlaylistsSnapshot(); // unsubscribe from any active listener

        },
        async addPlaylist(newPlaylist) {

            const res = await addDoc(playlistsCollectionRef, newPlaylist)
                //this.playlists.unshift(playlist)
            return res;
        },
        async deletePlaylist(playlistId) {
            //this.playlists = this.playlists.filter(playlist => { return playlist.id !== playlistId })
            await deleteDoc(doc(playlistsCollectionRef, playlistId));
        },
        async updatePlaylist(playlistId, content) {
            //let index = this.playlists.findIndex(playlist => playlist.id === playlistId)
            //this.playlists[index].content = content

            await updateDoc(doc(playlistsCollectionRef, playlistId), {
                content: content
            })
        },
        async updatePlaylistSongs(playlistId, songs) {
            //let index = this.playlists.findIndex(playlist => playlist.id === playlistId)
            //this.playlists[index].content = content
            // const playlistRef = doc(playlistsCollectionRef, playlistId);
            // const docSnap = await getDoc(playlistRef);
            // docSnap.data().songs.push(song)
            await updateDoc(doc(playlistsCollectionRef, playlistId), {
                songs: songs
            })
        }
    },
    getters: {
        getPlaylistContent: (state) => {

            return (playlistId) => {
                return state.playlists.filter(playlist => {
                    return playlist.id === playlistId
                })[0].content
            }
        },
        totalPlaylistsCount: (state) => {
            return state.playlists.length
        },
        totalCharactersCount: (state) => {
            let count = 0;
            state.playlists.forEach(playlist => {
                count += playlist.content.length
            })

            return count;
        }
    }
})