import joi from "joi";

export const newPollSchema = joi.object({
	title: joi.string().required(),
	expireAt: joi.string().allow(""),
});
