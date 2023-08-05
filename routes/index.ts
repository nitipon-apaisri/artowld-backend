import { Router } from "express";

import * as userController from "../controllers/userController";
import { auth } from "../middlewares/auth";
const router = Router();

router.get("/users", auth, userController.getUsers);
router.get("/user/:id", auth, userController.getUser);
router.post("/user/signup", userController.registerUser);
router.post("/user/signin", userController.signIn);
router.patch("/user/:id", auth, userController.updateUserName);
router.patch("/user/:id/email", auth, userController.updateUserEmail);
router.patch("/user/:id/changePassword", auth, userController.updateUserPassword);
router.post("/get-reset-password-link", userController.createResetPasswordLink);
router.post("/user/:id/reset-password/:token", userController.resetPassword);
router.delete("/user/:id", auth, userController.deleteUser);
export default router;
