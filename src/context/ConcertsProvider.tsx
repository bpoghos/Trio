import { createContext, ReactNode, useState } from "react";
import { ConcertsDataProps } from "../interface/interface";
import { addDoc, collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../configs/firebase/firebase";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../configs/firebase/firebase"; // Import storage instance

interface ConcertsContextProps {
  data: ConcertsDataProps[];
  loading: boolean;
  error: boolean | null;
  getDataFromFirestore: () => Promise<void>;
  addDataToFirestore: (newData: ConcertsDataProps) => Promise<void>;
  editDataInFirestore: (id: string, updatedData: Partial<ConcertsDataProps>) => Promise<void>;
  deleteDataFromFirestore: (id: string) => Promise<void>;
  checkAndDeleteImage: (concertDate: string, imageUrl: string, concertId: string) => void; // Exposed function to check and delete image
  deleteImageFromStorage: (id: string) => Promise<void>;
}

export const ConcertContext = createContext<ConcertsContextProps | undefined>(undefined);

const ConcertsProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<ConcertsDataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean | null>(null);




  

  // Fetch Data from Firestore
  const getDataFromFirestore = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "concertsData"));
      const items = querySnapshot.docs.map(doc => {
        const concertData = {
          id: doc.id,
          ...doc.data(),
        } as ConcertsDataProps;

        // Convert Firestore Timestamp (if applicable) to a Date string
        const concertDate = concertData.date instanceof Date ? concertData.date : concertData.date.toDate();
        const dateString = concertDate.toISOString(); // Convert to string in ISO format

        // Ensure that imageUrl is fetched correctly, and only attempt to delete if necessary
        if (concertData.image && typeof concertData.id === 'string') {
          checkAndDeleteImage(dateString, concertData.image, concertData.id);
        }

        return concertData;
      });
      setData(items);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add Data to Firestore
  const addDataToFirestore = async (newData: ConcertsDataProps) => {
    try {
      const docRef = await addDoc(collection(db, "concertsData"), newData);
      console.log("Document added with ID:", docRef.id);
    } catch (error) {
      setError(true);
      console.error("Error posting data to Firestore:", error);
    } finally {
      setError(null);
    }
  };

  // Edit Data in Firestore
  const editDataInFirestore = async (id: string, updatedData: Partial<ConcertsDataProps>) => {
    try {
      const docRef = doc(db, "concertsData", id);
      await updateDoc(docRef, updatedData);
      console.log("Document updated with ID:", id);
      
      setData(prevData =>
        prevData.map(item => (item.id === id ? { ...item, ...updatedData } : item))
      );
    } catch (error) {
      console.error("Error updating data in Firestore:", error);
    }
  };

  // Delete Data from Firestore
  const deleteDataFromFirestore = async (id: string) => {
    try {
      await deleteDoc(doc(db, "concertsData", id)); // Delete from Firestore
      console.log("Document deleted with ID:", id);

      // Update local state to remove the deleted item
      setData(prevData => prevData.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting data from Firestore:", error);
    }
  };

  // const isProduction = process.env.NODE_ENV === 'production';

  const deleteImageFromStorage = async (imageUrl: string) => {
    try {
      if (!imageUrl.includes("placeholder-image")) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
        console.log("Image deleted successfully from Firebase Storage.");
      }
    } catch (error: any) {
      if (error.code === "storage/object-not-found") {
        return;
      }
      console.error("Error deleting image from Firebase Storage:", error);
    }
  };
  
  
  // Update image URL in Firestore (set to empty string)
  const updateImageInFirestore = async (concertId: string) => {
    try {
      const concertDocRef = doc(db, "concertsData", concertId);
      await updateDoc(concertDocRef, { image: "" }); // Set the image field to an empty string
      console.log("Image field updated to empty string in Firestore.");
    } catch (error) {
      console.error("Error updating image in Firestore:", error);
    }
  };

  // Check if the concert's date is in the past and delete the image if needed
  const checkAndDeleteImage = (concertDate: string, imageUrl: string | undefined, concertId: string) => {
    const currentDate = new Date();
    const concertDateObj = new Date(concertDate);
  
    // Set both currentDate and concertDateObj to midnight (00:00) for accurate comparison
    currentDate.setHours(0, 0, 0, 0); // Set to midnight
    concertDateObj.setHours(0, 0, 0, 0); // Set to midnight
  
    // Compare the dates only (ignoring time)
    if (concertDateObj < currentDate && imageUrl) {
      if (!imageUrl.includes("placeholder-image")) {
        console.log("Attempting to delete image from Storage:", imageUrl);
        deleteImageFromStorage(imageUrl);
        updateImageInFirestore(concertId);
      }
    }
  };
  
  return (
    <ConcertContext.Provider
      value={{
        data,
        loading,
        error,
        getDataFromFirestore,
        addDataToFirestore,
        editDataInFirestore,
        deleteDataFromFirestore,
        checkAndDeleteImage, // Expose the function to check and delete images
        deleteImageFromStorage,
      }}
    >
      {children}
    </ConcertContext.Provider>
  );
};

export default ConcertsProvider;
