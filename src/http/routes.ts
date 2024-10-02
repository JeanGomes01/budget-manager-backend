// src/http/routes.ts
import { FastifyInstance } from "fastify";
import { createBudget, listBudget } from "../http/controllers/budget";
import {
  clients,
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
import { getCurrentUser } from "../http/controllers/user";
import { authMiddleware } from "../middleware/authMiddleware";
import { login } from "./controllers/login";

export async function userRoutes(app: FastifyInstance) {
  // Registrar o middleware de autenticação
  await app.register(authMiddleware);

  // Rotas que utilizam o middleware
  app.post("/user", register);
  app.get("/users", listUsers);
  app.post("/login", login);
  app.delete("/users", deleteUsers);

  // Aqui, a função authenticate deve estar definida corretamente
  app.get("/me", { preValidation: app.authenticate }, getCurrentUser);
}

export async function clientRoutes(app: FastifyInstance) {
  app.post("/clients", clients);
  app.put("/clients", updateClient);
  app.delete("/clients", deleteClient);
  app.get("/clients", listClients);
}

export async function materialRoutes(app: FastifyInstance) {
  app.post("/materials", createMaterial);
  app.put("/materials", updateMaterial);
  app.delete("/materials", deleteMaterial);
  app.get("/materials", listMaterials);
}

export async function budgetRoutes(app: FastifyInstance) {
  app.post("/budgets", createBudget);
  app.get("/budgets", listBudget);
}
