const pokeForm = document.getElementById('poke-form');
const pokeInput = document.getElementById('poke-input');
const pokeBtn = document.getElementById('poke-btn');
const pokeStatus = document.getElementById('poke-status');
const pokeResult = document.getElementById('poke-result');

pokeForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nomePokemon = pokeInput.value.trim().toLowerCase();

  if (!nomePokemon) {
    pokeStatus.textContent = "Por favor, digite o nome de um Pokémon.";
    pokeStatus.style.color = "red";
    pokeResult.replaceChildren();
    return;
  }

  // Estado: Carregando
  pokeBtn.disabled = true;
  pokeStatus.textContent = "Buscando Pokémon...";
  pokeResult.replaceChildren();

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nomePokemon}`, {
      signal: AbortSignal.timeout(5000)
    });

    // Tratamento explícito do erro HTTP 404 (Pokémon não encontrado)
    if (!response.ok) {
      if (response.status === 404) {
        pokeStatus.textContent = "Pokémon não encontrado.";
        pokeStatus.style.color = "orange";
        return;
      }
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();

    // Estado: Sucesso
    pokeStatus.textContent = "";
    
    // Criando elementos com segurança contra XSS (createElement + textContent)
    const container = document.createElement('div');

    const titulo = document.createElement('h2');
    // Capitaliza a primeira letra do nome
    titulo.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);

    const imagem = document.createElement('img');
    imagem.src = data.sprites.front_default;
    imagem.alt = `Sprite de ${data.name}`;

    const listaTipos = document.createElement('ul');
    const tituloTipos = document.createElement('p');
    tituloTipos.textContent = "Tipos:";
    
    data.types.forEach(t => {
      const li = document.createElement('li');
      li.textContent = t.type.name;
      listaTipos.appendChild(li);
    });

    container.appendChild(titulo);
    container.appendChild(imagem);
    container.appendChild(tituloTipos);
    container.appendChild(listaTipos);

    pokeResult.appendChild(container);

  } catch (error) {
    // Estado: Erro de Rede
    pokeStatus.textContent = "Falha na conexão com a PokéAPI. Verifique sua rede.";
    pokeStatus.style.color = "red";
    console.error(error);
  } finally {
    pokeBtn.disabled = false;
  }
});