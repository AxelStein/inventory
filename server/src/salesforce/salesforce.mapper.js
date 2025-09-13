export const mapAccount = (record) => ({
    id: record.Id,
    name: record.Name,
    phone: record.Phone,
    industry: record.Industry,
    website: record.Website,
    contacts: record.Contacts?.records?.map(contact => ({
        firstName: contact.FirstName,
        lastName: contact.LastName,
        email: contact.Email,
        phone: contact.Phone,
    })),
});

export const mapAccountData = (data) => ({
    Name: data.name,
    Industry: data.industry,
    Phone: data.phone,
    Website: data.website,
});

export const mapContactData = (data, accountId) => ({
    FirstName: data.firstName,
    LastName: data.lastName,
    Email: data.email,
    Phone: data.phone,
    AccountId: accountId
})