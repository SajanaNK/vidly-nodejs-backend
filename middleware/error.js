import { logger } from "../startup/logging.js";

function error(error,req,res,next){
    // console.log(error);
    logger.error(error.message, error);
    res.status(500).send('Something went wrong : ' + error);
}

export { error };
