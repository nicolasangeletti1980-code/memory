// ===================================================================
// jeu.js : le moteur du Memory, le même pour tous les univers.
// La page s'ouvre avec le nom de l'univers dans l'adresse,
// par exemple : jeu.html?monde=dino
// ===================================================================

// ===== 1. Quel univers ? =====
// On lit le nom dans l'adresse. S'il est inconnu, on prend Myrtille.
const nomDemande = new URLSearchParams(location.search).get("monde");
const ID_MONDE = LISTE_MONDES.indexOf(nomDemande) >= 0 ? nomDemande : "myrtille";

// On charge le fichier de l'univers (par exemple mondes/dino.js),
// puis on lance le jeu quand il est arrivé.
const fichierMonde = document.createElement("script");
fichierMonde.src = "mondes/" + ID_MONDE + ".js";
fichierMonde.onload = function () {
  lancerJeu(MONDES[ID_MONDE]);
};
document.body.appendChild(fichierMonde);

// ===== 2. Les éléments de la page =====
const plateau = document.getElementById("plateau");
const affichageCoups = document.getElementById("coups");
const affichageRecord = document.getElementById("record");
const fenetreVictoire = document.getElementById("victoire");
const texteResultat = document.getElementById("resultat");
const texteRecord = document.getElementById("message-record");

// ===== 3. Les variables qui changent pendant la partie =====
let monde = null;           // l'univers en cours
let premiereCarte = null;   // la 1re carte retournée
let deuxiemeCarte = null;   // la 2e carte retournée
let bloque = false;         // true = on attend, on ne peut pas toucher
let coups = 0;              // nombre de coups joués
let pairesTrouvees = 0;     // nombre de paires trouvées
let attente = null;         // le délai en cours (retournement ou victoire)

// ===================================================================
// 4. Habiller la page aux couleurs de l'univers
// ===================================================================
function appliquerTheme() {
  const c = monde.couleurs;
  const style = document.documentElement.style;
  style.setProperty("--accent", c.accent);
  style.setProperty("--accent-clair", c.accentClair);
  style.setProperty("--principal", c.principal);
  style.setProperty("--texte", c.texte);
  style.setProperty("--fond", c.fond);
  style.setProperty("--dos", c.dos);
  style.setProperty("--bouton", c.bouton);
  style.setProperty("--ombre", c.ombre);
  style.setProperty("--voile", c.voile);
  document.getElementById("couleur-barre").setAttribute("content", c.barre);

  // Le titre : chaque mot avec sa couleur
  const titre = document.getElementById("titre");
  titre.innerHTML = "";
  monde.titre.forEach(function (mot, i) {
    const span = document.createElement("span");
    span.textContent = (i > 0 ? " " : "") + mot[0];
    span.style.color = mot[1];
    titre.appendChild(span);
  });
  document.title = monde.titre.map(function (mot) { return mot[0]; }).join(" ");
  document.getElementById("titre-victoire").textContent = monde.titreVictoire;
}

// ===================================================================
// 5. Mélanger un tableau (méthode de Fisher-Yates)
// On parcourt le tableau de la fin vers le début
// et on échange chaque case avec une case au hasard avant elle.
// ===================================================================
function melanger(tableau) {
  for (let i = tableau.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tableau[i], tableau[j]] = [tableau[j], tableau[i]];
  }
  return tableau;
}

// ===================================================================
// 6. Le record : le moins de coups pour finir.
// Il est rangé dans la mémoire du téléphone ("localStorage"),
// un record par univers. try/catch évite que le jeu plante
// si cette mémoire est bloquée.
// ===================================================================
function cleRecord() {
  return "memory-record-" + monde.id;
}

function lireRecord() {
  try {
    const texte = localStorage.getItem(cleRecord());
    if (texte) {
      return parseInt(texte, 10);
    }
    // Pas encore de record : on reprend celui de l'ancienne version du jeu
    const ancien = JSON.parse(localStorage.getItem(monde.ancienneCleRecord));
    if (ancien && ancien.coups > 0) {
      return ancien.coups;
    }
  } catch (e) {}
  return null;
}

function sauverRecord(nombre) {
  try {
    localStorage.setItem(cleRecord(), String(nombre));
  } catch (e) {
    // Pas grave : le record ne sera simplement pas gardé
  }
}

function afficherRecord() {
  const record = lireRecord();
  affichageRecord.textContent = record ? record + " coups" : "–";
}

// ===================================================================
// 7. Créer une nouvelle partie
// ===================================================================
function nouvellePartie() {
  // On remet tout à zéro
  clearTimeout(attente);    // annule un retournement encore en attente
  premiereCarte = null;
  deuxiemeCarte = null;
  bloque = false;
  coups = 0;
  pairesTrouvees = 0;
  affichageCoups.textContent = "0";
  fenetreVictoire.classList.remove("visible");
  // On enlève les confettis qui tomberaient encore
  document.querySelectorAll(".confetti").forEach(function (c) { c.remove(); });
  afficherRecord();

  // Les 8 cartes de l'univers, en double (pour faire les paires), mélangées
  const paquet = melanger([...monde.cartes, ...monde.cartes]);

  // On vide le plateau puis on crée les 16 cartes
  plateau.innerHTML = "";
  paquet.forEach(function (modele) {
    const carte = document.createElement("button");
    carte.className = "carte";
    carte.dataset.id = modele.id;   // on garde l'identité "cachée" dans la carte
    carte.dataset.nom = modele.nom;
    carte.setAttribute("aria-label", "Carte cachée");
    carte.innerHTML =
      '<div class="carte-interieur">' +
        '<div class="dos">' + monde.dos + '</div>' +
        '<div class="face" style="background:' + modele.fond + '">' + modele.dessin + '</div>' +
      '</div>';
    carte.addEventListener("click", function () {
      toucherCarte(carte);
    });
    plateau.appendChild(carte);
  });
}

// ===================================================================
// 8. Quand on touche une carte
// ===================================================================
function toucherCarte(carte) {
  // On ignore le toucher si :
  // - on attend que deux cartes se retournent
  // - la carte est déjà retournée ou déjà trouvée
  if (bloque || carte.classList.contains("retournee")) {
    return;
  }

  // On réveille le synthétiseur (il a besoin d'un toucher pour démarrer)
  if (sonActif) {
    preparerAudio();
  }

  // On retourne la carte (le CSS fait l'animation)
  carte.classList.add("retournee");
  carte.setAttribute("aria-label", carte.dataset.nom);

  if (premiereCarte === null) {
    // C'est la 1re carte du coup : on la garde en mémoire
    premiereCarte = carte;
    return;
  }

  // C'est la 2e carte : un coup est terminé
  deuxiemeCarte = carte;
  coups++;
  affichageCoups.textContent = coups;

  if (premiereCarte.dataset.id === deuxiemeCarte.dataset.id) {
    // Les deux cartes sont identiques : elles restent visibles
    premiereCarte.classList.add("trouvee");
    deuxiemeCarte.classList.add("trouvee");
    pairesTrouvees++;
    premiereCarte = null;
    deuxiemeCarte = null;

    // Toutes les paires trouvées ? C'est gagné !
    if (pairesTrouvees === monde.cartes.length) {
      sonVictoire(monde);
      victoire();
    } else {
      // Le son de la carte trouvée (son cri, sa clochette...)
      const modele = monde.cartes.find(function (c) { return c.id === carte.dataset.id; });
      sonPaire(monde, modele);
    }
  } else {
    // Pas identiques : on bloque, puis on les retourne après 1 seconde.
    // Aucun son : on ne veut jamais décourager.
    bloque = true;
    attente = setTimeout(function () {
      premiereCarte.classList.remove("retournee");
      deuxiemeCarte.classList.remove("retournee");
      premiereCarte.setAttribute("aria-label", "Carte cachée");
      deuxiemeCarte.setAttribute("aria-label", "Carte cachée");
      premiereCarte = null;
      deuxiemeCarte = null;
      bloque = false;
    }, 1000);
  }
}

// ===================================================================
// 9. Pluie de confettis quand on gagne
// ===================================================================
function lancerConfettis() {
  const symboles = monde.confettis;
  for (let i = 0; i < 30; i++) {
    const c = document.createElement("span");
    c.className = "confetti";
    c.textContent = symboles[i % symboles.length];
    c.style.left = Math.random() * 100 + "vw";                 // position au hasard
    c.style.animationDuration = 2 + Math.random() * 2 + "s";   // vitesse au hasard
    c.style.animationDelay = Math.random() * 0.8 + "s";
    document.body.appendChild(c);
    // On l'enlève de la page quand il a fini de tomber
    c.addEventListener("animationend", function () { c.remove(); });
  }
}

// ===================================================================
// 10. Fin de partie
// ===================================================================
function victoire() {
  // Pour certains univers (les Dinos), le plateau tremble
  if (monde.secousse) {
    plateau.classList.add("secousse");
    setTimeout(function () { plateau.classList.remove("secousse"); }, 900);
  }

  texteResultat.textContent = "Gagné en " + coups + " coups !";

  // Meilleur score = le moins de coups
  const ancien = lireRecord();
  if (ancien === null || coups < ancien) {
    sauverRecord(coups);
    texteRecord.innerHTML = '<span class="record">🏆 Nouveau record !</span>';
  } else {
    texteRecord.textContent = "Record : " + ancien + " coups";
  }
  afficherRecord();

  // On met le dessin du personnage dans la fenêtre de victoire
  document.getElementById("mascotte").innerHTML =
    monde.cartes.find(function (c) { return c.id === monde.mascotte; }).dessin;

  // Toutes les cartes font la fête : elles sautent l'une après l'autre
  document.querySelectorAll(".carte").forEach(function (carte, i) {
    carte.style.setProperty("--retard", (0.5 + i * 0.06) + "s");
    carte.classList.add("danse");
  });

  // Petite pause pour laisser finir l'animation de la dernière carte
  attente = setTimeout(function () {
    fenetreVictoire.classList.add("visible");
    lancerConfettis();
  }, 800);
}

// ===================================================================
// 11. Le décor qui flotte derrière le jeu
// ===================================================================
function creerDecor(symboles) {
  const decor = document.getElementById("decor");
  for (let i = 0; i < 12; i++) {
    const element = document.createElement("span");
    const symbole = symboles[i % symboles.length];
    const taille = 18 + Math.random() * 22;               // taille au hasard
    if (symbole === "bulle") {
      element.className = "bulle-decor";                  // une bulle dessinée
      element.style.width = taille + "px";
      element.style.height = taille + "px";
    } else {
      element.textContent = symbole;
      element.style.fontSize = taille + "px";
    }
    element.style.left = Math.random() * 95 + "vw";        // position au hasard
    element.style.animationDuration = 14 + Math.random() * 12 + "s";  // lent
    element.style.animationDelay = -Math.random() * 20 + "s";         // déjà en route
    decor.appendChild(element);
  }
}

// ===================================================================
// 12. Tout démarrer, une fois l'univers chargé
// ===================================================================
function lancerJeu(mondeCharge) {
  monde = mondeCharge;
  appliquerTheme();
  creerDecor(monde.decor);
  prechargerSons(monde);
  brancherBoutonSon(document.getElementById("bouton-son"));
  initMusique(MELODIES[monde.melodie], document.getElementById("bouton-musique"));
  document.getElementById("rejouer").addEventListener("click", nouvellePartie);
  document.getElementById("rejouer-victoire").addEventListener("click", nouvellePartie);
  nouvellePartie();
}

// ===================================================================
// 13. Le mode appli : une copie du jeu est gardée dans le téléphone
// pour pouvoir jouer même sans internet (voir le fichier sw.js)
// ===================================================================
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(function () {});
}
