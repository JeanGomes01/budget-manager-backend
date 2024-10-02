// src/http/middleware/authMiddleware.ts

import fastifyJWT from "@fastify/jwt"; // Importar o módulo @fastify/jwt
import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { JWTUserPayload } from "../@types/jwt.Payload";

const authMiddleware: FastifyPluginAsync = async (app: FastifyInstance) => {
  // Registrar o plugin @fastify/jwt
  app.register(fastifyJWT, {
    secret: process.env.JWT_SECRET || "my$up3rS3cureK3y!12345",
  });

  // Decorar a instância do Fastify com o método authenticate
  app.addHook(
    "onRequest",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const authHeader = request.headers["authorization"];
      if (!authHeader || !authHeader.startsWith("Bearer")) {
        return reply.status(400).send({ message: "Token não fornecido" });
      }

      try {
        const decodedToken = (await request.jwtVerify()) as JWTUserPayload; // Verifica o token e decodifica

        request.currentUser = decodedToken;
      } catch (err: unknown) {
        if (err instanceof Error) {
          reply
            .status(401)
            .send({ message: "Token inválido", error: err.message });
        } else {
          reply
            .status(401)
            .send({ message: "Token inválido", error: "Erro desconhecido" });
        }
      }
    }
  );

  console.log("authMiddleware registered.");
};
export { authMiddleware };
