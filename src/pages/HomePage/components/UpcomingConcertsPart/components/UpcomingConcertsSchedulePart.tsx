import { Button, Container } from 'react-bootstrap';
import style from "./UpcomingConcertsSchedulePart.module.scss";
import CustomCards from './CustomCards/CustomCards';
import { ButtonText, UpcomingConcerts } from '../../../../../shared/enum/enum';
import { useNavigate } from 'react-router';
import { Timestamp } from 'firebase/firestore';
import { useConcerts } from '../../../../../customHooks/customHooks';
import { useEffect } from 'react';

const UpcomingConcertsSchedulePart = () => {

    const {data, getDataFromFirestore} = useConcerts()
    // Get the current date and normalize (set time to 00:00:00)
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Normalize current date to midnight

    const navigate = useNavigate();


useEffect(() =>{
    getDataFromFirestore()
},[])


    // Filter, sort, and get the nearest 3 future concerts (including today)
    const nearestThreeConcerts = data
        .filter((concert) => {
            const concertDate = concert.date instanceof Timestamp ? concert.date.toDate() : new Date(concert.date);
            concertDate.setHours(0, 0, 0, 0); // Normalize concert date to midnight
            return concertDate >= currentDate; // Include today and future dates
        })
        .sort((a, b) => {
            const dateA = a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date);
            const dateB = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date);
            return dateA.getTime() - dateB.getTime(); // Sort by date ascending
        })
        .slice(0, 3); // Get the first 3 concerts

    return (
        <Container className={style.upcomingConcertsScheduleContainer}>
            {nearestThreeConcerts.length > 0 ? (
                nearestThreeConcerts.map((concert, index) => (
                    <CustomCards
                        key={index}
                        concert={concert}
                        style={{
                            position: "relative",
                            marginBottom: "20px", // Create the 20px spacing
                            paddingBottom: "20px", // Ensure space for the border effect
                            ...(index !== nearestThreeConcerts.length - 1 && {
                                borderBottom: "0.5px solid #89A5C1",
                            }),
                        }}
                    />
                ))
            ) : (
                <div className={style.noDataContainer}>
                    <p>{UpcomingConcerts.NoData1}</p>
                    <p>{UpcomingConcerts.NoData2}</p>
                    <p>{UpcomingConcerts.NoData3}</p>
                </div>
            )}
            {/* Render the button only if there are concerts */}
            {nearestThreeConcerts.length > 0 && (
                <Button
                    className={style.button}
                    onClick={() => navigate("/concerts")}
                >
                    {ButtonText.ViewAll}
                </Button>
            )}
        </Container>
    );
};

export default UpcomingConcertsSchedulePart;
