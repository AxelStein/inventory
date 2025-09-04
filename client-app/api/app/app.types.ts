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
    customField: InventoryCustomFieldConfig;
    customIdTypes: CustomIdType[];
}

export interface InventoryCustomFieldConfig {
    types: string[];
    states: string[];
}

export interface InventoryImageConstraints {
    mimeTypes: string[];
    maxFileSize: number;
}

export enum CustomIdType {
    FIXED = 'fixed',
    RND_20_BIT = 'rnd_20_bit',
    RND_32_BIT = 'rnd_32_bit',
    RND_6_DIGIT = 'rnd_6_digit',
    RND_9_DIGIT = 'rnd_9_digit',
    GUID = 'guid',
    DATE_TIME = 'date_time',
    SEQUENCE = 'sequence'
}