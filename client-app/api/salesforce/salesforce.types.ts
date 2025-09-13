export interface SalesforceAccount {
    id?: string;
    name: string;
    phone?: string;
    industry: string;
    website?: string;
    contacts?: SalesforceContact[];
}

export interface SalesforceContact {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
}

export interface CreateSalesforceAccountProps {
    userId: number;
    name: string;
    phone?: string;
    industry: string;
    website?: string;
    contacts?: SalesforceContact[];
}