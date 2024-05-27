// Variables globales
let works = [];
const galleryElement = document.querySelector(".gallery");

// Appel API categories et works
async function getWorks() {
    const categoriesResponse = await fetch("http://localhost:5678/api/categories");
    const categories = await categoriesResponse.json();

    const worksResponse = await fetch("http://localhost:5678/api/works");
    works = await worksResponse.json();

    createbutton(categories);
    generateGallery(works);
    generateGalleryModal(works);
    renderEditionMode();
    createSelect(categories);
}

// Fonction qui génère les works (img + title)
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

// Fonction qui génère les works dans la modal
function generateGalleryModal(works) {
    const galleryModalElement = document.querySelector(".gallery-modal");

    galleryModalElement.innerHTML = "";  

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
                // on supprime le work de la modal
                figureElement.parentNode.removeChild(figureElement);
                // et on supprime en dessous aussi
                const workFigure = document.getElementById("work-" + figure.id);
                workFigure.parentNode.removeChild(workFigure);
            } else {
                // message d'erreur
                alert("Une erreur s'est produite. Veuillez réessayer ultérieurement.");
            }
        });

        galleryModalElement.appendChild(figureElement);
        figureElement.appendChild(trashElement);
        figureElement.appendChild(imageElement);
    }
}

// Fonction pour supprimer un work à partir de l'id
async function deleteWork(id, e) {
    e.preventDefault();
    const authToken = localStorage.getItem("authToken")
    const deleteResponse = await fetch("http://localhost:5678/api/works/" + id, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + authToken
        },
    });
    if (deleteResponse.ok) {
        return true;
    }
    return false;
}

// Fonction pour ajouter des works
const form = document.getElementById("upload-form");
const dropArea = document.getElementById("id-drop-area");
const imgInput = document.getElementById("img-add-photo");
const miniatureImg = document.getElementById("miniature");
const titleInput = document.getElementById("title-add-photo");
const categorySelect = document.getElementById("category-add-photo");
const addFileButton = document.getElementById("modal-valider");

// on écoute la sélection du fichier
imgInput.addEventListener("change", addMiniature, false);

addFileButton.addEventListener("click", async function addWork(e) {
    e.preventDefault();

    const file = imgInput.files[0];
    const title = titleInput.value;
    const category = parseInt(categorySelect.value, 10);

    if (!file || !title || isNaN(category)) {
        alert("Tous les champs doivent être complétés.");
        return;
    }

    if (file.size > 4 * 1024 * 1024) {
        alert("La taille du fichier ne doit pas dépasser 4 Mo.");
        return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", category);

    const authToken = localStorage.getItem("authToken");

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + authToken,
            },
            body: formData
        });

        if (response.ok) {
            const newWork = await response.json();
            works.push(newWork); // Ajoute le nouveau work 

            // et mise à jour de la galerie et de la modal
            updateGallery(newWork);
            updateGalleryModal(newWork);

            alert("Votre nouveau projet a bien été ajouté.");
            form.reset();
            miniatureImg.style.display = 'none';
            const dropAreaAfter = document.querySelector(".before-img-drop");
            dropAreaAfter.style.display = 'flex';
        } else {
            const errorData = await response.json();
            alert(`Erreur: ${errorData.message}`);
        }
    } catch (error) {
        alert("Une erreur s'est produite.");
        console.error("Erreur:", error);
    }
});

function updateGallery(work) {
    const figureElement = document.createElement("figure");
    figureElement.id = "work-" + work.id;
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    const nomElement = document.createElement("figcaption");
    nomElement.innerText = work.title;

    galleryElement.appendChild(figureElement);
    figureElement.appendChild(imageElement);
    figureElement.appendChild(nomElement);
}

function updateGalleryModal(work) {
    const galleryModalElement = document.querySelector(".gallery-modal");

    const figureElement = document.createElement("figure");
    figureElement.id = "modal-work-" + work.id;
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;

    const trashElement = document.createElement("button");
    trashElement.className = "modal-trash-can";
    trashElement.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    trashElement.addEventListener("click", function (e) {
        e.preventDefault();
        // si deleteWork a bien marché
        if (deleteWork(work.id, e)) {
            // on supprime le work de la modal
            figureElement.parentNode.removeChild(figureElement);
            // et on supprime en dessous aussi
            const workFigure = document.getElementById("work-" + work.id);
            workFigure.parentNode.removeChild(workFigure);
        } else {
            // message d'erreur
            alert("Une erreur s'est produite. Veuillez réessayer ultérieurement.");
        }
    });

    galleryModalElement.appendChild(figureElement);
    figureElement.appendChild(trashElement);
    figureElement.appendChild(imageElement);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function addMiniature() {
    const dropAreaAfter = document.querySelector(".before-img-drop");
    const file = imgInput.files[0];
    if (file) {
        miniatureImg.innerHTML = "";
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = document.createElement("img");
            img.src = event.target.result;
            miniatureImg.appendChild(img);
            dropAreaAfter.style.display = "none";
            miniatureImg.style.display = "flex";
        };
        reader.readAsDataURL(file);
    }
    validerButtonInGreen();
}

//et passer le bouton au vert quand les champs sont remplis
//1-écouter le remplissage du formulaire
imgInput.addEventListener("change", validerButtonInGreen);
titleInput.addEventListener("input", validerButtonInGreen);
categorySelect.addEventListener("change", validerButtonInGreen);

//2-changer la couleur
function validerButtonInGreen () {
    const file = imgInput.files[0];
    const title = titleInput.value.trim();
    const category = categorySelect.value;

    if (file && title && category) {
        addFileButton.style.backgroundColor = "#1D6154";
    }  
    else {
            addFileButton.style.backgroundColor ="";
        }
};

//fonction filtre selon categorie
// definition categorie : Array contenant toutes les categoryId.
// Exemple: [1,2,3]
function filterGallery(categorie) { 
    galleryElement.innerHTML = "";

    //récupérer nos works
    let filteredWorks = [];

    //filtrer nos works par rapport à la categoryId donnée en entrée
    let currentWork;
    for (let i = 0; i < works.length; i++) {
        currentWork = works[i];
        if(categorie.includes(currentWork.categoryId)) {
            filteredWorks.push(currentWork);
        }
    }
    //rappeler generateGallery avec notre nouveau tableau de works
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
    allButtonElement.className = "filters-buttons";
    filtersElement.appendChild(allButtonElement);

    //creer les autres boutons à partir des categories et remplir le tableau des catégories dispo
    for (let j = 0; j < categories.length; j++) {
        const categorie = categories[j]; 
        availableCategories.push(categorie.id);
        const buttonElement = document.createElement("button");
        buttonElement.innerText = categorie.name; 
        buttonElement.className = "filters-buttons"; 
        buttonElement.addEventListener("click", function() {
            resetFilteredButtonStyle();
            buttonElement.className = "filters-button-clicked filters-buttons";
            filterGallery([categorie.id]);
        });
        filtersElement.appendChild(buttonElement);
    }
    //creer le filtre du bouton "tous" avec le nouveau tableau de l'ensemble des catégories dispo
    allButtonElement.addEventListener("click", function() {
        resetFilteredButtonStyle();
        allButtonElement.className = "filters-button-clicked filters-buttons";
        filterGallery(availableCategories);
    });

}
//fonction reset de la couleur de bouton cliqué
function resetFilteredButtonStyle(){
    const buttons = document.querySelectorAll(".filters-buttons");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].className = "filters-buttons";
    }
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
//fonction pour vider le local storage quand on click sur logout
function viderLocalStorage() {
    localStorage.removeItem("authToken");
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

//fonction pour ouvrir la modal où on supprime les projets
function openModal (e) {
    e.preventDefault();
    const modal = document.querySelector("#modal1");
    modal.style.display = 'flex';
    const modalSuppr = document.querySelector(".modal-remove");
    modalSuppr.style.display = 'flex';
    const modalAdd = document.querySelector(".modal-add-form");
    modalAdd.style.display = 'none';
    //ajouter l'écouteur sur le bouton Ajouter photo pour ouvrir l'autre version de la modal
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
    modal.style.display = "flex";
    const modalSuppr = document.querySelector(".modal-remove");
    modalSuppr.style.display = "none";
    const modalAdd = document.querySelector(".modal-add-form");
    modalAdd.style.display = "flex";
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
    modal.style.display = "none";
    const modalSuppr = document.querySelector(".modal-remove");
    modalSuppr.style.display = "none";
    const modalAdd = document.querySelector(".modal-add-form");
    modalAdd.style.display = "none";
    //et on retire :
    //1: les écouteurs de clics de fermeture,
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".modal-content").removeEventListener("click", stopPropagation);
    modal.querySelector("#modal-close").removeEventListener("click", closeModal);
    //2: la class du body.
    document.body.classList.remove("modal-open");
}
//fonction pour générer les catégories dans le select de la modal
function createSelect(categories) {
    const selectCategories = document.getElementById("category-add-photo");

    //générer les values à partir des categories
    for (let k = 0; k < categories.length; k++) {
        const categorie = categories[k]; 
        const selectOption = document.createElement("option");
        selectOption.value = categorie.id;
        selectOption.innerText = categorie.name;

        selectCategories.appendChild(selectOption);
    }
}


