import UpcomingConcertsPart from "./componeents/UpcomingConcertsPart/UpcomingConcertsPart"
import style from "./ConcertsPage.module.scss"

const ConcertsPage = () => {
    return (
        <section className={style.sectionContainer}>
            <UpcomingConcertsPart />
        </section>
    )
}

export default ConcertsPage
