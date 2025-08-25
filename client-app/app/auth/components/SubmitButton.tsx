import {Button} from "react-bootstrap";

interface SubmitButtonProps {
    isSubmit: boolean;
    label: string;
}

export default function SubmitButton({ isSubmit, label }: SubmitButtonProps) {
    return <Button
        className='w-100 mb-3'
        variant='outline-primary'
        type='submit'
        disabled={isSubmit}>
        {isSubmit ? '...' : label}
    </Button>;
}