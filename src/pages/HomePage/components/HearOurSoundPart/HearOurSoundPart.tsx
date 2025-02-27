import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { Subtitle } from "../../../../shared/enum/enum";
import style from "./HearOurSoundPart.module.scss";
import { playIcon, pauseIcon } from "../../../../shared/svg/svgFiles";
import { useOurSounds } from "../../../../customHooks/customHooks";

const HearOurSoundPart = () => {
    const { sounds, fetchSounds } = useOurSounds();
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
    const [playingId, setPlayingId] = useState<number | null>(null);

    const location = useLocation();

    useEffect(() => {
        fetchSounds();

        // Stop audio when navigating away from the home page
        if (location.pathname !== "/" && currentAudio) {
            currentAudio.pause();
            setPlayingId(null);
            setCurrentAudio(null);
        }
    }, [location]); // Only depend on location

    const handlePlay = (track: string, id: number) => {
        if (currentAudio && playingId === id) {
            currentAudio.pause();
            setPlayingId(null);
            setCurrentAudio(null);
            return;
        }

        if (currentAudio) {
            currentAudio.pause();
        }

        if (!track) {
            alert("No audio track available.");
            return;
        }

        const newAudio = new Audio(track);
        newAudio.play();
        setCurrentAudio(newAudio);
        setPlayingId(id);

        newAudio.onended = () => {
            setPlayingId(null);
            setCurrentAudio(null);
        };
    };

    return (
        <Container className={style.hearOurSoundContainer}>
            <h1>{Subtitle.HearOurSound}</h1>
            <Container className={style.cardsContainer}>
                {sounds.map((item) => (
                    <div className={style.ourSoundItem} key={item.id}>
                        <img alt="soundPhotos" src={item.image} />
                        <div className={style.hoverContainer}>
                            <Button
                                className={playingId === item.id ? "playing" : ""}
                                onClick={() => handlePlay(item.audio, item.id)}
                            >
                                <div className="icon">
                                    {playingId === item.id ? pauseIcon : playIcon}
                                </div>
                            </Button>
                        </div>
                    </div>
                ))}
            </Container>
        </Container>
    );
};

export default HearOurSoundPart;
