import { ObjectId } from "mongodb";
import { db } from "../database/database.connection.js";
import { choiceSchema, newPollSchema } from "../schemas/poll.schemas.js";
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

export async function postChoice(req, res) {
	const validation = choiceSchema.validate(req.body);
	if (validation.error) {
		const errors = validation.error.details.map((detail) => detail.message);
		return res.status(422).send(errors);
	}

	try {
		const poll = await db
			.collection("poll")
			.findOne({ _id: new ObjectId(req.body.pollId) });

		if (!poll) {
			return res.sendStatus(404);
		}

		console.log(dayjs().diff(poll.expireAt, "day"));

		if (dayjs().diff(poll.expireAt, "day") > 0) {
			return res.sendStatus(403);
		}

		const repeated = await db
			.collection(`${poll.title}`)
			.findOne({ title: req.body.title });

		if (repeated) return res.sendStatus(409);

		await db.collection(`${poll.title}`).insertOne(req.body);
		return res.status(201).send(req.body);
	} catch (err) {
		console.log(err);
		return res.status(500).send(err);
	}
}

export async function getChoices(req, res) {
	try {
		const { id } = req.params;
		const poll = await db.collection("poll").findOne({ _id: new ObjectId(id) });

		if (!poll) return res.sendStatus(404);

		const choices = await db.collection(`${poll.title}`).find().toArray();
		return res.send(choices);
	} catch (err) {
		return res.status(500).send(err);
	}
}
