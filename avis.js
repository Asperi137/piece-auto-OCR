export function ajoutListenersAvis() {
    const piecesElements = document.querySelectorAll(".fiches article button");

    for (const element of piecesElements) {
        element.addEventListener("click", async function (event) {
            const id = event.target.dataset.id;
            const reponse = await fetch("http://localhost:8081/pieces/" + id + "/avis");
            const avis = await reponse.json();
            window.localStorage.setItem("avis-piece-" +id, JSON.stringify(avis));

            const pieceElement = event.target.parentElement;
            afficherAvis(pieceElement,avis);
        });
    }
}

export function afficherAvis(pieceElement, avis) { 
    const avisElement = document.createElement("p");

		for (const element of avis) {
			avisElement.innerHTML += element.utilisateur + ": " + element.commentaire + "<br>";
		}

		pieceElement.appendChild(avisElement);
    

}


const formulaireAvis = document.querySelector(".formulaire-avis");
formulaireAvis.addEventListener("submit", function (event) {
    event.preventDefault();

    const avis = {
			pieceId: event.target.querySelector("[name=piece-id]").value,
			utilisateur: event.target.querySelector("[name=utilisateur]").value,
			commentaire: event.target.querySelector("[name=commentaire]").value,
			nbEtoiles: event.target.querySelector("[name=nbEtoiles]").value,
		};

    const chargeUtile = JSON.stringify(avis); 
    fetch("http://localhost:8081/avis", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: chargeUtile,
    });
});