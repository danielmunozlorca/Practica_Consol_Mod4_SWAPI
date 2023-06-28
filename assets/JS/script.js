const apiUrl = "https://swapi.dev/api/people/";

function fetchCharacterData(url) {
  return fetch(url)
    .then(response => response.json())
    .catch(error => console.log(error));
}

//borderclass para cambiar el color en CSS, aunque parece que luego lo hice por otro atributo
function createCharacterCard(character, groupElement, borderClass) {
  // Buscar el elemento correspondiente al personaje usando el atributo "data-character-id"
  const characterCard = document.querySelector(`[data-character-id="${character.url.split('/').slice(-2, -1)}"] p`);
  characterCard.innerHTML = character.name;
  
  // Agregar la clase del borde al elemento del personaje
  characterCard.classList.add(borderClass);

  // Actualizar el evento de clic para mostrar la información del personaje
  characterCard.addEventListener('click', () => {
    fetchCharacterData(character.url)
      .then(data => {
        showCharacterInfo(data);
      });
  });
}

function showCharacterInfo(character) {
  const modal = document.getElementById('character-modal');
  const modalContent = document.querySelector('.modal-content');
  const closeBtn = document.createElement('span');
  closeBtn.classList.add('close-button');
  closeBtn.innerHTML = '&times;';

  modal.style.display = 'block';

  const characterInfo = document.createElement('div');
  characterInfo.innerHTML = `
    <h2>${character.name}</h2>
    
    <div class="character-info-inner">
      <div class="character-image" style="background-image: url('./assets/IMG/${character.name}.jpg');"></div>
      <div class="character-details">

    <p>Estatura: ${character.height} cm</p>
    <p>Peso: ${character.mass} kg</p>
    <p>Color de Pelo: ${character.hair_color}</p>
    <p>Color de Piel: ${character.skin_color}</p>
    <p>Color de Ojos: ${character.eye_color}</p>
  `;
  characterInfo.classList.add('character-info');
  characterInfo.appendChild(closeBtn);
  modalContent.appendChild(characterInfo);

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    modalContent.removeChild(characterInfo);
  });

  window.addEventListener('click', (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
      modalContent.removeChild(characterInfo);
    }
  });
}

function getCharactersByGroup(groupElement, start, end) {
  const borderClass = "border-character"; // Clase del borde deseado
  
  for (let i = start; i <= end; i++) {
    const characterUrl = apiUrl + i + "/";
    fetch(characterUrl)
      .then(response => response.json())
      .then(data => {
        createCharacterCard(data, groupElement, borderClass);
      })
      .catch(error => console.log(error));
  }
}


function initialize() {
  const popularCharactersGroup = document.getElementById('popular-characters');
  const secondaryCharactersGroup = document.getElementById('secondary-characters');
  const otherCharactersGroup = document.getElementById('other-characters');

  popularCharactersGroup.addEventListener('click', () => {
    popularCharactersGroup.innerHTML = `<h2>Personajes Populares</h2>`;
    getCharactersByGroup(popularCharactersGroup, 1, 5);
  });

  secondaryCharactersGroup.addEventListener('click', () => {
    secondaryCharactersGroup.innerHTML = `<h2>Personajes Secundarios</h2>`;
    getCharactersByGroup(secondaryCharactersGroup, 6, 11);
  });

  otherCharactersGroup.addEventListener('click', () => {
    otherCharactersGroup.innerHTML = `<h2>Otros Personajes</h2>`;
    getCharactersByGroup(otherCharactersGroup, 12, 16);
  });
}

initialize();
