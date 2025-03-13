import joiObjectid from "joi-objectid";
import Joi from "joi";

export function setupValidation(){
    Joi.objectId = joiObjectid(Joi);
}