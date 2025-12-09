import joi from "joi";

export const transferValidatorSchema = joi.object({
    sourceAccount: joi.string().required(),
    destinationAccount: joi.string().required(),
    amount : joi.number().required().min(10).max(1000000)
})