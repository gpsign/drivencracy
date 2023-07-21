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

		await db.collection("polls").insertOne(poll);
		return res.status(201).send(poll);
	} catch (err) {
		return res.status(500).send(err);
	}
}

export async function getPoll(req, res) {
	try {
		return res.send(await db.collection("polls").find().toArray());
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
			.collection("polls")
			.findOne({ _id: new ObjectId(req.body.pollId) });

		if (!poll) {
			return res.sendStatus(404);
		}

		if (dayjs().diff(poll.expireAt, "day") > 0) {
			return res.sendStatus(403);
		}

		const repeated = await db
			.collection("choices")
			.findOne({ title: req.body.title });

		if (repeated) return res.sendStatus(409);

		await db.collection("choices").insertOne(req.body);
		return res.status(201).send(req.body);
	} catch (err) {
		console.log(err);
		return res.status(500).send(err);
	}
}

export async function getChoices(req, res) {
	try {
		const { id } = req.params;
		const poll = await db
			.collection("polls")
			.findOne({ _id: new ObjectId(id) });

		if (!poll) return res.sendStatus(404);

		const choices = await db
			.collection("choices")
			.find({ pollId: id })
			.toArray();
		return res.send(choices);
	} catch (err) {
		return res.status(500).send(err);
	}
}

export async function postVote(req, res) {
	try {
		const { id } = req.params;
		const choice = await db
			.collection("choices")
			.findOne({ _id: new ObjectId(id) });

		if (!choice) {
			return res.sendStatus(404);
		}

		const poll = await db
			.collection("poll")
			.find({ _id: new ObjectId(choice.pollId) });
		if (dayjs(choice.expireAt).diff(poll.expireAt, "day") > 0) {
			return res.sendStatus(403);
		}

		await db.collection("votes").insertOne({
			createdAt: dayjs().format("YYYY-MM-DD HH:MM"),
			choiceId: new ObjectId(id),
		});

		return res.sendStatus(201);
	} catch (err) {
		console.log(err);
		return res.status(500).send(err);
	}
}

export async function getResult(req, res) {
	try {
		const { id } = req.params;

		const poll = await db
			.collection("polls")
			.findOne({ _id: new ObjectId(id) });

		if (!poll) {
			return res.sendStatus(404);
		}

		const choices = await db
			.collection("choices")
			.find({ pollId: id })
			.toArray();

		let finalPoll = {
			title: poll.title,
			expireAt: poll.expireAt,
			result: {
				title: "",
				votes: 0,
			},
		};

		for (let i = 0; i < choices.length; i++) {
			console.log(choices[i]._id);
			let votes = await db
				.collection("votes")
				.find({ choiceId: choices[i]._id }).toArray();

			console.log(votes);

			if (votes.length > finalPoll.result.votes) {
				finalPoll.result.votes = votes.length;
				finalPoll.result.title = choices[i].title;
			}
		}

		return res.send(finalPoll);
	} catch (err) {
		console.log(err);
		return res.status(500).send(err);
	}
}
