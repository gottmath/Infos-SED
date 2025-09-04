const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/fazer-login', async (req, res) => {
    const { ra, senha } = req.body;

    if (!ra || !senha) {
        return res.status(400).json({ erro: true, mensagem: "RA e Senha são obrigatórios." });
    }

    const urlApi = "https://sedintegracoes.educacao.sp.gov.br/credenciais/api/LoginCompletoToken";
    const headersApi = {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': '2b03c1db3884488795f79c37c069381a',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
    };
    const dataApi = {
        "user": ra,
        "senha": senha
    };

    try {
        const response = await axios.post(urlApi, dataApi, { headers: headersApi });
        
        res.status(200).json(response.data);

    } catch (error) {
        console.error(`Erro ao fazer a requisição: ${error.message}`);
        if (error.response) {
            res.status(error.response.status).json({
                erro: true,
                mensagem: "Ocorreu um erro na API externa.",
                dados: error.response.data
            });
        } else {
            res.status(500).json({
                erro: true,
                mensagem: "Não foi possível conectar à API externa."
            });
        }
    }
});

app.listen(port, () => {
});
