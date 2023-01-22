
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
    apiKey: "AIzaSyAQeD3U1vD4AZQn4a1eiYQmKFu3qrtALwc",
    authDomain: "trikojai.firebaseapp.com",
    databaseURL: "https://trikojai-default-rtdb.firebaseio.com",
    projectId: "trikojai",
    storageBucket: "trikojai.appspot.com",
    messagingSenderId: "835593093822",
    appId: "1:835593093822:web:6f35b98c4266afb627d4ef",
    measurementId: "G-92Y432YX5Q"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// export const storage = getStorage();
// export const db = getFirestore()
export const analytics = getAnalytics(app)
export const database = getDatabase(app)

if (app.name && typeof window !== 'undefined') {
 // analytics = getAnalytics(app);
}









