// Firebase SDK imports
console.log("🔥 app.js loaded");  // CONFIRM script is connected

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ✅ Your Firebase Config (replace with your actual config)

const firebaseConfig = {
  apiKey: "AIzaSyDa2MfgIT6N_4KiU_yPMQfZK2YLrRJtt8Y",
  authDomain: "smart-notes-app-449e4.firebaseapp.com",
  projectId: "smart-notes-app-449e4",
  storageBucket: "smart-notes-app-449e4.firebasestorage.app",
  messagingSenderId: "400665119542",
  appId: "1:400665119542:web:0df14cb450359f04ea4197",
  measurementId: "G-8GWQT72HN3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");
const saveNoteBtn = document.getElementById("save-note-btn");
const noteContent = document.getElementById("note-content");
const notesList = document.getElementById("notes-list");
const authSection = document.getElementById("auth-section");
const notesSection = document.getElementById("notes-section");

// Signup
signupBtn.addEventListener("click", async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    );
    alert("Signed up successfully!");
  } catch (error) {
    alert(error.message);
  }
});

// Login
loginBtn.addEventListener("click", async () => {
  try {
    await signInWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    );
    alert("Logged in successfully!");
  } catch (error) {
    alert(error.message);
  }
});

// Logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  alert("Logged out!");
});

// Save note
saveNoteBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (user && noteContent.value.trim() !== "") {
    const noteRef = doc(db, "notes", `${user.uid}-${Date.now()}`);
    await setDoc(noteRef, {
      content: noteContent.value,
      userId: user.uid,
      timestamp: Date.now()
    });
    noteContent.value = "";
    loadNotes(user.uid);
  }
});

// Load notes for user
async function loadNotes(uid) {
  notesList.innerHTML = "";
  const notesSnapshot = await getDocs(collection(db, "notes"));
  notesSnapshot.forEach((docItem) => {
    const data = docItem.data();
    if (data.userId === uid) {
      const li = document.createElement("li");
      li.textContent = data.content;
      notesList.appendChild(li);
    }
  });
}

// Show/Hide sections based on login status
onAuthStateChanged(auth, (user) => {
  console.log("Auth state changed:", user);
  if (user) {
    authSection.style.display = "none";
    notesSection.style.display = "block";
    loadNotes(user.uid);
  } else {
    authSection.style.display = "block";
    notesSection.style.display = "none";
  }
});
