class CustomError extends Error {
    /**
     * @typedef {Object} ErrorOptions
     * @property {String} message
     * @property {Number} code
     */
    /**
     * @param {ErrorOptions} error 
     */
    constructor(error) {
        super();
        /**
         * The error message
         * @type {String}
         */
        this.message = error.message;
        /**
         * The error code
         * @type {Number | string}
         */
        this.code = error.code;
    }
}
module.exports = CustomError;