const UserRole = Object.freeze({
    USER: 'user',
    ADMIN: 'admin',
    values: function() {
        return [this.USER, this.ADMIN];
    }
});
export default UserRole;