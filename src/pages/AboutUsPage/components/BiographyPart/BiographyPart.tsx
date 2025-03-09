import { useState } from "react";
import { Container } from "react-bootstrap";
import style from "./BiographyPart.module.scss";
import { BiographyText, Subtitle } from "../../../../shared/enum/enum";
import wave from "../../../../shared/svg/about-wave.svg";
import photo1 from "../../../../assets/about/photo1.png";
import photo2 from "../../../../assets/about/photo2.png";
import photo3 from "../../../../assets/about/photo3.png";
import armineImage from "../../.././../assets/trioPhotos/armine.webp";
import shKarenImage from "../../.././../assets/trioPhotos/shkaren.webp";
import qKarenImage from "../../.././../assets/trioPhotos/qkaren.webp";

const BiographyPart = () => {
    // Track image loading state
    const [imageLoadedState, setImageLoadedState] = useState({
        photo1: false,
        photo2: false,
        photo3: false,
        armineImage: false,
        shKarenImage: false,
        qKarenImage: false,
    });

    // Handle image load
    const handleImageLoad = (imageId: string) => {
        setImageLoadedState((prevState) => ({
            ...prevState,
            [imageId]: true,
        }));
    };

    return (
        <Container className={style.biographyPartContainer}>
            <div className={style.trioBiographyContainer}>
                <div className={`${style.text1} ${style.trioText}`}>
                    <div className={style.imageContainer}>
                        <img
                            alt="PhotoTrioBiography"
                            src={photo1}
                            loading="lazy"
                            onLoad={() => handleImageLoad("photo1")}
                            onError={() => handleImageLoad("photo1")}
                            className={imageLoadedState.photo1 ? style.visible : style.hidden}
                        />
                        {!imageLoadedState.photo1 && <div className={style.skeletonLoader}></div>}
                    </div>
                    <p>{BiographyText.TrioPart1}</p>
                </div>
                <div className={`${style.text2} ${style.trioText}`}>
                    <p className={style.text2Paragraph}>{BiographyText.TrioPart2}</p>
                    <div className={style.imageContainer}>
                        <img
                            alt="PhotoTrioBiography"
                            src={photo2}
                            loading="lazy"
                            onLoad={() => handleImageLoad("photo2")}
                            onError={() => handleImageLoad("photo2")}
                            className={imageLoadedState.photo2 ? style.visible : style.hidden}
                        />
                        {!imageLoadedState.photo2 && <div className={style.skeletonLoader}></div>}
                    </div>
                </div>
                <div className={`${style.text3} ${style.trioText}`}>
                    <div className={style.imageContainer}>
                        <img
                            alt="PhotoTrioBiography"
                            src={photo3}
                            loading="lazy"
                            onLoad={() => handleImageLoad("photo3")}
                            onError={() => handleImageLoad("photo3")}
                            className={imageLoadedState.photo3 ? style.visible : style.hidden}
                        />
                        {!imageLoadedState.photo3 && <div className={style.skeletonLoader}></div>}
                    </div>
                    <p>{BiographyText.TrioPart3}</p>
                </div>
            </div>

            <img alt="wave" src={wave} className={style.wave} />

            <h1>{Subtitle.TrioMembers}</h1>

            <div className={style.separateBiographyContainer}>
                <Container className={style.armineText}>
                    <img
                        alt="ArmineGrigoryan"
                        src={armineImage}
                        onLoad={() => handleImageLoad("armineImage")}
                        onError={() => handleImageLoad("armineImage")}
                        className={imageLoadedState.armineImage ? style.visible : style.hidden}
                    />
                    {!imageLoadedState.armineImage && <div className={style.skeletonLoader}></div>}
                    <p>
                        <strong className={style.name}>{BiographyText.ArmineGrigoryan}</strong>
                        {BiographyText.ArmineGrigoryanBiography1}
                    </p>
                    <p>{BiographyText.ArmineGrigoryanBiography2}</p>
                </Container>
                <Container className={style.karenShText}>
                    <img
                        alt="KarenShahgaldyan"
                        src={shKarenImage}
                        onLoad={() => handleImageLoad("shKarenImage")}
                        onError={() => handleImageLoad("shKarenImage")}
                        className={imageLoadedState.shKarenImage ? style.visible : style.hidden}
                    />
                    {!imageLoadedState.shKarenImage && <div className={style.skeletonLoader}></div>}
                    <p>
                        <strong className={style.name}>{BiographyText.KarenShahgaldyan}</strong>
                        {BiographyText.KarenShahgaldyanBiography}
                    </p>
                </Container>
                <Container className={style.karenQText}>
                    <img
                        alt="KarenQocharyan"
                        src={qKarenImage}
                        onLoad={() => handleImageLoad("qKarenImage")}
                        onError={() => handleImageLoad("qKarenImage")}
                        className={imageLoadedState.qKarenImage ? style.visible : style.hidden}
                    />
                    {!imageLoadedState.qKarenImage && <div className={style.skeletonLoader}></div>}
                    <p className={style.name}>
                        <strong>{BiographyText.KarenQocharyan}</strong>
                        {BiographyText.KarenQocharyanBiography}
                    </p>
                </Container>
            </div>
        </Container>
    );
};

export default BiographyPart;
