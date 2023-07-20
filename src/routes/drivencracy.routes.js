import { Router } from "express";
import {
	getChoices,
	getPoll,
	postChoice,
	postPoll,
} from "../controllers/drivencracy.controller.js";

const drivencracyRouter = Router();

drivencracyRouter.post("/poll", postPoll);
drivencracyRouter.get("/poll", getPoll);
drivencracyRouter.post("/choice", postChoice);
drivencracyRouter.get("/poll/:id/choice", getChoices);

export default drivencracyRouter;
