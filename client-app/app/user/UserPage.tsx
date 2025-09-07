import { useNavigate, useParams } from "react-router";
import { Alert, Button, Col, Container, Pagination } from "react-bootstrap";
import UserInfo from "~/user/components/UserInfo";
import { useDeleteAccountMutation, useGetUserAccountByIdQuery } from "api/user/user.api";
import { useErrorFormatter } from "~/components/error.formatter";
import { isGuest } from "~/auth/auth.check.guest";
import Loader from "~/components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useGetInventoriesQuery } from "api/inventory/inventory.api";
import { useTranslation } from "react-i18next";
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
    const { data: userAccount, error } = useGetUserAccountByIdQuery(id, { skip: guest });
    const { formatError } = useErrorFormatter();
    const isOwn = userAccount && userAccount.id == currentUser?.id;
    const userId = Number(id);
    const { showAlertDialog } = useAlertDialog();
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const hideCreateModal = () => setCreateModalVisible(false);
    const [deleteAccount] = useDeleteAccountMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { page: ownPage, setPage: setOwnPage } = usePagingListState();
    const { page: writeAccessPage, setPage: setWriteAccessPage } = usePagingListState();

    const { data: ownInventories } = useGetInventoriesQuery({
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

    const { data: writeAccessInventories } = useGetInventoriesQuery({
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

    if (guest) {
        return <Alert variant="danger"></Alert>
    }
    if (error) {
        return <Alert variant="danger">{formatError(error)}</Alert>
    }
    if (!userAccount) {
        return <Loader />
    }

    return <Col>
        <Container>
            <UserInfo
                user={userAccount}
                onDeleteAccountClick={handleDeleteAccountClick}
                canDelete={userAccount?.id === currentUser?.id} />

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
                inventories={ownInventories?.items} />

            {ownPagingItems && ownPagingItems?.length !== 0 && (
                <Pagination>{ownPagingItems}</Pagination>
            )}

            <h4 className="mt-3">{t('dashboard.title.writeAccessInventories')}</h4>
            <InventoryTable
                inventories={writeAccessInventories?.items} />

            {writeAccessPagingItems && writeAccessPagingItems?.length !== 0 && (
                <Pagination>{writeAccessPagingItems}</Pagination>
            )}
        </Container>

        <CreateInventoryModal
            show={createModalVisible}
            onHide={hideCreateModal} />
    </Col>;
}