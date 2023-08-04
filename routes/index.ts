import { Router } from "express";
import { getHelloworldController } from "../controllers/exempleController";
import { userRegister } from "../controllers/userController";
const router = Router();
router.get("/helloworld", getHelloworldController);
router.post("/user/signup", userRegister);
export default router;
