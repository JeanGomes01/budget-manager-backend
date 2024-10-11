import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma"; // Certifique-se de que o caminho para o prisma está correto

export async function createBudget(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const createBudgetSchema = z.object({
    clientId: z.number(),
    materials: z.array(
      z.object({
        materialId: z.number(),
        quantity: z.number(),
      })
    ),
  });

  const { clientId, materials } = createBudgetSchema.parse(request.body);

  const client = await prisma.client.findUnique({
    where: { id: clientId },
  });

  if (!client) {
    return reply.status(404).send({ error: "Client not found" });
  }

  const newBudget = await prisma.budget.create({
    data: {
      clientId: clientId,
      finalized: false,
      budgetOnMaterial: {
        create: materials.map((material) => ({
          quantity: material.quantity,
          material: {
            connect: {
              id: material.materialId,
            },
          },
        })),
      },
    },
    include: {
      client: true,
      budgetOnMaterial: {
        include: {
          material: true,
        },
      },
    },
  });

  const totalValue = newBudget.budgetOnMaterial.reduce((amount, material) => {
    return (amount += material.material.value * material.quantity);
  }, 0);

  const updatedBudget = await prisma.budget.update({
    where: {
      id: clientId,
    },
    data: {
      amount: totalValue,
    },
    include: {
      client: true,
      budgetOnMaterial: {
        include: {
          material: true,
        },
      },
    },
  });

  return reply.status(201).send(updatedBudget);
}

export async function listBudget(request: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    clientId: z.number().optional(),
    createdAt: z.date().optional(),
    finalized: z.boolean().optional(),
    budgetOnMaterial: z.boolean().optional(),
  });

  // Fazendo o parse da query
  const parseQuery = querySchema.safeParse(request.query);

  if (!parseQuery.success) {
    return reply.status(400).send({
      error: "Invalid query parameters",
      details: parseQuery.error.errors,
    });
  }
  const { clientId, createdAt, finalized, budgetOnMaterial } = parseQuery.data;

  // Definindo as condições de filtro

  try {
    // Se clientId for fornecido, filtra os orçamentos por cliente
    const budgets = await prisma.budget.findMany({
      where: {
        budgetOnMaterial: {
          some: {},
        },
      },
      include: {
        client: true,
        budgetOnMaterial: {
          include: {
            material: true,
          },
        },
      },
    });

    return reply.status(200).send({
      message: "O orçamento foi listado com sucesso !!!",
      data: budgets,
    });
  } catch (error) {
    return reply.status(500).send({
      error: "Failed to fetch budgets",
      details: (error as Error).message,
    });
  }
}

export async function updateBudget(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const updateBudgetSchema = z.object({
    id: z.number(),
  });

  const { id } = updateBudgetSchema.parse(request.body);

  const isFinalized = (
    await prisma.budget.findUnique({
      where: {
        id,
      },
    })
  )?.finalized;

  if (isFinalized === true) {
    return reply.status(500).send({
      message: "O budget já foi finalizado!",
    });
  }

  const listMaterials = await prisma.budgetOnMaterial.findMany({
    where: {
      budgetId: id,
    },
    include: {
      material: true,
    },
  });

  const totalValue = listMaterials.reduce((amount, material) => {
    return (amount += material.material.value * material.quantity);
  }, 0);

  const updatedBudget = await prisma.budget.update({
    where: {
      id,
    },
    data: {
      amount: totalValue,
    },
    include: {
      client: true,
      budgetOnMaterial: {
        include: {
          material: true,
        },
      },
    },
  });

  return reply.status(200).send({
    message: "O orçamento foi atualizado com sucesso !!",
    data: updatedBudget,
  });
}

export async function finishBudget(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const finishBudgetSchema = z.object({
    id: z.number(),
    finalized: z.boolean(),
  });

  const { id, finalized } = finishBudgetSchema.parse(request.body);

  const finishedBudget = await prisma.budget.update({
    where: {
      id,
    },
    data: {
      finalized: true,
    },
  });
  return reply.status(200).send({
    message: {
      message: "O orçamento foi finalizado com sucesso !",
    },
    data: finishedBudget,
  });
}
