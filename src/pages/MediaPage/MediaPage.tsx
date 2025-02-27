
import ImagesPart from "./components/ImagesPart/ImagesPart"
import VideoPart from "./components/VideoPart/VideoPart"
import style from "./MediaPage.module.scss"

const MediaPage = () => {
  return (
    <section className={style.mediaPartContainer}>
      <ImagesPart />
      <VideoPart/>
    </section>
  )
}

export default MediaPage
