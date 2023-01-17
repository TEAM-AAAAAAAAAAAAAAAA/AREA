import { Router } from "express";
import { indexRoute } from "./routes/index";

export const routes = Router();

routes.use(indexRoute)
