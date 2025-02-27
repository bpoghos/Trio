import { formatFirestoreDate } from "../../../../../../configs/firebase/firebaseConfigs"
import { ConcertsDataProps } from "../../../../../../interface/interface"
import style from "./ArchiveCard.module.scss"


const ArchiveCard = ({data} : {data: ConcertsDataProps}) => {

 const {day, month, year} = formatFirestoreDate(data.date)

  return (
    <div className={style.card}>
      <div className={style.dateContainer}>
        <h4 className={style.day}>{day}</h4>
        <h4 className={style.month}>{month}</h4>
        <p className={style.year}>{year}</p>
      </div>
      <div className={style.infoContainer}>
        <h5 className={style.city}>{data.city_name}</h5>
        <p className={style.hall}>{data.hall_name}</p>
      </div>
    </div>
  )
}

export default ArchiveCard
