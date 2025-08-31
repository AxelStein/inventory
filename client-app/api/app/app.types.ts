export interface AppConfig {
    inventory: InventoryConfig;
    themes: string[];
    languages: AppLanguage[];
}

export interface AppLanguage {
    locale: string;
    name: string;
    default: boolean;
}

export interface InventoryConfig {
    imageConstraints: InventoryImageConstraints;
}

export interface InventoryImageConstraints {
    mimeTypes: string[];
    maxFileSize: number;
}