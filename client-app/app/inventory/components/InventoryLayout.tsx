import { Container } from "react-bootstrap";
import { Outlet } from "react-router";

export default function inventoryLayout() {
    return <Container>
        <Outlet/>
    </Container>;
}