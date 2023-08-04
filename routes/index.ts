import { Router } from "express";
import { getHelloworldController } from "../controllers/exempleController";
import { userRegister, userSignin } from "../controllers/userController";
const router = Router();
router.get("/helloworld", getHelloworldController);
router.post("/user/signup", userRegister);
router.post("/user/signin", userSignin);
export default router;
