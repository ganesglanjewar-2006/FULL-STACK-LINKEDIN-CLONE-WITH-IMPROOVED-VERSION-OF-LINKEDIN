import { Router } from "express";

import {
  register,
  login,
  uploadProfilePicture,
  updateUserProfile,
  getUserAndProfile,
  updateProfileData,
  getAllUserProfile,
  downloadResumeProfile,
  sendConnectionRequest,
  getMyConnectionsRequest,
  whatAreMyConnections,
  acceptConnectionRequest,
  getProfileByUsername,
} from "../controllers/user.controller.js";
import multer from "multer";

const router = Router();

//multer or (s3 bucket in aws) :-use for storing data
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router
  .route("/update_profile_picture")
  .post(upload.single("profile_picture"), uploadProfilePicture);

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/user_update").post(updateUserProfile);

router.route("/get_user_and_profile").get(getUserAndProfile);
router.route("/user/get_profile_based_on_username").get(getProfileByUsername);

router.route("/update_profile_data").post(updateProfileData);

router.route("/user/get_all_users").get(getAllUserProfile);

router.route("/user/download_resume").get(downloadResumeProfile);

router.route("/user/send_connection_request").post(sendConnectionRequest);

router.route("/user/getConnectionRequest").post(whatAreMyConnections);
router.route("/user/getMyConnectionRequests").post(getMyConnectionsRequest);
router.route("/user/accept_connection_request").post(acceptConnectionRequest);

export default router;
