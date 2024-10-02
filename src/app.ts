import fastify from "fastify";
import {
  budgetRoutes,
  clientRoutes,
  materialRoutes,
  userRoutes,
} from "./http/routes";
import { authMiddleware } from "./middleware/authMiddleware";

export const app = fastify();
app.register(authMiddleware);

app.register(userRoutes, { preHandler: authMiddleware });
app.register(clientRoutes, { preHandler: authMiddleware });
app.register(materialRoutes, { preHandler: authMiddleware });
app.register(budgetRoutes, { preHandler: authMiddleware });
