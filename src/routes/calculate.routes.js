import { Router } from "express";
import { CalculateController } from "../controllers/calculate.controllers.js";

const router = Router();

router.route("/calculate").post(CalculateController);

export default router;
