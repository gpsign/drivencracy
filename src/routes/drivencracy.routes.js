import { Router } from "express";
import {
	getChoices,
	getPoll,
	getResult,
	postChoice,
	postPoll,
	postVote,
} from "../controllers/drivencracy.controller.js";

const drivencracyRouter = Router();

drivencracyRouter.post("/poll", postPoll);
drivencracyRouter.get("/poll", getPoll);
drivencracyRouter.post("/choice", postChoice);
drivencracyRouter.get("/poll/:id/choice", getChoices);
drivencracyRouter.post("/choice/:id/vote", postVote);
drivencracyRouter.get("/poll/:id/result", getResult);

export default drivencracyRouter;
