class BaseException extends Error {
    constructor(code, message, actualError) {
        super(message);
        this.type = 'generic';
        this.message = message;
        this.code = code;
        this.errors = [actualError];
    }
}
class BusinessException extends BaseException {
    constructor(code, message, actualError) {
        super(code, message, actualError);
        this.type = 'business';
    }
}

module.exports = {
    BusinessException,
};
