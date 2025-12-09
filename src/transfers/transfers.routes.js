 import { Router } from "express";
import * as transferContollers from "./transfers.controllers.js"
import { auth } from "../middleware/auth.js";
// import { createTransfercontroller } from "./transfers.controllers.js";

  export const TransferRoutes = Router();

  TransferRoutes.post("/",auth, transferContollers.createTransfercontroller);