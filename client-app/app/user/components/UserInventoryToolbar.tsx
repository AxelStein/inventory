import {Button} from "react-bootstrap";
import {MdAdd, MdDeleteOutline} from "react-icons/md";

export default function UserInventoryToolbar() {
    return <div className='mb-3'>
        <Button variant='outline-primary' className='me-2'>
            <MdAdd />
        </Button>
        <Button variant='outline-danger'>
            <MdDeleteOutline />
        </Button>
    </div>;
}