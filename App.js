import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from 'react-native';
import axios from 'axios'; //O cliente mobile se conecta à base de dados através da API definida na URL

const API_URL = 'http://10.0.2.2:3000/alunos'; //IP Para emuladores Android (eles não vêem o localhost)

export default function App() {
  const [alunos, setAlunos] = useState([]);
  const [newNome, setNewNome] = useState('');
  const [newIdade, setNewIdade] = useState('');
  const [selectedAluno, setSelectedAluno] = useState(null);

  useEffect(() => {
    fetchAlunos();
  }, []);

  //Usar HTTP:GET para listar os alunos na tela
  const fetchAlunos = async () => {
    try {
      const response = await axios.get(API_URL);
      setAlunos(response.data);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    }
  };

  //Usar HTTP:POST para inserir um novo aluno
  const addAluno = async () => {
    try {
      await axios.post(API_URL, {
        nome: newNome,
        idade: parseInt(newIdade),
      });
      setNewNome('');
      setNewIdade('');
      fetchAlunos();
    } catch (error) {
      console.error('Erro ao adicionar aluno:', error);
    }
  };

  //Usar HTTP:PUT para atualizar os dados de um aluno específico
  const updateAluno = async () => {
    try {
      if (!selectedAluno) return;

      await axios.put(`${API_URL}/${selectedAluno.id}`, {
        nome: newNome,
        idade: parseInt(newIdade),
      });

      console.log('Aluno atualizado:', { nome: newNome, idade: parseInt(newIdade) });
      fetchAlunos();
      setSelectedAluno(null);
      setNewNome('');
      setNewIdade('');
    } catch (error) {
      console.error('Erro ao atualizar aluno:', error);
    }
  };

  //Usar HTTP:DELETE para remover um aluno específico
  const deleteAluno = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      console.log('Aluno deletado:', response.data);
      fetchAlunos();
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Alunos</Text>
      <FlatList
        data={alunos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.alunoItem}>
            <Text>
              {item.nome} - {item.idade} anos
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                title="Editar"
                onPress={() => {
                  setNewNome(item.nome);
                  setNewIdade(item.idade.toString());
                  setSelectedAluno(item);
                }}
              />
              <Button title="Excluir" onPress={() => deleteAluno(item.id)} />
            </View>
          </View>
        )}
      />

      <TextInput
        style={styles.input}
        placeholder="Nome do aluno"
        value={newNome}
        onChangeText={setNewNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Idade do aluno"
        value={newIdade}
        onChangeText={setNewIdade}
        keyboardType="numeric"
      />

      <View style={styles.buttonContainer}>
        <Button
          title={selectedAluno ? 'Atualizar Aluno' : 'Adicionar Aluno'}
          onPress={selectedAluno ? updateAluno : addAluno}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  alunoItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
