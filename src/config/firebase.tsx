import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBvZ13XOMjY8--BU6WpKSPB4ntM8vg7Uhg",
  authDomain: "specialty-detail.firebaseapp.com",
  databaseURL: "https://specialty-detail-default-rtdb.firebaseio.com",
  projectId: "specialty-detail",
  storageBucket: "specialty-detail.appspot.com",
  messagingSenderId: "790340378643",
  appId: "1:790340378643:web:71af0d671a4f5932be1fe6",
  measurementId: "G-LK099C0NKF",
};

export const firebase = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebase);
