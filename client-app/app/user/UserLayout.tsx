import {Container} from "react-bootstrap";
import {Outlet} from "react-router";

export default function UserLayout() {
    return <Container>
        <Outlet/>
    </Container>;
}