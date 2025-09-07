import { format, formatRelative } from "date-fns";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

interface TableDateDataProps {
    date: Date;
}

export default function TableDateData({ date }: TableDateDataProps) {
    return <OverlayTrigger
        placement="top"
        container={document.body}
        overlay={<Tooltip>{format(date, 'MMMM dd yyyy, k:mm:ss')}</Tooltip>}>
        <div>{formatRelative(date, new Date())}</div>
    </OverlayTrigger>
}