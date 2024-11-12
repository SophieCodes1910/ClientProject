//firebase.js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc } = require('firebase/firestore');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyArePdmV5-oz4XDNxUrh3Qq5f3_QamWZR4",
    authDomain: "huppsiv2.firebaseapp.com",
    projectId: "huppsiv2",
    storageBucket: "huppsiv2.firebasestorage.app",
    messagingSenderId: "606763964769",
    appId: "1:606763964769:web:b872c63b1123198ff80d20",
    measurementId: "G-DNSYFK7SST"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Create a new event (Create operation)
async function createEvent(eventData) {
    try {
        const docRef = doc(collection(db, 'events'));
        await setDoc(docRef, eventData);
        return docRef.id; // Return the ID of the created event
    } catch (error) {
        console.error('Error creating event: ', error);
        throw error;
    }
}

// Get an event by its ID (Read operation)
async function getEvent(docId) {
    try {
        const docRef = doc(db, 'events', docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data(); // Return event data if it exists
        } else {
            console.log('No such event!');
            return null;
        }
    } catch (error) {
        console.error('Error fetching event: ', error);
        throw error;
    }
}

// Get all events (Read operation)
async function getAllEvents() {
    try {
        const snapshot = await getDocs(collection(db, 'events')); // Correct syntax for Firebase v9
        const events = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return events;
    } catch (error) {
        console.error("Error fetching events:", error);
        throw new Error("Failed to fetch events.");
    }
}

// Update an event (Update operation)
async function updateEvent(docId, eventData) {
    try {
        const docRef = doc(db, 'events', docId);
        await updateDoc(docRef, eventData);
        console.log('Event updated successfully!');
    } catch (error) {
        console.error('Error updating event: ', error);
        throw error;
    }
}

// Delete an event (Delete operation)
async function deleteEvent(docId) {
    try {
        const docRef = doc(db, 'events', docId);
        await deleteDoc(docRef);
        console.log('Event deleted successfully!');
    } catch (error) {
        console.error('Error deleting event: ', error);
        throw error;
    }
}

// Upload media (Schedule, Map, Media files)
async function uploadMedia(file, folder) {
    try {
        const storageRef = ref(storage, `${folder}/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL; // Return the URL for the uploaded file
    } catch (error) {
        console.error('Error uploading media: ', error);
        throw error;
    }
}

module.exports = {
    createEvent,
    getEvent,
    getAllEvents, // Export getAllEvents
    updateEvent,
    deleteEvent,
    uploadMedia
};
