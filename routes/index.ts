import { Router } from "express";
import * as userController from "../controllers/userController";
import * as productController from "../controllers/productController";
import * as imageController from "../controllers/imageController";
import { auth } from "../middlewares/auth";
import { validateUser } from "../middlewares/userAccess";
import multer from "multer";

const router = Router();
// Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage: storage });

// Routes
//User routes
router.get("/users", auth, userController.getUsers);
router.get("/user/:id", auth, userController.getUser);
router.post("/user/signup", userController.registerUser);
router.post("/user/signin", userController.signIn);
router.patch("/user/:id", auth, validateUser, userController.updateUserName);
router.patch("/user/:id/email", auth, validateUser, userController.updateUserEmail);
router.patch("/user/:id/changePassword", auth, validateUser, userController.updateUserPassword);
router.post("/get-reset-password-link", userController.createResetPasswordLink);
router.post("/user/:id/reset-password/:token", userController.resetPassword);

//Product routes
router.post("/product", auth, productController.registerProduct);
router.delete("/user/:id", auth, validateUser, userController.deleteUser);
router.get("/products", productController.getProducts);
router.get("/product/:id", productController.getProduct);

//Image routes
router.post("/image", auth, upload.single("image"), imageController.uploadFile);
router.get("/image/:id", imageController.retrieveImg);
export default router;
