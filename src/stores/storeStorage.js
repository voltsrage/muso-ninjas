import { defineStore } from 'pinia'
import { db, timestamp, auth } from '@/firebase/config'
import { useStoreAuth } from '@/stores/storeAuth'
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export const useStoreStorage = defineStore('storeStorage', {
    state: () => {
        return {
            url: null,
            error: null,
            filePath: null,
            storageRef: null,
        }
    },
    actions: {
        async uploadImage(file) {

            const storeAuth = useStoreAuth();
            this.filePath = `covers/${storeAuth.user.id}/${file[0].name}`;
            const storage = getStorage()
            this.storageRef = ref(storage, this.filePath);

            const metadata = {
                contentType: file[0].type, // or image/png, etc...
            };

            try {
                await uploadBytes(this.storageRef, file[0], metadata).then(async(snapshot) => {

                });
                await getDownloadURL(this.storageRef)
                    .then((url) => {
                        this.url = url;
                    })
                    .catch((error) => {
                        // A full list of error codes is available at
                        // https://firebase.google.com/docs/storage/web/handle-errors
                        switch (error.code) {
                            case 'storage/object-not-found':
                                // File doesn't exist
                                break;
                            case 'storage/unauthorized':
                                // User doesn't have permission to access the object
                                break;
                            case 'storage/canceled':
                                // User canceled the upload
                                break;

                                // ...

                            case 'storage/unknown':
                                // Unknown error occurred, inspect the server response
                                break;
                        }
                    });

            } catch (err) {
                this.error = err.message
            }
        },
        async deleteImage(path) {
            const storage = getStorage()
            const desertRef = ref(storage, path);
            // Delete the file
            deleteObject(desertRef).then(() => {
                // File deleted successfully
            }).catch((error) => {
                // Uh-oh, an error occurred!
            });
        }

    }
})