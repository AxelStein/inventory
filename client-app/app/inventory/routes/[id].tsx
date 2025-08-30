import { useParams } from "react-router";
import InventoryPage from "../InventoryPage";

export default function InventoryPageById() {
    const params = useParams();
    const inventoryId = Number(params.id);
    if (Number.isNaN(inventoryId)) {
        return "Invalid id";
    }
    return <InventoryPage inventoryId={inventoryId}/>;
}