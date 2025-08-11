// Récupérer le panier depuis localStorage ou initialiser vide
let panier = JSON.parse(localStorage.getItem("panier")) || [];

const listePanier = document.getElementById('liste-panier');
const totalPanier = document.getElementById('total-panier');
const cartCount = document.getElementById('cart-count');

// Ajouter un produit au panier (avec gestion de quantités)
function ajouterAuPanier(produit, prix) {
  const produitExistant = panier.find(item => item.produit === produit);

  if (produitExistant) {
    produitExistant.quantite++;
  } else {
    panier.push({ produit, prix, quantite: 1 });
  }

  sauvegarderPanier();
  afficherPanier();
}

// Afficher le panier avec quantités
function afficherPanier() {
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

  totalPanier.innerText = `Total : ${total.toFixed(2)} €`;
  cartCount.innerText = panier.reduce((sum, p) => sum + p.quantite, 0);
}

// Modifier la quantité d'un produit
function changerQuantite(index, changement) {
  panier[index].quantite += changement;

  if (panier[index].quantite <= 0) {
    panier.splice(index, 1);
  }

  sauvegarderPanier();
  afficherPanier();
}

// Supprimer un produit
function supprimerDuPanier(index) {
  panier.splice(index, 1);
  sauvegarderPanier();
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
    sauvegarderPanier();
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

  // Construire un tableau d'objets avec nom, quantite, prix unitaire
  const produitsObjets = panier.map(p => ({
    nom: p.produit,
    quantite: p.quantite,
    prix: p.prix
  }));

  const commande = {
    email: emailClient,
    produits: produitsObjets
    // Pas besoin de total, le serveur calcule
  };

  fetch("https://script.google.com/macros/s/AKfycbzDGcbDVjloDXVQDb6FVtDWXCOaLyhdgrODGPJsKtWBE9fvI5kniWlNCIlPRlstejgX/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // bien préciser le type JSON
    body: JSON.stringify(commande)
  })
  .then(res => res.text())
  .then(() => {
    alert("Commande envoyée avec succès !");
    panier.length = 0;
    sauvegarderPanier();
    afficherPanier();
  })
  .catch(err => {
    alert("Erreur lors de l'envoi : " + err);
  });
}

// Sauvegarder dans localStorage
function sauvegarderPanier() {
  localStorage.setItem("panier", JSON.stringify(panier));
}

// Vérifier email
function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

// Initialiser
afficherPanier();

// Sélecteurs
const cartButton = document.getElementById("cart-button");
const cartPanel = document.getElementById("cart-panel");
const overlay = document.getElementById("overlay");

// Toggle panier
cartButton.addEventListener("click", () => {
  const isHidden = cartPanel.classList.contains("hidden");
  if (isHidden) {
    cartPanel.classList.remove("hidden");
    overlay.classList.remove("hidden");
  } else {
    cartPanel.classList.add("hidden");
    overlay.classList.add("hidden");
  }
});

// Clic sur overlay = fermer panier
overlay.addEventListener("click", () => {
  cartPanel.classList.add("hidden");
  overlay.classList.add("hidden");
});

document.querySelectorAll('.carousel-produit').forEach(carousel => {
  let images = carousel.querySelectorAll('img');
  let prevBtn = carousel.querySelector('.prev');
  let nextBtn = carousel.querySelector('.next');
  let index = 0;
  let autoSlide;

  function showImage(i) {
    images.forEach(img => img.classList.remove('active'));
    images[i].classList.add('active');
  }

  function nextImage() {
    index = (index + 1) % images.length;
    showImage(index);
  }

  function prevImage() {
    index = (index - 1 + images.length) % images.length;
    showImage(index);
  }

  function startAutoSlide() {
    autoSlide = setInterval(nextImage, 8000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlide);
  }

  prevBtn.addEventListener('click', () => {
    prevImage();
    stopAutoSlide();
    startAutoSlide();
  });

  nextBtn.addEventListener('click', () => {
    nextImage();
    stopAutoSlide();
    startAutoSlide();
  });

  // Initialisation
  showImage(index);
  startAutoSlide();
});
