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
    generateGalleryModal(works);
    renderEditionMode();
}

//créer fonction qui génère les works (img + title)
function generateGallery(works) {
    galleryElement.innerHTML = "";

    for (let i = 0; i < works.length; i++) {
        const figure = works[i];
        const figureElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        const nomElement = document.createElement("figcaption");
        nomElement.innerText = figure.title;

        galleryElement.appendChild(figureElement);
        figureElement.appendChild(imageElement);
        figureElement.appendChild(nomElement);
    }
}

//créer fonction qui génère les works dans la modal
function generateGalleryModal(works) {
    const galleryModalElement = document.querySelector(".gallery-modal");
    galleryModalElement.innerHTML = "";

    for (let i = 0; i < works.length; i++) {
        const figure = works[i];
        const figureElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;

        const trashElement = document.createElement("button");
        trashElement.className = "modal-trash-can";
        trashElement.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        trashElement.addEventListener("click", function (e) {
            e.preventDefault();
            deleteWork(works[i].id, e);
        });

        galleryModalElement.appendChild(figureElement);
        figureElement.appendChild(trashElement);
        figureElement.appendChild(imageElement);
    }
}

// fonction pour supprimer un work à partir de l'id
async function deleteWork(id, e) {
    e.preventDefault();
    const authToken = localStorage.getItem("authToken")
    const deleteResponse = await fetch("http://localhost:5678/api/works/"+id, 
    {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + authToken
        }
    });
    generateGalleryModal();
    deleted = await deleteResponse.json();
    await getWorks();

}

//créer fonction filtre selon categorie
// definition categorie : Array contenant toutes les categoryId.
// Exemple: [1,2,3]
function filterGallery(categorie) { 
    // 0: vider la gallery générée à l'ouverture de la page
    galleryElement.innerHTML = "";

    // 1: récupérer nos works
    let filteredWorks = [];

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

    //creer les autres boutons à partir des categories et remplir le tableau des catégories dispo
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
    //creer le filtre du bouton "tous" avec le nouveau tableau de l'ensemble des catégories dispo
    allButtonElement.addEventListener("click", function() {
        filterGallery(availableCategories);
    });

}
getWorks();

export function editorView() {
    window.location.href = "index.html";    
}

//créer fonction pour générer le Mode Edition
function renderEditionMode() {
    if(localStorage.getItem("authToken") !== null) {
        const subHeaderSection = document.createElement("section");
        subHeaderSection.className = "subHeader";
        subHeaderSection.innerHTML = '<p><i class="fa-regular fa-pen-to-square"></i></p><p>Mode édition</p>';
        const parentElement = document.querySelector("header");
        parentElement.appendChild(subHeaderSection);
    
        const modifierEditorDiv = document.createElement("div");
        modifierEditorDiv.className = "ModifierEditor";

        const modifierEditorButton = document.createElement("button");
        modifierEditorButton.id = "openModalButton";
        modifierEditorButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Modifier';
        modifierEditorButton.addEventListener("click", openModal);
        modifierEditorDiv.appendChild(modifierEditorButton);
        
        const SdParentElement = document.querySelector(".titleProjets");
        SdParentElement.appendChild(modifierEditorDiv);        
        
        const filtersElement = document.querySelector(".filters");
        filtersElement.style.display = 'none';
        };
        
    if(localStorage.getItem("authToken") !== null) {
        const logLink = document.getElementById("loginLink");
        logLink.innerHTML = "logout";
        }
}

const openModal = function (e){
    e.preventDefault();
    const modal = document.querySelector("#modal1");
    modal.style.display = 'flex';
    modal.addEventListener("click", closeModal);
    modal.querySelector("#modalClose").addEventListener("click", closeModal);
    modal.querySelector(".modal-content").addEventListener("click", stopPropagation);
}

const closeModal = function (e) {
    const modal = document.querySelector("#modal1");
    e.preventDefault();
    modal.style.display = 'none';
    modal.removeEventListener("click", closeModal)
    modal.querySelector("#modalClose").removeEventListener("click", closeModal);
    modal.querySelector(".modal-content").removeEventListener("click", stopPropagation);
}

const stopPropagation = function (e) {
    e.stopPropagation()
}


