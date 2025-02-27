import { Card } from "react-bootstrap";
import style from "./CustomCard.module.scss";
import { ConcertsDataProps } from "../../../../../../../interface/interface";
import { ButtonText } from "../../../../../../../shared/enum/enum";
import { arrowUpRight } from "../../../../../../../shared/svg/svgFiles";
import { formatFirestoreDate } from "../../../../../../../configs/firebase/firebaseConfigs";

const CustomCard = ({ concert, borderStyle }: { concert: ConcertsDataProps, borderStyle?: React.CSSProperties }) => {
  
  const {day, month, year} = formatFirestoreDate(concert.date)
  

  return (
    <Card className={style.card} style={borderStyle}>
      <Card.Header className={style.cardHeader}>
        <p className={style.day}>{day}</p>
        <p className={style.month}>{month}</p>
        <p className={style.year}>{year}</p>
      </Card.Header>
      <Card.Body className={style.cardBody}>
        <p className={style.cityName}>{concert.city_name}</p>
        <p className={style.hallName}>{concert.hall_name}</p>
        <div className={style.timeContainer}>
          <span>{concert.time}</span>
          <button onClick={() => {
    window.open(concert.link, "_blank", "noopener,noreferrer");
  }}>{ButtonText.Details}{arrowUpRight}</button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CustomCard;
