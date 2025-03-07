import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { Subtitle } from "../../../../shared/enum/enum";
import style from "./HearOurSoundPart.module.scss";
import { playIcon, pauseIcon } from "../../../../shared/svg/svgFiles";
import { useOurSounds } from "../../../../customHooks/customHooks";

const HearOurSoundPart = () => {
    const { sounds, fetchSounds } = useOurSounds();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [playingId, setPlayingId] = useState<number | null>(null);
    const location = useLocation();

    // Fetch sounds only once when component mounts
    useEffect(() => {
        fetchSounds();
    }, []);

    // Stop audio when navigating away from the home page "/"
    useEffect(() => {
        if (location.pathname !== "/") {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
                setPlayingId(null);
            }
        }
    }, [location.pathname]);

    // Function to handle play/pause logic
    const handlePlay = (track: string, id: number) => {
        // If the same track is clicked, toggle play/pause
        if (audioRef.current && playingId === id) {
            audioRef.current.pause();
            audioRef.current = null;
            setPlayingId(null);
            return;
        }

        // Pause the current audio and play the new one
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        if (!track) {
            alert("No audio track available.");
            return;
        }

        // Create new audio instance and play
        const newAudio = new Audio(track);
        newAudio.play().then(() => {
            audioRef.current = newAudio;
            setPlayingId(id);
        }).catch((error) => {
            console.error("Error playing audio:", error);
        });

        // Reset when audio ends
        newAudio.onended = () => {
            setPlayingId(null);
            audioRef.current = null;
        };
    };

    // Stop audio when clicking outside the sound items
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                audioRef.current &&
                !(event.target as HTMLElement).closest(`.${style.ourSoundItem}`)
            ) {
                audioRef.current.pause();
                audioRef.current = null;
                setPlayingId(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    // Memoize the rendered list to avoid unnecessary re-renders
    const soundsMemo = useMemo(() => {
        return sounds.map((item) => (
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
        ));
    }, [sounds, playingId]);

    return (
        <Container className={style.hearOurSoundContainer}>
            <h1>{Subtitle.HearOurSound}</h1>
            <Container className={style.cardsContainer}>{soundsMemo}</Container>
        </Container>
    );
};

export default HearOurSoundPart;
