import { useTranslation } from "react-i18next";

export const useErrorFormatter = () => {
    const { t } = useTranslation();
    const formatError = (err: any) => (err.data ? err.data.message : t('networkError'))
    return { formatError };
}