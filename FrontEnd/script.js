    //variables globales
let works = [];
const galleryElement = document.querySelector(".gallery");

    //appel API categories et works
async function getWorks() {
    const categoriesResponse = await fetch("http://localhost:5678/api/categories");
    const categories = await categoriesResponse.json();

    const worksResponse = await fetch("http://localhost:5678/api/works");
    works = await worksResponse.json();

    createbutton(categories);
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
    //générer mes boutons à partir des categories
function createbutton(categories) {
    const filtersElement = document.querySelector(".filters");

    // creer le tableau des categories dispo
    const availableCategories = []

    // creer le bouton "tous"
    const allButtonElement = document.createElement("button");
    allButtonElement.innerText = "Tous"; 
    allButtonElement.id = "filtersButtons"; 
    filtersElement.appendChild(allButtonElement);
    //creer les autres boutons à partir des categories
    for (let j = 0; j < categories.length; j++) {
        const categorie = categories[j]; 
        availableCategories.push(categorie.id);
        const buttonElement = document.createElement("button");
        buttonElement.innerText = categorie.name; 
        buttonElement.id = "filtersButtons"; 
        buttonElement.addEventListener("click", function() {
            filterGallery([categorie.id]);
        });
        filtersElement.appendChild(buttonElement);
        
    }

    allButtonElement.addEventListener("click", function() {
        filterGallery(availableCategories);
    });

}

getWorks();
