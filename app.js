const urlBase = "http://gateway.marvel.com/v1/public/";
let ts = "ts=1"; 
const publicKey = "&apikey=93c0e369ba23b10fe80edb027c368e12"; 
const hash = "&hash=31c8321bf2c8dca37913226c7e83701d";
//const title = "&title=${title}"
const $ = (selector) => document.querySelector(selector)
let title = ""

//data de comics
const getMarvelComics = async(title) =>{
    let existTitle= title?`&titleStartsWith=${title}`:""
    const url = `${urlBase}comics?${ts}${publicKey}${hash}${existTitle}`
    const response = await fetch(url)
    const data = await response.json()
    //console.log(data.data.results)
    return data.data.results
}

// getMarvelComics()

//impresion de comics en pantalla

const printComics = async(tittle)=>{
    const comics = await getMarvelComics(tittle)
    //console.log(comics)
    $(".comics-cards").innerHTML = ``
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
    const url = `${urlBase}characters?${ts}${publicKey}${hash}${existName}`
    const response = await fetch(url)
    const data = await response.json()
console.log(data.data.results)
    return data.data.results
}


//impresion de personajes en pantalla

const printCharacters = async(name)=>{
    const characters = await getMarvelCharacters(name)
    $(".characters-cards").innerHTML = ``
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


 //input text 

    $(".input-text").addEventListener("input", ()=>{
        $(".button-search").addEventListener("click", ()=>{
            printCharacters($(".input-text").value)
        }) 
    }) 
     








