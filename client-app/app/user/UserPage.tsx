import {useParams} from "react-router";
import {Col, Container} from "react-bootstrap";
import UserInventoryTable from "~/user/components/UserInventoryTable";
import UserInfo from "~/user/components/UserInfo";

export default function UserPage() {
    const {id} = useParams();
    return <Col>
        <Container>
            <UserInfo/>
            <UserInventoryTable isOwn={true}/>
            <UserInventoryTable isOwn={false}/>
        </Container>
    </Col>;
}