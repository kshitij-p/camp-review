class CustomError extends Error{

    constructor(errCode, message){
        super();
        this.errCode = errCode;
        this.message = message;
    }

}

module.exports = CustomError;