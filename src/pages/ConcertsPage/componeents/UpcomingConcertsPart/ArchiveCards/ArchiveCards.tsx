import { Container, FormCheck } from "react-bootstrap";
import { useEffect, useState } from "react";
import style from "./ArchiveCards.module.scss";
import ArchiveCard from "./ArchiveCard/ArchiveCard";
import { ConcertsDataProps } from "../../../../../interface/interface";
import { arrowLeftIcon, arrowRightIcon } from "../../../../../shared/svg/svgFiles";
import { Timestamp } from "firebase/firestore";
import { useConcerts } from "../../../../../customHooks/customHooks";

const ArchiveCards = () => {
  const [oldToNew, setOldToNew] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year

  const {data, getDataFromFirestore} = useConcerts()

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const currentYear = now.getFullYear();

  // Generate years from 1999 to current year
  const uniqueYears = Array.from({ length: currentYear - 1999 + 1 }, (_, i) => 1999 + i).reverse();


  useEffect(() => {
    getDataFromFirestore()
  }, [])

  // Filter concerts by selected year
  const filteredConcerts = data
  .filter((concert) => {
    // Check if the date is a Timestamp, and if so, convert it to a Date object
    const concertDate = concert.date instanceof Timestamp ? concert.date.toDate() : new Date(concert.date);
    const concertYear = concertDate.getFullYear();
    return concertYear === selectedYear && concertDate.getTime() < now.getTime();
  })
  .sort((a, b) => {
    const aDate = a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date);
    const bDate = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date);
    return aDate.getTime() - bDate.getTime();
  });
  // Group concerts by month
  const concertsByMonth: Record<number, ConcertsDataProps[]> = {};
  filteredConcerts.forEach((concert) => {
    // Convert Timestamp to Date if necessary
    const concertDate = concert.date instanceof Timestamp ? concert.date.toDate() : new Date(concert.date);
    const monthIndex = concertDate.getMonth();
    
    if (!concertsByMonth[monthIndex]) {
      concertsByMonth[monthIndex] = [];
    }
    concertsByMonth[monthIndex].push(concert);
  });
  

  // Sort months based on checkbox state
  const sortedMonthKeys = Object.keys(concertsByMonth)
    .map(Number)
    .sort((a, b) => (oldToNew ? b - a : a - b));

  return (
    <Container className={style.archiveCardsContainer}>
      {/* Year Selection */}
      <div className={style.yearsContainer}>
        <div className={style.yearsDropdownContainer}>
          <div className={style.buttonLeft}
            onClick={() => {
              if (selectedYear > 1999) setSelectedYear(prev => prev - 1);
            }}
            style={{ opacity: selectedYear === 1999 ? 0.5 : 1, pointerEvents: selectedYear === 1999 ? 'none' : 'auto' }}
          >
            {arrowLeftIcon}
          </div>
          <div
            className={`${style.dropdown} ${isDropdownOpen ? style.open : ""}`}
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            <h5>{selectedYear}</h5>
            {isDropdownOpen && (
              <div className={style.boxDropdown}>
                {uniqueYears.map((year) => (
                  <div
                    key={year}
                    className={style.dropdownItem}
                    onClick={(event) => {
                      event.stopPropagation(); // Prevents the event from propagating to parent elements
                      setSelectedYear(year);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {year}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={style.buttonRight}
            onClick={() => {
              if (selectedYear < currentYear) setSelectedYear(prev => prev + 1);
            }}
            style={{ opacity: selectedYear === currentYear ? 0.5 : 1, pointerEvents: selectedYear === currentYear ? 'none' : 'auto' }}
          >
            {arrowRightIcon}
          </div>
        </div>
      </div>

      {/* Sorting Checkbox */}
      <div className={style.checkboxContainer}>
        <FormCheck
          className="checkbox"
          type="checkbox"
          label=""
          checked={oldToNew}
          onChange={(e) => setOldToNew(e.target.checked)}
        />
        <label htmlFor="custom-checkbox" className={style.formCheckLabel}>
    Sort from old to new
  </label>
      </div>

      {/* Concerts List */}
      <div className={style.cardsContainer}>
        {sortedMonthKeys.length > 0 ? (
          sortedMonthKeys.map((monthKey) => {
            const monthName = new Date(2000, monthKey, 1).toLocaleString("default", { month: "long" });
            return (
              <div key={monthKey} className={style.monthGroup}>
                <h5 className={style.month}>{monthName}</h5>
                <div className={style.cardsRow}>
                  {concertsByMonth[monthKey].map((concert) => (
                    <ArchiveCard key={concert.id} data={concert} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <p className={style.noDataText}>No concerts found for {selectedYear}.</p>
        )}
      </div>
    </Container>
  );
};

export default ArchiveCards;
