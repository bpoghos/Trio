import { Container } from "react-bootstrap"
import Cards from "./Cards/Cards"
import style from "./Body.module.scss"

const Body = () => {
    return (
        <Container className={style.bodyContainer}>
            <Cards/>
        </Container>
    )
}

export default Body
