const panier = [];

function ajouterAuPanier(produit, prix) {
  panier.push({ produit, prix });
  afficherPanier();
}

function afficherPanier() {
  const listePanier = document.getElementById('liste-panier');
  listePanier.innerHTML = '';
  let total = 0;
  panier.forEach((item) => {
    listePanier.innerHTML += `
      <div class="panier-item">
        <span>${item.produit}</span>
        <span>${item.prix.toFixed(2)} €</span>
      </div>
    `;
    total += item.prix;
  });
  document.getElementById('total-panier').innerText = `Total : ${total.toFixed(2)} €`;
}

function validerCommande() {
  if (panier.length === 0) {
    alert("Votre panier est vide.");
    return;
  }
  alert("Commande validée !");
  panier.length = 0;
  afficherPanier();
}

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
