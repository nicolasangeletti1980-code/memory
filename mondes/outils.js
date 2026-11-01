// ===================================================================
// mondes/outils.js : la liste des univers et les petits outils
// de dessin partagés par tous les univers.
// ===================================================================

// ===== 1. La liste des univers =====
// Pour AJOUTER UN UNIVERS :
//   1. créer un fichier dans le dossier "mondes" (copier un univers existant),
//   2. ajouter son nom dans la liste ci-dessous.
// C'est tout : l'accueil, le jeu et le mode hors ligne le prennent en compte.
const LISTE_MONDES = ["myrtille", "mer", "dino", "ferme", "zoo", "foret"];

// Chaque fichier d'univers appelle ajouterMonde({...}) pour se présenter.
const MONDES = {};
function ajouterMonde(monde) {
  MONDES[monde.id] = monde;
}

// ===== 2. Les outils de dessin (images SVG dans une boîte de 100 x 100) =====

// Astuce : on dessine les formes une 1re fois en foncé et un peu plus grosses
// (le contour), puis une 2e fois par-dessus en clair.
// Résultat : un seul joli contour autour de tout le personnage.
function avecContour(formes, couleur, contour) {
  return '<g fill="' + contour + '" stroke="' + contour + '" stroke-width="5" stroke-linejoin="round">' + formes + '</g>' +
         '<g fill="' + couleur + '">' + formes + '</g>';
}

// Un œil avec un petit reflet blanc
function oeil(x, y, taille) {
  return '<circle cx="' + x + '" cy="' + y + '" r="' + taille + '" fill="#1d2b3a"/>' +
         '<circle cx="' + (x + taille * 0.35) + '" cy="' + (y - taille * 0.35) + '" r="' + (taille * 0.38) + '" fill="#fff"/>';
}

// Un gros œil de poisson (blanc avec la pupille dedans)
function oeilPoisson(x, y, taille) {
  return '<circle cx="' + x + '" cy="' + y + '" r="' + taille + '" fill="#fff" stroke="#1d2b3a" stroke-width="1.5"/>' +
         oeil(x + 1, y, taille * 0.6);
}

// Un petit sourire
function sourire(x, y, largeur) {
  return '<path d="M' + (x - largeur / 2) + ' ' + y + ' q' + (largeur / 2) + ' ' + (largeur * 0.45) + ' ' + largeur + ' 0" ' +
         'stroke="#1d2b3a" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
}

// Une joue rose
function joue(x, y) {
  return '<ellipse cx="' + x + '" cy="' + y + '" rx="4" ry="2.5" fill="#ff7fa0" opacity="0.6"/>';
}

// Deux joues roses (une à gauche, une à droite, à la même hauteur)
function joues(xGauche, xDroite, y) {
  return '<ellipse cx="' + xGauche + '" cy="' + y + '" rx="5" ry="3" fill="#ff8fc0" opacity="0.6"/>' +
         '<ellipse cx="' + xDroite + '" cy="' + y + '" rx="5" ry="3" fill="#ff8fc0" opacity="0.6"/>';
}

// Petite étoile scintillante
function etincelle(x, y, taille, couleur) {
  const t = taille;
  return '<path d="M' + x + ' ' + (y - t) +
    ' Q' + x + ' ' + y + ' ' + (x + t) + ' ' + y +
    ' Q' + x + ' ' + y + ' ' + x + ' ' + (y + t) +
    ' Q' + x + ' ' + y + ' ' + (x - t) + ' ' + y +
    ' Q' + x + ' ' + y + ' ' + x + ' ' + (y - t) + 'Z" fill="' + couleur + '"/>';
}
