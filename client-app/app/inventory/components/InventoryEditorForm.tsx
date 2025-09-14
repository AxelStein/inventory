import { useGetCategoriesQuery } from "api/category/category.api";
import { useRef, useCallback, useContext, useState, useEffect } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { Button, Form } from "react-bootstrap";
import { useCreateTagMutation, useDeleteTagMutation, useGetTagsQuery } from "api/tag/tag.api";
import { useCreateInventoryMutation, useCreateOdooTokenMutation, useDeleteImageMutation, useDeleteInventoryMutation, useUpdateInventoryMutation, useUploadImageMutation } from "api/inventory/inventory.api";
import { useForm } from 'react-hook-form';
import { MdDelete } from "react-icons/md";
import { filesize } from "filesize";
import { useGetAppConfigQuery } from "api/app/app.api";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { useTranslation } from "react-i18next";
import { useAlertDialog } from "~/components/AlertDialogContext";
import debounce from 'lodash.debounce';
import { InventoryContext } from "../InventoryPage";
import type { InventoryTag } from "api/tag/tag.types";
import { useNavigate } from "react-router";
import { toast } from 'react-toastify';
import { useErrorFormatter } from "~/components/error.formatter";
import OdooTokenModal from "./OdooTokenModal";

interface InventoryForm {
    title: string;
    description?: string;
    isPublic: boolean;
    categoryId: number;
    version?: number;
}

interface InventoryImageForm {
    file: File[],
}

export default function InventoryEditorForm() {
    const typeaheadRef = useRef<any>(null);
    const { inventory, setInventory, handleInventoryError } = useContext(InventoryContext);
    const { formatError } = useErrorFormatter();

    const [uploadImage, { isLoading: isUploadingImage }] = useUploadImageMutation();
    const [deleteImage] = useDeleteImageMutation();
    const [createInventory, { isLoading: isCreatingInventory }] = useCreateInventoryMutation();
    const [updateInventory, { isLoading: isUpdatingInventory }] = useUpdateInventoryMutation();
    const [deleteInventory, { isLoading: isDeletingInventory }] = useDeleteInventoryMutation();
    const [createOdooToken, { isLoading: isCreatingOdooToken }] = useCreateOdooTokenMutation();
    const navigate = useNavigate();
    const isSubmit = isCreatingInventory || isUpdatingInventory;

    const { data: categories } = useGetCategoriesQuery();
    const { data: tagsQuery } = useGetTagsQuery({}, { skip: !inventory });
    const [createTag] = useCreateTagMutation();
    const [deleteTag] = useDeleteTagMutation();
    const [availableTags, setAvailableTags] = useState<InventoryTag[]>([]);
    const [selectedTags, setSelectedTags] = useState<InventoryTag[]>([]);
    const [odooToken, setOdooToken] = useState<string | undefined | null>();
    const [odooTokenModalVisible, setOdooTokenModalVisible] = useState(false);

    useEffect(() => {
        setAvailableTags(tagsQuery || []);
        setSelectedTags(inventory?.tags || []);
    }, [tagsQuery]);

    useEffect(() => {
        setOdooToken(inventory?.odooToken);
    }, [inventory]);

    const { data: appConfig } = useGetAppConfigQuery();
    const { t } = useTranslation();
    const { showAlertDialog } = useAlertDialog();

    const [tagInput, setTagInput] = useState('');

    const handleTagInputChange = (text: string) => {
        setTagInput(text);
    };

    const handleError = (err: any) => {
        toast.error(formatError(err));
    }

    const handleTagFilter = (option: any) => !selectedTags.some(tag => tag.id === option.id);

    const handleTagsChange = (newTags: any[]) => {
        const ids = new Set(selectedTags.map(tag => tag.id));
        const newIds = new Set(newTags.map(tag => tag.id));

        const added = newTags.filter(tag => !ids.has(tag.id));
        const removed = selectedTags.filter(tag => !newIds.has(tag.id));

        if (added.length !== 0) {
            createTag({
                inventoryId: inventory!.id,
                name: added[0].name
            }).unwrap()
                .then((newTag) => {
                    setSelectedTags([...selectedTags, newTag]);
                    if (!availableTags.some(tag => tag.id === newTag.id)) {
                        setAvailableTags([...availableTags, newTag]);
                    }
                })
                .catch(handleError);
        }
        if (removed.length !== 0) {
            const removedId = removed[0].id;
            deleteTag({
                inventoryId: inventory!.id,
                tagId: removedId
            }).unwrap()
                .then(() => setSelectedTags(selectedTags.filter(tag => tag.id !== removedId)))
                .catch(handleError);
        }
    }

    const {
        register: registerInventoryForm,
        handleSubmit: handleInventorySubmit,
        watch: inventoryFormWatch,
    } = useForm<InventoryForm>({
        defaultValues: {
            title: inventory?.title,
            description: inventory?.description || undefined,
            isPublic: inventory?.isPublic,
            categoryId: inventory?.category?.id,
        }
    });

    const debounceSave = useCallback(debounce(() => {
        if (!inventory) return;

        const body = inventoryFormWatch();
        body.version = inventory.version;

        updateInventory({
            id: inventory.id,
            body
        }).unwrap()
            .then(setInventory)
            .catch(handleInventoryError);
    }, 3000), [inventory]);

    const handleInventoryFormChange = () => {
        if (inventory) {
            debounceSave();
        }
    };

    const {
        register: registerImageForm,
        handleSubmit: handleImageSubmit,
        formState: imageFormState,
    } = useForm<InventoryImageForm>();

    const imageFormError = imageFormState.errors?.file?.message;

    const createInventoryCallback = useCallback((form: InventoryForm) => {
        createInventory(form).unwrap()
            .then((inventory) => {
                setInventory?.(inventory);
                navigate(`/inventory/${inventory.id}`);
            })
            .catch(handleInventoryError);
    }, []);

    const uploadImageCallback = useCallback((form: InventoryImageForm) => {
        if (!inventory) {
            return;
        }

        const formData = new FormData();
        formData.append('file', form.file[0]);

        uploadImage({
            inventoryId: inventory.id,
            version: inventory.version,
            formData,
        }).unwrap()
            .then(setInventory)
            .catch(handleInventoryError);
    }, [inventory]);

    const onDeleteImageClick = useCallback(() => {
        showAlertDialog({
            message: t('inventory.editorForm.confirmDeleteImage'),
            onConfirm: () => {
                deleteImage({
                    inventoryId: inventory!.id,
                    version: inventory!.version,
                }).unwrap()
                    .then(setInventory)
                    .catch(handleInventoryError);
            }
        });
    }, [inventory]);

    const handleDeleteInventoryClick = useCallback(() => {
        showAlertDialog({
            message: t('inventory.editorForm.confirmDeleteDialog.msg'),
            confirmLabel: t('inventory.editorForm.confirmDeleteDialog.btnConfirm'),
            onConfirm: () => {
                deleteInventory(inventory!.id)
                    .unwrap()
                    .then(() => navigate('/'))
                    .catch(handleError);
            }
        });
    }, [inventory]);

    const handleGetOdooToken = () => {
        setOdooTokenModalVisible(true);
    }

    const handleCreateOdooToken = () => {
        createOdooToken({
            inventoryId: inventory!.id,
            version: inventory!.version
        }).unwrap()
            .then(newInventory => {
                setInventory?.(newInventory);
                setOdooTokenModalVisible(true);
            })
            .catch(handleInventoryError);
    }

    const handleHideOdooTokenModal = () => {
        setOdooTokenModalVisible(false);
    }

    return <>
        <Form onSubmit={handleInventorySubmit(createInventoryCallback)} onChange={handleInventoryFormChange}>
            <Form.Control
                type="text"
                placeholder={t('inventory.editorForm.placeholderName')}
                className='mb-3'
                disabled={isSubmit}
                {...registerInventoryForm('title', { required: !inventory })} />

            <Form.Select
                className='mb-3'
                disabled={isSubmit}
                {...registerInventoryForm('categoryId', { required: !inventory })}>
                {categories?.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
            </Form.Select>

            <Form.Control
                as='textarea'
                rows={8}
                placeholder={t('inventory.editorForm.placeholderDescription')}
                className='mb-3'
                disabled={isSubmit}
                {...registerInventoryForm('description')} />

            <Form.Switch
                label={t('inventory.editorForm.labelPublic')}
                className='mb-3'
                disabled={isSubmit}
                {...registerInventoryForm('isPublic')} />

            {!inventory && <Button
                className="btn btn-primary"
                type='submit'
                disabled={isSubmit}>
                {t('inventory.createModal.btnSubmit')}
            </Button>}
        </Form>

        {inventory &&
            <Form onSubmit={handleImageSubmit(uploadImageCallback)}>
                <Form.Group className='mb-3'>
                    <Form.Label htmlFor="imageFile">{t('inventory.editorForm.labelImage')}</Form.Label>
                    {
                        inventory.imageLink ? (
                            <InventoryEditorImage imageUrl={inventory.imageLink} onDeleteClick={onDeleteImageClick} />
                        ) : (<>
                            <Form.Control
                                type='file'
                                id="imageFile"
                                disabled={isUploadingImage}
                                isInvalid={imageFormError != null}
                                className='mb-3'
                                {...registerImageForm('file', {
                                    required: true,
                                    validate: {
                                        fileSize: (value) => {
                                            if (value.length == 0) return true;
                                            const file = value[0];
                                            const maxFileSize = appConfig?.inventory.imageConstraints.maxFileSize ?? 0;
                                            return file.size > 0 && file.size <= maxFileSize || `File size must be less than ${filesize(maxFileSize)}`;
                                        },
                                        fileType: (value) => {
                                            if (value.length == 0) return true;
                                            const file = value[0];
                                            const allowedMimeTypes = appConfig?.inventory.imageConstraints.mimeTypes;
                                            return allowedMimeTypes?.includes(file.type) || `Invalid file type. Allowed types are "${allowedMimeTypes?.join(', ')}"`;
                                        }
                                    }
                                })} />
                            <Form.Control.Feedback type="invalid" className="mb-3">{imageFormError}</Form.Control.Feedback>
                        </>)
                    }
                </Form.Group>

                {!inventory.imageLink && (
                    <Button
                        className="btn btn-primary mb-3"
                        type='submit'
                        disabled={isUploadingImage}>
                        {t('inventory.editorForm.btnUploadImage')}
                    </Button>
                )}
            </Form>
        }

        {inventory && availableTags &&
            <div>
                <p className="label">{t('inventory.editorForm.labelTags')}</p>
                <Typeahead
                    id="tags"
                    multiple
                    options={availableTags}
                    labelKey='name'
                    allowNew={tagInput.length >= 4}
                    onInputChange={handleTagInputChange}
                    selected={selectedTags}
                    onChange={handleTagsChange}
                    filterBy={handleTagFilter}
                    ref={typeaheadRef}
                    className='mb-3'
                    dropup />
            </div>
        }

        {inventory && (
            <div className="mb-3">
                {odooToken ? (
                    <Button onClick={handleGetOdooToken}>Get Odoo token</Button>
                ) : (
                    <Button
                        onClick={handleCreateOdooToken}
                        disabled={isCreatingOdooToken}>Create Odoo token</Button>
                )}
            </div>
        )}

        {inventory && (
            <Button
                className="btn btn-danger mb-3"
                onClick={handleDeleteInventoryClick}
                disabled={isDeletingInventory}>
                {t('inventory.editorForm.btnDeleteInventory')}
            </Button>
        )}

        <OdooTokenModal
            show={odooTokenModalVisible}
            onHide={handleHideOdooTokenModal}
            token={odooToken}
        />
    </>;
}

interface IntervalEditorImageProps {
    imageUrl?: string;
    onDeleteClick?: () => void;
}

function InventoryEditorImage({ imageUrl, onDeleteClick }: IntervalEditorImageProps) {
    return <div className='inventory-image-container'>
        <img
            src={imageUrl}
            className="inventory-image"
            alt="Image" />

        <Button variant='danger' className='inventory-image-delete-button' onClick={onDeleteClick}>
            <MdDelete />
        </Button>
    </div>;
}