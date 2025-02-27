import React, { useEffect, useState } from "react";
import style from "./Animation.module.scss";
import { Container } from "react-bootstrap";

const Animation: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollLock, setScrollLock] = useState(true);
    const [scrollAmount, setScrollAmount] = useState(0);
    const [lastScrollTime, setLastScrollTime] = useState(0);

    let touchStartY = 0;

    useEffect(() => {
        const handleScroll = (event: WheelEvent) => {
            const currentTime = Date.now();
            const deltaY = event.deltaY;

            setScrollAmount((prev) => prev + Math.abs(deltaY));
            setLastScrollTime(currentTime);

            if (scrollLock) {
                event.preventDefault();
                if (scrollAmount > 100 || currentTime - lastScrollTime < 1000) {
                    setIsScrolled(true);
                    setTimeout(() => setScrollLock(false), 1200);
                }
            }
        };

        const handleTouchStart = (event: TouchEvent) => {
            touchStartY = event.touches[0].clientY;
        };

        const handleTouchMove = (event: TouchEvent) => {
            const currentY = event.touches[0].clientY;
            const deltaY = touchStartY - currentY; // Swipe distance

            if (scrollLock) {
                event.preventDefault();
                setScrollAmount((prev) => prev + Math.abs(deltaY));
                if (scrollAmount > 100) {
                    setIsScrolled(true);
                    setTimeout(() => setScrollLock(false), 1200);
                }
            }
        };

        const checkInitialScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
                setScrollLock(false);
            }
        };

        checkInitialScroll();

        window.addEventListener("wheel", handleScroll, { passive: false });
        window.addEventListener("touchstart", handleTouchStart, { passive: false });
        window.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            window.removeEventListener("wheel", handleScroll);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, [scrollLock, scrollAmount]);

    return (
        <div
            className={`${style.titleContainer} ${
                isScrolled ? style.scrolled : style.initial
            }`}
        >
            <Container className={style.textContainer}>
                <h1>Khachaturian Trio</h1>
            </Container>
        </div>
    );
};

export default Animation;
