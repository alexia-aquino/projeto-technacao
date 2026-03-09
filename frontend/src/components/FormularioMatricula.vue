<script setup lang="ts">
import { ref, onMounted } from 'vue'

// URL do Backend
const API_URL = 'http://localhost:5000'


// Interface para tipar os cursos
interface Course {
  id: number
  title: string
  description: string
  price: number
}

// Estado do Componente
const nome = ref('')
const email = ref('')
const cursoSelecionado = ref<number | null>(null)
const cursos = ref<Course[]>([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const mensagem = ref('')
const tipoMensagem = ref<'sucesso' | 'erro'>('sucesso')


// Carregar cursos ao iniciar
onMounted(async () => {
  isLoading.value = true
  try {
    const response = await fetch(`${API_URL}/cursos`)
    if (!response.ok) throw new Error('Falha ao carregar cursos')
    cursos.value = await response.json()
  } catch (error) {
    console.error(error)
    mensagem.value = 'Erro ao carregar a lista de cursos.'
    tipoMensagem.value = 'erro'
  } finally {
    isLoading.value = false
  }
})

// Enviar formulário
const realizarMatricula = async () => {
  // Validação
  const nomeTrimado = nome.value.trim()
  const partesNome = nomeTrimado.split(' ')
  
  if (partesNome.length < 2) {
    mensagem.value = 'Por favor, insira nome e sobrenome.'
    tipoMensagem.value = 'erro'
    return
  }

  if (!nome.value || !email.value || !cursoSelecionado.value) {
    mensagem.value = 'Por favor, preencha todos os campos.'
    tipoMensagem.value = 'erro'
    return
  }

  isSubmitting.value = true
  mensagem.value = ''

  try {
    const response = await fetch(`${API_URL}/matricula`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: nome.value,
        email: email.value,
        cursoId: cursoSelecionado.value,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      mensagem.value = data.mensagem || 'Matrícula realizada com sucesso!'
      tipoMensagem.value = 'sucesso'
      
      // Limpar formulário
      nome.value = ''
      email.value = ''
      cursoSelecionado.value = null
    } else {
      throw new Error(data.erro || 'Erro ao realizar matrícula')
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao comunicar com o servidor.'
    mensagem.value = errorMessage
    tipoMensagem.value = 'erro'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="container">
    <div class="logo-topo">
        <img src="./assets/img/logo do projeto.png" alt="Logo" class="logo" />
      </div>

    <div class="card">
      <h1>Matricule-se já!</h1>
      <p class="subtitle">Escolha um curso e comece a aprender.</p>

      <!-- Carregando -->
      <div v-if="isLoading" class="loading">
        <span class="spinner"></span>
        Carregando formulário...
      </div>

      <!-- Formulário -->
      <form v-else @submit.prevent="realizarMatricula">
        
        <!-- Nome -->
        <div class="form-group">
          <label for="nome">Nome Completo</label>
          <input
            id="nome"
            v-model="nome"
            type="text"
            placeholder="Seu nome completo"
            :class="{ invalid: !nome && mensagem.includes('Preencha') }"
          />
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email">E-mail</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="seu@email.com"
            :class="{ invalid: !email && mensagem.includes('Preencha') }"
          />
        </div>

        <!-- Curso -->
        <div class="form-group">
          <label for="curso">Selecione o Curso</label>
          <select
            id="curso"
            v-model="cursoSelecionado"
            :class="{ invalid: !cursoSelecionado && mensagem.includes('Preencha') }"
          >
            <option :value="null" disabled>Escolha uma opção</option>
            <option v-for="curso in cursos" :key="curso.id" :value="curso.id">
              {{ curso.title }} – {{ curso.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
            </option>
          </select>
        </div>

        <!-- Botão -->
        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Enviando...' : 'Realizar matrícula' }}
        </button>

        <!-- Mensagem -->
        <div v-if="mensagem" :class="['message', tipoMensagem]">
          {{ mensagem }}
        </div>

      </form>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding-top: 20px;
  padding-bottom: 50px;
background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
                    url('./assets/img/fundo.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.logo-topo {
  margin-bottom: 2px; 
  text-align: center;
    animation: desceLogo 0.5s ease-out forwards;
    opacity: 0;
    transform: translateY(-20px);
    }

    @keyframes desceLogo {
        to {
        opacity: 1;
        transform: translateY(0);
  }
}

.logo {
  max-width: 150px;
  height: auto;
}

.card {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 450px;
    animation: sobeCard 0.6s ease-out 0.2s forwards; /* 0.2s de delay */
    opacity: 0;
    transform: translateY(30px);
}

    @keyframes sobeCard {
        to {
        opacity: 1;
        transform: translateY(0);
    }
}

h1 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-size: 1.8rem;
  text-align: center;
}


.subtitle {
  color: #7f8c8d;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 1.2rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #34495e;
  font-size: 0.9rem;
}

input, select {
  width: 100%;
  padding: 0.9rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

input:focus, select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

input.invalid, select.invalid {
  border-color: #e74c3c;
  background-color: #fdf2f2;
}

button {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #1e3249 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 0.5rem;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.message {
  margin-top: 1.2rem;
  padding: 0.9rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  font-size: 0.9rem;
  animation: fadeIn 0.3s ease;
}

.sucesso {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.erro {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #667eea;
  font-weight: 500;
  padding: 2rem;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid #e0e0e0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsividade */

/* Tablet */
@media (max-width: 768px) {
  .card {
    padding: 1.5rem;
  }
  
  h1 {
    font-size: 1.4rem;
  }
  
  .logo {
    max-width: 130px;
  }
}

/* Celular */
@media (max-width: 480px) {
  .container {
    padding: 15px;
  }
  
  .card {
    padding: 1.2rem;
    border-radius: 12px;
  }
  
  h1 {
    font-size: 1.2rem;
  }
  
  .subtitle {
    font-size: 0.8rem;
  }
  
  label {
    font-size: 0.8rem;
  }
  
  input, select {
    padding: 0.7rem;
    font-size: 0.9rem;
  }
  
  button {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
  
  .logo {
    max-width: 110px;
  }
  
  .message {
    font-size: 0.8rem;
    padding: 0.6rem;
  }
}

/* Celular Pequeno */
@media (max-width: 320px) {
  .card {
    padding: 1rem;
  }
  
  h1 {
    font-size: 1.1rem;
  }
  
  .logo {
    max-width: 90px;
  }
}
</style>