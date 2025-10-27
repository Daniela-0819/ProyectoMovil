/*import {db} from '../config/firebase'
import { collection, doc, addDoc, getDocs, getDoc,serverTimestamp } from 'firebase/firestore';

const COLLECTION_NAME = 'profiles';
//Crear Crud

export const createProfile = async (profileData) => { 
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...profileData, 
            fechaCreacion: serverTimestamp()
        });
            console.log("Perfil creado con exito",docRef.id);
        
    }catch(error){
        console.error("Error creating profile:", error);
        throw error;
    }
}*/