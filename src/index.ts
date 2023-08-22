import express, { Request, Response, NextFunction } from 'express';
import { createConnection } from 'typeorm';
import authRoutes from './routes/auth';

const app = express();
const PORT = 3002;

app.set('view engine', 'pug');
app.set('views', 'src/views');


// Middlewares para parsing de JSON e dados de formulário
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para servir arquivos estáticos
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});


// Rotas de autenticação
app.use('/auth', authRoutes);

// Middleware de tratamento de erros
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

createConnection()
    .then(async () => {
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Erro ao conectar com o banco de dados:', error);
    });
