import { Router } from "express";

import { userRegister, userSignin, userNameUpdate, getUsers, userDelete, getUser } from "../controllers/userController";
import { auth } from "../middlewares/auth";
const router = Router();

router.get("/users", auth, getUsers);
router.get("/user/:id", auth, getUser);
router.post("/user/signup", userRegister);
router.post("/user/signin", userSignin);
router.patch("/user/:id", auth, userNameUpdate);
router.delete("/user/:id", auth, userDelete);
export default router;
