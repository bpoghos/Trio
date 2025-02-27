import React from "react";
// import profilePicture from "../../../../assets/profilePic.jpg";
import style from "./ImagePart.module.scss";
// import { Container } from "react-bootstrap";
import Animation from "./Animation/Animation";
// import wave from "../../../../shared/svg/wave.svg"
// import descriptionWave from "../../../../shared/svg/descriptionWave.svg"
import demo from "../../../../shared/svg/hhh.svg"

const ImagePart: React.FC = () => {



  return (
    <>
      <div className={style.imageContainer}>
        {/* <div className={style.imageEffect}></div> */}
        <img alt="ddd" src={demo} className={style.image}/>
        {/* <img
          className={style.image}
          alt="profilePicture"
          src={profilePicture}
        /> */}
        <Animation />
      </div>
      {/* <img alt="" src={wave} className={style.wave} /> */}
      {/* <div className={style.descriptionWave}>
        <img alt="" src={descriptionWave} />
        <p className={style.descriptionFirst}>
          <span className={style.quoteMark}>“</span> Music is a higher revelation than all wisdom and philosophy.<span className={style.quoteMark}>”</span>
        </p>
        <p className={style.descriptionSecond}>— Ludwig van Beethoven</p>
      </div> */}
    </>
  );
};

export default ImagePart;
