import { useGetCategoriesQuery } from "api/category/category.api";
import { useRef, useCallback, useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { Button, Form } from "react-bootstrap";
import { useGetTagsQuery } from "api/tag/tag.api";
import type { Inventory } from "api/types";
import { useCreateInventoryMutation, useUploadImageMutation } from "api/inventory/inventory.api";
import { useForm } from 'react-hook-form';
import { MdDelete } from "react-icons/md";
import type { Option } from "react-bootstrap-typeahead/types/types";
import { ConfirmationDialog, useConfirmationDialog } from "~/components/ConfirmationDialog";
import { filesize } from "filesize";

interface CreateInventoryFormProps {
    inventory?: Inventory,
}

interface InventoryForm {
    title: string,
    description: string,
    isPublic: boolean,
    categoryId: number,
}

interface InventoryImageForm {
    file: File[],
}

export default function InventoryEditorForm({ inventory }: CreateInventoryFormProps) {
    const ref = useRef<any>(null);

    const [uploadImage, { isLoading: isUploadingImage }] = useUploadImageMutation();
    const [createInventory, { isLoading: isCreatingInventory }] = useCreateInventoryMutation();
    const isUpdatingInventory = isCreatingInventory;

    const { data: categories } = useGetCategoriesQuery();
    const { data: tags } = useGetTagsQuery(undefined, { skip: !inventory });
    const [imageUrl, setImageUrl] = useState<string | undefined>(inventory?.imageLink);

    const {
        confirmationDialogMessage,
        showConfirmationDialog,
        onDialogConfirm,
        onDialogCancel
    } = useConfirmationDialog();

    const onTagsChange = useCallback((selected: Option[]) => {
        console.log(selected);
    }, []);

    const { register: registerInventoryForm, handleSubmit: handleInventorySubmit } = useForm<InventoryForm>({
        defaultValues: {
            title: inventory?.title,
            description: inventory?.description,
            isPublic: inventory?.isPublic,
            categoryId: inventory?.category?.id,
        }
    });

    const { register: registerImageForm, handleSubmit: handleImageSubmit, formState: imageFormState } = useForm<InventoryImageForm>();
    const imageFormError = imageFormState.errors?.file?.message;
    console.log(imageFormError);

    const createInventoryCallback = useCallback((form: InventoryForm) => {
        createInventory(form).unwrap()
            .then((newInventory: Inventory) => console.log(newInventory))
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
            .then(newInventory => {
                inventory = newInventory;
                setImageUrl(newInventory.imageLink)
            })
            .catch(err => console.log(err));
    }, []);

    const onDeleteImageClick = useCallback(() => {
        showConfirmationDialog('Are you sure you want to delete the image?', () => {
            setImageUrl(undefined);
        });
    }, []);

    const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    return <div>
        <Form onSubmit={handleInventorySubmit(createInventoryCallback)}>
            <Form.Control
                type="text"
                placeholder="Name"
                className='mb-3'
                disabled={isUpdatingInventory}
                {...registerInventoryForm('title', { required: !inventory })} />

            <Form.Select
                className='mb-3'
                disabled={isUpdatingInventory}
                {...registerInventoryForm('categoryId', { required: !inventory })}>
                {categories?.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
            </Form.Select>

            <Form.Control
                as='textarea'
                placeholder="Description"
                className='mb-3'
                rows={6}
                disabled={isUpdatingInventory}
                {...registerInventoryForm('description')} />

            <Form.Switch
                label="Public"
                className='mb-3'
                disabled={isUpdatingInventory}
                {...registerInventoryForm('isPublic')} />

            {!inventory && <Button
                className="btn btn-primary"
                type='submit'
                disabled={isUpdatingInventory}>
                Save
            </Button>}
        </Form>

        {inventory &&
            <Form onSubmit={handleImageSubmit(uploadImageCallback)}>
                <Form.Group className='mb-3'>
                    <Form.Label htmlFor="imageFile">Image</Form.Label>
                    {
                        isUploadingImage ? (
                            <div className="spinner" />
                        ) : imageUrl ? (
                            <InventoryEditorImage imageUrl={imageUrl} onDeleteClick={onDeleteImageClick} />
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
                                            return file.size > 0 && file.size <= MAX_FILE_SIZE || `File size must be less than ${filesize(MAX_FILE_SIZE)}`;
                                        },
                                        fileType: (value) => {
                                            if (value.length == 0) return true;
                                            const file = value[0];
                                            console.log('fileType', file.type, ALLOWED_MIME_TYPES.includes(file.type));
                                            return ALLOWED_MIME_TYPES.includes(file.type) || `Invalid file type. Allowed types are ${ALLOWED_MIME_TYPES}`;
                                        }
                                    }
                                })} />
                            <Form.Control.Feedback type="invalid" className="mb-3">{imageFormError}</Form.Control.Feedback>
                            <Button
                                className="btn btn-primary"
                                type='submit'
                                disabled={isUploadingImage}>
                                Upload
                            </Button>
                        </>)
                    }
                </Form.Group>
            </Form>
        }


        {tags &&
            <div>
                <p className="label">Tags</p>
                <Typeahead
                    id="tags"
                    multiple
                    options={tags}
                    labelKey='name'
                    allowNew
                    defaultSelected={inventory?.tags}
                    onChange={onTagsChange}
                    ref={ref}
                    className='mb-3' />
            </div>
        }

        <ConfirmationDialog
            message={confirmationDialogMessage}
            onConfirm={onDialogConfirm}
            onCancel={onDialogCancel} />
    </div>;
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