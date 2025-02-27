import { Subtitle } from '../../../../shared/enum/enum'
import { Container } from 'react-bootstrap'
import style from "./GlobalMapPart.module.scss"
import MapFunctional from './components/MapFunctional/MapFunctional'

const GlobalMapPart = () => {
  return (
    <Container className={style.GlobalMapContainer}>
      <h1>{Subtitle.GlobalMap}</h1>
      <MapFunctional/>
    </Container>
  )
}

export default GlobalMapPart
