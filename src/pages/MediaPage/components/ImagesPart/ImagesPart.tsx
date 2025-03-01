import { useEffect, useRef, useState, useMemo } from "react"; // Import useMemo
import { Button, Container, Modal } from "react-bootstrap";
import { ImageDataProps } from "./imagesData";
import style from "./ImagesPart.module.scss";
import { ButtonText } from "../../../../shared/enum/enum";
import { arrowDownIcon, arrowLeftIcon, arrowRightIcon, downloadIcon, zoomIcon } from "../../../../shared/svg/svgFiles";
import { collection, getDocs, limit, startAfter, query } from "firebase/firestore";
import { db, storage } from "../../../../configs/firebase/firebase";
import { getBlob, getDownloadURL, ref } from "firebase/storage";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";


const IMAGES_PER_PAGE = 8;

const ImagesPart = () => {
    const [imagesData, setImagesData] = useState<ImageDataProps[]>([]);
    const [lastDoc, setLastDoc] = useState<any | null>(null); // Keep track of last fetched document
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [selectedImageArray, setSelectedImageArray] = useState<ImageDataProps[]>([]);
    const [selectedImagePath, setSelectedImagePath] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [loadingImages, setLoadingImages] = useState(true); // Track image loading

    const touchStartRef = useRef<number>(0);  // Ref for storing touch start position
    const touchEndRef = useRef<number>(0);


    const fetchImages = async (nextBatch = false) => {
        if (loading || (!hasMore && nextBatch)) return;
        setLoading(true);
        setLoadingImages(true); // Start loading placeholders

        try {
            let q = query(collection(db, "mediaData"), limit(IMAGES_PER_PAGE));

            if (nextBatch && lastDoc) {
                q = query(collection(db, "mediaData"), startAfter(lastDoc), limit(IMAGES_PER_PAGE));
            }

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setHasMore(false);
                setLoading(false);
                return;
            }

            const tempImages = await Promise.all(
                querySnapshot.docs.map(async (doc) => {
                    const data = doc.data();
                    try {
                        const srcUrl = await getDownloadURL(ref(storage, data.src));
                        return {
                            id: doc.id,
                            src: srcUrl,
                            original_image: data.original_image ?? null,
                        } as ImageDataProps;
                    } catch (error) {
                        console.error("Error fetching image URL:", error);
                        return null;
                    }
                })
            );

            const validImages = tempImages.filter((img): img is ImageDataProps => img !== null);

            setImagesData((prevImages) => [...prevImages, ...validImages]);

            if (querySnapshot.docs.length < IMAGES_PER_PAGE) {
                setHasMore(false);
            } else {
                setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
            }
        } catch (error) {
            console.error("Error fetching images:", error);
        } finally {
            setLoading(false);
            setTimeout(() => setLoadingImages(false), 500); // Allow brief delay for smoother UX
        }
    };


    useEffect(() => {
        fetchImages(); // Fetch initial set of images
    }, []);

    const handleViewMore = () => {
        fetchImages(true); // Fetch the next batch of images
    };

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index);
        setSelectedImageArray(imagesData);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedImageIndex(null);
    };

    const handleNextImage = () => {
        if (selectedImageIndex !== null && selectedImageIndex < selectedImageArray.length - 1) {
            setSelectedImageIndex(selectedImageIndex + 1);
        }
    };

    const handlePrevImage = () => {
        if (selectedImageIndex !== null && selectedImageIndex > 0) {
            setSelectedImageIndex(selectedImageIndex - 1);
        }
    };

    useEffect(() => {
        const downloadImage = async () => {
            if (!selectedImagePath) return;
            setDownloading(true); // Disable button
            try {
                const fileRef = ref(storage, selectedImagePath);
                const blob = await getBlob(fileRef);
                const blobUrl = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = blobUrl;
                link.download = "downloaded_image.jpg";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
            } catch (error) {
                console.error("Error downloading image:", error);
            }
            setDownloading(false);
        };

        if (selectedImagePath) {
            downloadImage();
        }
    }, [selectedImagePath]);

    const handleDownloadClick = (imagePath: string, event: React.MouseEvent) => {
        event.stopPropagation()
        setSelectedImagePath(imagePath);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        touchStartRef.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        touchEndRef.current = e.changedTouches[0].clientX;
        if (touchEndRef.current - touchStartRef.current > 150) {
            handlePrevImage();  // Swipe Right (go to previous image)
        } else if (touchStartRef.current - touchEndRef.current > 150) {
            handleNextImage();  // Swipe Left (go to next image)
        }
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>,) => {
        const modalWidth = e.currentTarget.offsetWidth;
        const clickPosition = e.clientX;

        if (clickPosition < modalWidth / 2) {
            handlePrevImage();  // Click on the left side of the modal
        } else {
            handleNextImage();  // Click on the right side of the modal
        }
    };

    // Use useMemo to prevent unnecessary re-renders of already loaded images
    const memoizedImagesData = useMemo(() => imagesData, [imagesData]);

    const SkeletonLoader = () => {
        return (
            <Grid container spacing={2} sx={{ display: "flex", flexWrap: "wrap" }}>
                {Array.from({ length: 8 }).map((_, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                       <div style={{ paddingLeft: '16px', paddingRight: '16px' }}>
                        <Skeleton variant="rectangular" width="100%" height={260} animation="wave" />
                    </div>
                    </Grid>
                ))}
            </Grid>
        );
    };




const [loadedImages, setLoadedImages] = useState(0);

useEffect(() => {
    if (loadedImages === imagesData.length && imagesData.length > 0) {
        setLoadingImages(false);  // Hide skeletons when all images are loaded
    }
}, [loadedImages, imagesData]);

const handleImageLoad = () => {
    setLoadedImages((prev) => prev + 1);
};

    return (
        <Container className={style.imagesContainer} >
             {loadingImages ? (
            <SkeletonLoader />
        ) : (
            <div className={style.imageGrid}>
            {memoizedImagesData.map((image, index) => (
                <div
                    key={image.id}
                    className={style.gridItem}
                    onClick={() => handleImageClick(index)}
                >
                    <img
                        src={image.src}
                        alt={`image-${image.id}`}
                        loading="lazy"
                        className={style.images}
                        onLoad={handleImageLoad} // Track when each image loads
                    />
                    {/* The Zoom Icon */}
                    <div className={style.zoomIcon}>{zoomIcon}</div>
                </div>
            ))}
        </div>
        )}

        {hasMore && !loading && (
            <div className={style.buttonContainer}>
                <Button className={style.viewMoreButton} onClick={handleViewMore}>
                    {ButtonText.ViewMorePhotos} {arrowDownIcon}
                </Button>
            </div>
        )}



            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal} centered className={style.customModal}>
                <Modal.Body className={style.modalBody}>
                    <div className={style.modalContent}>
                        {/* <Button className={style.prevButton} onClick={handlePrevImage} disabled={selectedImageIndex === 0}>
                            {arrowLeftIcon}
                        </Button> */}
                        <div className={style.imageWrapper}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                            onClick={handleClick}
                        >
                            {selectedImageIndex !== null && (
                                <>
                                    <img
                                        src={selectedImageArray[selectedImageIndex]?.src}
                                        alt={`modalImage-${selectedImageIndex}`}
                                        className={style.modalImage}
                                    />
                                    <Button
                                        className={style.downloadButton}
                                        onClick={(event) => {
                                            if (selectedImageIndex !== null) {
                                                const originalPath = selectedImageArray[selectedImageIndex]?.original_image;
                                                if (originalPath) {
                                                    handleDownloadClick(originalPath, event);
                                                } else {
                                                    console.error("No valid original image path found for download.");
                                                }
                                            }
                                        }}
                                        disabled={downloading}
                                    >
                                        {downloadIcon} Download
                                    </Button>
                                </>
                            )}
                        </div>
                        {/* <Button className={style.nextButton} onClick={handleNextImage} disabled={selectedImageIndex === selectedImageArray.length - 1}>
                            {arrowRightIcon}
                        </Button> */}
                    </div>
                </Modal.Body>
            </Modal>

        </Container>

    );
};

export default ImagesPart;
