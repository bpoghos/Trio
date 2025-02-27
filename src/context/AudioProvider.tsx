import { createContext, ReactNode, useState, useEffect } from "react";
import { db, storage } from "../configs/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

// Define the data structure
interface OurSound {
  id: number;
  image: string; // URL of the image
  audio: string; // URL of the audio file
}

// Define the context props
interface OurSoundsContextProps {
  sounds: OurSound[];
  loading: boolean;
  error: string | null;
  fetchSounds: () => Promise<void>;
}

// Create the context
export const OurSoundsContext = createContext<OurSoundsContextProps | undefined>(undefined);

// Provider component
const OurSoundsProvider = ({ children }: { children: ReactNode }) => {
  const [sounds, setSounds] = useState<OurSound[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


    const fetchSounds = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ourSounds"));

        const soundList: OurSound[] = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data();

            // Convert gs:// URLs to HTTPS
            const audioURL = await getDownloadURL(ref(storage, data.audio));
            const imageURL = await getDownloadURL(ref(storage, data.image));

            return {
              id: data.id,
              image: imageURL, // Firebase Storage HTTPS URL
              audio: audioURL, // Firebase Storage HTTPS URL
            };
          })
        );

        setSounds(soundList);
      } catch (err) {
        console.error("Error fetching sounds:", err);
        setError("Failed to fetch sound data");
      } finally {
        setLoading(false);
      }
    };

  return (
    <OurSoundsContext.Provider value={{ sounds, loading, error, fetchSounds }}>
      {children}
    </OurSoundsContext.Provider>
  );
};

export default OurSoundsProvider;
