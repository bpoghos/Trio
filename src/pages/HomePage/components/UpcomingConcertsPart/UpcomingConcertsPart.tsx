import { Container } from 'react-bootstrap'
import { Subtitle } from '../../../../shared/enum/enum'
import style from "./UpcomingConcertsPart.module.scss"
import CustomCalendar from '../../../../components/CustomCalendar/CustomCalendar'
import UpcomingConcertsSchedulePart from './components/UpcomingConcertsSchedulePart'

const UpcomingConcertsPart = () => {
  return (
    <Container className={style.upcomingConcertsContainerPart}>
      <h1>{Subtitle.UpcomingConcerts}</h1>
      <Container className={style.upcomingConcertsContainer}>
       <UpcomingConcertsSchedulePart/>
        <CustomCalendar/>
      </Container>
    </Container>
  )
}

export default UpcomingConcertsPart
