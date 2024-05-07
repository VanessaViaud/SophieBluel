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
    renderEditionMode();}

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

//créer modifs de la modal quand on clique sur Ajouter une photo
const buttonAddPhoto = document.querySelector(".modal-add-photo");

buttonAddPhoto.addEventListener("click", function() {
    const modalTitle = document.querySelector(".modal-title");
    modalTitle.innerHTML = "Ajout photo";
    
    buttonAddPhoto.style.display = 'none';
    
    const galleryModalElement = document.querySelector(".gallery-modal");
    galleryModalElement.style.display = 'none';

    const formContentAddPhoto = document.querySelector(".form-modal");
    const formAddPhoto = document.createElement("form");
        formAddPhoto.action = "#";
        formAddPhoto.method = "post";
    const areaImgAddPhoto = document.createElement("div");
        areaImgAddPhoto.className = "drop-area";
        areaImgAddPhoto.id = "dropArea";
        areaImgAddPhoto.innerHTML = '<i class="fa-regular fa-image"></i><br><p>jpg, png : 4mo max</p>';
    const imgAddPhoto = document.createElement("input");
        imgAddPhoto.type = "file";
        imgAddPhoto.name = "img";
        imgAddPhoto.id = "img-add-photo";
        imgAddPhoto.accept = "image/**";
        // imgAddPhoto.setAttribute("required");
    const labelTitleAddPhoto = document.createElement("label");
        labelTitleAddPhoto.for = "title-add-photo";
        labelTitleAddPhoto.innerHTML = "Titre";
    const titleAddPhoto = document.createElement("input");
        titleAddPhoto.type = "text";
        titleAddPhoto.name = "title";
        titleAddPhoto.id = "title-add-photo";
        // titleAddPhoto.setAttribute("required");
    const labelCategoryAddPhoto = document.createElement("label");
        labelCategoryAddPhoto.for = "category-add-photo";
        labelCategoryAddPhoto.innerHTML = "Catégorie";
    const categoryAddPhoto = document.createElement("select");
        categoryAddPhoto.name = "category";
        categoryAddPhoto.id = "category-add-photo";
        // categoryAddPhoto.setAttribute("required");
    const optionAddPhoto = document.createElement("option");
        optionAddPhoto.value = "numéro de catégorie";
        optionAddPhoto.innerHTML = "titre de catégorie";
    const validationAddPhoto = document.createElement("input");
        validationAddPhoto.value = "Valider";
        validationAddPhoto.type = "submit";
        validationAddPhoto.id = "modal-valider";

    formContentAddPhoto.appendChild(formAddPhoto);
    formAddPhoto.appendChild(areaImgAddPhoto);
    areaImgAddPhoto.appendChild(imgAddPhoto);
    formAddPhoto.appendChild(labelTitleAddPhoto);
    formAddPhoto.appendChild(titleAddPhoto);
    formAddPhoto.appendChild(labelCategoryAddPhoto);
    formAddPhoto.appendChild(categoryAddPhoto);
    categoryAddPhoto.appendChild(optionAddPhoto);
    const footerModal = document.querySelector(".modal-footer");
    footerModal.appendChild(validationAddPhoto);
    
});
    
// Autres opérations spécifiques pour la zone de chargement des photos
// const dropArea = document.getElementById("dropArea");

// //const eventNames = ["dragenter", "dragover", "dragleave", "drop"]

// // Gérer le glisser-déposer de fichiers
// dropArea.addEventListener("drop", handleDrop, false);

// // Gérer le dépôt de fichiers
// function handleDrop(e) {
//   const dt = e.dataTransfer;
//   const files = dt.files;

//   handleFiles(files);
// }

// // Gérer les fichiers après le dépôt
// function handleFiles(files) {
//   for (let i = 0; i < files.length; i++) {
//     const file = files[i];
//     if (isImage(file)) {
//       uploadImage(file);
//     } else {
//       alert("Veuillez sélectionner une image.");
//     }
//   }
// }

// // Vérifier si le fichier est une image
// function isImage(file) {
//   return /^image\//.test(file.type);
// }

// // Télécharger l'image
// function uploadImage(file) {
//   const reader = new FileReader();

//   reader.onload = function(e) {
//     const img = new Image();
//     img.src = e.target.result;

//     // Afficher l'image téléchargée
//     dropArea.innerHTML = "";
//     dropArea.appendChild(img);
//   }

//   reader.readAsDataURL(file);
// }

// Gérer le téléchargement de fichiers via l'input de type file
// const fileInput = document.getElementById("fileInput");
// fileInput.addEventListener("change", function() {
//   handleFiles(this.files);
// });


//et une fonction pour annuler les effets des modifs quand on ferme la modal 
// function resetModalState() {
//     buttonAddPhoto.style.display = "";
//     const galleryModalElement = document.querySelector(".gallery-modal");
//     galleryModalElement.style.display = "";
//     const formContentAddPhoto = document.querySelector(".form-modal");
//     formContentAddPhoto.style.display = 'none';
//     const modalTitle = document.querySelector(".modal-title");
//     modalTitle.innerHTML = "Galerie photo";
//     const inputInFooterModal = document.querySelector(".modal-footer input");
//     inputInFooterModal.style.display = 'none';
// }
const stopPropagation = function (e) {
    e.stopPropagation()
}
//créer une fonction pour ouvrir la modal
function openModal (e) {
    e.preventDefault();
    const modal = document.querySelector("#modal1");
    modal.style.display = 'flex';
    //fermer la modal quand on clique dessus...
    modal.addEventListener("click", closeModal);
    //...sauf si on clique à l'intérieur
    modal.querySelector(".modal-content").addEventListener("click", stopPropagation);
    //fermer la modal quand on clique sur la croix
    modal.querySelector("#modal-close").addEventListener("click", closeModal);

    //et on ajoute une class au body pour empêcher le overlay scroll en arrière-plan
    document.body.classList.add("modal-open")
}

//créer une fonction pour fermer la modal
function closeModal (e) {
    const modal = document.querySelector("#modal1");
    e.preventDefault();
    modal.style.display = 'none';
    //et on retire :
    //1: les écouteurs de cliques de fermeture,
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".modal-content").removeEventListener("click", stopPropagation);
    modal.querySelector("#modal-close").removeEventListener("click", closeModal);
    //2: la class attribuée au body,
    document.body.classList.remove("modal-open");
    //3: les modifs de la seconde version de la modal.
    //resetModalState()
}



