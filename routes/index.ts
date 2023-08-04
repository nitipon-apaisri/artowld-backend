import { Router } from "express";

import { getUsers, getUser, registerUser, signIn, updateUserName, deleteUser, updateUserEmail } from "../controllers/userController";
import { auth } from "../middlewares/auth";
const router = Router();

router.get("/users", auth, getUsers);
router.get("/user/:id", auth, getUser);
router.post("/user/signup", registerUser);
router.post("/user/signin", signIn);
router.patch("/user/:id", auth, updateUserName);
router.patch("/user/:id/email", auth, updateUserEmail);
router.delete("/user/:id", auth, deleteUser);
export default router;
