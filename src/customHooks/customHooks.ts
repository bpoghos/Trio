import { useContext } from "react";
import { ConcertContext } from "../context/ConcertsProvider";
import { OurSoundsContext } from "../context/AudioProvider";



export const useConcerts = () => {
    const context = useContext(ConcertContext);
    if (!context) {
      throw new Error("useConcerts must be used within a ConcertsProvider");
    }
    return context;
  };



  
  export const useOurSounds = () => {
    const context = useContext(OurSoundsContext);
    if (!context) {
      throw new Error("useOurSounds must be used within an OurSoundsProvider");
    }
    return context;
  };
  