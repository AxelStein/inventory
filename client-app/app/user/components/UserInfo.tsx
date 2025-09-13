import type { User } from "api/user/user.types";
import { formatRelative } from "date-fns";
import { Button, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

interface UserInfoProps {
    user?: User;
    canDelete: boolean;
    handleDeleteAccountClick: () => void;
    isAdmin: boolean;
    handleAdminClick: () => void;
    salesforceAccountAction?: SalesforceAccountAction;
    handleSalesforceAccountClick?: (action: SalesforceAccountAction) => void;
}

export enum SalesforceAccountAction {
    create,
    view
}

export default function UserInfo({
    user,
    handleDeleteAccountClick,
    canDelete,
    isAdmin,
    handleAdminClick,
    salesforceAccountAction,
    handleSalesforceAccountClick,
}: UserInfoProps) {
    if (!user) {
        return null;
    }
    const { t } = useTranslation();
    return <Col className="mb-5">
        <h5>{user?.name}</h5>
        <p className="text-secondary">{user?.email}</p>
        <p className="mb-3">{t('account.lastSeen')}: {formatRelative(user?.lastSeen, new Date())}</p>

        <div className="d-flex mb-3">
            {isAdmin && (
                <Button
                    className="btn me-3"
                    onClick={handleAdminClick}>
                    {t('admin.title')}
                </Button>
            )}
            {canDelete && (
                <Button
                    className="btn btn-danger me-3"
                    onClick={handleDeleteAccountClick}>
                    {t('account.btnDeleteAccount')}
                </Button>
            )}
            {salesforceAccountAction === SalesforceAccountAction.create && (
                <Button
                    className="btn me-3"
                    onClick={() => handleSalesforceAccountClick?.(SalesforceAccountAction.create)}>
                    {t('account.salesforce.action.connect')}
                </Button>
            )}
            {salesforceAccountAction === SalesforceAccountAction.view && (
                <Button
                    className="btn me-3"
                    onClick={() => handleSalesforceAccountClick?.(SalesforceAccountAction.view)}>
                    {t('account.salesforce.action.view')}
                </Button>
            )}
        </div>

    </Col>;
}