import { Router } from "express";
import { postPoll } from "../controllers/drivencracy.controller.js";

const drivencracyRouter = Router();

drivencracyRouter.post("/poll", postPoll);

export default drivencracyRouter;
