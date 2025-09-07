import type { User } from "api/user/user.types";
import { formatRelative } from "date-fns";
import { Button, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

interface UserInfoProps {
    user?: User;
    onDeleteAccountClick: () => void;
    canDelete: boolean;
    isAdmin: boolean;
    onAdminClick: () => void;
}

export default function UserInfo({ user, onDeleteAccountClick, canDelete, isAdmin, onAdminClick }: UserInfoProps) {
    if (!user) {
        return null;
    }
    const { t } = useTranslation();
    return <Col className="mb-5">
        <h5>{user?.name}</h5>
        <p className="text-secondary">{user?.email}</p>
        <p className="mb-3">{t('account.lastSeen')}: {formatRelative(user?.lastSeen, new Date())}</p>
        {isAdmin && (
            <Button
                className="btn mb-3 me-3"
                onClick={onAdminClick}>
                {t('admin.title')}
            </Button>
        )}
        {canDelete && (
            <Button
                className="btn btn-danger mb-3"
                onClick={onDeleteAccountClick}>
                {t('account.btnDeleteAccount')}
            </Button>
        )}
    
    </Col>;
}