import { Reorder } from "motion/react";
import { useContext, useState } from "react";
import { InventoryContext } from "../InventoryPage";

export default function CustomIdPage() {
    const [values, setValues] = useState(['Item 1', 'Item 2']);
    const { inventory } = useContext(InventoryContext);
    
    return <Reorder.Group onReorder={setValues} values={values}>
        {values.map(value => (
            <Reorder.Item key={value} value={value}>
                {value}
            </Reorder.Item>
        ))}
    </Reorder.Group>
}