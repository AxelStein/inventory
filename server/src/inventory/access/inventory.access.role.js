const InventoryAccessRole = Object.freeze({
    VIEWER: 'viewer',
    EDITOR: 'editor',
    OWNER: 'owner',
    ADMIN: 'admin',
    values: function() {
        return [this.VIEWER, this.EDITOR, this.OWNER, this.ADMIN];
    }
});
export default InventoryAccessRole;