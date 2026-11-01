// Univers « Myrtille » : les cartes de Myrtille et de son monde.
// Pour créer un nouvel univers, copier ce fichier et changer son contenu.

// Tout est rangé dans une fonction pour que les noms utilisés ici
// ne se mélangent pas avec ceux des autres univers.
(function () {
  // Un nounours : on choisit la couleur du poil, du contour et du museau.
  // Comme ça, la même fonction dessine le blanc ET le marron.
  function dessinOurs(poil, contour, museau) {
    return '<svg viewBox="0 0 100 100">' +
      // Les oreilles
      '<circle cx="25" cy="29" r="13" fill="' + poil + '" stroke="' + contour + '" stroke-width="2.5"/>' +
      '<circle cx="75" cy="29" r="13" fill="' + poil + '" stroke="' + contour + '" stroke-width="2.5"/>' +
      '<circle cx="25" cy="29" r="6" fill="#ffb3d1"/>' +
      '<circle cx="75" cy="29" r="6" fill="#ffb3d1"/>' +
      // La tête
      '<circle cx="50" cy="56" r="33" fill="' + poil + '" stroke="' + contour + '" stroke-width="2.5"/>' +
      // Le museau, le nez et la bouche
      '<ellipse cx="50" cy="67" rx="15" ry="11" fill="' + museau + '"/>' +
      '<ellipse cx="50" cy="62" rx="5.5" ry="4" fill="#4a3428"/>' +
      '<path d="M50 66 v3 M44 70 q6 5 12 0" stroke="#4a3428" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
      // Les yeux (avec un petit reflet blanc)
      '<circle cx="38" cy="50" r="4" fill="#2b2b2b"/>' +
      '<circle cx="62" cy="50" r="4" fill="#2b2b2b"/>' +
      '<circle cx="39.3" cy="48.7" r="1.3" fill="#fff"/>' +
      '<circle cx="63.3" cy="48.7" r="1.3" fill="#fff"/>' +
      joues(29, 71, 60) +
      '</svg>';
  }

  // La liste des 8 cartes du jeu.
  // - id : un nom unique pour reconnaître les paires
  // - nom : ce qui est lu à voix haute par le téléphone (accessibilité)
  // - fond : la couleur pastel de la face de la carte
  // - dessin : l'image SVG
  const CARTES = [
    {
      id: "myrtille", nom: "Une myrtille", fond: "#e6ebff",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // La feuille (dessinée en premier pour être derrière)
        '<path d="M54 24 Q62 6 82 8 Q76 26 54 24Z" fill="#7fd27f" stroke="#43a24e" stroke-width="2"/>' +
        // Le fruit
        '<circle cx="50" cy="57" r="33" fill="#5b6fd6" stroke="#3d4aa8" stroke-width="2.5"/>' +
        // Le reflet de lumière
        '<ellipse cx="34" cy="44" rx="6" ry="10" fill="#fff" opacity="0.35" transform="rotate(-25 34 44)"/>' +
        // La petite couronne en étoile en haut du fruit
        '<polygon points="50,16 52.4,21.8 58.6,22.2 53.8,26.2 55.3,32.3 50,29 44.7,32.3 46.2,26.2 41.4,22.2 47.6,21.8" fill="#2e3680"/>' +
        // Le visage
        '<circle cx="40" cy="56" r="3.5" fill="#1d1f4a"/>' +
        '<circle cx="60" cy="56" r="3.5" fill="#1d1f4a"/>' +
        '<path d="M43 65 q7 6 14 0" stroke="#1d1f4a" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
        joues(33, 67, 64) +
        '</svg>'
    },
    {
      id: "lettre-m", nom: "La lettre M", fond: "#ffe3f1",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        '<text x="50" y="76" text-anchor="middle" font-size="72" font-weight="900" ' +
        'font-family="Arial Rounded MT Bold, Trebuchet MS, Arial, sans-serif" ' +
        'fill="#ff5fa8" stroke="#fff" stroke-width="4" paint-order="stroke">M</text>' +
        etincelle(14, 18, 7, "#9b6bff") +
        etincelle(86, 22, 5, "#3aa0e8") +
        etincelle(84, 86, 6, "#9b6bff") +
        '</svg>'
    },
    {
      id: "prenom", nom: "Le prénom Myrtille", fond: "#efe4ff",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // Un cœur rose au-dessus du prénom
        '<path d="M50 40 C30 26 38 12 50 23 C62 12 70 26 50 40Z" fill="#ff6fb5"/>' +
        // textLength oblige le mot à tenir dans la carte
        '<text x="50" y="66" text-anchor="middle" font-size="24" font-weight="900" ' +
        'textLength="88" lengthAdjust="spacingAndGlyphs" ' +
        'font-family="Arial Rounded MT Bold, Trebuchet MS, Arial, sans-serif" fill="#8a4fd8">Myrtille</text>' +
        etincelle(18, 84, 5, "#3aa0e8") +
        etincelle(82, 84, 5, "#ff6fb5") +
        '</svg>'
    },
    {
      id: "surnom", nom: "Le surnom Mimi", fond: "#e0f2ff",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        '<text x="50" y="64" text-anchor="middle" font-size="36" font-weight="900" ' +
        'textLength="76" lengthAdjust="spacingAndGlyphs" ' +
        'font-family="Arial Rounded MT Bold, Trebuchet MS, Arial, sans-serif" fill="#3aa0e8">Mimi</text>' +
        // Deux petits cœurs
        '<path d="M24 30 C14 23 18 15 24 21 C30 15 34 23 24 30Z" fill="#ff6fb5"/>' +
        '<path d="M76 84 C66 77 70 69 76 75 C82 69 86 77 76 84Z" fill="#9b6bff"/>' +
        etincelle(80, 22, 6, "#9b6bff") +
        etincelle(20, 80, 5, "#ff6fb5") +
        '</svg>'
    },
    {
      id: "hovawart", nom: "Un chien hovawart", fond: "#fff0dc",
      dessin:
        // Un hovawart "noir marqué de feu", dessiné d'après le standard
        // officiel de la race : robe noire, marques blond moyen au bas du
        // museau, autour des babines, sous la gorge, au-dessus des yeux
        // et deux taches au poitrail. Oreilles triangulaires tombantes.
        '<svg viewBox="0 0 100 100">' +
        // Le cou et le poitrail (poil long et un peu ondulé)
        '<path d="M22 98 Q24 75 36 69 L64 69 Q76 75 78 98 Z" fill="#1f1f1f"/>' +
        '<path d="M30 80 q3 3 0 6 M70 80 q-3 3 0 6 M36 90 q3 3 0 6 M64 90 q-3 3 0 6" stroke="#3d3d3d" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
        // Les deux taches feu du poitrail
        '<ellipse cx="43" cy="89" rx="6.5" ry="6" fill="#d69a4a"/>' +
        '<ellipse cx="57" cy="89" rx="6.5" ry="6" fill="#d69a4a"/>' +
        // La tête : crâne large et front bombé
        '<path d="M29 37 Q29 13 50 12 Q71 13 71 37 Q71 50 63 58 L61 70 L39 70 L37 58 Q29 50 29 37 Z" fill="#1f1f1f"/>' +
        // Le feu sous la gorge, puis au bas du museau et autour des babines
        '<ellipse cx="50" cy="75" rx="10" ry="5.5" fill="#d69a4a"/>' +
        '<ellipse cx="50" cy="67" rx="11.5" ry="7.5" fill="#d69a4a"/>' +
        // Le haut du museau reste noir
        '<path d="M43 42 Q50 39 57 42 L59.5 62 Q50 58 40.5 62 Z" fill="#1f1f1f"/>' +
        // La truffe noire avec un reflet
        '<ellipse cx="50" cy="61" rx="5.5" ry="4" fill="#000"/>' +
        '<ellipse cx="48.3" cy="59.6" rx="1.6" ry="1" fill="#777"/>' +
        // La bouche et la petite langue
        '<path d="M50 65 v3 M44.5 69 q5.5 4 11 0" stroke="#4a2c10" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        '<path d="M47.5 71 q2.5 5 5 0 Z" fill="#ff8fa3"/>' +
        // Les points feu au-dessus des yeux
        '<ellipse cx="40" cy="28" rx="3.6" ry="2.4" fill="#d69a4a"/>' +
        '<ellipse cx="60" cy="28" rx="3.6" ry="2.4" fill="#d69a4a"/>' +
        // Les yeux marron, avec un reflet blanc
        '<circle cx="40" cy="36" r="4.2" fill="#6b3d1a"/><circle cx="60" cy="36" r="4.2" fill="#6b3d1a"/>' +
        '<circle cx="40" cy="36" r="2.4" fill="#000"/><circle cx="60" cy="36" r="2.4" fill="#000"/>' +
        '<circle cx="41.3" cy="34.7" r="1.2" fill="#fff"/><circle cx="61.3" cy="34.7" r="1.2" fill="#fff"/>' +
        // Les oreilles triangulaires qui tombent le long des joues,
        // avec le bout arrondi (attachées haut, bien écartées)
        '<path d="M33 21 Q22 25 19 44 Q18 62 28 65 Q34 50 37 27 Z" fill="#2b2b2b" stroke="#000" stroke-width="1.2"/>' +
        '<path d="M67 21 Q78 25 81 44 Q82 62 72 65 Q66 50 63 27 Z" fill="#2b2b2b" stroke="#000" stroke-width="1.2"/>' +
        '</svg>'
    },
    {
      id: "trottinette", nom: "Une trottinette violette", fond: "#e3f3ff",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // Les rubans roses qui flottent au guidon
        '<path d="M50 20 q-8 4 -14 0 q-6 -4 -12 1 M50 24 q-7 5 -13 2" stroke="#ff8fc7" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
        // Le guidon et la colonne de direction (contour foncé puis violet)
        '<path d="M51 21 L77 21 M66 21 L76 71" stroke="#5a2f9e" stroke-width="10" fill="none" stroke-linecap="round"/>' +
        '<path d="M51 21 L77 21 M66 21 L76 71" stroke="#9b5de5" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        // Les poignées roses
        '<rect x="47" y="17" width="10" height="8" rx="4" fill="#ff6fb5" stroke="#c23f86" stroke-width="2"/>' +
        '<rect x="73" y="17" width="10" height="8" rx="4" fill="#ff6fb5" stroke="#c23f86" stroke-width="2"/>' +
        // La planche où l'on pose le pied
        '<rect x="14" y="66" width="64" height="9" rx="4.5" fill="#9b5de5" stroke="#5a2f9e" stroke-width="2.5"/>' +
        '<path d="M22 70.5 h44" stroke="#c9a7ff" stroke-width="2" stroke-linecap="round"/>' +
        // Le garde-boue au-dessus de la roue arrière
        '<path d="M12 74 Q20 64 30 72" stroke="#5a2f9e" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        // Les deux roues
        '<circle cx="21" cy="81" r="9" fill="#3d2c52"/><circle cx="21" cy="81" r="3.5" fill="#e6d8ff"/>' +
        '<circle cx="78" cy="81" r="9" fill="#3d2c52"/><circle cx="78" cy="81" r="3.5" fill="#e6d8ff"/>' +
        // Des petites étoiles qui brillent
        etincelle(36, 46, 6, "#ff6fb5") +
        etincelle(22, 34, 4, "#9b6bff") +
        etincelle(88, 48, 4.5, "#3aa0e8") +
        '</svg>'
    },
    {
      id: "ours-blanc", nom: "Le doudou nounours blanc", fond: "#ffe9f3",
      dessin: dessinOurs("#fffdf8", "#cdbfb0", "#f3e8dc")
    },
    {
      id: "ours-marron", nom: "Le doudou nounours marron", fond: "#fff1de",
      dessin: dessinOurs("#b5804f", "#7d5233", "#ebcba5")
    }
  ];

  // Le petit cœur blanc dessiné au dos de chaque carte
  const DESSIN_DOS =
    '<svg viewBox="0 0 100 100">' +
    '<path d="M50 88 C10 60 18 18 50 38 C82 18 90 60 50 88Z" fill="#fff" opacity="0.9"/>' +
    '</svg>';

  ajouterMonde({
    id: "myrtille",
    nom: "Myrtille",                       // le nom sur la tuile de l'accueil
    sousTitre: "Mimi, nounours, hovawart…",
    titre: [["Memory", "#ff6fb5"], ["de", "#3aa0e8"], ["Myrtille", "#9b6bff"]],   // le titre du jeu, mot par mot, avec sa couleur
    couleurs: {
      accent: "#ff6fb5",          // les chiffres, le contour des paires trouvées
      accentClair: "#ffd6ec",     // le bord de la fenêtre de victoire
      principal: "#9b6bff",       // couleur principale du thème
      texte: "#5b3a8c",           // couleur des textes
      fond: "linear-gradient(160deg, #ffd6ec 0%, #d9efff 50%, #e7dcff 100%)",
      dos: "linear-gradient(135deg, #ff9cd0, #b38cff)",
      bouton: "linear-gradient(135deg, #ff6fb5, #9b6bff)",
      ombre: "155, 107, 255",     // couleur des ombres (rouge, vert, bleu)
      voile: "rgba(91, 58, 140, 0.45)",
      barre: "#ffc2e2"            // couleur de la barre du téléphone
    },
    cartes: CARTES,
    dos: DESSIN_DOS,
    mascotte: "myrtille",                 // le personnage qui saute quand on gagne
    titreVictoire: "Bravo Myrtille !",
    decor: ["💜", "💖", "⭐", "✨", "💙"],   // ce qui flotte derrière le jeu
    confettis: ["💖", "💜", "💙", "⭐", "✨"],
    melodie: "clairDeLune",                   // la comptine (voir musique.js)
    sons: "clochette",                     // le type de bruitages (voir sons.js)
    secousse: false,                    // les cartes tremblent à la victoire ?
    ancienneCleRecord: "memory-myrtille-record"       // pour garder les records d'avant
  });
})();
