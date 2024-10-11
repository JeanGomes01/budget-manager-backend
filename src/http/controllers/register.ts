import bcrypt from "bcrypt";
import { FastifyReply, FastifyRequest } from "fastify";
import jwt, { JwtPayload } from "jsonwebtoken"; // Certifique-se de que está importando o jwt
import { z } from "zod";
import { prisma } from "../../lib/prisma";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });
  const { email, password } = registerBodySchema.parse(request.body);

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return reply.status(400).send({ message: "Nome de usuário já existe." });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: passwordHash,
    },
  });

  // Gerar o token JWT após criar o usuário
  const token = jwt.sign(
    { id: user.id, role: "user" },
    process.env.JWT_SECRET || "my$up3rS3cureK3y!12345",
    { expiresIn: "10d" }
  );

  return reply
    .status(201)
    .send({ message: "O Usuário foi registrado com sucesso !!!", token });
}

export async function listUsers(request: FastifyRequest, reply: FastifyReply) {
  const token = request.headers["authorization"]?.split(" ")[1];

  // Log para verificar o token recebido

  if (!token) {
    return reply.status(401).send({ message: "Unauthorized" });
  }

  const jwtSecret = process.env.JWT_SECRET || "my$up3rS3cureK3y!12345"; // Use uma chave segura no ambiente

  try {
    // Verificar e decodificar o token
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    // Retornar todos os usuários
    const users = await prisma.user.findMany();
    const usersWithoutPassword = users.map(
      ({ password, ...userData }) => userData
    );
    return reply.status(200).send({ users: usersWithoutPassword });
  } catch (error) {
    console.error("Erro ao verificar o token:", error); // Log do erro
    return reply.status(401).send({ message: "Token inválido" });
  }
}

export async function deleteUsers(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // Deletar todos os usuários
    await prisma.user.deleteMany({});

    return reply.status(204).send(); // Retorna um status 204 No Content
  } catch (error) {
    console.error("Erro ao deletar usuários:", error);
    return reply.status(500).send({ message: "Erro ao deletar usuários" });
  }
}
