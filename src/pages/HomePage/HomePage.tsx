import OurSoundsProvider from "../../context/AudioProvider"
import AudioProvider from "../../context/AudioProvider"
import GlobalMapPart from "./components/GlobalMapPart/GlobalMapPart"
import HearOurSoundPart from "./components/HearOurSoundPart/HearOurSoundPart"
import ImagePart from "./components/ImagePart/ImagePart"
import UpcomingConcertsPart from "./components/UpcomingConcertsPart/UpcomingConcertsPart"
import style from "./HomePage.module.scss"

const HomePage = () => {
  return (
    <section className={style.sectionContainer}>
      <ImagePart />
      <UpcomingConcertsPart />
      <GlobalMapPart />
      <OurSoundsProvider>
        <HearOurSoundPart />
      </OurSoundsProvider>
    </section>
  )
}

export default HomePage
