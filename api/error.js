class KatError extends Error {
    constructor({ message = "Произошла ошибка", statusCode = 400 } = {}) {
        super(message);
        this.statusCode = statusCode;
    }
};

module.exports = KatError;