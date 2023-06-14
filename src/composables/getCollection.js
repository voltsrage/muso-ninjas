import { ref, watchEffect } from 'vue'
import { db, timestamp, auth } from '@/firebase/config'
import { collection, addDoc, doc, onSnapshot, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';

const getCollection = (collection) => {

    const documents = ref(null)
    const error = ref(null)

    // register the firestore collection reference
    let collectionRef = collection(db, collection)
    let q = query(playlistsCollectionRef, orderBy('createdAt', 'asc'))

    const unsub = q.onSnapshot(snap => {
        let results = []
        snap.docs.forEach(doc => {
            // must wait for the server to create the timestamp & send it back
            doc.data().createdAt && results.push({...doc.data(), id: doc.id })
        });

        // update values
        documents.value = results
        error.value = null
    }, err => {
        console.log(err.message)
        documents.value = null
        error.value = 'could not fetch the data'
    })

    watchEffect((onInvalidate) => {
        onInvalidate(() => unsub());
    });

    return { error, documents }
}

export default getCollection