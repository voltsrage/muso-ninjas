import { defineStore } from 'pinia'
import { db, timestamp, auth } from '@/firebase/config'
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { collection, setDoc, doc, onSnapshot, deleteDoc, updateDoc, getDocs, getDoc } from 'firebase/firestore';
import { useStorePlaylists } from '@/stores/storePlaylist'

export const useStoreAuth = defineStore('storeAuth', {

    state: () => {
        return {
            user: {},
            error: null,
            isPending: false
        }
    },
    actions: {
        init() {
            const storePlaylist = useStorePlaylists();
            onAuthStateChanged(auth, async(user) => {
                if (user) {
                    this.user.id = user.uid
                    this.user.email = user.email
                    let usersFromFirebase = collection(db, "users");
                    let currentDetailsRef = doc(usersFromFirebase, user.uid)
                    let currentDetails = await getDoc(currentDetailsRef)
                    console.log(currentDetails)
                    if (currentDetails.exists()) {
                        this.user.displayName = currentDetails.data().displayName
                    } else {
                        this.user.displayName = ''
                    }

                } else {
                    this.user = {}
                    storePlaylist.clearPlaylists()
                    this.router.replace('/login')
                }
            })
        },
        registerUser(credentials) {
            this.error = null;
            createUserWithEmailAndPassword(auth, credentials.email, credentials.password)
                .then(async(userCredential) => {

                    const user = userCredential.user;

                    await setDoc(doc(db, "users", userCredential.user.uid), {
                        displayName: credentials.displayName
                    })
                    this.router.push({ name: 'UserPlaylists' })
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    this.error = errorMessage
                });
        },
        loginUser(credentials) {
            this.error = null;
            this.isPending = true
            signInWithEmailAndPassword(auth, credentials.email, credentials.password)
                .then((userCredential) => {
                    this.isPending = false
                    const user = userCredential.user;
                    this.router.push({ name: 'UserPlaylists' })
                })
                .catch((error) => {
                    this.isPending = false
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    this.error = errorMessage
                });
        },
        logoutUser() {
            signOut(auth).then(() => {}).catch((error) => {

            })
        }
    },
    getters: {

    }
})