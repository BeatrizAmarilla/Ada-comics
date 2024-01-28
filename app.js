const $ = (selector) => document.querySelector(selector)
const urlBase = "http://gateway.marvel.com/v1/public/";
let ts = "ts=1"; 
const publicKey = "&apikey=93c0e369ba23b10fe80edb027c368e12"; 
const hash = "&hash=31c8321bf2c8dca37913226c7e83701d";
//const title = "&title=${title}"
const limit = "&limit=20";

//comics
let title = ""

//data de comics
const getMarvelComics = async(title) =>{
    let existTitle= title?`&titleStartsWith=${title}`:""
    const url = `${urlBase}comics?${ts}${publicKey}${hash}${existTitle}${limit}`
    const response = await fetch(url)
    const data = await response.json()
    console.log(data.data)
    return { 
        comics:data.data.results,
        totalComics:data.data.total
    }
}

// getMarvelComics()

//impresion de comics en pantalla

const printComics = async(tittle)=>{
    const {comics,totalComics} = await getMarvelComics(tittle)
    console.log(totalComics)
    $(".comics-cards").innerHTML = ``
    $(".totalResults").innerHTML = `${totalComics}`

    for(let comic of comics){
        $(".comics-cards").innerHTML += `
        <div>
        <img src="${comic.thumbnail.path}/portrait_xlarge.${comic.thumbnail.extension}" alt="${comic.title}">
        <p>${comic.title}</p>
        </div>

        `
    }
}
printComics()

  
// personajes    
let name = ""

 //data de personajes 
const getMarvelCharacters = async(name) =>{
    let existName= name?`&nameStartsWith=${name}`:""
    const url = `${urlBase}characters?${ts}${publicKey}${hash}${existName}${limit}`
    const response = await fetch(url)
    const data = await response.json()
//console.log(data.data)
return { 
    characters:data.data.results,
    totalCharacters:data.data.total
}
}


//impresion de personajes en pantalla

const printCharacters = async(name)=>{
    const {characters,totalCharacters} = await getMarvelCharacters(name)
    //console.log(totalCharacters)
    $(".characters-cards").innerHTML = ``
    $(".totalResults").innerHTML = `${totalCharacters}`
    for(let character of characters){
        $(".characters-cards").innerHTML += `
        <div>
        <img src="${character.thumbnail.path}/portrait_xlarge.${character.thumbnail.extension}" alt="${character.name}">
        <p>${character.name}</p>
        </div>

        `
    }
}
printCharacters ()


// Al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".comics-cards").classList.remove("ocultoComics");
    document.querySelector(".characters-cards").classList.add("ocultoCharacters");
});


// Obtener referencia a los elementos del DOM
const buttonSearch = document.querySelector(".button-search");
const selectElement = document.querySelector("select");
const selectOrden = document.getElementById("selectOrden");
const comicsCards = document.querySelector(".comics-cards");
const charactersCards = document.querySelector(".characters-cards");
const inputText = document.querySelector(".input-text");
const cardCharactersOnly = document.getElementById("characters-cards-only");




// Agregar un listener al botón de búsqueda
buttonSearch.addEventListener("click", () => {
    const selectedValue = selectElement.value;

    if (selectedValue === "COMICS") {
        comicsCards.classList.remove("ocultoComics");
        charactersCards.classList.add("ocultoCharacters");
        cardCharactersOnly.style.display = "none";
        printComics(inputText.value);

    } else if (selectedValue === "PERSONAJES") {
        comicsCards.classList.add("ocultoComics");
        charactersCards.classList.remove("ocultoCharacters");
        cardCharactersOnly.style.display = "none";
        selectOrden.querySelector('option[value="NUEVOS"]').style.display = 'none';
        selectOrden.querySelector('option[value="VIEJOS"]').style.display = 'none';
        printCharacters(inputText.value);
    }
});

// Evitar el envío del formulario por defecto al hacer clic en el botón
buttonSearch.addEventListener("click", (e) => {
    e.preventDefault();
});



selectElement.addEventListener('change', (e) => {
    if (e.target.value === 'PERSONAJES') {
        selectOrden.querySelector('option[value="NUEVOS"]').style.display = 'none';
        selectOrden.querySelector('option[value="VIEJOS"]').style.display = 'none';
    } else {
        selectOrden.querySelectorAll('option').forEach(option => option.style.display = 'block');
    }
});












//comics
// let title1 = ""

// //data de comics
// const getMarvelComics1 = async(title) =>{
//     let existTitle= title?`&titleStartsWith=${title}`:""
//     const url = `${urlBase}comics?${ts}${publicKey}${hash}${existTitle}${limit}`
//     const response = await fetch(url)
//     const data = await response.json()
//     console.log(data.data)
//     return { 
//         comics:data.data.results.id,
       
//     }
// }
// console.log(getMarvelComics1())







