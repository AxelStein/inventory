const CustomIdType = Object.freeze({
    FIXED: 'fixed',
    RND_20_BIT: 'rnd_20_bit',
    RND_32_BIT: 'rnd_32_bit',
    RND_6_DIGIT: 'rnd_6_digit',
    RND_9_DIGIT: 'rnd_9_digit',
    GUID: 'guid',
    DATE_TIME: 'date_time',
    SEQUENCE: 'sequence',
    values: function() {
        return [
            this.FIXED, 
            this.RND_20_BIT, 
            this.RND_32_BIT, 
            this.RND_6_DIGIT, 
            this.RND_9_DIGIT, 
            this.GUID, 
            this.DATE_TIME, 
            this.SEQUENCE
        ];
    }
});
export default CustomIdType;