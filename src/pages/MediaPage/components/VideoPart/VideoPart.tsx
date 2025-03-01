import { Container, Nav } from 'react-bootstrap'
import style from "./VideoPart.module.scss"
import { useState } from 'react'
import LogosYoutubeIcon, { arrowUpRight } from '../../../../shared/svg/svgFiles'
import defaultPhotoOfYoutube from "../../../../assets/video_image.webp"
import { ButtonText } from '../../../../shared/enum/enum'


const VideoPart = () => {
  const [isPlaying, setIsPlaying] = useState(false)

  // Function to start video on first tap/click
  const handlePlay = () => {
    setIsPlaying(true)
  }

  return (
    <Container fluid className={style.videoPartContainer}>
      <div className={style.videoContainer}>
        {!isPlaying ? (
          <div
            className={style.thumbnailOverlay}
            onClick={handlePlay}
            onTouchStart={handlePlay} // Ensures one-tap play
          >
            <img
              src={defaultPhotoOfYoutube}
              alt="Video Thumbnail"
              className={style.thumbnail}
            />
            <button className={style.playButton}>
              <LogosYoutubeIcon className={style.youtubeIcon} />
            </button>
          </div>
        ) : (
          <iframe
            className={style.videoPlayer}
            src="https://www.youtube.com/embed/hX6rURB55Zw?autoplay=1" // Autoplay ensures instant play
            title="YouTube video player"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        )}
      </div>

      <Nav.Link
        className={style.linkToYoutube}
        href='https://www.youtube.com/@khachaturyantrio'
         target="_blank"
        rel="noopener noreferrer"
        >
        <span className={style.firstPart}>{ButtonText.YoutubeLinkFirstText}</span>
        <LogosYoutubeIcon className={style.youtubeLogo} />
        <span className={style.secondPart}>{ButtonText.YoutubeLinkSecondText}</span>{arrowUpRight}
      </Nav.Link>
    </Container>
  )
}

export default VideoPart
