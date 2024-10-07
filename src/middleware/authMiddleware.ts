// src/http/middleware/authMiddleware.ts

import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import jwt from "jsonwebtoken";
import { JWTUserPayload } from "../@types/jwt.Payload";

function ensureAuthenticated(
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) {
  const token = request.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return reply.code(401).send({ Error: "Token not provided" });
  }
  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || "my$up3rS3cureK3y!12345"
    ) as JWTUserPayload;

    request.userId = decodedToken.userId;
    console.log("USER ID", request.userId);

    console.log(decodedToken);
  } catch (error) {
    reply.code(401).send({ Error: "Token invalid" });
  }
  done();
}

export { ensureAuthenticated };
