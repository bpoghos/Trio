import React, { useEffect, useRef, useState } from "react";
import { SVG, Svg } from "@svgdotjs/svg.js";
import style from "./MapFunctional.module.scss";
import earth from "../../../../../../assets/defaultMap.svg";
import { FormCheck } from "react-bootstrap";
import "./MapFunctional.scss"
import { markers } from "./markers";




const MapFunctional: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [svgContent, setSvgContent] = useState<string>("");
    const [zoomLevel, setZoomLevel] = useState<number>(1);
    const [viewBox, setViewBox] = useState<{ x: number; y: number; width: number; height: number }>({
        x: 0,
        y: 0,
        width: 1000,
        height: 600,
    });
    const [isMapActive, setIsMapActive] = useState<boolean>(false);
    const [hoverInfo, setHoverInfo] = useState<{ country: string; city: string; x: number; y: number } | null>(null);
    const [isChecked, setIsChecked] = useState(false); // State for checkbox
    const [touchStartDistance, setTouchStartDistance] = useState<number | null>(null);
const [touchStartZoom, setTouchStartZoom] = useState<number>(zoomLevel);
const [isTouchZooming, setIsTouchZooming] = useState(false); 
const [touchStartX, setTouchStartX] = useState<number>(0);
const [touchStartY, setTouchStartY] = useState<number>(0);
const [startViewBox, setStartViewBox] = useState<{ x: number; y: number; width: number; height: number }>(viewBox);
const [isPanning, setIsPanning] = useState(false);





    const handleCheckboxChange = () => {
        setIsChecked((prev) => {
            const newState = !prev;

            if (mapRef.current) {
                const paths = mapRef.current.node.querySelectorAll("path");

                paths.forEach((path) => {
                    const countryId = path.getAttribute("id"); // Get path's ID
                    if (markers.some(marker => marker.countryId === countryId)) {
                        path.setAttribute("fill", newState ? "#171717" : "#cccccc");
                    }
                });
            }




            return newState;
        });
    };




   


    const mapRef = useRef<Svg | null>(null);

    useEffect(() => {
        const preventGlobalZoom = (event: TouchEvent) => {
            // Prevent pinch-zoom globally
            if (event.touches.length > 1) {
                event.preventDefault(); // Prevent pinch-to-zoom behavior on the whole page
            }
        };
    
        // Add event listener to block pinch-to-zoom globally
        window.addEventListener("touchstart", preventGlobalZoom, { passive: false });
        window.addEventListener("touchmove", preventGlobalZoom, { passive: false });
    
        return () => {
            window.removeEventListener("touchstart", preventGlobalZoom);
            window.removeEventListener("touchmove", preventGlobalZoom);
        };
    }, []);

    

    const handleTouchStart = (event: TouchEvent) => {
        if (event.touches.length === 1) {
            setIsPanning(true); // Start panning
        }
    
        if (event.touches.length === 2) {
            setIsTouchZooming(true); // Start zooming
        }
        if (event.touches.length === 1) {
            // Track initial touch position
            const touch = event.touches[0];
            const boundingRect = mapContainerRef.current!.getBoundingClientRect();
    
            // Store the initial touch position and current viewBox
            setTouchStartX(touch.clientX - boundingRect.left);
            setTouchStartY(touch.clientY - boundingRect.top);
            setStartViewBox(viewBox); // Store the current viewBox at the start of the touch
        }
    
        if (event.touches.length === 2) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            const distance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2)
            );
            setTouchStartDistance(distance);
            setTouchStartZoom(zoomLevel);
            setIsTouchZooming(true);
        }
    };
    
    const handleTouchMove = (event: TouchEvent) => {

        if (isTouchZooming || isPanning) {
            event.preventDefault(); // Prevent scroll only when interacting with the map
        }
        if (event.touches.length === 2 && touchStartDistance !== null && isTouchZooming) {
            // Zooming logic (same as before)
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            const currentDistance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2)
            );
            const zoomFactor = currentDistance / touchStartDistance;
    
            const newZoomLevel = Math.min(Math.max(touchStartZoom * zoomFactor, 1), 10);
            const boundingRect = mapContainerRef.current!.getBoundingClientRect();
            const mouseX = (touch1.clientX + touch2.clientX) / 2 - boundingRect.left;
            const mouseY = (touch1.clientY + touch2.clientY) / 2 - boundingRect.top;
    
            const relativeX = (mouseX / boundingRect.width) * viewBox.width + viewBox.x;
            const relativeY = (mouseY / boundingRect.height) * viewBox.height + viewBox.y;
    
            const newWidth = viewBox.width / (newZoomLevel / zoomLevel);
            const newHeight = viewBox.height / (newZoomLevel / zoomLevel);
    
            const newX = relativeX - (mouseX / boundingRect.width) * newWidth;
            const newY = relativeY - (mouseY / boundingRect.height) * newHeight;
    
            setViewBox({ x: newX, y: newY, width: newWidth, height: newHeight });
            setZoomLevel(newZoomLevel);
        } else if (event.touches.length === 1 && !isTouchZooming) {
            // Panning logic (one finger)
            const touch = event.touches[0];
            const boundingRect = mapContainerRef.current!.getBoundingClientRect();
    
            // Calculate how much the user moved their finger
            const deltaX = (touch.clientX - boundingRect.left) - touchStartX;
            const deltaY = (touch.clientY - boundingRect.top) - touchStartY;
    
            // Calculate the new viewBox by adding the movement deltas to the initial viewBox
            setViewBox({
                x: startViewBox.x - deltaX * (viewBox.width / boundingRect.width),
                y: startViewBox.y - deltaY * (viewBox.height / boundingRect.height),
                width: viewBox.width,
                height: viewBox.height,
            });
        }
    };
    
    const handleTouchEnd = () => {
        setIsTouchZooming(false);
        setTouchStartDistance(null);
        setTouchStartZoom(zoomLevel);
        setIsPanning(false);
    };
    
    useEffect(() => {
        const container = mapContainerRef.current;
        if (container) {
            container.addEventListener("touchstart", handleTouchStart, { passive: false });
            container.addEventListener("touchmove", handleTouchMove, { passive: false });
            container.addEventListener("touchend", handleTouchEnd);

            return () => {
                container.removeEventListener("touchstart", handleTouchStart);
                container.removeEventListener("touchmove", handleTouchMove);
                container.removeEventListener("touchend", handleTouchEnd);
            };
        }
    }, [zoomLevel, viewBox, isTouchZooming]);
 
    // Fetch the SVG content
    useEffect(() => {
        fetch(earth)
            .then((response) => response.text())
            .then((data) => {
                setSvgContent(data);
    
                // ✅ Extract width and height from the SVG dynamically
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = data;
                const svgElement = tempDiv.querySelector("svg");
    
                if (svgElement) {
                    const svgWidth = parseFloat(svgElement.getAttribute("width") || "1000");
                    const svgHeight = parseFloat(svgElement.getAttribute("height") || "600");
    
                    setViewBox({ x: 0, y: 0, width: svgWidth, height: svgHeight });
                }
            })
            .catch((error) => console.error("Error fetching SVG:", error));
    }, []);
    

    // Initialize the SVG and markers
    useEffect(() => {
        if (mapContainerRef.current && svgContent) {
            if (!mapRef.current) { 
                // Initialize the SVG only once
                const draw = SVG().addTo(mapContainerRef.current).size("100%", "100%");
                mapRef.current = draw;
                draw.svg(svgContent).attr({
                    preserveAspectRatio: "xMidYMid meet",
                    "shape-rendering": "crispEdges",
                    "vector-effect": "non-scaling-stroke",
                });
            }
    
            const draw = mapRef.current;
    
            //  Maintain current zoom/viewBox instead of resetting it
            draw.viewbox(viewBox.x, viewBox.y, viewBox.width, viewBox.height);
    
            // Remove only old markers, but keep the zoom state
            draw.find("image").forEach((marker) => marker.remove());
    
            // Re-add markers when checkbox is checked
            if (!isChecked) {
                markers.forEach((marker) =>
                    addMarker(marker.x, marker.y, marker.country, marker.city, marker.countryId, draw)
                );
            }
        }
    }, [svgContent, isChecked]); // Removed viewBox dependency to prevent unwanted resets
    






    // Handle zooming and keep it centered
    // Handle zooming and keep it centered
const handleWheel = (event: WheelEvent) => {
    if (!isMapActive) return;
    event.preventDefault();

    const zoomStep = 1.05;
    const zoomFactor = event.deltaY < 0 ? zoomStep : 1 / zoomStep;
    const newZoomLevel = zoomLevel * zoomFactor;
    const clampedZoom = Math.max(1, Math.min(newZoomLevel, 10));

    if (clampedZoom === 1) {
        // ✅ Preserve the current viewBox instead of resetting
        setViewBox((prev) => ({
            ...prev,
            width: prev.width,
            height: prev.height,
        }));
    } else {
        const boundingRect = mapContainerRef.current!.getBoundingClientRect();
        const mouseX = event.clientX - boundingRect.left;
        const mouseY = event.clientY - boundingRect.top;

        const relativeX = (mouseX / boundingRect.width) * viewBox.width + viewBox.x;
        const relativeY = (mouseY / boundingRect.height) * viewBox.height + viewBox.y;

        const newWidth = viewBox.width / (clampedZoom / zoomLevel);
        const newHeight = viewBox.height / (clampedZoom / zoomLevel);

        const newX = relativeX - (mouseX / boundingRect.width) * newWidth;
        const newY = relativeY - (mouseY / boundingRect.height) * newHeight;

        setViewBox({ x: newX, y: newY, width: newWidth, height: newHeight });
    }

    setZoomLevel(clampedZoom);
};

// ✅ Preserve zoom level when resizing the window
useEffect(() => {
    const handleResize = () => {
        if (mapRef.current) {
            // Maintain the current zoom and viewBox on resize
            mapRef.current.viewbox(viewBox.x, viewBox.y, viewBox.width, viewBox.height);
        }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
}, [viewBox]);


    // Handle panning with mouse drag
    const handleMouseDown = (event: MouseEvent) => {
        if (!isMapActive) return;

        let isDragging = true;
        let startX = event.clientX;
        let startY = event.clientY;
        let startViewBoxX = viewBox.x;
        let startViewBoxY = viewBox.y;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (!isDragging) return;

            const dx = (moveEvent.clientX - startX) * (viewBox.width / mapContainerRef.current!.clientWidth);
            const dy = (moveEvent.clientY - startY) * (viewBox.height / mapContainerRef.current!.clientHeight);

            setViewBox((prev) => ({
                ...prev,
                x: startViewBoxX - dx,
                y: startViewBoxY - dy,
            }));
        };

        const handleMouseUp = () => {
            isDragging = false;
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    useEffect(() => {
        if (mapContainerRef.current) {
            const container = mapContainerRef.current;
            container.addEventListener("wheel", handleWheel as EventListener, { passive: false });
            container.addEventListener("mousedown", handleMouseDown as EventListener);

            return () => {
                container.removeEventListener("wheel", handleWheel as EventListener);
                container.removeEventListener("mousedown", handleMouseDown as EventListener);
            };
        }
    }, [isMapActive, viewBox]);

    // Update the viewBox on zoom/pan
    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.viewbox(viewBox.x, viewBox.y, viewBox.width, viewBox.height);
        }
    }, [viewBox, isChecked]);

    // Add markers and hover info
    const addMarker = (x: number, y: number, country: string, city: string, countryId: string, draw: Svg): void => {
        const marker = draw.image("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjRkY2ODI0IiBkPSJNMTIgMTEuNUEyLjUgMi41IDAgMCAxIDkuNSA5QTIuNSAyLjUgMCAwIDEgMTIgNi41QTIuNSAyLjUgMCAwIDEgMTQuNSA5YTIuNSAyLjUgMCAwIDEtMi41IDIuNU0xMiAyYTcgNyAwIDAgMC03IDdjMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2E3IDcgMCAwIDAtNy03Ii8+PC9zdmc+")
            .center(x, y);
    
        marker.on("mouseenter", (event: any) => {
            const mouseEvent = event as MouseEvent;
            setHoverInfo({ country, city, x: mouseEvent.clientX, y: mouseEvent.clientY });
    
            const path = document.getElementById(countryId);
            if (path) {
                path.setAttribute("fill", "#171717");
                path.style.transition = "transform 0.6s ease, fill 0.6s ease";
                path.style.transform = "scaleY(0.998)";
           


            }
        });
    
        marker.on("mousemove", (event: any) => {
            const mouseEvent = event as MouseEvent;
            setHoverInfo((prev) => prev ? { ...prev, x: mouseEvent.clientX, y: mouseEvent.clientY } : null);
        });
    
        marker.on("mouseleave", () => {
            setHoverInfo(null);
            const path = document.getElementById(countryId);
            if (path) {
                path.setAttribute("fill", "#cccccc");
                path.style.transform = "scaleY(1)";
            }
        });
    };
    
    




    return (
        <div
            className={style.mapContainer}
            ref={mapContainerRef}
            onClick={() => setIsMapActive(true)}
        >



            <div className={style.checkboxContainer}>
                <FormCheck
                    className="checkbox"
                    type="checkbox"
                    label="Show all visited countries"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                />

            </div>



            {hoverInfo && (
                <div
                    className={style.countryHover}
                    style={{
                        top: hoverInfo.y + 10, // Offset from cursor
                        left: hoverInfo.x + 10,
                        position: "fixed", // Ensures it follows the mouse
                        transform: "translateX(0)",
                    }}
                >
                    <p className={style.country}>{hoverInfo.country}</p>
                    <p className={style.city}>{hoverInfo.city}</p>
                </div>
            )}

        </div>
    );
};

export default MapFunctional;