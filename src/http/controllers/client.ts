import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

export async function createClient(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const clientsBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
  });

  const { name, email } = clientsBodySchema.parse(request.body);

  if (!request.userId) {
    return reply.status(401).send({ message: "User ID is missing" });
  }

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

export async function updateClient(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const updateClientSchema = z.object({
    id: z.number(),
    name: z.string(),
  });

  const { id, name } = updateClientSchema.parse(request.body);

  const updatedClient = await prisma.client.update({
    where: {
      userId: request.userId,
      id,
    },
    data: {
      name,
    },
  });
  return reply.status(200).send({
    message: "O cliente foi atualizado com sucesso !!!",
    data: updatedClient,
  });
}

// export async function updateClient(
//   request: FastifyRequest,
//   reply: FastifyReply
// ) {
//   const updateClientSchema = z.object({
//     id: z.number(),
//   });
//   const { id } = updateClientSchema.parse(request.params);

//   const updateBodySchema = z.object({
//     name: z.string(),
//   });
//   const { name } = updateBodySchema.parse(request.body);

//   const updatedClient = await prisma.client.update({
//     where: {
//       userId: request.userId,
//       id,
//     },
//     data: {
//       name,
//     },
//   });

//   return reply.status(200).send({
//     message: "O cliente foi atualizado com sucesso !!!",
//     data: updatedClient,
//   });
// }

export async function deleteClient(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const deleteClientSchema = z.object({
    id: z.number(),
  });

  const { id } = deleteClientSchema.parse(request.body);

  const deletedClient = await prisma.client.delete({
    where: {
      id,
    },
  });
  console.log(deletedClient);
  return reply.status(200).send({
    message: "O Cliente foi excluído com sucesso !!!",
    data: deletedClient,
  });
}
