import { Router } from "express";
import { getHelloworldController } from "../controllers/exempleController";
import { userRegister, userSignin, userNameUpdate, getUsers, userDelete } from "../controllers/userController";
import { auth } from "../middlewares/auth";
const router = Router();
router.get("/helloworld", getHelloworldController);
router.get("/users", auth, getUsers);
router.post("/user/signup", userRegister);
router.post("/user/signin", userSignin);
router.patch("/user/:id", auth, userNameUpdate);
router.delete("/user/:id", auth, userDelete);
export default router;
