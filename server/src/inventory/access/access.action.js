const AccessAction = Object.freeze({
    CREATE: {
        own: 'createOwn',
        any: 'createAny'
    },
    READ: {
        own: 'readOwn',
        any: 'readAny'
    },
    UPDATE: {
        own: 'updateOwn',
        any: 'updateAny'
    },
    DELETE: {
        own: 'deleteOwn',
        any: 'deleteAny'
    },
});
export default AccessAction;