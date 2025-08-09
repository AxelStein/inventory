const InventoryAccessRole = Object.freeze({
    VIEWER: 'viewer',
    EDITOR: 'editor',
    OWNER: 'owner',
    values: function() {
        return [this.VIEWER, this.EDITOR, this.OWNER];
    }
});
export default InventoryAccessRole;