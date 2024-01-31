import { Router } from "express";
import {
    changeCurrentPassword,
    loginUser,
    registerUser,
    updateAccountDetails,
} from "../controllers/user.controller.js";
const router = Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/change-password").patch(changeCurrentPassword);
router.route("/update-account").patch(updateAccountDetails);

export default router;
