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
    createSelect(categories)}

//créer fonction qui génère les works (img + title)
function generateGallery(works) {
    galleryElement.innerHTML = "";

    for (let i = 0; i < works.length; i++) {
        const figure = works[i];
        const figureElement = document.createElement("figure");
        figureElement.id = "work-" + figure.id;
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

    for (let i = 0; i < works.length; i++) {
        const figure = works[i];
        const figureElement = document.createElement("figure");
        figureElement.id = "modal-work-" + figure.id;
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;

        const trashElement = document.createElement("button");
        trashElement.className = "modal-trash-can";
        trashElement.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        trashElement.addEventListener("click", function (e) {
            e.preventDefault();
           // si deleteWork a bien marché
            if (deleteWork(figure.id, e)) {
                //on supprime le work de la modal
                figureElement.parentNode.removeChild(figureElement);
                //et on supprime en dessous aussi
                const workFigure = document.getElementById("work-" + figure.id);
                workFigure.parentNode.removeChild(workFigure);
            } else {
                //message d'erreur
                alert("Une erreur s'est produite. Veuillez réessayer ultérieurement.");
            };
 
        });
        galleryModalElement.appendChild(figureElement);
        figureElement.appendChild(trashElement);
        figureElement.appendChild(imageElement);
    }
}

//fonction pour supprimer un work à partir de l'id
async function deleteWork(id, e) {
    e.preventDefault();
    const authToken = localStorage.getItem("authToken")
    console.log("avant await fetch");
    const deleteResponse = await fetch ("http://localhost:5678/api/works/"+id, 
    {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + authToken
        },
    });
    if(deleteResponse.ok) {
        return true;
    }
    return false;
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
    allButtonElement.id = "filters-buttons"; 
    filtersElement.appendChild(allButtonElement);

    //creer les autres boutons à partir des categories et remplir le tableau des catégories dispo
    for (let j = 0; j < categories.length; j++) {
        const categorie = categories[j]; 
        availableCategories.push(categorie.id);
        const buttonElement = document.createElement("button");
        buttonElement.innerText = categorie.name; 
        buttonElement.id = "filters-buttons"; 
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

//créer fonction pour générer le Mode Edition
function renderEditionMode() {
    if(localStorage.getItem("authToken") !== null) {
        const subHeaderSection = document.createElement("section");
        subHeaderSection.className = "sub-header";
        subHeaderSection.innerHTML = '<p><i class="fa-regular fa-pen-to-square"></i></p><p>Mode édition</p>';
        const parentElement = document.querySelector("header");
        parentElement.appendChild(subHeaderSection);
    
        const modifierEditorDiv = document.createElement("div");
        modifierEditorDiv.className = "modifier-editor";

        const modifierEditorButton = document.createElement("button");
        modifierEditorButton.id = "open-modal-button";
        modifierEditorButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Modifier';
        modifierEditorButton.addEventListener("click", openModal);
        modifierEditorDiv.appendChild(modifierEditorButton);
        
        const SdParentElement = document.querySelector(".title-projets");
        SdParentElement.appendChild(modifierEditorDiv);        
        
        const filtersElement = document.querySelector(".filters");
        filtersElement.style.display = 'none';
        };
        
    if(localStorage.getItem("authToken") !== null) {
        const logLink = document.getElementById("login-link");
        logLink.innerHTML = "logout";
        logLink.setAttribute("href", "index.html");
        logLink.addEventListener("click", function() {
            viderLocalStorage();
        })
    }
}
//créer une fonction pour vider le local storage quand on click sur logout
function viderLocalStorage() {
    localStorage.removeItem("authToken");
}

const stopPropagation = function (e) {
    e.stopPropagation()
}
//créer une fonction pour ouvrir la modal où on supprime les projets
function openModal (e) {
    e.preventDefault();
    const modal = document.querySelector("#modal1");
    modal.style.display = 'flex';
    const modalSuppr = document.querySelector(".modal-remove");
    modalSuppr.style.display = 'flex';
    const modalAdd = document.querySelector(".modal-add-form");
    modalAdd.style.display = 'none';
    //ajouter l'écouter sur le bouton Ajouter photo pour ouvrir l'autre version de la modal
    const modalAddPhoto = document.querySelector(".modal-add-photo");
    modalAddPhoto.addEventListener("click", openModal2);
    //fermer la modal quand on clique dessus...
    modal.addEventListener("click", closeModal);
    //...sauf si on clique à l'intérieur
    modal.querySelector(".modal-content").addEventListener("click", stopPropagation);
    //fermer la modal quand on clique sur la croix
    modal.querySelector("#modal-close").addEventListener("click", closeModal);

    //et on ajoute une class au body pour empêcher le overlay scroll en arrière-plan
    document.body.classList.add("modal-open")
}
//créer une fonction pour ouvrir la modal où on ajoute des projets
function openModal2 (e) {
    e.preventDefault();
    const modal = document.querySelector("#modal1");
    modal.style.display = 'flex';
    const modalSuppr = document.querySelector(".modal-remove");
    modalSuppr.style.display = 'none';
    const modalAdd = document.querySelector(".modal-add-form");
    modalAdd.style.display = 'flex';
    //fermer la modal quand on clique dessus...
    modal.addEventListener("click", closeModal);
    //...sauf si on clique à l'intérieur
    modal.querySelector(".modal-content-snd").addEventListener("click", stopPropagation);
    //fermer la modal quand on clique sur la croix
    modal.querySelector("#modal-close-snd").addEventListener("click", closeModal);
    //revenir en arrière quand on clique sur la flèche
    modal.querySelector("#modal-back").addEventListener("click", openModal);

    //et on ajoute une class au body pour empêcher le overlay scroll en arrière-plan
    document.body.classList.add("modal-open")
}
//créer une fonction pour fermer la modal
function closeModal (e) {
    const modal = document.querySelector("#modal1");
    e.preventDefault();
    modal.style.display = 'none';
    const modalSuppr = document.querySelector(".modal-remove");
    modalSuppr.style.display = 'none';
    const modalAdd = document.querySelector(".modal-add-form");
    modalAdd.style.display = 'none';
    //et on retire :
    //1: les écouteurs de cliques de fermeture,
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".modal-content").removeEventListener("click", stopPropagation);
    modal.querySelector("#modal-close").removeEventListener("click", closeModal);
    //2: la class attribuée au body.
    document.body.classList.remove("modal-open");
}
//créer fonction pour générer les catégories dans le select de la modal
//générer mes boutons à partir des categories
function createSelect(categories) {
    const selectCategories = document.getElementById("category-add-photo");

    // creer le tableau des categories dispo comme pour les filtres
    const availableCategories = []

    //générer les values à partir des categories et remplir le tableau des catégories dispo
    for (let k = 0; k < categories.length; k++) {
        const categorie = categories[k]; 
        availableCategories.push(categorie.id);
        const selectOption = document.createElement("option");
        selectOption.value = categorie.name;
        selectOption.innerText = categorie.name;

        selectCategories.appendChild(selectOption);
    }
}


