// src/controllers/auth.ts
import bcrypt from "bcrypt";
import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "my$up3rS3cureK3y!12345"; // Use uma chave segura no ambiente

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const loginBodySchema = z.object({
    username: z.string(),
    password: z.string().min(6),
  });

  const { username, password } = loginBodySchema.parse(request.body);

  // Buscar o usuário no banco de dados
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return reply.status(400).send({ message: "Usuário não encontrado" });
  }

  // Verificar se a senha está correta
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return reply.status(400).send({ message: "Senha incorreta" });
  }

  // Gerar o token JWT
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "10d",
  });

  return reply.send({ token, user });
}


