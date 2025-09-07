import { Col, Container } from "react-bootstrap";
import { InventoryTable } from "~/inventory/components/InventoryTable";
import { useGetInventoriesQuery } from "../../api/inventory/inventory.api";
import { useTranslation } from "react-i18next";
import { isGuest } from "~/auth/auth.check.guest";
import { useGetTagsQuery } from "api/tag/tag.api";
import { TagCloud } from 'react-tagcloud';
import { Link, useNavigate } from "react-router";

export default function DashboardPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

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

    const { data: tags } = useGetTagsQuery({
        asGuest: isGuest()
    });
    const cloudTags = tags?.map(tag => ({
        value: tag.name,
        count: tag.inventoryCount ?? 0,
        key: tag.id.toString(),
    })) || [];

    return <Container>
        <Col>
            <InventoryTable title={t('dashboard.title.latestInventories')} inventories={latest?.items} />

            {latest?.hasMore == true && (<div className="mb-3">
                <Link to='/inventory-list?sortBy=createdAt&sortAsc=false'>{t('dashboard.btnShowMore')}</Link>
            </div>)}

            <InventoryTable title={t('dashboard.title.popularInventories')} inventories={popular?.items} />

            {popular?.hasMore == true && (<div className="mb-3">
                <Link to='/inventory-list?sortBy=itemCount&sortAsc=false'>{t('dashboard.btnShowMore')}</Link>
            </div>)}

            <h4>{t('dashboard.title.tags')}</h4>
            <TagCloud
                maxSize={50}
                minSize={12}
                tags={cloudTags}
                onClick={(tag) => navigate(`/inventory-list?tagId=${tag.key}&&tagName=${tag.value}`)} />
            {cloudTags.length === 0 && (
                <p className="no-data">{t('tag.noData')}</p>
            )}
        </Col>
    </Container>
}