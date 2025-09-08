import { Alert, Col, Container } from "react-bootstrap";
import { InventoryTable } from "~/inventory/components/InventoryTable";
import { useGetInventoriesQuery } from "../../api/inventory/inventory.api";
import { useTranslation } from "react-i18next";
import { isGuest } from "~/auth/auth.check.guest";
import { useGetTagsQuery } from "api/tag/tag.api";
import { TagCloud } from 'react-tagcloud';
import { Link, useNavigate } from "react-router";
import { useErrorFormatter } from "~/components/error.formatter";
import Loader from "~/components/Loader";
import ErrorAlert from "~/components/ErrorAlert";

export default function DashboardPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { formatError } = useErrorFormatter();

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

    const { data: tags, error: tagsError, isLoading: tagsLoading } = useGetTagsQuery({
        asGuest: isGuest()
    });
    const cloudTags = tags?.map(tag => ({
        value: tag.name,
        count: tag.inventoryCount ?? 0,
        key: tag.id.toString(),
    })) || [];

    return <Container>
        <Col>
            <InventoryTable
                isLoading={latestLoading}
                error={latestError}
                hasMoreLink={latest?.hasMore == true ? '/inventory-list?sortBy=createdAt&sortAsc=false' : undefined}
                title={t('dashboard.title.latestInventories')}
                inventories={latest?.items} />

            <InventoryTable
                isLoading={popularLoading}
                error={popularError}
                hasMoreLink={popular?.hasMore == true ? '/inventory-list?sortBy=itemCount&sortAsc=false' : undefined}
                title={t('dashboard.title.popularInventories')}
                inventories={popular?.items} />

            <h4>{t('dashboard.title.tags')}</h4>
            <TagCloud
                maxSize={50}
                minSize={12}
                tags={cloudTags}
                onClick={(tag) => navigate(`/inventory-list?tagId=${tag.key}&&tagName=${tag.value}`)} />

            <ErrorAlert error={tagsError} />

            <Loader loading={tagsLoading} />

            {!tagsLoading && !tagsError && cloudTags.length === 0 && (
                <p className="no-data">{t('tag.noData')}</p>
            )}
        </Col>
    </Container>
}