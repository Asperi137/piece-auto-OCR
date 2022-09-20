import { ajoutListenersAvis, afficherAvis } from "./avis.js";

// Récupération des pièces éventuellement stockées dans le localStorage
let pieces = window.localStorage.getItem("pieces");

if (pieces === null) {
	// Récupération des pièces depuis l'API HTTP
	const pieces = await fetch("http://localhost:8081/pieces").then((pieces) => pieces.json());
	// Transformation des pièces en JSON
	const valeurPieces = JSON.stringify(pieces);
	// Stockage des informations dans le localStorage
	window.localStorage.setItem("pieces", valeurPieces);
} else {
	pieces = JSON.parse(pieces);
}





function genererPieces(pieces) {
    for (const element of pieces) {
        // Récupération de l'élément du DOM qui accueillera les fiches
        const sectionFiches = document.querySelector(".fiches");
		const pieceElement = document.createElement("article");
		
		pieceElement.dataset.id = element.id;

        const imageElement = document.createElement("img");
        imageElement.src = element.image;
        pieceElement.appendChild(imageElement);

        const nomElement = document.createElement("h2");
		nomElement.innerText = element.nom;
		pieceElement.appendChild(nomElement);

		const prixElement = document.createElement("p");
		prixElement.innerText = "Prix : " + element.prix + " € (" + (element.prix < 35 ? "€" : "€€€") + ")";
		pieceElement.appendChild(prixElement);

		const categorieElement = document.createElement("p");
		categorieElement.innerText = "Categorie : " + (element.categorie ?? "(aucune categorie)");
		pieceElement.appendChild(categorieElement);

		const descriptionElement = document.createElement("p");
		descriptionElement.innerText = "Description : " + (element.description ?? "(pas de description pour le moment)");
		pieceElement.appendChild(descriptionElement);

		const disponibiliteElement = document.createElement("p");
		disponibiliteElement.innerText = (element.disponibilite ? "En" : "Rupture de") + " Stock";
		pieceElement.appendChild(disponibiliteElement);

		const avisElement = document.createElement("button");
		avisElement.innerText = "afficher les avis";
		avisElement.dataset.id = element.id;
		pieceElement.appendChild(avisElement);

		sectionFiches.appendChild(pieceElement);
	}
	
	ajoutListenersAvis(); 
}
// Premier affichage de la page
genererPieces(pieces);

for (let i = 0; i < pieces.length; i++) {
	const id = pieces[i].id;
	const avisJSON = window.localStorage.getItem("avis-piece-" + id);
	const avis = JSON.parse(avisJSON);

	if (avis !== null) {
		const pieceElement = document.querySelector(`[data-id="${id}"`);
		afficherAvis(pieceElement, avis);
	}
}

// Ajout du listener pour mettre à jour des données du localStorage
const boutonMettreAJour = document.querySelector(".btn-maj");
boutonMettreAJour.addEventListener("click", function () {
	window.localStorage.removeItem("pieces");
});

// Ajout du listener pour trier les pièces par ordre de prix croissant
const boutonTrier = document.querySelector(".btn-trier");
boutonTrier.addEventListener("click", function () {
	const piecesReordonees = Array.from(pieces);
	piecesReordonees.sort(function (a, b) {
		return a.prix - b.prix;
	});
	document.querySelector(".fiches").innerHTML = "";
	genererPieces(piecesReordonees);
});

// Ajout du listener pour trier les pièces par ordre de prix décroissant
const boutonTriersdécroissant = document.querySelector(".btn-trier-decroissant");
boutonTriersdécroissant.addEventListener("click", function () {
	const piecesReordonees = Array.from(pieces);
	piecesReordonees.sort(function (a, b) {
		return b.prix - a.prix;
	});
	document.querySelector(".fiches").innerHTML = "";
	genererPieces(piecesReordonees);
});

// Ajout du listener pour filter les pièces non abordables
const boutonFiltrerAbordable = document.querySelector(".btn-filtrer-abordable");
boutonFiltrerAbordable.addEventListener("click", function () {
	const piecesfiltrer = pieces.filter(function (piece) {
		return piece.prix <= 35;
	});
	document.querySelector(".fiches").innerHTML = "";
	genererPieces(piecesfiltrer);
});

// Ajout du listener pour filter les pièces sans description
const boutonFiltrerDescription = document.querySelector(".btn-filtrer-description");
boutonFiltrerDescription.addEventListener("click", function () {
	const piecesfiltrer = pieces.filter(function (piece) {
		return Boolean(piece.description);
	});
	document.querySelector(".fiches").innerHTML = "";
	genererPieces(piecesfiltrer);
});

// list des pieces abordables
const nomsAbordable = pieces.map((piece) => piece.nom);
for (let i = pieces.length - 1; i >= 0; i--) {
	if (pieces[i].prix > 35) {
		nomsAbordable.splice(i, 1);
	}
}
const abordablesElement = document.createElement("ul");
for (const element of nomsAbordable) {
	const nomElement = document.createElement("li");
	nomElement.innerText = element;
	abordablesElement.appendChild(nomElement);
}
document.querySelector(".abordables").appendChild(abordablesElement);

// list des pièces disponibles
const nomsDisponibles = pieces.map((piece) => piece.nom);
const prixDisponibles = pieces.map((piece) => piece.prix);
for (let i = pieces.length - 1; i >= 0; i--) {
	if (pieces[i].disponibilite === false) {
		nomsDisponibles.splice(i, 1);
		prixDisponibles.splice(i, 1);
	}
}
const disponibleElement = document.createElement("ul");
for (let i = 0; i < nomsDisponibles.length; i++) {
	const nomElement = document.createElement("li");
	nomElement.innerText = nomsDisponibles[i] + " - " + prixDisponibles[i] + "€";
	disponibleElement.appendChild(nomElement);
}
document.querySelector(".disponible").appendChild(disponibleElement);
// Ajout du listener pour filter les pièces selon le prix
const inputPrixMax = document.querySelector("#prix-max");
inputPrixMax.addEventListener("input", function () {
	const piecesFiltrees = pieces.filter(function (piece) {
		return piece.prix <= inputPrixMax.value;
	});

	// Effacement de l'écran et regénération de la page avec les pieces filtrées uniquement
	document.querySelector(".fiches").innerHTML = "";
	genererPieces(piecesFiltrees);
});
