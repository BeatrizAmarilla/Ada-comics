const urlBase = "https://gateway.marvel.com/v1/public/";
let ts = "ts=1";
const publicKey = "&apikey=93c0e369ba23b10fe80edb027c368e12";
const hash = "&hash=31c8321bf2c8dca37913226c7e83701d";
const $ = (selector) => document.querySelector(selector);

//elementos del DOM
const buttonSearch = document.querySelector(".button-search");
const selectElement = document.querySelector("select");
const selectOrden = document.getElementById("selectOrden");
const comicsCards = document.querySelector(".comics-cards");
const charactersCards = document.querySelector(".characters-cards");
const inputText = document.querySelector(".input-text");
const comicCardsOnly = document.getElementById("comicCardsOnly");
const charactersCardOnly = document.getElementById("charactersCardOnly");

// loader
function mostrarLoader() {
  document.getElementById("loader-container").style.display = "block";
}

function ocultarLoader() {
  document.getElementById("loader-container").style.display = "none";
}

mostrarLoader();

//comics
let title = "";
let offset = 0;
let limit = 20;
let order = "";
let totalComics = 0;
let totalPages = 0;

//data de comics
const getMarvelComics = async (title, offset) => {
  mostrarLoader();
  let existTitle = title ? `&titleStartsWith=${title}` : "";
  const url = `${urlBase}comics?${ts}${publicKey}${hash}${existTitle}&offset=${offset}&limit=${limit}`;
  const response = await fetch(url);
  const data = await response.json();
  return {
    comics: data.data.results,
    totalComics: data.data.total,
  };
};

//impresion de comics en pantalla

const printComics = async (title, order, offset) => {
  const result = await getMarvelComics(title, offset);
  const comics = result.comics;
  totalComics = result.totalComics;
  totalPages = Math.ceil(totalComics / limit);

  // Ordenar los cómics según el orden seleccionado
  if (order === "AZ") {
    comics.sort((a, b) => a.title.localeCompare(b.title));
  } else if (order === "ZA") {
    comics.sort((a, b) => b.title.localeCompare(a.title));
  } else if (order === "VIEJOS") {
    comics.sort(
      (a, b) =>
        new Date(b.dates.find((date) => date.type === "onsaleDate").date) -
        new Date(a.dates.find((date) => date.type === "onsaleDate").date)
    );
  } else if (order === "NUEVOS") {
    comics.sort(
      (a, b) =>
        new Date(a.dates.find((date) => date.type === "onsaleDate").date) -
        new Date(b.dates.find((date) => date.type === "onsaleDate").date)
    );
  }

  $(".comics-cards").innerHTML = ``;
  $(".totalResults").innerHTML = `${totalComics}`;

  for (let comic of comics) {
    $(".comics-cards").innerHTML += `
    <div onclick="handleComicClick(${comic.id})">
        <img src="${comic.thumbnail.path}/portrait_xlarge.${comic.thumbnail.extension}" alt="${comic.title}">
        <p style="font-size: 12px; word-wrap: break-word;margin-bottom:05px">${comic.title}</p>
        </div>`;
  }
  ocultarLoader();
  updatePaginationButtons();
};
printComics(title, order, offset);
// Función para actualizar los botones de paginación
const updatePaginationButtons = () => {
  const currentPage = offset / limit + 1;

  $("#paginaPrevia").disabled = currentPage === 1;
  $("#paginaAnterior").disabled = currentPage === 1;
  $("#siguientePagina").disabled = currentPage === totalPages;
  $("#ultimaPagina").disabled = currentPage === totalPages;

  // Deshabilitar el botón de página previa al cargar la página
  if (currentPage === 1) {
    $("#paginaPrevia").disabled = true;
    $("#paginaAnterior").disabled = true;
  }
};

// Event listener para el botón de página anterior
$("#paginaAnterior").addEventListener("click", () => {
  if (offset >= limit) {
    offset -= limit;
    printComics(title, order, offset);
  }
});

// Event listener para el botón de siguiente página
document.getElementById("siguientePagina").addEventListener("click", () => {
  if (offset + limit < totalComics) {
    offset += limit;
    printComics(title, order, offset);

    // Habilitar todos los botones de paginación
    document.getElementById("paginaPrevia").removeAttribute("disabled");
    document.getElementById("paginaAnterior").removeAttribute("disabled");
    document.getElementById("siguientePagina").removeAttribute("disabled");
    document.getElementById("ultimaPagina").removeAttribute("disabled");
  }
});

// Event listener para el botón de página previa
$("#paginaPrevia").addEventListener("click", () => {
  offset = 0; // Establecer offset a 0 para ir a la primera página
  printComics(title, order, offset);
});

// // Event listener para el botón de última página
// $("#ultimaPagina").addEventListener("click", () => {
//   const totalPages = Math.ceil(totalComics / limit);
//   const lastPageOffset = (totalPages - 1) * limit;
//   printComics(title, order, lastPageOffset);
// });
// Event listener para el botón de última página
$("#ultimaPagina").addEventListener("click", async () => {
  const totalPages = Math.ceil(totalComics / limit);
  const lastPageOffset = (totalPages - 1) * limit;
  await printComics(title, order, lastPageOffset);

  // Habilitar los botones de página previa y página anterior
  $("#paginaPrevia").disabled = false;
  $("#paginaAnterior").disabled = false;

  // Deshabilitar el botón de última página si ya estamos en la última página
  if (offset >= lastPageOffset) {
    console.log("Deshabilitando el botón de última página");
    document.getElementById("ultimaPagina").disabled = true;
  }

  // Deshabilitar el botón de página siguiente si ya estamos en la última página
  if (offset + limit >= totalComics) {
    console.log("Deshabilitando el botón de siguiente página");
    document.getElementById("siguientePagina").disabled = true;
  }
});

//card descripcion comics

const handleComicClick = (comicId) => {
  cardDescription(comicId);
  comicsCards.classList.add("ocultoComics");
  charactersCards.classList.add("ocultoCharacters");
  comicCardsOnly.classList.remove("ocultoComics");
  charactersCardOnly.classList.add("ocultoComics");
};

const cardDescription = async (comicId) => {
  const url = `${urlBase}comics/${comicId}?${ts}${publicKey}${hash}`;
  const response = await fetch(url);
  const data = await response.json();
  const detailsComic = data.data.results[0];
  renderComicDetails(detailsComic);
};

const renderComicDetails = (detailsComic) => {
  const comicCardsOnly = document.getElementById("comicCardsOnly");
  if (comicCardsOnly) {
    const rawDate = new Date(detailsComic.dates[0].date);
    const formattedDate = `${rawDate.getDate()}/${
      rawDate.getMonth() + 1
    }/${rawDate.getFullYear()}`;
    comicCardsOnly.innerHTML = `
      <div>
          <div class="detail-comic"style="columns: 2;margin-left:20px,gap:2">
              <div class="img-container">
                <img class="img" src="${detailsComic.thumbnail.path}/portrait_xlarge.${detailsComic.thumbnail.extension}" alt="${detailsComic.title}">
              </div>  
              <div>
                <p style="font-size:2rem;margin-bottom:10px">${detailsComic.title}</p>
                <p style="margin-bottom:10px">Publicado</p>
                <p style="margin-bottom:10px">${formattedDate}</p>
                <p style="margin-bottom:10px">Guionistas</p>
                <p style="margin-bottom:10px">${detailsComic.creators.items[0].name}</p>
                <p style="margin-bottom:10px">Descripción</p>
                <p>${detailsComic.description}</p>
              </div>
          </div>
          <div style="margin:20px">
            <h3 >Personajes</h3>
            <p>${detailsComic.characters.items.length} resultados</p>
          </div> 
          <div id="characterList"></div>
      </div>`;

    // // Obtener nombres de personajes y renderizarlos
    // const characterList = document.getElementById("characterList");
    // detailsComic.characters.items.forEach((character) => {
    //   getCharacterDetails(character.name).then((characterDetails) => {
    //     if (characterDetails) {
    //       characterList.innerHTML += `
    //         <div class="comic" style="display: inline-block;margin-left:20px">
    //         <img src="${characterDetails.thumbnail.path}/portrait_xlarge.${characterDetails.thumbnail.extension}" alt="${characterDetails.title}">
    //         <p style="font-size: 12px; word-wrap: break-word;">${characterDetails.name}</p>
    //         </div>`;
    //     }
    //   });

    // });
    // Obtener nombres de personajes y renderizarlos
    const characterList = document.getElementById("characterList");
    detailsComic.characters.items.forEach((character) => {
      getCharacterDetails(character.name).then((characterDetails) => {
        if (characterDetails) {
          const characterDiv = document.createElement("div");
          characterDiv.classList.add("comic");
          characterDiv.style.display = "inline-block";
          characterDiv.style.marginLeft = "20px";

          const characterImg = document.createElement("img");
          characterImg.src = `${characterDetails.thumbnail.path}/portrait_xlarge.${characterDetails.thumbnail.extension}`;
          characterImg.alt = characterDetails.title;

          const characterName = document.createElement("p");
          characterName.style.fontSize = "12px";
          characterName.textContent = characterDetails.name;

          characterDiv.appendChild(characterImg);
          characterDiv.appendChild(characterName);

          // Agregar evento de click al div del personaje
          characterDiv.addEventListener("click", () => {
            console.log("Clic en el personaje:", characterDetails);
            renderCharacterDetails(characterDetails);
          });

          characterList.appendChild(characterDiv);
        }
      });
    });
  }
};

const getCharacterDetails = async (characterName) => {
  const url = `${urlBase}characters?name=${characterName}&${ts}${publicKey}${hash}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.data.results[0];
};

// personajes
// Variables
let name = "";
//data de personajes
const getMarvelCharacters = async (name) => {
  mostrarLoader();
  let existName = name ? `&nameStartsWith=${name}` : "";
  const url = `${urlBase}characters?${ts}${publicKey}${hash}${existName}`;
  const response = await fetch(url);
  const data = await response.json();
  return {
    characters: data.data.results,
    totalCharacters: data.data.total,
  };
};

//impresion de personajes en pantalla

const printCharacters = async (name, order) => {
  const { characters, totalCharacters } = await getMarvelCharacters(name);
  if (order) {
    characters.sort((a, b) => {
      const aValue = a.name || "";
      const bValue = b.name || "";

      if (order === "AZ") {
        return aValue.localeCompare(bValue);
      } else if (order === "ZA") {
        return bValue.localeCompare(aValue);
      }
    });
  }
  $(".characters-cards").innerHTML = ``;
  $(".totalResults").innerHTML = `${totalCharacters}`;

  for (let character of characters) {
    $(".characters-cards").innerHTML += `
    <div onclick="handleCharacterClick(${character.id})">
                <img src="${character.thumbnail.path}/portrait_xlarge.${character.thumbnail.extension}" alt="${character.name}">
                <p>${character.name}</p>
            </div>`;
  }
  ocultarLoader();
};

printCharacters();

//card descripcion characters

const handleCharacterClick = (characterId) => {
  cardDescriptionCharacter(characterId);
  comicsCards.classList.add("ocultoComics");
  charactersCards.classList.add("ocultoCharacters");
  comicCardsOnly.classList.add("ocultoComics");
  charactersCardOnly.classList.remove("ocultoComics");
};

const cardDescriptionCharacter = async (characterId) => {
  const url = `${urlBase}characters/${characterId}?${ts}${publicKey}${hash}`;
  const response = await fetch(url);
  const data = await response.json();
  const detailsCharacter = data.data.results[0];
  renderCharacterDetails(detailsCharacter);
};

const renderCharacterDetails = async (detailsCharacter) => {
  let characterDetailsContainer;
  if (charactersCardOnly) {
    characterDetailsContainer = document.createElement("div");
    characterDetailsContainer.innerHTML = `
      <div>
        <div style="columns: 2;margin:20px">
          <img src="${detailsCharacter.thumbnail.path}/portrait_xlarge.${detailsCharacter.thumbnail.extension}" alt="${detailsCharacter.title}">
          <p>${detailsCharacter.name}</p>
          <p>${detailsCharacter.description}</p>
        </div>
        <div id="comicList"></div>
      </div>`;

    // Limpiar el contenido previo antes de agregar el nuevo contenido
    charactersCardOnly.innerHTML = "";
    charactersCardOnly.classList.remove("ocultoComics");
    comicCardsOnly.classList.add("ocultoComics");
    // Agregar el contenedor de detalles del personaje al elemento charactersCardOnly
    charactersCardOnly.appendChild(characterDetailsContainer);

    // Obtener los cómics en los que aparece el personaje
    const comics = await getCharacterComics(detailsCharacter.id);

    // Limpiar la lista de cómics antes de agregar los nuevos cómics
    const comicList = document.getElementById("comicList");
    comicList.innerHTML = "";

    //renderCharacterComics(comics);
    // // Agregar evento de clic a cada cómic
    // comics.forEach((comic) => {
    //   const comicDiv = document.createElement('div');
    //   comicDiv.innerHTML = `
    //     <div>
    //       <img src="${comic.thumbnail.path}/portrait_xlarge.${comic.thumbnail.extension}" alt="${comic.title}">
    //       <p>${comic.title}</p>
    //     </div>`;
    //   comicDiv.addEventListener('click', () => {
    //     // Aquí puedes manejar la lógica para mostrar el detalle del cómic
    //     console.log('Clic en el cómic:', comic);
    //     // Llamar a una función para mostrar el detalle del cómic
    //     renderComicDetails(comic);
    //   });
    //   comicList.appendChild(comicDiv);
    // });

    // Agregar evento de clic a cada cómic
    comics.forEach((comic) => {
      const comicDiv = document.createElement("div");
      comicDiv.classList.add("comic"); // Agrega la clase 'comic' al div del cómic
      comicDiv.innerHTML = `
    <div>
      <img src="${comic.thumbnail.path}/portrait_xlarge.${comic.thumbnail.extension}" alt="${comic.title}">
      <p>${comic.title}</p>
    </div>`;

      // Aplicar estilos al div del cómic
      comicDiv.style.flex = "1 0 200px"; // Cada cómic ocupa un tercio del espacio disponible, con un ancho máximo de 200px
      comicDiv.style.maxWidth = "200px";
      comicDiv.style.cursor = "pointer";

      comicDiv.addEventListener("click", () => {
        // Aquí puedes manejar la lógica para mostrar el detalle del cómic
        console.log("Clic en el cómic:", comic);
        // Llamar a una función para mostrar el detalle del cómic
        renderComicDetails(comic);
      });
      document.getElementById("comicList").appendChild(comicDiv);
    });
  }
};

const getCharacterComics = async (characterId) => {
  const url = `${urlBase}characters/${characterId}/comics?${ts}${publicKey}${hash}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.data.results;
};

const renderCharacterComics = (comics) => {
  const comicList = document.getElementById("comicList");
  if (comicList) {
    comicList.innerHTML = `
      <div style="margin-left:20px;margin-bottom:10px">
      <h3>Comics</h3>
      <p>${comics.length} resultados</p>
      </div>
      <div class="comic-container">`;

    comics.forEach((comic) => {
      comicList.innerHTML += `
          <div class="comic" style="display: inline-block;margin-left:20px; max-width: 120px;">
            <img src="${comic.thumbnail.path}/portrait_xlarge.${comic.thumbnail.extension}" alt="${comic.title}" style="max-width: 100px;">
            <p style="font-size: 8px; word-wrap: break-word;">${comic.title}</p>
          </div>`;
    });

    comicList.innerHTML += `</div>`;
  }
};

// Al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".comics-cards").classList.remove("ocultoComics");
  document.querySelector(".characters-cards").classList.add("ocultoCharacters");
});

//ocultar option
selectElement.addEventListener("change", (e) => {
  if (e.target.value === "PERSONAJES") {
    selectOrden.querySelector('option[value="NUEVOS"]').style.display = "none";
    selectOrden.querySelector('option[value="VIEJOS"]').style.display = "none";
  } else {
    selectOrden
      .querySelectorAll("option")
      .forEach((option) => (option.style.display = "block"));
  }
});

//boton buscar
buttonSearch.addEventListener("click", async (e) => {
  e.preventDefault();
  const selectedValue = selectElement.value;

  if (selectedValue === "COMICS") {
    comicsCards.classList.remove("ocultoComics");
    charactersCards.classList.add("ocultoCharacters");
    comicCardsOnly.classList.add("ocultoComics");
    charactersCardOnly.classList.add("ocultoComics");
    const selectedOrder = selectOrden.value;
    await printComics(inputText.value, selectedOrder);
  } else if (selectedValue === "PERSONAJES") {
    comicsCards.classList.add("ocultoComics");
    charactersCards.classList.remove("ocultoCharacters");
    comicCardsOnly.classList.add("ocultoComics");
    charactersCardOnly.classList.add("ocultoComics");
    const selectedOrder = selectOrden.value;
    await printCharacters(inputText.value, selectedOrder);
  }
});
