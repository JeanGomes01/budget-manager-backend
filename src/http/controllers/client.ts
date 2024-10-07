import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

export async function createClient(
  request: FastifyRequest,
  reply: FastifyReply
) {
  console.log("Create Cliente", createClient);
  const clientsBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
  });

  const { name, email } = clientsBodySchema.parse(request.body);

  if (!request.userId) {
    return reply.status(401).send({ message: "User ID is missing" });
  }

  console.log("Create Cliente", createClient);
  const createdClient = await prisma.client.create({
    data: {
      userId: request.userId,
      name,
      email,
    },
  });
  return reply.status(201).send({
    message: "O Cliente foi registrado com sucesso !!!",
    data: createdClient,
  });
}

export async function updateClient(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Esquema de validação dos dados de entrada
  const updateClientSchema = z.object({
    id: z.number(), // Aqui, o ID do cliente a ser atualizado
    name: z.string().optional(), // O nome pode ser opcional
  });

  const { id, name } = updateClientSchema.parse(request.body);

  // Atualizar o cliente no banco de dados, permitindo campos opcionais
  const updatedClient = await prisma.client.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });

  return reply.status(200).send({
    message: "O Cliente foi atualizado com sucesso !!!",
    data: updatedClient, // Retorna os dados atualizados
  });
}

export async function deleteClient(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const deleteClientSchema = z.object({
    id: z.number(),
  });

  // Delete o cliente no banco de dados sem hash da senha
  const { id } = deleteClientSchema.parse(request.body);

  const deletedClient = await prisma.client.delete({
    where: {
      id,
    },
  });
  return reply.status(200).send({
    message: "O Cliente foi excluído com sucesso !!!",
    data: deletedClient,
  });
}

export async function listClients(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Buscar todos os clientes
  const clients = await prisma.client.findMany({
    where: {
      userId: request.userId,
      deleted: false,
    },
  });
  return reply.status(200).send({
    message: "Os Clientes foram listados com sucesso !!!",
    data: clients,
  });
}
