import { Button, Container } from "react-bootstrap"
import style from "./UpcomingConcertsPart.module.scss"
import { ButtonText, Subtitle } from "../../../../shared/enum/enum"
import Cards from "./Cards/Cards"
import { useState } from "react"
import ArchiveCards from "./ArchiveCards/ArchiveCards"

const UpcomingConcertsPart = () => {

  const [isArchiveConcerts, setIsArchiveConcerts] = useState<boolean>(false)

  const handleArchiveButtonClick = () => {
    setIsArchiveConcerts((prev) => !prev)
  }

  return (
    <Container className={style.upcomingConcertsContainer}>
      <h1>{!isArchiveConcerts ? Subtitle.UpcomingConcerts : Subtitle.ArchiveConcerts}</h1>
      <div className={style.archivebuttonContainer}>
        <Button
          className={`${!isArchiveConcerts ? style.archiveButton : style.activeButton}`}
          onClick={handleArchiveButtonClick}>
          {!isArchiveConcerts ? ButtonText.ArchiveConcerts : ButtonText.UpcomingConcerts}
        </Button>
      </div>
      {
        !isArchiveConcerts ? (<Cards />) : (<ArchiveCards />)
      }
    </Container>
  )
}

export default UpcomingConcertsPart
