// src/http/routes.ts
import { FastifyInstance } from "fastify";
import { createBudgetRoutes, listBudget } from "../http/controllers/budget";
import {
  createClient,
  deleteClient,
  listClients,
  updateClient,
} from "../http/controllers/client";
import {
  createMaterial,
  deleteMaterial,
  listMaterials,
  updateMaterial,
} from "../http/controllers/material";
import { deleteUsers, listUsers, register } from "../http/controllers/register";
import { ensureAuthenticated } from "../middleware/authMiddleware";
import { login } from "./controllers/login";

export async function userRoutes(app: FastifyInstance) {
  app.addHook("preHandler", ensureAuthenticated);
  app.get("/users", listUsers);
  app.delete("/users", deleteUsers);
}

export async function authRoutes(app: FastifyInstance) {
  app.post("/login", login);
  app.post("/register", register);
}

export async function clientRoutes(app: FastifyInstance) {
  app.addHook("preHandler", ensureAuthenticated);
  app.post("/clients", createClient);
  app.put("/clients", updateClient);
  app.delete("/clients", deleteClient);
  app.get("/clients", listClients);
}

export async function materialRoutes(app: FastifyInstance) {
  app.addHook("preHandler", ensureAuthenticated);
  app.post("/materials", createMaterial);
  app.put("/materials", updateMaterial);
  app.delete("/materials", deleteMaterial);
  app.get(
    "/materials",
    {
      preHandler: ensureAuthenticated,
    },
    listMaterials
  );
}

export async function budgetRoutes(app: FastifyInstance) {
  app.post("/budgets", createBudgetRoutes);
  app.get("/budgets", listBudget);
}
