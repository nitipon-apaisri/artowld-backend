import { Router } from "express";
import { getHelloworldController } from "../controllers/exempleController";
const router = Router();
router.get("/helloworld", getHelloworldController);
export default router;
