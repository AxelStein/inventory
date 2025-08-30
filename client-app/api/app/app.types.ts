export interface AppConfig {
    inventoryImage: InventoryImageConstraints;
    themes: string[];
    languages: AppLanguage[];
}

export interface AppLanguage {
    locale: string;
    name: string;
    default: boolean;
}

export interface InventoryImageConstraints {
    mimeTypes: string[];
    maxFileSize: number;
}