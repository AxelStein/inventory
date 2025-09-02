import { Col, Container } from "react-bootstrap";
import { InventoryTable } from "~/inventory/components/InventoryTable";
import { useGetInventoriesQuery } from "../../api/inventory/inventory.api";
import { useTranslation } from "react-i18next";
import { isGuest } from "~/auth/auth.check.guest";

export default function DashboardPage() {
    const { t } = useTranslation();

    const { data: popular, error: popularError, isLoading: popularLoading } = useGetInventoriesQuery({
        page: 1,
        perPage: 5,
        sortBy: 'itemCount',
        sortAsc: false,
        asGuest: isGuest(),
    });

    const { data: latest, error: latestError, isLoading: latestLoading } = useGetInventoriesQuery({
        page: 1,
        perPage: 5,
        sortBy: 'createdAt',
        sortAsc: false,
        asGuest: isGuest(),
    });

    return <Container>
        <Col>
            <InventoryTable title={t('dashboard.title.latestInventories')} inventories={latest?.items} />

            <InventoryTable title={t('dashboard.title.popularInventories')} inventories={popular?.items} />

            <h4>{t('dashboard.title.tags')}</h4>
        </Col>
    </Container>
}