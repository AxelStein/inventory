interface LoaderProps {
    loading?: boolean;
}

export default function Loader({ loading = true }: LoaderProps) {
    if (loading === true) {
        return <div className="spinner" />
    }
    return null;
}