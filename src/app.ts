import dotenv from "dotenv";
import fastify from "fastify";
import {
  authRoutes,
  budgetRoutes,
  clientRoutes,
  materialRoutes,
  userRoutes,
} from "./http/routes";

dotenv.config();

export const app = fastify();

app.register(userRoutes);
app.register(clientRoutes);
app.register(materialRoutes);
app.register(budgetRoutes);
app.register(authRoutes);
