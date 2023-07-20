import { Router } from "express";
import {
	getPoll,
	postChoice,
	postPoll,
} from "../controllers/drivencracy.controller.js";

const drivencracyRouter = Router();

drivencracyRouter.post("/poll", postPoll);
drivencracyRouter.get("/poll", getPoll);
drivencracyRouter.post("/choice", postChoice);

export default drivencracyRouter;
