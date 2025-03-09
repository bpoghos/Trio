import { useEffect, useState } from 'react';
import Card from './Card/Card';
import { Container, Button } from 'react-bootstrap';
import style from "./Cards.module.scss";
import { ConcertsDataProps } from '../../../../../interface/interface';
import { arrowDownIcon } from '../../../../../shared/svg/svgFiles';
import { ButtonText, UpcomingConcerts } from '../../../../../shared/enum/enum';
import { Timestamp } from 'firebase/firestore';
import { useConcerts } from '../../../../../customHooks/customHooks';
import SkeletonLoader from './SkeletonLoader/SkeletonLoader';



const Cards = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Normalize to 00:00:00

    const { data, getDataFromFirestore } = useConcerts();
    const [visibleCount, setVisibleCount] = useState(8); // Initially show only 8 concerts
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getDataFromFirestore().then(() => setIsLoading(false));
    }, []);

    // Filter and sort concerts from now onwards
    const sortedConcerts = data
        .filter((concert) => {
            const concertDate = concert.date instanceof Timestamp ? concert.date.toDate() : new Date(concert.date);
            return concertDate.getTime() >= now.getTime(); // Include today and future concerts
        })
        .sort((a, b) => {
            const dateA = a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date);
            const dateB = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date);
            return dateA.getTime() - dateB.getTime(); // Sort by date (earliest first)
        });

    const visibleConcerts = sortedConcerts.slice(0, visibleCount); // Show limited concerts

    // Group concerts by month
    const concertsByMonth: Record<string, ConcertsDataProps[]> = {};
    visibleConcerts.forEach((concert) => {
        const concertDate = concert.date instanceof Timestamp ? concert.date.toDate() : new Date(concert.date);
        const monthKey = concertDate.toLocaleString('default', { month: 'long' });

        if (!concertsByMonth[monthKey]) {
            concertsByMonth[monthKey] = [];
        }
        concertsByMonth[monthKey].push(concert);
    });

    // Handle "View More" button click
    const handleViewMore = () => {
        setVisibleCount((prev) => prev + 8); // Increase the visible count by 8
    };

    return (
        <Container className={style.cardsContainer}>
            {isLoading ? (
                <SkeletonLoader />
            ) : sortedConcerts.length === 0 ? (
                // If there are no concerts, show a message
                <div className={style.noDataTextContainer}>
                    <p className={style.text1}>{UpcomingConcerts.NoData1}</p>
                    <p className={style.text2}>{UpcomingConcerts.NoData2}</p>
                    <p className={style.text3}>{UpcomingConcerts.NoData3}</p>
                </div>
            ) : (
                Object.entries(concertsByMonth).map(([month, concerts]) => (
                    <div key={month} className={style.cards}>
                        <h5>{month}</h5>
                        {concerts.length > 0 ? (
                            concerts.map((concert) => (
                                <Card key={concert.id} data={concert} />
                            ))
                        ) : (
                            <p>No concerts in {month}.</p> // Optional: Message for empty months
                        )}
                    </div>
                ))
            )}

            {/* Show "View More" button only if there are more concerts to display */}
            {visibleCount < sortedConcerts.length && sortedConcerts.length > 0 && (
                <div className={style.buttonContainer}>
                    <Button className={style.viewMoreButton} onClick={handleViewMore}>
                        {ButtonText.ViewMore}{arrowDownIcon}
                    </Button>
                </div>
            )}
        </Container>
    );
};

export default Cards;