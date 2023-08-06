import { Router } from "express";
import * as userController from "../controllers/userController";
import * as productController from "../controllers/productController";
import { auth } from "../middlewares/auth";
import { validateUser } from "../middlewares/userAccess";
import multer from "multer";

const router = Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage: storage });
router.get("/users", auth, userController.getUsers);
router.get("/user/:id", auth, userController.getUser);
router.post("/user/signup", userController.registerUser);
router.post("/user/signin", userController.signIn);
router.patch("/user/:id", auth, validateUser, userController.updateUserName);
router.patch("/user/:id/email", auth, validateUser, userController.updateUserEmail);
router.patch("/user/:id/changePassword", auth, validateUser, userController.updateUserPassword);
router.post("/get-reset-password-link", userController.createResetPasswordLink);
router.post("/user/:id/reset-password/:token", userController.resetPassword);
router.post("/product", auth, productController.registerProduct);
router.post("/image", upload.single("image"), productController.getImg);
router.get("/image/:id", productController.retrieveImg);
router.delete("/user/:id", auth, validateUser, userController.deleteUser);
export default router;
