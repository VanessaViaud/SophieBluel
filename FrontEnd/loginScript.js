function sendLogin() {
    const formLogin = document.getElementById("login");
    formLogin.addEventListener("submit", function (event) {
        event.preventDefault();

        // je récupère les valeurs des champs du formulaire
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // je crée un objet avec les données du formulaire
        const loginData = {
            email: email,
            password: password
        };

        // requête HTTP POST 
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        })
        .then(response => {
            if (response.ok) {
                // vers index si ok
                window.location.href = "index.html";
            } else {
                // message d'erreur
                alert("Votre Email et/ou votre Mot de passe sont incorrects. Veuillez réessayer");
            }
        })
        .catch(error => {
            console.error("Erreur lors de la requête:", error);
        });
    });
}
sendLogin()