import style from "./BiographyPartSkeletonLoader.module.scss";

const BiographyPartSkeletonLoader = () => {
  return (
    <div className={style.skeletonContainer}>
      {/* Trio Biography Skeleton */}
      <div className={style.trioBiographyContainer}>
        <div className={style.skeletonTextContainer}>
          <div className={style.skeletonImage}></div>
          <div className={style.skeletonText}></div>
        </div>
        <div className={style.skeletonTextContainer}>
          <div className={style.skeletonText}></div>
          <div className={style.skeletonImage}></div>
        </div>
        <div className={style.skeletonTextContainer}>
          <div className={style.skeletonImage}></div>
          <div className={style.skeletonText}></div>
        </div>
      </div>
    </div>
  );
};

export default BiographyPartSkeletonLoader;
