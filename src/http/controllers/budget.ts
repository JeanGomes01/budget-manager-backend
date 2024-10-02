import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma"; // Certifique-se de que o caminho para o prisma está correto

export async function createBudget(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const createBudgetSchema = z.object({
    clientId: z.number(),
    materials: z.array(z.number()),
    finalized: z.boolean().optional(),
  });

  const parseBody = createBudgetSchema.safeParse(request.body);

  if (!parseBody.success) {
    return reply.status(400).send({
      error: "Invalid data",
      details: parseBody.error.errors,
    });
  }

  const { clientId, materials, finalized = false } = parseBody.data;

  try {
    // Verifique se o cliente existe
    const clientExists = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!clientExists) {
      return reply.status(400).send({
        error: "Client does not exist",
        details: { clientId },
      });
    }

    // Verifique se todos os materiais existem
    const existingMaterials = await prisma.material.findMany({
      where: { id: { in: materials } },
    });

    if (existingMaterials.length !== materials.length) {
      return reply.status(400).send({
        error: "Some materials do not exist",
        details: materials.filter(
          (id) => !existingMaterials.some((m) => m.id === id)
        ),
      });
    }

    const budget = await prisma.budget.create({
      data: {
        clientId,
        finalized,
        materials: {
          connect: materials.map((materialId) => ({ id: materialId })),
        },
      },
    });

    return reply.status(201).send(budget);
  } catch (error) {
    return reply.status(500).send({
      error: "Failed to create budget",
      details: (error as Error).message,
    });
  }
}

export async function listBudget(request: FastifyRequest, reply: FastifyReply) {
  // Definindo um schema opcional para o clientId
  const querySchema = z.object({
    clientId: z.number().optional(),
  });

  // Fazendo o parse da query
  const parseQuery = querySchema.safeParse(request.query);

  if (!parseQuery.success) {
    return reply.status(400).send({
      error: "Invalid query parameters",
      details: parseQuery.error.errors,
    });
  }

  const { clientId } = parseQuery.data;

  try {
    // Se clientId for fornecido, filtra os orçamentos por cliente
    const budgets = await prisma.budget.findMany({
      where: clientId ? { clientId } : {}, // Filtro condicional
      include: { materials: true }, // Inclui os materiais no retorno
    });

    return reply.send(budgets);
  } catch (error) {
    return reply.status(500).send({
      error: "Failed to fetch budgets",
      details: (error as Error).message,
    });
  }
}
