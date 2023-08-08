import { Router } from "express";
import * as userController from "../controllers/userController";
import * as productController from "../controllers/productController";
import * as imageController from "../controllers/imageController";
import { auth } from "../middlewares/auth";
import { validateUser } from "../middlewares/userAccess";
import multer from "multer";

const router = Router();
// Multer config
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "uploads/");
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + "-" + file.originalname);
//     },
// });
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
//User routes
router.get("/users", auth, userController.getUsers);
router.get("/user/:userId", auth, userController.getUser);
router.post("/user/signup", userController.registerUser);
router.post("/user/signin", userController.signIn);
router.patch("/user/:userId", auth, validateUser, userController.updateUserName);
router.patch("/user/:userId/email", auth, validateUser, userController.updateUserEmail);
router.patch("/user/:userId/changePassword", auth, validateUser, userController.updateUserPassword);
router.post("/get-reset-password-link", userController.createResetPasswordLink);
router.post("/user/:userId/reset-password/:token", userController.resetPassword);
router.delete("/user/:userId", auth, validateUser, userController.deleteUser);

//Product routes
router.post("/user/:userId/product", auth, productController.registerProduct);
router.get("/products", productController.getProducts);
router.get("/product/:id", productController.getProduct);
router.patch("/user/:userId/product/:id", auth, validateUser, productController.updateProduct);

//Image routes
router.post("/user/:userId/image", auth, validateUser, upload.single("image"), imageController.uploadFile);
router.get("/image/:id", imageController.retrieveImg);
export default router;
