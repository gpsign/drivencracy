import { db } from "../database/database.connection.js";
import { newPollSchema } from "../schemas/poll.schemas.js";
import dayjs from "dayjs";

export async function postPoll(req, res) {
	const validation = newPollSchema.validate(req.body);
	if (validation.error) {
		const errors = validation.error.details.map((detail) => detail.message);
		return res.status(422).send(errors);
	}

	try {
		const poll = {
			title: req.body.title,
			expireAt: req.body.expireAt
				? req.body.expireAt
				: dayjs().add(30, "day").format("YYYY-MM-DD HH:MM"),
		};

		console.log(req.body.expireAt);
		await db.collection("poll").insertOne(poll);
		return res.status(201).send(poll);
	} catch (err) {
		return res.status(500).send(err);
	}
}

export async function getPoll(req, res) {
	try {
		return res.send(await db.collection("poll").find().toArray());
	} catch (err) {
		return res.status(500).send(err);
	}
}
