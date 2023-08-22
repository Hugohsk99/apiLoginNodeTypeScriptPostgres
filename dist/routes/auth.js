"use strict";
// src/routes/auth.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const user_1 = require("../entity/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const repo = (0, typeorm_1.getRepository)(user_1.User);
    const { username, password } = req.body;
    const user = new user_1.User();
    user.username = username;
    user.password = password;
    user.hashPassword();
    try {
        const result = yield repo.save(user);
        res.status(201).send(result);
    }
    catch (e) {
        res.status(409).send('Username já existe.');
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const repo = (0, typeorm_1.getRepository)(user_1.User);
    const { username, password } = req.body;
    const user = yield repo.findOne({ where: { username } });
    if (user && user.checkPassword(password)) {
        const token = jsonwebtoken_1.default.sign({ userId: user.id, username: user.username }, "your_secret_key", { expiresIn: "1h" });
        res.send({ token });
    }
    else {
        res.status(401).send('Credenciais inválidas.');
    }
}));
exports.default = router;
