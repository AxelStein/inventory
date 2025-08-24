import {Col, Container, Stack} from "react-bootstrap";
import {Outlet} from "react-router";

export default function AuthLayout() {
    return <Container fluid className="d-flex justify-content-center align-items-center" style={{minHeight: '100vh'}}>
        <Col md={6} className="text-center">
            <Stack>
                <Outlet/>
            </Stack>
        </Col>
    </Container>;
}