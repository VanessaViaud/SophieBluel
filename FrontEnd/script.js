async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    console.log(works[0].title);

        genererGallery(works);
}

function genererGallery(works) {

    const galleryElement = document.querySelector(".gallery");

    for (let i = 0; i < works.length; i++) {

        const figure = works[i];
        const figureElement = document.createElement("figure");
        figureElement.dataset.id = works[i].id;
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        const nomElement = document.createElement("figcaption");
        nomElement.innerText = figure.title;

        galleryElement.appendChild(figureElement);
        figureElement.appendChild(imageElement);
        figureElement.appendChild(nomElement);

    }
}
    getWorks();
    