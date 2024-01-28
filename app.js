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


//input text 


    $(".input-text").addEventListener("input", ()=>{
        $(".button-search").addEventListener("click", ()=>{
            printComics($(".input-text").value)
        }) 
    }) 
  
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

document.querySelector(".button-search").addEventListener("click", () => {

    const selectedValue = document.querySelector("select").value;

    if (selectedValue === "COMICS") {
        document.querySelector(".comics-cards").classList.remove("ocultoComics");
        document.querySelector(".characters-cards").classList.add("ocultoCharacters");
        printComics();

    } else if (selectedValue === "PERSONAJES") {
        document.querySelector(".comics-cards").classList.add("ocultoComics");
        document.querySelector(".characters-cards").classList.remove("ocultoCharacters");
        printCharacters();
    }
});









