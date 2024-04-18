    //variables globales
let works = [];
const galleryElement = document.querySelector(".gallery");

    //appel API categories et works
async function getWorks() {
    const categoriesResponse = await fetch("http://localhost:5678/api/categories");
    const categories = await categoriesResponse.json();

    const worksResponse = await fetch("http://localhost:5678/api/works");
    works = await worksResponse.json();

    generateGallery(works);
}
    //créer fonction qui génère les works (img + title)
function generateGallery(works) {

    for (let i = 0; i < works.length; i++) {
        const figure = works[i];
        const figureElement = document.createElement("figure");
        figureElement.dataset.id = figure.id;
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        const nomElement = document.createElement("figcaption");
        nomElement.innerText = figure.title;

        galleryElement.appendChild(figureElement);
        figureElement.appendChild(imageElement);
        figureElement.appendChild(nomElement);
    }
}
//créer fonction filtre selon categorie
// definition categorie : Array contenant toutes les categoryId.
// Exemple: [1,2,3]
function filterGallery(categorie) { 
    // 0: vider la gallery générée à l'ouverture de la page
    galleryElement.innerHTML = "";

    // 1: récupérer nos works
    const filteredWorks = [];

    // 2: filter nos works par rapport à la categoryId donnée en entrée
    let currentWork;
    for (let i = 0; i < works.length; i++) {
        currentWork = works[i];
        if(categorie.includes(currentWork.categoryId)) {
            filteredWorks.push(currentWork);
        }
    }
    // 3: rappeler generateGallery avec notre nouveau tableau de works
    generateGallery(filteredWorks);
}

    //récupérer les boutons html
    const objetButton = document.getElementById("objetsFilter");
    const appartButton = document.getElementById("appartFilter");
    const restauButton = document.getElementById("restauFilter");
    const allButton = document.getElementById("allFilter");

    //créer les écouteurs et relancer la fonction de filtre
    objetButton.addEventListener("click", function() {
        filterGallery([1]);
    });
    appartButton.addEventListener("click", function() {
        filterGallery([2]);
    });
    restauButton.addEventListener("click", function() {
        filterGallery([3]);
    });
    allButton.addEventListener("click", function() {
        filterGallery([1,2,3]);
        //generateGallery(works);
    });

getWorks();
