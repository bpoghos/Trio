import style from './SkeletonLoader.module.scss'

const SkeletonLoader = () => {
  return (
    <div className={style.skeletonContainer}>
            <div className={style.skeletonMonth}></div>
            <div className={style.skeletonCard}></div>
            <div className={style.skeletonCard}></div>
            <div className={style.skeletonCard}></div>
        </div>
  )
}

export default SkeletonLoader
