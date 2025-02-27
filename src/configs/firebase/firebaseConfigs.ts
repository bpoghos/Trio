import { Timestamp } from "firebase/firestore";

export const formatFirestoreDate = (firestoreDate: any) => {
    const date = firestoreDate instanceof Timestamp ? firestoreDate.toDate() : new Date(firestoreDate);
  
    return {
      month: date.toLocaleDateString("en-US", { month: "short" }), // 'Jan'
      day: date.toLocaleDateString("en-US", { day: "2-digit" }),   // '23'
      year: date.toLocaleDateString("en-US", { year: "numeric" })  // '2025'
    };
  };