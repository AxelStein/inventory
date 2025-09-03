import { useGetCategoriesQuery } from "api/category/category.api";
import { useRef, useCallback, useContext } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { Button, Form } from "react-bootstrap";
import { useGetTagsQuery } from "api/tag/tag.api";
import { useCreateInventoryMutation, useDeleteImageMutation, useUpdateInventoryMutation, useUploadImageMutation } from "api/inventory/inventory.api";
import { useForm } from 'react-hook-form';
import { MdDelete } from "react-icons/md";
import type { Option } from "react-bootstrap-typeahead/types/types";
import { filesize } from "filesize";
import type { Inventory } from "api/inventory/inventory.types";
import { useGetAppConfigQuery } from "api/app/app.api";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { useTranslation } from "react-i18next";
import { useAlertDialog } from "~/components/AlertDialogContext";
import debounce from 'lodash.debounce';
import { InventoryContext } from "../InventoryPage";

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
    const { inventory, setInventory } = useContext(InventoryContext);

    const [uploadImage, { isLoading: isUploadingImage }] = useUploadImageMutation();
    const [deleteImage] = useDeleteImageMutation();
    const [createInventory, { isLoading: isCreatingInventory }] = useCreateInventoryMutation();
    const [updateInventory, { isLoading: isUpdatingInventory }] = useUpdateInventoryMutation();
    const isSubmit = isCreatingInventory || isUpdatingInventory;

    const { data: categories } = useGetCategoriesQuery();
    const { data: tags } = useGetTagsQuery({}, { skip: !inventory });

    const { data: appConfig } = useGetAppConfigQuery();
    const { t } = useTranslation();
    const { showAlertDialog } = useAlertDialog();

    const onTagsChange = useCallback((selected: Option[]) => {
        console.log(selected);
    }, []);

    const {
        register: registerInventoryForm,
        handleSubmit: handleInventorySubmit,
        control: inventoryFormControl,
        formState: inventoryFormState,
        watch: inventoryFormWatch,
    } = useForm<InventoryForm>({
        defaultValues: {
            title: inventory?.title,
            description: inventory?.description || undefined,
            isPublic: inventory?.isPublic,
            categoryId: inventory?.category?.id,
        }
    });

    const onInventorySaved = useCallback((newInventory: Inventory) => {
        console.log('setInventory', setInventory, newInventory);
        setInventory?.(newInventory);
        // inventoryRef.current = newInventory;
        // setImageUrl(newInventory.imageLink);
        // onChanged?.(newInventory);
    }, []);

    const onInventorySaveError = useCallback((err: any) => {
        if (err.status === 409) {
            // todo onForceRefresh?.();
        }
        console.log(err);
    }, []);

    const debounceSave = useCallback(debounce(() => {
        if (!inventory) return;

        const body = inventoryFormWatch();
        body.version = inventory.version;

        updateInventory({
            id: inventory.id,
            body
        }).unwrap()
            .then(onInventorySaved)
            .catch(onInventorySaveError);
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
            .then((newInventory: Inventory) => {

                // todo
                console.log(newInventory);
            })
            .catch(error => console.log(error));
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
            .then(onInventorySaved)
            .catch(onInventorySaveError);
    }, [inventory]);


    const onDeleteImageClick = useCallback(() => {
        showAlertDialog({
            message: t('inventory.editorForm.confirmDeleteImage'),
            onConfirm: () => {
                deleteImage({
                    inventoryId: inventory!.id,
                    version: inventory!.version,
                }).unwrap()
                    .then(onInventorySaved)
                    .catch(onInventorySaveError);
            }
        });
    }, [inventory]);

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
                placeholder={t('inventory.editorForm.placeholderDescription')}
                className='mb-3'
                rows={6}
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

        {tags &&
            <div>
                <p className="label">{t('inventory.editorForm.labelTags')}</p>
                <Typeahead
                    id="tags"
                    multiple
                    options={tags}
                    labelKey='name'
                    allowNew
                    defaultSelected={inventory?.tags || undefined}
                    onChange={onTagsChange}
                    ref={typeaheadRef}
                    className='mb-3' />
            </div>
        }
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