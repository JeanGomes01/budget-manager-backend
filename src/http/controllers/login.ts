import bcrypt from "bcrypt"; // Certifique-se de que o bcrypt está instalado
import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../../env"; // Importando suas variáveis de ambiente
import { prisma } from "../../lib/prisma";

export async function login(request: FastifyRequest, reply: FastifyReply) {
  // Definindo o esquema de validação para o corpo da requisição
  const loginBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  // Validando o corpo da requisição
  const { email, password } = loginBodySchema.parse(request.body);

  // Encontre o usuário no banco de dados
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return reply.status(401).send({ message: "Usuário não encontrado" });
  }

  // Verifique a senha
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return reply.status(401).send({ message: "Senha inválida" });
  }

  // Verifique se o JWT_SECRET está definido
  if (!env.JWT_SECRET) {
    throw new Error("JWT_SECRET não está definido!");
  }

  // Crie o token JWT
  const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
    expiresIn: "10d",
  });
  const newData = {
    email: user.email,
    created: user.createdAt,
  };

  return reply.status(200).send({
    token,
    data: newData,
  });
}
