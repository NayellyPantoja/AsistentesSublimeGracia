import { initializeApp } from "firebase/app";
import {signInWithEmailAndPassword, getAuth, signOut, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";
import {collection, doc, getDoc, getFirestore} from "firebase/firestore"
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage"
import {v4} from "uuid"



 const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID
};



 const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
const storage = getStorage(app)


//DeleteUser



//Login

export const login = async ({email, password}) => {
    try{
        const res = await signInWithEmailAndPassword(auth, email, password)
        return res
    }catch(error){
        console.log(error)
    }
    
}
//logout
export const logout = () =>{
    try {
        signOut(auth)
    } catch (error) {
        console.log(error)
    }
}

// logout change role

export const logoutOtherUser = async (userId, setUser) => {
    try {
      const auth = getAuth();
  
      // Obtén el usuario correspondiente al ID desde Firestore.
      const user = await getUserById(userId);
      console.log("getUserlogoutOtherUserById", userId);
      console.log("getUserById", user);
  
      // Verifica si el usuario existe antes de intentar cerrar su sesión.
      if (user) {
        // Cierra la sesión del usuario específico.

        await signOut(auth);
        console.log(`Se cerró la sesión del usuario con ID ${userId}.`);
        setUser({});
      } else {
        console.log(`No se encontró un usuario con el ID ${userId}.`);
      }
    } catch (error) {
      console.error("Error al cerrar sesión del usuario:", error);
    }
  };
  
  const getUserById = async (userId) => {
    try {
      const userCollection = collection(db, "users");
      const userDoc = await getDoc(doc(userCollection, userId));
  
      if (userDoc.exists()) {
        const userData = { ...userDoc.data(), id: userDoc.id };
        return userData;
      } else {
        console.log(`No se encontró un usuario con el ID ${userId} en Firestore.`);
        return null;
      }
    } catch (error) {
      console.error("Error al obtener información del usuario por ID:", error);
      return null;
    }
  };

//Login con google

const googleProvider = new GoogleAuthProvider();
export const loginGoogle = async () => {
    try {
        const res =  await signInWithPopup(auth, googleProvider);
    return res
    } catch (error) {
        console.log(error)
    }
    
}

//Registro

export const signUp = async ({email, password}) => {
    try {
        let res = await createUserWithEmailAndPassword(auth, email, password)
    return res
    } catch (error) {
        console.log(error)
    }
    
}

//forgot password

export const forgotPassword = async (email) => {
    try {
        let res = await sendPasswordResetEmail(auth, email);
        return res
    } catch (error) {
        console.log(error)
    }
}

//storage
export const uploadFile = async (file) => {
    try {
        const storageRef = ref(storage, v4());
    await uploadBytes(storageRef, file);
    let url = await getDownloadURL(storageRef)
    return url
    } catch (error) {
        console.log(error)
    }
}