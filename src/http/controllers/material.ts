import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

export async function createMaterial(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const materialSchema = z.object({
    name: z.string(), // Nome do material
    value: z.number(), // Preço do material
  });

  // Valida o corpo da requisição
  const { name, value } = materialSchema.parse(request.body);

  // Criação do material no banco de dados
  const material = await prisma.material.create({
    data: {
      name,
      value,
    },
  });

  return reply.status(201).send({
    message: "Material criado com sucesso!",
    data: material,
  });
}

export async function updateMaterial(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const updateMaterialSchema = z.object({
    id: z.number(),
    value: z.number(),
  });

  const { id, value } = updateMaterialSchema.parse(request.body);

  const updatedMaterial = await prisma.material.update({
    where: {
      id,
    },
    data: {
      value,
    },
  });
  return reply.status(200).send({
    message: "O material foi atualizado com sucesso !!",
    data: updatedMaterial,
  });
}

export async function deleteMaterial(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const deleteMaterialSchema = z.object({
    id: z.number(),
  });

  const { id } = deleteMaterialSchema.parse(request.body);

  const deletedMaterial = await prisma.material.delete({
    where: {
      id,
    },
  });
  return reply.status(200).send({
    message: "O material foi excluído com sucesso !!",
    data: deletedMaterial,
  });
}

export async function listMaterials(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const materials = await prisma.material.findMany({
    where: {
      deleted: false,
    },
  });
  return reply.status(200).send({
    message: "Os Materiais foram listados com sucesso !!!",
    data: materials,
  });
}
