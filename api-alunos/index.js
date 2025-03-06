const express = require('express'); //Framework web para Node.js
const { Pool } = require('pg'); //Biblioteca para conectar e interagir com a base de dados
const bodyParser = require('body-parser'); //Tratar as requisições HTTP
const cors = require('cors'); //Tratar requisições de diferentes origens

const app = express(); //Instanciando o servidor Express 
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Configuração do PostgreSQL (Pode-se usar outro SGBD de sua preferência)
const pool = new Pool({
  user: 'USUÁRIO DO SGBD', //No exemplo aqui era o usuário 'postgres'
  host: 'IP do servidor SGBD', //Defina o IP de onde se encontra o servidor de base de dados ou 'localhost' caso seja na máquina local
  database: 'NOME DA BASE DE DADOS', //Aqui no exemplo foi usada a base 'colegio'
  password: 'SENHA DO USUÁRIO DO SGBD', //Coloque a senha do usuário do SGBD
  port: 1111, //Troque o 1111 pela porta do servidor SGBD. Aqui no exemplo foi usada a porta padrão do PostgreSQL, 5432
});

// GET: Rota para obter todos os alunos
app.get('/alunos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alunos');
    console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar alunos');
  }
});

// POST: Criar um novo aluno
app.post('/alunos', async (req, res) => {
  const { nome, idade } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO alunos (nome, idade) VALUES ($1, $2) RETURNING *',
      [nome, idade]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar aluno');
  }
});

// PUT: Atualizar um aluno por ID
app.put('/alunos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, idade } = req.body;

  try {
    const result = await pool.query(
      'UPDATE alunos SET nome = $1, idade = $2 WHERE id = $3 RETURNING *',
      [nome, idade, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Aluno não encontrado');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar aluno');
  }
});

// DELETE: Deletar um aluno por ID
app.delete('/alunos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM alunos WHERE id = $1 RETURNING *', [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).send('Aluno não encontrado');
    }

    res.json({ message: 'Aluno deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao deletar aluno');
  }
});

//Atender requisições na porta especificada (3000)
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});