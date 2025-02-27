import { Container } from "react-bootstrap"
import style from "./BiographyPart.module.scss"
import { BiographyText, Subtitle } from "../../../../shared/enum/enum"
import wave from "../../../../shared/svg/about-wave.svg"
import photo from "../../../../assets/trioPhotos/Photo horizontal/Default.png"
import armineImage from "../../.././../assets/trioPhotos/armine.webp"
import shKarenImage from "../../.././../assets/trioPhotos/shkaren.webp"
import qKarenImage from "../../.././../assets/trioPhotos/qkaren.webp"



const BiographyPart = () => {
    return (
        <Container className={style.biographyPartContainer}>
            <div className={style.trioBiographyContainer}>
                <div className={`${style.text1} ${style.trioText}`}>
                    <div className={style.imageContainer}>
                        <img alt="PhotoTrioBiography" src={photo} />
                    </div>
                    <p>{BiographyText.TrioPart1}</p>
                </div>
                <div className={`${style.text2} ${style.trioText}`}>
                    <p className={style.text2Paragraph}>{BiographyText.TrioPart2}</p>
                    <div className={style.imageContainer}>
                        <img alt="PhotoTrioBiography" src={photo} />
                    </div>
                </div>
                <div className={`${style.text3} ${style.trioText}`}>
                    <div className={style.imageContainer}>
                        <img alt="PhotoTrioBiography" src={photo} />
                    </div>
                    <p>{BiographyText.TrioPart3}</p>
                </div>
            </div>

            <img alt="wave" src={wave} className={style.wave} />

            <h1>{Subtitle.TrioMembers}</h1>

            <div className={style.separateBiographyContainer}>
                <Container className={style.armineText}>
                    <img alt="ArmineGrigoryan" src={armineImage} />
                    <p><strong>{BiographyText.ArmineGrigoryan}</strong>{BiographyText.ArmineGrigoryanBiography1}</p>
                    <p>{BiographyText.ArmineGrigoryanBiography2}</p>
                </Container>
                <Container className={style.karenShText}>
                    <img alt="KarenShahgaldyan" src={shKarenImage} />
                    <p><strong>{BiographyText.KarenShahgaldyan}</strong>{BiographyText.KarenShahgaldyanBiography}</p>
                </Container>
                <Container className={style.karenQText}>
                    <img alt="KarenQocharyan" src={qKarenImage} />
                    <p><strong>{BiographyText.KarenQocharyan}</strong>{BiographyText.KarenQocharyanBiography}</p>
                </Container>
            </div>
        </Container>
    )
}

export default BiographyPart
