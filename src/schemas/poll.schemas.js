import joi from "joi";

export const newPollSchema = joi.object({
	title: joi.string().required(),
	expireAt: joi.string().allow(""),
});

export const choiceSchema = joi.object({
	title: joi.string().required(),
	pollId: joi.string().required(),
});
