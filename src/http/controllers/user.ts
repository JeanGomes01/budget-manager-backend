// import { FastifyReply, FastifyRequest } from "fastify";
// import { prisma } from "../../lib/prisma";

// export const getUserData = async (
//   request: FastifyRequest,
//   reply: FastifyReply
// ) => {
//   try {
//     const currentUser = request.currentUser; // Acessa o usuário autenticado

//     if (!currentUser) {
//       return reply.status(401).send({ message: "Usuário não autenticado" });
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: currentUser.id },
//     });

//     if (!user) {
//       return reply.status(404).send({ message: "Usuário não encontrado" });
//     }

//     return reply.send(user);
//   } catch (error) {
//     return reply
//       .status(500)
//       .send({ message: "Erro ao buscar dados do usuário" });
//   }
// };

// export async function getCurrentUser(
//   request: FastifyRequest,
//   reply: FastifyReply
// ) {
//   try {
//     const currentUser = request.currentUser;
//     if (!currentUser) {
//       return reply.status(401).send({ message: "Usuário não autenticado" });
//     }
//     return reply.send(currentUser);
//   } catch (error) {
//     return reply.status(500).send({ error: "Erro ao buscar dados do usuário" });
//   }

//   return reply.send(request.currentUser); // Retorne os dados do usuário
// }
