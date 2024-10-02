// src/@types/fastify.d.ts
import "fastify";
import { JWTUserPayload } from "./jwt.Payload";

declare module "fastify" {
  interface FastifyRequest {
    currentUser: JWTUserPayload;
    currentClient: JWTUserPayload;
  }

  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}
