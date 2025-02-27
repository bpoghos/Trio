import { Timestamp } from "firebase/firestore";

export interface ConcertsDataProps {
    id?: string; 
    city_name: string;
    hall_name: string;
    image: any;
    time: string;
    date: Date | Timestamp;
    link: string;
}


export const concertsData: ConcertsDataProps[] = [
    
]