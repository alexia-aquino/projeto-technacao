import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Interface
interface Course {
    id: number;
    title: string;
    description: string;
    price: number;
}

interface MatriculaRequest {
    nome: string;
    email: string;
    cursoId: number;
}

// Dados
const cursos: Course[] = [
    { id: 1, title: 'Introdução ao Vue.js', description: 'Aprenda o básico de Vue', price: 99.90 },
    { id: 2, title: 'Node.js Avançado', description: 'Backend robusto com TypeScript', price: 149.90 },
    { id: 3, title: 'UX/UI Design', description: 'Criando interfaces modernas', price: 120.00 },
    { id: 4, title: 'Python para Data Science', description: 'Análise de dados com Python', price: 199.00 },
];

// Rota GET - Lista cursos
app.get('/cursos', (req: Request, res: Response) => {
    res.status(200).json(cursos);
});

// Rota POST - Matrícula
app.post('/matricula', (req: Request, res: Response) => {
    const { nome, email, cursoId } = req.body as MatriculaRequest;

    if (!nome || !email || !cursoId) {
        res.status(400).json({ 
            erro: 'Preencha todos os campos corretamente.' 
        });
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ erro: 'Formato de e-mail inválido.' });
        return;
    }

    console.log('--- Nova Matrícula Recebida ---');
    console.log(`Aluno: ${nome} | Email: ${email}`);
    console.log(`Curso ID: ${cursoId}`);
    console.log('--------------------------------');

    res.status(201).json({ 
        mensagem: 'Matrícula realizada com sucesso!', 
        dados: { nome, email, cursoId } 
    });
});

// Inicialização do Servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});