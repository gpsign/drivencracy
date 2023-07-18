import { Router } from "express";
import drivencracyRouter from "./drivencracy.routes.js";

const router = Router();

router.use(drivencracyRouter);

export default router;