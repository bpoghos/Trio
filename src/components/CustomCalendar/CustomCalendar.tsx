import React, { useEffect, useState } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import './CustomCalendar.scss';
import 'react-calendar/dist/Calendar.css';
import activeSign from '../../shared/svg/active-sign.svg';
import deactiveSign from '../../shared/svg/deactive-sign.svg';
import rightArrow from '../../shared/svg/solar--alt-arrow-right-line-duotone.svg';
import leftArrow from '../../shared/svg/solar--alt-arrow-left-line-duotone.svg';
import { useConcerts } from '../../customHooks/customHooks';
import { Timestamp } from 'firebase/firestore';

interface HoveredDate {
  date: Date;
  element: HTMLElement;
}

const CustomCalendar = () => {
  const [value, setValue] = useState<CalendarProps['value']>(new Date());
  const [hoveredDate, setHoveredDate] = useState<HoveredDate | null>(null);
  const [imageLoadedState, setImageLoadedState] = useState<{ [key: string]: boolean }>({});


  const { data, getDataFromFirestore } = useConcerts()
  const today = new Date();
  const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  useEffect(() => {
    getDataFromFirestore()
  }, [])


  const isHighlighted = (date: Date): boolean => {
    if (!data || data.length === 0) return false;

    return data.some((concert) => {
      const concertDate = concert.date instanceof Timestamp ? concert.date.toDate() : concert.date;

      // Normalize to remove time part
      const normalizedConcertDate = new Date(
        concertDate.getFullYear(),
        concertDate.getMonth(),
        concertDate.getDate()
      );
      const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      return normalizedConcertDate.getTime() === normalizedDate.getTime();
    });
  };


  const getSignForDate = (date: Date): React.ReactNode | null => {
    const concert = data.find((concert) => {
      const concertDate = concert.date instanceof Timestamp ? concert.date.toDate() : concert.date;
      const normalizedConcertDate = new Date(
        concertDate.getFullYear(),
        concertDate.getMonth(),
        concertDate.getDate()
      );
      return normalizedConcertDate.getTime() === date.getTime();
    });

    if (concert) {
      const concertDate = concert.date instanceof Timestamp ? concert.date.toDate() : concert.date;
      const isPastOrToday = concertDate < normalizedToday || concertDate === new Date();
      return <img alt="concertSign" src={isPastOrToday ? deactiveSign : activeSign} />;
    }

    return null;
  };


  const handleImageLoad = (id: string) => {
    setImageLoadedState((prevState) => ({
      ...prevState,
      [id]: true,
    }));
  };


  return (
    <div className="calendarContainer">
      <Calendar
        onChange={setValue}
        value={value}
        tileContent={({ date, view }) => {
          if (view === 'month' && isHighlighted(date)) {
            return (
              <div
                className="hover-trigger-wrapper"
                onMouseEnter={(e) =>
                  setHoveredDate({ date, element: e.currentTarget as HTMLElement })
                }
                onMouseLeave={() => setHoveredDate(null)}
              >
                {getSignForDate(date)}
              </div>
            );
          }
          return null;
        }}
        prevLabel={<img src={leftArrow} alt="Previous" />}
        nextLabel={<img src={rightArrow} alt="Next" />}
        minDetail="month"
        next2Label={null}
        prev2Label={null}
      />

      {/* Render hover content */}
      {hoveredDate && (
        <div
          className="hover-box"
          style={{
            top: hoveredDate.element.getBoundingClientRect().top - 65,
            left:
              hoveredDate.element.getBoundingClientRect().left +
              hoveredDate.element.offsetWidth / 2,

          }}
        >
          {/* Previously Section */}
          <div className='hover-previously'>
            {data
              .filter((concert) => {
                const concertDate = concert.date instanceof Timestamp ? concert.date.toDate() : concert.date;
                const normalizedConcertDate = new Date(
                  concertDate.getFullYear(),
                  concertDate.getMonth(),
                  concertDate.getDate()
                );
                return (
                  normalizedConcertDate.getTime() === hoveredDate.date.getTime() &&
                  hoveredDate.date < normalizedToday
                );
              })
              .map((concert, index) => {
                const concertDate = concert.date instanceof Timestamp ? concert.date.toDate() : concert.date;
                return (
                  <div key={index} className={`previous-concert ${hoveredDate ? 'active' : ''}`}>
                    <div className="date-container">
                      <p className="day">{concertDate.toLocaleDateString('en-US', { day: '2-digit' })}</p>
                      <p className="month">{concertDate.toLocaleDateString('en-US', { month: 'short' })}</p>
                      <p className="year">{concertDate.toLocaleDateString('en-US', { year: 'numeric' })}</p>
                    </div>
                    <div className="info-container">
                      <p className="city-name">{concert.city_name}</p>
                      <p className="hall-name">{concert.hall_name}</p>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Upcoming Section */}
          <div className="hover-upcoming">
            {data
              .filter((concert) => {
                const concertDate = concert.date instanceof Timestamp ? concert.date.toDate() : concert.date;
                const normalizedConcertDate = new Date(
                  concertDate.getFullYear(),
                  concertDate.getMonth(),
                  concertDate.getDate()
                );
                return (
                  normalizedConcertDate.getTime() === hoveredDate.date.getTime() &&
                  hoveredDate.date >= normalizedToday
                );
              })
              .map((concert, index) => {
                const concertDate = concert.date instanceof Timestamp ? concert.date.toDate() : concert.date;


                return (
                  <div key={index} className="upcoming-concert">
                    <div className="content-wrapper">
                      <div className="date-container">
                        <p className="day">
                          {concertDate.toLocaleDateString("en-US", { day: "2-digit" })}
                        </p>
                        <p className="month">
                          {concertDate.toLocaleDateString("en-US", { month: "short" })}
                        </p>
                        <p className="year">
                          {concertDate.toLocaleDateString("en-US", { year: "numeric" })}
                        </p>
                      </div>
                     <div className="image-container">
                        {/* Image with Skeleton */}
                        <img
                          alt="hall-image"
                          src={concert.image}
                          loading="lazy"
                          onLoad={() => concert.id && handleImageLoad(concert.id)} 
                          onError={() => concert.id && handleImageLoad(concert.id)}  
                          className={concert.id && imageLoadedState[concert.id] ? "visible" : "hidden"}  
                        />
                        {concert.id && !imageLoadedState[concert.id] && <div className="skeleton-loader"></div>}
                      </div>
                    </div>
                    <div className="info-container">
                      <p className="city-name">{concert.city_name}</p>
                      <p className="time">{concert.time}</p>
                      <p className="hall-name">{concert.hall_name}</p>
                    </div>
                  </div>
                );

              })}
          </div>
        </div>
      )}
    </div>

  );
};

export default CustomCalendar;
