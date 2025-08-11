const panier = [];

// Ajouter un produit au panier (avec gestion de quantités)
function ajouterAuPanier(produit, prix) {
  const produitExistant = panier.find(item => item.produit === produit);

  if (produitExistant) {
    produitExistant.quantite++;
  } else {
    panier.push({ produit, prix, quantite: 1 });
  }

  afficherPanier();
}

// Afficher le panier avec quantités
function afficherPanier() {
  const listePanier = document.getElementById('liste-panier');
  listePanier.innerHTML = '';
  let total = 0;

  panier.forEach((item, index) => {
    const totalLigne = item.prix * item.quantite;
    total += totalLigne;

    listePanier.innerHTML += `
      <li class="panier-item">
        <span>${item.produit}</span>
        <span>
          <button onclick="changerQuantite(${index}, -1)">-</button>
          ${item.quantite}
          <button onclick="changerQuantite(${index}, 1)">+</button>
        </span>
        <span>${totalLigne.toFixed(2)} €</span>
        <button onclick="supprimerDuPanier(${index})">x</button>
      </li>
    `;
  });

  document.getElementById('total-panier').innerText = `Total : ${total.toFixed(2)} €`;
}

// Modifier la quantité d'un produit
function changerQuantite(index, changement) {
  panier[index].quantite += changement;

  if (panier[index].quantite <= 0) {
    panier.splice(index, 1);
  }

  afficherPanier();
}

// Supprimer un produit
function supprimerDuPanier(index) {
  panier.splice(index, 1);
  afficherPanier();
}

// Vider le panier
function viderPanier() {
  if (panier.length === 0) {
    alert("Le panier est déjà vide.");
    return;
  }
  if (confirm("Voulez-vous vraiment vider le panier ?")) {
    panier.length = 0;
    afficherPanier();
  }
}

// Valider la commande
function validerCommande() {
  if (panier.length === 0) {
    alert("Votre panier est vide.");
    return;
  }

  const emailClient = prompt("Entrez votre adresse email :");
  if (!emailClient || !validateEmail(emailClient)) {
    alert("Adresse email invalide.");
    return;
  }

  const commande = {
    email: emailClient,
    produits: panier.map(p => `${p.produit} x${p.quantite} - ${(p.prix * p.quantite).toFixed(2)} €`),
    total: panier.reduce((sum, p) => sum + (p.prix * p.quantite), 0).toFixed(2)
  };

  fetch("https://script.google.com/macros/s/AKfycbzDGcbDVjloDXVQDb6FVtDWXCOaLyhdgrODGPJsKtWBE9fvI5kniWlNCIlPRlstejgX/exec", {
    method: "POST",
    body: JSON.stringify(commande)
  })
  .then(res => res.text())
  .then(() => {
    alert("Commande envoyée avec succès !");
    panier.length = 0;
    afficherPanier();
  })
  .catch(err => {
    alert("Erreur lors de l'envoi : " + err);
  });
}

// Vérifier email
function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

// Initialiser
afficherPanier();
