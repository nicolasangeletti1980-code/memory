// Univers « Myrtille » : les cartes de Myrtille et de son monde.
// Pour créer un nouvel univers, copier ce fichier et changer son contenu.

// Tout est rangé dans une fonction pour que les noms utilisés ici
// ne se mélangent pas avec ceux des autres univers.
(function () {
  // Un nounours : on choisit la couleur du poil, du contour et du museau.
  // Comme ça, la même fonction dessine le blanc ET le marron.
  function dessinOurs(poil, contour, museau) {
    return '<svg viewBox="0 0 100 100">' +
      // Les oreilles et la tête, avec un joli contour tout autour
      avecContour(
        '<circle cx="25" cy="29" r="13"/><circle cx="75" cy="29" r="13"/>' +
        '<circle cx="50" cy="57" r="33"/>',
        poil, contour) +
      // L'intérieur rose des oreilles
      '<circle cx="25" cy="29" r="6.5" fill="#ffb3d1"/>' +
      '<circle cx="75" cy="29" r="6.5" fill="#ffb3d1"/>' +
      // Le museau, le nez (avec un reflet) et la bouche
      '<ellipse cx="50" cy="69" rx="16" ry="12" fill="' + museau + '"/>' +
      '<ellipse cx="50" cy="63" rx="6" ry="4.5" fill="#4a3428"/>' +
      '<ellipse cx="48" cy="61.6" rx="2" ry="1.2" fill="#fff" opacity="0.6"/>' +
      '<path d="M50 67 v3 M44 71 q6 5 12 0" stroke="#4a3428" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
      // Les yeux (avec un petit reflet blanc)
      oeil(37, 52, 4.6) + oeil(63, 52, 4.6) +
      joues(28, 72, 63) +
      '</svg>';
  }

  // Un mot écrit comme un autocollant : un contour foncé, un liseré blanc,
  // puis les lettres en couleur par-dessus.
  // - largeur : la largeur imposée au mot (0 = sa largeur naturelle)
  // - epais : l'épaisseur du contour (0.2 = gros contour, 0.13 = plus fin)
  function texteAutocollant(texte, y, taille, couleur, contour, largeur, epais) {
    const debut = '<text x="50" y="' + y + '" text-anchor="middle" font-size="' + taille + '" font-weight="900" ' +
      (largeur ? 'textLength="' + largeur + '" lengthAdjust="spacingAndGlyphs" ' : '') +
      'font-family="ui-rounded, Arial Rounded MT Bold, Trebuchet MS, Arial, sans-serif" stroke-linejoin="round" ';
    return debut + 'fill="' + contour + '" stroke="' + contour + '" stroke-width="' + (taille * epais) + '">' + texte + '</text>' +
      debut + 'fill="#fff" stroke="#fff" stroke-width="' + (taille * epais * 0.55) + '">' + texte + '</text>' +
      debut + 'fill="' + couleur + '">' + texte + '</text>';
  }

  // Un petit cœur (x, y = le haut du creux du cœur, t = sa taille)
  function coeur(x, y, t, couleur, contour) {
    return '<path d="M' + x + ' ' + (y + t * 1.1) +
      ' C' + (x - t * 1.3) + ' ' + (y + t * 0.3) + ' ' + (x - t * 0.8) + ' ' + (y - t * 0.6) + ' ' + x + ' ' + y +
      ' C' + (x + t * 0.8) + ' ' + (y - t * 0.6) + ' ' + (x + t * 1.3) + ' ' + (y + t * 0.3) + ' ' + x + ' ' + (y + t * 1.1) + 'Z" ' +
      'fill="' + couleur + '" stroke="' + contour + '" stroke-width="2" stroke-linejoin="round"/>';
  }

  // Les couleurs du hovawart « noir marqué de feu »
  const NOIR = "#26262e";       // la robe noire
  const NOIR_CONTOUR = "#0c0c12";
  const BRILLANT = "#565666";   // les reflets qui font briller le poil
  const FEU = "#d4964a";        // le feu blond moyen

  // La liste des 8 cartes du jeu.
  // - id : un nom unique pour reconnaître les paires
  //        (c'est aussi le nom du fichier son : sons/myrtille/<id>.wav)
  // - nom : ce qui est lu à voix haute par le téléphone (accessibilité)
  // - fond : la couleur pastel de la face de la carte
  // - dessin : l'image SVG (une boîte de 100 x 100)
  const CARTES = [
    {
      id: "myrtille", nom: "Une myrtille", fond: "#e6ebff",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // La feuille (dessinée en premier pour être derrière), avec sa nervure
        avecContour('<path d="M54 26 Q60 6 84 7 Q80 28 54 26 Z"/>', "#7fd27f", "#3f9a4a") +
        '<path d="M57 24 Q68 16 80 10" stroke="#b6eab0" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        // Le fruit tout rond
        avecContour('<circle cx="50" cy="58" r="33"/>', "#5b6fd6", "#323d96") +
        // Le reflet de lumière
        '<ellipse cx="32" cy="45" rx="6" ry="11" fill="#fff" opacity="0.35" transform="rotate(-25 32 45)"/>' +
        // La petite couronne en étoile en haut du fruit
        '<polygon points="50,17 52.6,23 59,23.4 54,27.6 55.6,34 50,30.6 44.4,34 46,27.6 41,23.4 47.4,23" fill="#2e3680" stroke="#2e3680" stroke-width="2" stroke-linejoin="round"/>' +
        // Le visage
        oeil(39, 56, 4.8) + oeil(61, 56, 4.8) +
        sourire(50, 67, 13) +
        joues(30, 70, 66) +
        '</svg>'
    },
    {
      id: "lettre-m", nom: "La lettre M", fond: "#ffe3f1",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        texteAutocollant("M", 76, 72, "#ff5fa8", "#c23f86", 0, 0.2) +
        // Un petit reflet de lumière sur la lettre
        '<path d="M27 34 v14" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity="0.7"/>' +
        etincelle(13, 17, 7, "#9b6bff") +
        etincelle(87, 20, 5.5, "#3aa0e8") +
        coeur(87, 84, 5.5, "#ff8fc7", "#c23f86") +
        etincelle(14, 86, 5, "#ff6fb5") +
        '</svg>'
    },
    {
      id: "prenom", nom: "Le prénom Myrtille", fond: "#efe4ff",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // Un cœur rose au-dessus du prénom
        coeur(50, 20, 12, "#ff6fb5", "#c23f86") +
        '<ellipse cx="42" cy="24" rx="2.5" ry="4" fill="#fff" opacity="0.6" transform="rotate(-30 42 24)"/>' +
        // textLength (la largeur imposée) oblige le mot à tenir dans la carte
        texteAutocollant("Myrtille", 69, 30, "#8a4fd8", "#5a2f9e", 86, 0.13) +
        etincelle(16, 86, 5.5, "#3aa0e8") +
        etincelle(84, 86, 5.5, "#ff6fb5") +
        etincelle(50, 88, 4, "#9b6bff") +
        '</svg>'
    },
    {
      id: "surnom", nom: "Le surnom Mimi", fond: "#e0f2ff",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        texteAutocollant("Mimi", 66, 38, "#3aa0e8", "#1d64a8", 74, 0.18) +
        // Deux petits cœurs
        coeur(22, 18, 7, "#ff6fb5", "#c23f86") +
        coeur(78, 78, 7, "#9b6bff", "#5a2f9e") +
        etincelle(80, 22, 6, "#9b6bff") +
        etincelle(20, 82, 5, "#ff6fb5") +
        '</svg>'
    },
    {
      id: "hovawart", nom: "Un chien hovawart", fond: "#fff0dc",
      dessin:
        // Un hovawart « noir marqué de feu », dessiné d'après le standard
        // officiel de la race (FCI n° 190) :
        // - robe noire et brillante ;
        // - feu blond moyen : bas du museau, tour des babines qui rejoint
        //   le feu sous la gorge, une tache au-dessus de chaque œil,
        //   deux taches côte à côte sur le poitrail ;
        // - oreilles en triangle, attachées haut, qui tombent le long
        //   des joues jusqu'au coin des lèvres, bout un peu arrondi ;
        // - front large et bombé, stop marqué, museau droit
        //   à peu près aussi long que le crâne, truffe noire.
        '<svg viewBox="0 0 100 100">' +
        // Le cou et le poitrail (poil long et un peu ondulé)
        avecContour('<path d="M18 97 Q17 75 33 66 L67 66 Q83 75 82 97 Z"/>', NOIR, NOIR_CONTOUR) +
        '<path d="M27 78 q3 3 0 6 q-3 3 0 6 M73 78 q-3 3 0 6 q-3 3 0 6" stroke="' + BRILLANT + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
        // Les deux taches feu du poitrail, côte à côte
        '<ellipse cx="43" cy="86" rx="6.5" ry="7" fill="' + FEU + '"/>' +
        '<ellipse cx="57" cy="86" rx="6.5" ry="7" fill="' + FEU + '"/>' +
        // Le feu sous la gorge
        '<ellipse cx="50" cy="70" rx="10" ry="8" fill="' + FEU + '"/>' +
        // La tête : le crâne large et bombé, puis le museau droit
        avecContour(
          '<ellipse cx="50" cy="34" rx="25" ry="21"/>' +
          '<path d="M37 40 Q36 62 42 68 Q50 72 58 68 Q64 62 63 40 Z"/>',
          NOIR, NOIR_CONTOUR) +
        // Le reflet brillant sur le front bombé
        '<path d="M38 20 Q50 13 62 20" stroke="' + BRILLANT + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
        // Le feu au bas du museau et autour des babines (le dessus reste noir)
        '<path d="M37.5 50 Q37 63 42 68 Q50 72 58 68 Q63 63 62.5 50 Q57 57 50 57 Q43 57 37.5 50 Z" fill="' + FEU + '"/>' +
        // Le stop (le petit creux entre les yeux, en haut du museau)
        '<path d="M45 41 Q50 44 55 41" stroke="' + BRILLANT + '" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        // La truffe noire, avec un reflet
        '<ellipse cx="50" cy="56" rx="6.5" ry="4.8" fill="#0c0c12" stroke="' + BRILLANT + '" stroke-width="1.2"/>' +
        '<ellipse cx="48" cy="54.5" rx="2" ry="1.2" fill="#9a9aa8"/>' +
        // La bouche et la petite langue rose
        '<path d="M50 61 v2.5 M44.5 64 q5.5 4 11 0" stroke="#5a3210" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        '<path d="M47.5 66 q2.5 5 5 0 Z" fill="#ff8fa3"/>' +
        // Les taches feu bien nettes au-dessus des yeux
        '<ellipse cx="41" cy="28" rx="4.2" ry="2.8" fill="' + FEU + '"/>' +
        '<ellipse cx="59" cy="28" rx="4.2" ry="2.8" fill="' + FEU + '"/>' +
        // Les yeux marron foncé, avec un reflet blanc
        '<circle cx="41" cy="37" r="5" fill="#7a4a1e"/><circle cx="59" cy="37" r="5" fill="#7a4a1e"/>' +
        '<circle cx="41" cy="37" r="3.2" fill="#0c0c12"/><circle cx="59" cy="37" r="3.2" fill="#0c0c12"/>' +
        '<circle cx="42.6" cy="35.4" r="1.7" fill="#fff"/><circle cx="60.6" cy="35.4" r="1.7" fill="#fff"/>' +
        // Les oreilles en triangle, attachées haut sur le crâne,
        // qui tombent le long des joues (bout un peu arrondi)
        avecContour(
          '<path d="M38 17 Q30 13 24 19 Q19 36 23 56 Q26 63 30 59 Q34 44 37 30 Z"/>' +
          '<path d="M62 17 Q70 13 76 19 Q81 36 77 56 Q74 63 70 59 Q66 44 63 30 Z"/>',
          NOIR, NOIR_CONTOUR) +
        // Les reflets brillants sur les oreilles
        '<path d="M27 24 Q24 38 27 52 M73 24 Q76 38 73 52" stroke="' + BRILLANT + '" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        '</svg>'
    },
    {
      id: "trottinette", nom: "Une trottinette violette", fond: "#e3f3ff",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // Les rubans roses qui flottent au guidon
        '<path d="M53 19 q-9 4 -16 0 q-7 -4 -14 2 M53 23 q-8 6 -15 3" stroke="#ff8fc7" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        // Le guidon et la colonne de direction (contour foncé puis violet)
        '<path d="M55 19 L80 19 M68 19 L77 70" stroke="#4a2490" stroke-width="12" fill="none" stroke-linecap="round"/>' +
        '<path d="M55 19 L80 19 M68 19 L77 70" stroke="#9b5de5" stroke-width="7" fill="none" stroke-linecap="round"/>' +
        // Les poignées roses
        '<rect x="49" y="14" width="12" height="10" rx="5" fill="#ff6fb5" stroke="#c23f86" stroke-width="2.5"/>' +
        '<rect x="75" y="14" width="12" height="10" rx="5" fill="#ff6fb5" stroke="#c23f86" stroke-width="2.5"/>' +
        // La planche où l'on pose le pied, et le garde-boue arrière
        avecContour(
          '<rect x="12" y="64" width="68" height="11" rx="5.5"/>' +
          '<path d="M8 76 Q12 64 24 66 L26 70 Q16 70 13 78 Z"/>',
          "#9b5de5", "#4a2490") +
        '<path d="M22 69.5 h48" stroke="#c9a7ff" stroke-width="2.5" stroke-linecap="round"/>' +
        // Un petit cœur collé sur la planche
        coeur(46, 66.5, 3.2, "#ff8fc7", "#c23f86") +
        // Les deux roues, avec leur centre rose
        '<circle cx="20" cy="82" r="11" fill="#3d2c52" stroke="#231633" stroke-width="2.5"/>' +
        '<circle cx="20" cy="82" r="4.5" fill="#ffb3d9" stroke="#c23f86" stroke-width="1.5"/>' +
        '<circle cx="78" cy="82" r="11" fill="#3d2c52" stroke="#231633" stroke-width="2.5"/>' +
        '<circle cx="78" cy="82" r="4.5" fill="#ffb3d9" stroke="#c23f86" stroke-width="1.5"/>' +
        // Des petites étoiles qui brillent
        etincelle(38, 44, 6.5, "#ff6fb5") +
        etincelle(22, 34, 4.5, "#9b6bff") +
        etincelle(90, 46, 5, "#3aa0e8") +
        '</svg>'
    },
    {
      id: "ours-blanc", nom: "Le doudou nounours blanc", fond: "#ffe9f3",
      dessin: dessinOurs("#fffdf8", "#bfae9c", "#f3e8dc")
    },
    {
      id: "ours-marron", nom: "Le doudou nounours marron", fond: "#fff1de",
      dessin: dessinOurs("#b5804f", "#6e4526", "#ebcba5")
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
