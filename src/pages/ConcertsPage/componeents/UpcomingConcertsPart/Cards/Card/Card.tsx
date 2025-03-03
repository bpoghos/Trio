import { Button } from "react-bootstrap"
import style from "./Card.module.scss"
import { ConcertsDataProps } from "../../../../../../interface/interface"
import { formatFirestoreDate } from "../../../../../../configs/firebase/firebaseConfigs"
import { ButtonText } from "../../../../../../shared/enum/enum"

const Card = ({data}: {data: ConcertsDataProps}) => {

   const {day, month, year} = formatFirestoreDate(data.date)

    return (
        <div className={style.card}>
            <div className={style.corner}></div>
            <div className={style.dateContainer}>
                <p className={style.day}>{day}</p>
                <p className={style.month}>{month}</p>
                <p className={style.year}>{year}</p>
            </div>
            <div className={style.contentContainer}>
                <div className={style.imageContainer}>
                    <img alt="concertPhoto" src={data.image} className={style.image}/>
                </div>
                <div className={style.infoContainer}>
                    <p className={style.city}>{data.city_name}</p>
                    <p className={style.hall}>{data.hall_name}</p>
                    <p className={style.time}>{data.time}</p>
                </div>
            </div>
            <div className={style.linkContainer}>
            <Button 
                className={style.button} 
                onClick={() => {
                    if (data.link && data.link.length > 0) {
                        window.open(data.link, "_blank", "noopener,noreferrer");
                    }
                  }}
                disabled={!data.link || data.link.length === 0}
                >
                  {ButtonText.Details}
                </Button>
            </div>
        </div>
    )
}

export default Card
