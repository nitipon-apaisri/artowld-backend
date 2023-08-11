import { Router } from "express";
import * as userController from "../controllers/userController";
import * as productController from "../controllers/productController";
import * as imageController from "../controllers/imageController";
import { auth } from "../middlewares/auth";
import { validateUser } from "../middlewares/userAccess";
import multer from "multer";

const router = Router();
// Multer config
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
            cb(null, true);
        } else {
            const error = new Error("Invalid file type, only JPEG and PNG is allowed!") as any;
            cb(error, false);
        }
    },
});

// Routes
//User routes
router.get("/users", userController.getUsers);
router.get("/user/:userId", userController.getUser);
router.post("/user/signup", userController.registerUser);
router.post("/user/signin", userController.signIn);
router.patch("/user/:userId/userName", auth, validateUser, userController.updateUserName);
router.patch("/user/:userId/email", auth, validateUser, userController.updateUserEmail);
router.patch("/user/:userId/changePassword", auth, validateUser, userController.updateUserPassword);
router.post("/get-reset-password-link", userController.createResetPasswordLink);
router.post("/user/:userId/reset-password/:token", userController.resetPassword);
router.delete("/user/:userId", auth, validateUser, userController.deleteUser);

//Product routes
router.get("/products", productController.getProducts);
router.get("/product/:id", productController.getProduct);
router.post("/user/:userId/product", auth, validateUser, productController.registerProduct);
router.patch("/user/:userId/product/:id", auth, validateUser, productController.updateProduct);
router.delete("/user/:userId/product/:id", auth, validateUser, productController.deleteProduct);

//Image routes
router.post("/user/:userId/image", auth, validateUser, upload.single("image"), imageController.uploadFile);
router.get("/image/:id", imageController.retrieveImg);
export default router;
