// ================= Panier =================

// Sélecteurs
const listePanier = document.getElementById('liste-panier');
const totalPanier = document.getElementById('total-panier');
const cartCount = document.getElementById('cart-count');
const btnCommander = document.getElementById("btn-commander");
const emailContainer = document.getElementById("email-container");
const btnEnvoyer = document.getElementById("btn-envoyer");
const status = document.getElementById("panier-status");

// Panier depuis localStorage
let panier = JSON.parse(localStorage.getItem("panier")) || [];

// Afficher le panier
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

// Ajouter un produit
function ajouterAuPanier(produit, prix) {
  const produitExistant = panier.find(item => item.produit === produit);
  if (produitExistant) produitExistant.quantite++;
  else panier.push({ produit, prix, quantite: 1 });

  sauvegarderPanier();
  afficherPanier();
}

// Modifier la quantité
function changerQuantite(index, changement) {
  panier[index].quantite += changement;
  if (panier[index].quantite <= 0) panier.splice(index, 1);
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
  if (panier.length === 0) return alert("Le panier est déjà vide.");
  if (confirm("Voulez-vous vraiment vider le panier ?")) {
    panier.length = 0;
    sauvegarderPanier();
    afficherPanier();
  }
}

// Sauvegarder
function sauvegarderPanier() {
  localStorage.setItem("panier", JSON.stringify(panier));
}

// Vérifier email
function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

// Afficher champ email au clic sur Commander
btnCommander.addEventListener("click", () => {
  if (panier.length === 0) {
    status.textContent = "Votre panier est vide.";
    status.style.color = "red";
    return;
  }
  emailContainer.style.display = "block";
  status.textContent = "";
});

// Envoyer la commande
btnEnvoyer.addEventListener("click", () => {
  const emailClient = document.getElementById("email-panier").value.trim();

  if (!emailClient || !validateEmail(emailClient)) {
    status.textContent = "Adresse email invalide.";
    status.style.color = "red";
    return;
  }

  const commande = {
    email: emailClient,
    produits: panier.map(p => `${p.produit} x${p.quantite} - ${(p.prix * p.quantite).toFixed(2)} €`),
    total: panier.reduce((sum, p) => sum + (p.prix * p.quantite), 0).toFixed(2)
  };

  status.textContent = "Envoi de la commande...";
  status.style.color = "black";

  fetch("https://script.google.com/macros/s/AKfycbzDGcbDVjloDXVQDb6FVtDWXCOaLyhdgrODGPJsKtWBE9fvI5kniWlNCIlPRlstejgX/exec", {
    method: "POST",
    body: JSON.stringify(commande)
  })
  .then(res => res.text())
  .then(() => {
    status.textContent = "Commande envoyée avec succès ! Un mail vous a été envoyé avec le récapitulatif de votre commande.";
    status.style.color = "green";
    panier.length = 0;
    sauvegarderPanier();
    afficherPanier();
    document.getElementById("email-panier").value = "";
    emailContainer.style.display = "none";
  })
  .catch(err => {
    status.textContent = "Erreur lors de l'envoi : " + err;
    status.style.color = "red";
  });
});

// Initialisation
afficherPanier();



// ================= Toggle Panier =================
const cartButton = document.getElementById("cart-button");
const cartPanel = document.getElementById("cart-panel");
const overlay = document.getElementById("overlay");
const closeCartBtn = document.getElementById("close-cart");

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

overlay.addEventListener("click", () => {
  cartPanel.classList.add("hidden");
  overlay.classList.add("hidden");
});

closeCartBtn.addEventListener("click", () => {
  cartPanel.classList.add("hidden");
  overlay.classList.add("hidden");
});

// ================= Carousel =================
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

  showImage(index);
  startAutoSlide();
});

// ================= Formulaire Contact =================
document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("contactForm");
  const nom = document.getElementById("nom");
  const email = document.getElementById("email");
  const message = document.getElementById("message");
  const submitBtn = document.getElementById("submitBtn");
  const formStatus = document.getElementById("form-status");

  // Restaurer contenu sauvegardé
  if (localStorage.getItem("formData")) {
    const saved = JSON.parse(localStorage.getItem("formData"));
    nom.value = saved.nom || "";
    email.value = saved.email || "";
    message.value = saved.message || "";
  }

  // Sauvegarder en temps réel
  [nom, email, message].forEach(field => {
    field.addEventListener("input", () => {
      localStorage.setItem("formData", JSON.stringify({
        nom: nom.value,
        email: email.value,
        message: message.value
      }));
    });
  });

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    submitBtn.classList.add("loading");
    formStatus.textContent = "Envoi en cours...";
    formStatus.style.color = "black";

    fetch("https://script.google.com/macros/s/AKfycbxyzWnBrh7otwQjCZGVPYV79U5Lw5GmtvrXf49hK7EKwlKNiLVkJ0cK_mn4djtR5O2Y/exec", {
      method: "POST",
      body: JSON.stringify({
        nom: nom.value,
        email: email.value,
        message: message.value
      })
    })
    .then(res => res.json())
    .then(data => {
      formStatus.textContent = "Message envoyé avec succès !";
      formStatus.style.color = "green";
      localStorage.removeItem("formData");
      form.reset();
    })
    .catch(err => {
      formStatus.textContent = "Erreur lors de l'envoi. Réessayez.";
      formStatus.style.color = "red";
    })
    .finally(() => {
      submitBtn.classList.remove("loading");
    });
  });
});


const API_URL = "https://script.google.com/macros/s/AKfycbw3_VZzFz9bAbe2-j0MkN5RdMKD-bIP47TG96OaYdSjP5NLrHNX9lCStpIHCjwbQZg8VQ/exec"; // Remplace par ton lien déployé

fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    // Moyenne
    const moy = data.moyenne.toFixed(1);
    document.getElementById("moyenne").innerHTML = 
      `<h3>Note moyenne : ${moy} ★</h3>`;

    // Liste des avis
    let html = "";
    data.avis.forEach(a => {
      html += `
        <div class="avis-card">
          <div>${"★".repeat(a.note)}${"☆".repeat(5-a.note)}</div>
          <p>${a.commentaire}</p>
        </div>`;
    });
    document.getElementById("liste-avis").innerHTML = html;
  });

