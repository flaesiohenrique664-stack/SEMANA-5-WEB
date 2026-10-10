const cepForm = document.getElementById('cep-form');
const cepInput = document.getElementById('cep-input');
const cepBtn = document.getElementById('cep-btn');
const statusMessage = document.getElementById('status-message');
const cepResult = document.getElementById('cep-result');
const historicoList = document.getElementById('historico-list');

// Array para armazenar o histórico (Bônus)
const historicoCEPs = [];

cepForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Evita o recarregamento da página

  // Limpeza e Validação: apenas dígitos e exatamente 8 caracteres
  const cepLimpo = cepInput.value.trim().replace(/\D/g, '');

  if (cepLimpo.length !== 8) {
    exibirErro("CEP inválido. Deve conter exatamente 8 dígitos.");
    return;
  }

  // Estado 1: Carregando
  definirEstadoCarregando(true);

  try {
    // Uso de AbortSignal.timeout(5000) para evitar travamentos de rede
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`, {
      signal: AbortSignal.timeout(5000)
    });

    // O fetch não rejeita por erros HTTP (ex: 404), é preciso checar response.ok
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();

    // Estado 2: Vazio / Não Encontrado (API retorna a chave 'erro: true')
    if (data.erro) {
      exibirVazio("CEP não encontrado.");
      return;
    }

    // Estado 3: Sucesso
    exibirSucesso(data);

    // Bônus: Adicionar ao histórico
    adicionarAoHistorico(data);

  } catch (error) {
    // Estado 4: Erro (Falha de conexão ou timeout)
    exibirErro("Falha na conexão ou tempo limite excedido. Tente novamente.");
    console.error(error);
  } finally {
    definirEstadoCarregando(false);
  }
});

function definirEstadoCarregando(carregando) {
  if (carregando) {
    cepBtn.disabled = true;
    statusMessage.textContent = "Buscando...";
    cepResult.replaceChildren(); // Limpa resultados anteriores
  } else {
    cepBtn.disabled = false;
  }
}

function exibirErro(mensagem) {
  statusMessage.textContent = mensagem;
  statusMessage.style.color = "red";
  cepResult.replaceChildren();
}

function exibirVazio(mensagem) {
  statusMessage.textContent = mensagem;
  statusMessage.style.color = "orange";
  cepResult.replaceChildren();
}

function exibirSucesso(data) {
  statusMessage.textContent = ""; // Limpa o aviso de status
  cepResult.replaceChildren(); // Limpa dados anteriores com segurança

  const campos = [
    { termo: "Rua", descricao: data.logradouro },
    { termo: "Bairro", descricao: data.bairro },
    { termo: "Cidade", descricao: data.localidade },
    { termo: "UF", descricao: data.uf }
  ];

  campos.forEach(item => {
    const dt = document.createElement('dt');
    dt.textContent = item.termo;

    const dd = document.createElement('dd');
    dd.textContent = item.descricao || "Não informado";

    cepResult.appendChild(dt);
    cepResult.appendChild(dd);
  });
}

function adicionarAoHistorico(data) {
  const registro = {
    cep: data.cep,
    localidade: data.localidade,
    uf: data.uf
  };
  
  historicoCEPs.push(registro);
  
  // Renderizar a lista de histórico na tela de forma segura
  historicoList.replaceChildren();
  historicoCEPs.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `CEP: ${item.cep} - ${item.localidade}/${item.uf}`;
    historicoList.appendChild(li);
  });
}