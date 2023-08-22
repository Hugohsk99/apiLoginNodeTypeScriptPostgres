// src/routes/auth.ts

import { Router } from 'express';
import { getConnection } from 'typeorm';
import { User } from '../entity/user';
import jwt from 'jsonwebtoken';

const router = Router();

// Retorna o repositório de User uma única vez, para evitar repetição
function getUserRepository() {
    return getConnection().getRepository(User);
}

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const repo = getUserRepository();

    const user = new User();
    user.username = username;
    user.password = password;
    user.hashPassword();

    try {
        await repo.save(user);
        res.redirect('/login'); // Redireciona para a página de login após o registro bem-sucedido
    } catch (e) {
        res.status(409).send('Nome de usuário já existe.');
    }
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const repo = getUserRepository();

    // Simplificado a busca por username
    const user = await repo.findOne({ where: { username } });

    if (user && user.checkPassword(password)) {
        const token = jwt.sign({ userId: user.id, username: user.username }, "your_secret_key", { expiresIn: "1h" });
        res.send({ token });
    } else {
        res.status(401).send('Credenciais inválidas.');
    }
});

export default router;
