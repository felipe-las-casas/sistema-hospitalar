import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Criar uma consulta
router.post("/", async (req, res) => {
    try {
      const { dataHora, nomeMedico, descricao, pacienteId } = req.body;
  
      // Verifica se o paciente existe
      const paciente = await prisma.paciente.findUnique({ where: { id: pacienteId } });
      if (!paciente) return res.status(404).json({ error: "Paciente não encontrado" });
  
      const consulta = await prisma.consulta.create({
        data: { dataHora, nomeMedico, descricao, pacienteId },
      });
  
      res.status(201).json(consulta);
    } catch (error) {
      res.status(400).json({ error: "Erro ao criar consulta." });
    }
  });
  
  // Listar todas as consultas
  router.get("/", async (req, res) => {
    try {
        const consultas = await prisma.consulta.findMany({
          include: {
            paciente: {
              select: {
                nomeCompleto: true,
                cpf: true,
                celular: true
              }
            }
          },
          orderBy: {
            dataHora: 'desc'
          }
        });
        
        res.json(consultas);
      } catch (error) {
        console.error('Erro ao buscar consultas:', error);
        res.status(500).json({
          error: 'Erro ao carregar consultas',
          details: error.message
        });
      }
  });
  
  // Buscar consulta por ID
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const consulta = await prisma.consulta.findUnique({
      where: { id },
      include: { paciente: true },
    });
  
    consulta ? res.json(consulta) : res.status(404).json({ error: "Consulta não encontrada." });
  });
  
  // Buscar consultas de um paciente
  router.get("/paciente/:pacienteId", async (req, res) => {
    const { pacienteId } = req.params;
    const consultas = await prisma.consulta.findMany({
      where: { pacienteId },
      include: { paciente: true },
    });
  
    consultas.length > 0 ? res.json(consultas) : res.status(404).json({ error: "Nenhuma consulta encontrada." });
  });
  
  // Atualizar consulta
  router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { dataHora, nomeMedico, descricao } = req.body;
  
    try {
      const consulta = await prisma.consulta.update({
        where: { id },
        data: { dataHora, nomeMedico, descricao },
      });
      res.json(consulta);
    } catch {
      res.status(400).json({ error: "Erro ao atualizar consulta." });
    }
  });
  
  // Deletar consulta
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      await prisma.consulta.delete({ where: { id } });
      res.json({ message: "Consulta deletada com sucesso." });
    } catch {
      res.status(400).json({ error: "Erro ao deletar consulta." });
    }
})

export default router;