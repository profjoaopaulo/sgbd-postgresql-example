A base de dados usada no PostgreSQL de nome colegio e tabela alunos:
CREATE DATABASE colegio; 
CREATE TABLE alunos (
    id SERIAL PRIMARY KEY,
    nome TEXT,
    idade INT
);
