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
                // je récupère mon token d'authentification depuis la réponse
                return response.json();
            } else {
                // sinon message d'erreur
                alert("Votre email et/ou votre mot de passe sont incorrects. Veuillez réessayer.");
                throw new Error("Erreur de connexion");
            }
        })
        .then(data => {
            // je stocke mon token dans le localStorage (quid session storage ou cookie???)
            localStorage.setItem("authToken", data.token);
            
            // et j'ouvre mon index.html
            window.location.href = "index.html";
        })
        .catch(error => {
            console.error("Erreur lors de la requête:", error);
        });
    });
}

// j'appelle ma fonction sendLogin
sendLogin();