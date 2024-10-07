import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma"; // Certifique-se de que o caminho para o prisma está correto

export async function createBudgetRoutes(
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
  console.log(`Client ID received: ${clientId}`);

  const client = await prisma.client.findUnique({
    where: { id: clientId },
  });

  if (!client) {
    return reply.status(404).send({ error: "Client not found" });
  }

  let totalValue = 0;

  const budgetMaterials = await Promise.all(
    materials.map(async ({ materialId, quantity }) => {
      const material = await prisma.material.findUnique({
        where: { id: materialId },
      });

      if (!material) {
        return reply.status(404).send({ error: "Material not found" });
      }

      totalValue += material.value * quantity;

      return {
        materialId: material.id,
        quantity,
        priceAtCreation: material.value,
      };
    })
  );
  const newBudget = await prisma.budget.create({
    data: {
      clientId: clientId,
      finalized: false,
      BudgetMaterial: {
        create: budgetMaterials.map((bm) => ({
          materialId: bm.materialId,
          quantity: bm.quantity,
          priceAtCreation: bm.priceAtCreation,
        })),
      },
    },
    include: {
      BudgetMaterial: true,
    },
  });

  return reply.status(201).send(newBudget);
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
