const clientId = 978243;  // Remplacez par votre Client ID GitHub
const redirectUri = 'https://fewerteam.github.io/Test-BeaconMC-website/callback.html';

document.getElementById('githubLogin').href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo`;

// Vérifiez si l'utilisateur est connecté
function checkLogin() {
    const token = localStorage.getItem('github_token');
    if (token) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('uploadSection').style.display = 'block';
        loadApprovedPlugins();
    }
}

// Écoutez le formulaire de soumission
document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let fileInput = document.getElementById('pluginFile');
    let file = fileInput.files[0];
    if (file && file.name.endsWith('.py')) {
        submitPlugin(file);
    } else {
        alert('Veuillez sélectionner un fichier .py valide.');
    }
});

// Fonction pour soumettre un plugin
function submitPlugin(file) {
    const token = localStorage.getItem('github_token');
    if (!token) {
        alert('Vous devez être connecté pour soumettre un plugin.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;

        // Création d'une Pull Request via l'API GitHub
        fetch('https://api.github.com/repos/votre-utilisateur/votre-repo/contents/plugins/' + file.name, {
            method: 'PUT',
            headers: {
                'Authorization': 'token ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Ajout de ' + file.name,
                content: btoa(content),
                branch: 'nouvelle-branch-' + Date.now() // Nouvelle branche pour la PR
            })
        }).then(response => response.json())
          .then(data => {
              if (data.content) {
                  alert('Plugin soumis pour vérification : ' + file.name);
                  // TODO: Créer une Pull Request via GitHub API
              } else {
                  alert('Erreur lors de la soumission.');
              }
          });
    };
    reader.readAsText(file);
}

// Charger les plugins approuvés
function loadApprovedPlugins() {
    fetch('https://api.github.com/repos/votre-utilisateur/votre-repo/contents/approved-plugins')
        .then(response => response.json())
        .then(data => {
            let list = document.getElementById('approvedPluginsList');
            list.innerHTML = ''; // Effacer l'ancienne liste
            data.forEach(item => {
                let listItem = document.createElement('li');
                listItem.textContent = item.name;
                list.appendChild(listItem);
            });
        });
}

checkLogin();
