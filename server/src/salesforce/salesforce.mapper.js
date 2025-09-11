export const mapAccount = (record) => ({
    id: record.Id,
    name: record.Name,
    phone: record.Phone,
    industry: record.Industry,
    website: record.Website,
    contacts: record.Contacts?.map(contact => ({
        firstName: contact.FirstName,
        lastName: contact.LastName,
        email: contact.Email,
        phone: contact.Phone,
    })),
});