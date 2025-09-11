import { Link, useNavigate, useParams } from "react-router";
import { Alert, Button, Col, Container, Pagination } from "react-bootstrap";
import UserInfo, { SalesforceAccountAction } from "~/user/components/UserInfo";
import { useDeleteAccountMutation, useGetUserAccountByIdQuery } from "api/user/user.api";
import { useErrorFormatter } from "~/components/error.formatter";
import { isGuest } from "~/auth/auth.check.guest";
import Loader from "~/components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useGetInventoriesQuery } from "api/inventory/inventory.api";
import { Trans, useTranslation } from "react-i18next";
import { InventoryTable } from "~/inventory/components/InventoryTable";
import { useAlertDialog } from "~/components/AlertDialogContext";
import { MdAdd } from "react-icons/md";
import { useEffect, useState, type JSX } from "react";
import CreateInventoryModal from "~/inventory/components/CreateInventoryModal";
import { toast } from 'react-toastify';
import { logout } from "api/slice/auth.slice";
import { usePagingListState } from "~/components/paging.list.state";
import type { PagingList } from "api/types";
import type { Inventory } from "api/inventory/inventory.types";
import ErrorAlert from "~/components/ErrorAlert";
import { UserRole } from "api/user/user.types";
import CreateSalesforceAccountModal from "./components/CreateSalesforceAccountModal";

const createPagingItems = (
    list: PagingList<Inventory> | undefined,
    currentPage: number,
    onPageClick: (page: number) => void,
) => {
    let items = [];
    const pageCount = list?.pageCount ?? 0;
    for (let page = 1; pageCount > 1 && page <= pageCount; page++) {
        items.push(
            <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => onPageClick(page)}>
                {page}
            </Pagination.Item>,
        );
    }
    return items;
}

export default function UserPage() {
    const { t } = useTranslation();
    const guest = isGuest();
    const { id } = useParams();
    const currentUser = useSelector((state: any) => state.auth.user);
    const { data: userAccount, error, isLoading } = useGetUserAccountByIdQuery(id, { skip: guest });
    const { formatError } = useErrorFormatter();

    const isOwn = userAccount && userAccount.id == currentUser?.id;
    const userId = Number(id);

    const [createSalesforceAccountModalVisible, setCreateSalesforceAccountModalVisible] = useState(false);
    let salesforceAccountAction;
    if (userAccount && (isOwn || currentUser?.role === UserRole.admin)) {
        salesforceAccountAction = userAccount?.salesforceAccountId ? SalesforceAccountAction.view : SalesforceAccountAction.create;
    }

    const { showAlertDialog } = useAlertDialog();
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const hideCreateModal = () => setCreateModalVisible(false);
    const [deleteAccount] = useDeleteAccountMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { page: ownPage, setPage: setOwnPage } = usePagingListState();
    const { page: writeAccessPage, setPage: setWriteAccessPage } = usePagingListState();

    const {
        data: ownInventories,
        isLoading: isLoadingOwnInventories,
        error: errorOwnInventories
    } = useGetInventoriesQuery({
        filter: 'own',
        userId: Number.isInteger(userId) ? userId : undefined,
        page: ownPage,
    });
    const [ownPagingItems, setOwnPagingItems] = useState<JSX.Element[]>();

    useEffect(() => {
        setOwnPagingItems(
            createPagingItems(ownInventories, ownPage, setOwnPage)
        );
    }, [ownInventories, ownPage]);

    const {
        data: writeAccessInventories,
        isLoading: isLoadingWriteAccessInventories,
        error: errorWriteAccessInventories
    } = useGetInventoriesQuery({
        filter: 'writeAccess',
        userId: Number.isInteger(userId) ? userId : undefined,
        page: writeAccessPage
    });

    const [writeAccessPagingItems, setwriteAccessPagingItems] = useState<JSX.Element[]>();
    useEffect(() => {
        setwriteAccessPagingItems(
            createPagingItems(writeAccessInventories, writeAccessPage, setWriteAccessPage)
        );
    }, [writeAccessInventories, writeAccessPage]);

    const handleDeleteAccountClick = () => {
        showAlertDialog({
            message: t('account.confirmDeleteDialog.msg'),
            confirmLabel: t('account.confirmDeleteDialog.btnConfirm'),
            onConfirm: () => {
                deleteAccount()
                    .unwrap()
                    .then(() => {
                        dispatch(logout());
                        navigate('/');
                    })
                    .catch(err => toast.error(formatError(err)));
            }
        });
    }
    const handleOnAddInventoryClick = () => {
        setCreateModalVisible(true);
    }
    const handleSalesforceAccountClick = (action: SalesforceAccountAction) => {
        switch (action) {
            case SalesforceAccountAction.create:
                setCreateSalesforceAccountModalVisible(true);
                break;

            case SalesforceAccountAction.view:
                break;
        }
    }
    const handleHideCreateSalesforceAccount = () => {
        setCreateSalesforceAccountModalVisible(false);
    }

    if (guest) {
        return <Alert variant="danger"><Trans i18nKey='account.forbiddenSignIn'>You have to <Link to='/auth/sign-in'>Sign in</Link> to view this page</Trans></Alert>
    }
    if (error) {
        return <ErrorAlert error={error} />
    }
    if (isLoading) {
        return <Loader />
    }
    return <Col>
        <Container>
            {userAccount && (
                <UserInfo
                    user={userAccount}
                    handleDeleteAccountClick={handleDeleteAccountClick}
                    canDelete={isOwn === true}
                    isAdmin={isOwn === true && userAccount.role === UserRole.admin}
                    handleAdminClick={() => navigate('/admin')}
                    salesforceAccountAction={salesforceAccountAction}
                    handleSalesforceAccountClick={handleSalesforceAccountClick} />
            )}

            <h4>{t('dashboard.title.ownInventories')}</h4>
            {isOwn && (
                <Button
                    variant='outline-primary'
                    className='me-2'
                    onClick={handleOnAddInventoryClick}>
                    <MdAdd /> {t('actions.add')}
                </Button>
            )}

            <InventoryTable
                inventories={ownInventories?.items}
                isLoading={isLoadingOwnInventories}
                error={errorOwnInventories} />

            {ownPagingItems && ownPagingItems?.length !== 0 && (
                <Pagination>{ownPagingItems}</Pagination>
            )}

            <h4 className="mt-3">{t('dashboard.title.writeAccessInventories')}</h4>
            <InventoryTable
                inventories={writeAccessInventories?.items}
                isLoading={isLoadingWriteAccessInventories}
                error={errorWriteAccessInventories} />

            {writeAccessPagingItems && writeAccessPagingItems?.length !== 0 && (
                <Pagination>{writeAccessPagingItems}</Pagination>
            )}
        </Container>

        <CreateInventoryModal
            show={createModalVisible}
            onHide={hideCreateModal} />

        <CreateSalesforceAccountModal
            show={createSalesforceAccountModalVisible}
            onHide={handleHideCreateSalesforceAccount} />
    </Col>;
}