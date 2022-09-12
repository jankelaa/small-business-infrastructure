const { isNil } = require("lodash");

class Utils{
    handleResponseException(res, error, transaction = null){
        if(!isNil(transaction)){
            transaction.rollback();
        }

        let statusCode = 500;

        if(error.isCustom == true){
            statusCode = error.statusCode;
        }

        res.status(statusCode).send(error.message);
    }
}

module.exports = new Utils();