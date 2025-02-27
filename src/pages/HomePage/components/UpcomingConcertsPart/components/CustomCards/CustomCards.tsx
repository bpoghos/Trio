import { ConcertsDataProps } from '../../../../../../interface/interface'
import CustomCard from './CustomCard/CustomCard'

const CustomCards = ({ concert, style }: { concert: ConcertsDataProps; style?: React.CSSProperties }) => {
  return (
    <CustomCard concert={concert} borderStyle={style}/>
  )
}

export default CustomCards
