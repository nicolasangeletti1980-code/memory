// ===================================================================
// appui.js : l'« appui long », un petit verrou pour les parents.
// Pour les boutons 🏠 (accueil), 🎵 (musique) et 🔔 (bruitages),
// il faut garder le doigt appuyé 1 seconde : un anneau se remplit
// autour du bouton, puis l'action se fait.
// Un simple toucher (celui d'un petit doigt pressé) ne fait rien :
// le bouton se secoue juste un peu.
// Partagé par toutes les pages.
// ===================================================================

const DUREE_APPUI = 1000;   // en millisecondes (1000 = 1 seconde)

// - element : le bouton
// - action : ce qu'il faut faire quand l'appui a duré assez longtemps
function appuiLong(element, action) {
  let minuteur = null;

  // Le doigt se pose : l'anneau commence à se remplir
  function commencer(evenement) {
    evenement.preventDefault();
    element.classList.remove("refus");
    element.classList.add("appui");
    minuteur = setTimeout(function () {
      minuteur = null;
      element.classList.remove("appui");
      action();
    }, DUREE_APPUI);
  }

  // Le doigt part trop tôt : on annule et le bouton se secoue
  function annuler() {
    if (minuteur === null) return;
    clearTimeout(minuteur);
    minuteur = null;
    element.classList.remove("appui");
    element.classList.add("refus");
    setTimeout(function () { element.classList.remove("refus"); }, 400);
  }

  element.addEventListener("pointerdown", commencer);
  element.addEventListener("pointerup", annuler);
  element.addEventListener("pointerleave", annuler);
  element.addEventListener("pointercancel", annuler);

  // Un simple toucher (ou un clic) ne fait rien du tout
  element.addEventListener("click", function (evenement) {
    evenement.preventDefault();
  });
  // Pas de menu du téléphone pendant l'appui long
  element.addEventListener("contextmenu", function (evenement) {
    evenement.preventDefault();
  });
}
