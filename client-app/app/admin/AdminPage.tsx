import { useBlockUsersByIdsMutation, useChangeUserRoleByIdsMutation, useDeleteUsersByIdsMutation, useGetUsersQuery } from "api/user/user.admin.api";
import type { User } from "api/user/user.types";
import { useEffect, useState, type FormEvent, type FormEventHandler } from "react";
import { Alert, Button, Col, Container, Form, Modal, OverlayTrigger, Table } from "react-bootstrap";
import { MdAdminPanelSettings, MdBlock, MdDeleteOutline, MdLock, MdOutlineLockOpen } from "react-icons/md";
import InfiniteScroll from "react-infinite-scroll-component";
import { useErrorFormatter } from "~/components/error.formatter";
import Loader from "~/components/Loader";
import { usePagingListState } from "~/components/paging.list.state";
import TableDateData from "~/components/TableDateData";
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import { useGetAppConfigQuery } from "api/app/app.api";

export default function AdminPage() {
    const {
        page,
        setPage,
        sortBy,
        sortAsc,
        fetchNextPage,
        handleColumnClick,
        renderSortIndicator
    } = usePagingListState('name');

    const { data, error, refetch } = useGetUsersQuery({
        page,
        perPage: 25,
        sortBy,
        sortAsc
    });

    const { data: appConfig } = useGetAppConfigQuery();
    const { t } = useTranslation();
    const [roleModalVisible, setRoleModalVisible] = useState(false);

    const [deleteUsers] = useDeleteUsersByIdsMutation();
    const [blockUsers] = useBlockUsersByIdsMutation();
    const [changeRole] = useChangeUserRoleByIdsMutation();

    const [users, setUsers] = useState<User[]>([]);
    const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());

    const refreshData = () => {
        setCheckedIds(new Set());
        setPage(1);
        refetch();
    }

    const handleError = (err: any) => {
        toast.error(formatError(err));
    }

    useEffect(() => {
        if (!data) return;
        if (page === 1) {
            setUsers(data.items);
        } else {
            setUsers([...users, ...data.items]);
        }
    }, [data]);

    const { formatError } = useErrorFormatter();

    const handleBlockUsers = (block: boolean) => {
        blockUsers({
            ids: [...checkedIds],
            block
        }).unwrap()
            .then(refreshData)
            .catch(handleError);
    }

    const handleDeleteUsers = () => {
        deleteUsers({
            ids: [...checkedIds]
        }).unwrap()
            .then(refreshData)
            .catch(handleError);
    }

    const handleUserCheck = (user: User) => {
        const checked = new Set(checkedIds);
        if (checked.has(user.id)) {
            checked.delete(user.id);
        } else {
            checked.add(user.id);
        }
        setCheckedIds(checked);
    }

    const handleAllItemsCheck = () => {
        if (checkedIds.size === users.length) {
            setCheckedIds(new Set());
        } else {
            setCheckedIds(new Set(users.map(user => user.id)));
        }
    }
    const handleChangeRoleClick = () => {
        setRoleModalVisible(true);
    }
    const handleHideRoleModal = () => {
        setRoleModalVisible(false);
    }
    const handleRoleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const selectedRole = formData.get('role');

        setRoleModalVisible(false);

        changeRole({
            ids: [...checkedIds],
            role: selectedRole as string
        }).unwrap()
            .then(refreshData)
            .catch(handleError);
    }

    if (error) {
        return <Alert variant="danger">{formatError(error)}</Alert>
    }
    if (!data) {
        return <Loader />;
    }

    return <Container >
        <Col>
            <h4>{t('admin.title')}</h4>
            <div className="mb-3">
                <Button
                    variant='outline-primary'
                    className='me-2'
                    disabled={checkedIds.size === 0}
                    onClick={handleChangeRoleClick}>
                    <MdAdminPanelSettings /> {t('admin.btnRole')}
                </Button>

                <Button
                    variant='outline-primary'
                    className='me-2'
                    disabled={checkedIds.size === 0}
                    onClick={() => handleBlockUsers(true)}>
                    <MdLock /> {t('admin.btnBlock')}
                </Button>

                <Button
                    variant='outline-primary'
                    className='me-2'
                    disabled={checkedIds.size === 0}
                    onClick={() => handleBlockUsers(false)}>
                    <MdOutlineLockOpen />
                </Button>

                <Button
                    variant='outline-danger'
                    className='me-2'
                    disabled={checkedIds.size === 0}
                    onClick={handleDeleteUsers}>
                    <MdDeleteOutline />
                </Button>
            </div>

            <InfiniteScroll
                hasMore={data.hasMore}
                dataLength={users.length}
                next={fetchNextPage}
                loader={(<Loader />)}>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>
                                <Form.Check
                                    checked={checkedIds.size === users.length}
                                    onClick={handleAllItemsCheck} />
                            </th>
                            <th onClick={() => handleColumnClick('name')}>Name {renderSortIndicator('name')}</th>
                            <th onClick={() => handleColumnClick('email')}>Email {renderSortIndicator('email')}</th>
                            <th onClick={() => handleColumnClick('role')}>Role {renderSortIndicator('role')}</th>
                            <th onClick={() => handleColumnClick('lastSeen')}>Last seen {renderSortIndicator('lastSeen')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ opacity: user.isBlocked ? 0.4 : 1 }}>
                                <td>
                                    <Form.Check
                                        onClick={() => handleUserCheck(user)}
                                        checked={checkedIds.has(user.id)} />
                                </td>
                                <td className={user.isBlocked ? 'text-decoration-line-through' : undefined}>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <TableDateData date={user.lastSeen} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </InfiniteScroll>

            <Modal show={roleModalVisible} onHide={handleHideRoleModal}>
                <Modal.Header>{t('admin.btnRole')}</Modal.Header>
                <Modal.Body>

                    <Form onSubmit={handleRoleSubmit}>
                        <Form.Select
                            className='mb-3'
                            name="role">
                            {appConfig?.userRoles?.map((role) => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </Form.Select>
                        <Button
                            className="btn btn-primary"
                            type='submit'>
                            {t('admin.btnChange')}
                        </Button>
                    </Form>

                </Modal.Body>
            </Modal>

        </Col>
    </Container >
}