// Univers « La Ferme » : les animaux de la ferme et le tracteur.
// Pour créer un nouvel univers, copier ce fichier et changer son contenu.

// Tout est rangé dans une fonction pour que les noms utilisés ici
// ne se mélangent pas avec ceux des autres univers.
(function () {
  // La liste des 8 cartes du jeu.
  // - id : un nom unique pour reconnaître les paires
  //        (c'est aussi le nom du fichier son : sons/ferme/<id>.wav)
  // - nom : ce qui est lu à voix haute par le téléphone (accessibilité)
  // - fond : la couleur pastel de la face de la carte
  // - dessin : l'image SVG (une boîte de 100 x 100)
  const CARTES = [
    {
      id: "vache", nom: "Une vache", fond: "#dff0ff",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // Les deux petites cornes
        '<path d="M34 24 Q26 18 28 8 Q36 14 40 20 Z M66 24 Q74 18 72 8 Q64 14 60 20 Z" fill="#fff3d0" stroke="#c9a46a" stroke-width="2.5" stroke-linejoin="round"/>' +
        avecContour(
          // Les oreilles sur les côtés, puis la tête
          '<ellipse cx="17" cy="38" rx="13" ry="7" transform="rotate(-15 17 38)"/>' +
          '<ellipse cx="83" cy="38" rx="13" ry="7" transform="rotate(15 83 38)"/>' +
          '<ellipse cx="50" cy="48" rx="27" ry="30"/>',
          "#ffffff", "#4a4a5a") +
        // L'intérieur rose des oreilles
        '<ellipse cx="15" cy="38" rx="7" ry="3.2" fill="#ffb3c6" transform="rotate(-15 15 38)"/>' +
        '<ellipse cx="85" cy="38" rx="7" ry="3.2" fill="#ffb3c6" transform="rotate(15 85 38)"/>' +
        // Les grosses taches noires
        '<path d="M28 34 Q30 22 44 22 Q46 30 40 34 Q36 44 28 42 Z" fill="#2b2b33"/>' +
        '<path d="M62 26 Q72 22 75 32 Q74 40 66 38 Q60 32 62 26 Z" fill="#2b2b33"/>' +
        // La petite mèche de poils sur le front
        '<path d="M44 21 Q50 14 56 21 Q50 19 44 21 Z" fill="#4a4a5a"/>' +
        // Le gros museau rose et ses deux narines
        '<ellipse cx="50" cy="71" rx="24" ry="15" fill="#ffb3c6" stroke="#d9708f" stroke-width="2.5"/>' +
        '<ellipse cx="42" cy="68" rx="3" ry="4" fill="#b84a6a"/>' +
        '<ellipse cx="58" cy="68" rx="3" ry="4" fill="#b84a6a"/>' +
        sourire(50, 78, 12) +
        oeil(38, 46, 4.5) + oeil(62, 46, 4.5) +
        joues(29, 71, 56) +
        '</svg>'
    },
    {
      id: "cochon", nom: "Un cochon", fond: "#fff4d0",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        avecContour(
          // Les oreilles pointues, puis la grosse tête ronde
          '<path d="M22 36 L16 12 L42 24 Z"/>' +
          '<path d="M78 36 L84 12 L58 24 Z"/>' +
          '<ellipse cx="50" cy="54" rx="35" ry="31"/>',
          "#ffaecb", "#d9668f") +
        // L'intérieur des oreilles, un peu plus foncé
        '<path d="M24 31 L20 17 L35 25 Z M76 31 L80 17 L65 25 Z" fill="#ff8fb5"/>' +
        // Le groin avec ses deux narines
        '<ellipse cx="50" cy="63" rx="15" ry="11" fill="#ff8fb5" stroke="#d9668f" stroke-width="2.5"/>' +
        '<ellipse cx="44.5" cy="63" rx="2.8" ry="4.5" fill="#b84a72"/>' +
        '<ellipse cx="55.5" cy="63" rx="2.8" ry="4.5" fill="#b84a72"/>' +
        sourire(50, 79, 12) +
        oeil(35, 47, 4.5) + oeil(65, 47, 4.5) +
        joues(25, 75, 60) +
        '</svg>'
    },
    {
      id: "coq", nom: "Un coq", fond: "#e6e8ff",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // La grande queue de plumes vertes et bleues
        '<path d="M34 58 Q14 50 12 22 Q24 34 36 46 Z" fill="#2f9e6a" stroke="#1d6a45" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<path d="M32 62 Q8 62 4 38 Q20 50 34 54 Z" fill="#3a6fd8" stroke="#24479a" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<path d="M38 52 Q28 34 34 14 Q40 32 44 46 Z" fill="#3a6fd8" stroke="#24479a" stroke-width="2.5" stroke-linejoin="round"/>' +
        // Les pattes jaunes
        '<path d="M44 76 v13 m-5 0 h10 M56 76 v13 m-5 0 h10" stroke="#e0a000" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
        // La crête rouge sur la tête
        avecContour('<circle cx="59" cy="22" r="6"/><circle cx="67" cy="17" r="6.5"/><circle cx="75" cy="22" r="5.5"/>', "#e8443b", "#a82a22") +
        avecContour(
          // Le corps, puis le cou et la tête
          '<ellipse cx="48" cy="62" rx="22" ry="18"/>' +
          '<path d="M52 50 Q54 36 60 30 L78 34 Q76 48 66 60 Z"/>' +
          '<circle cx="68" cy="34" r="12"/>',
          "#f5a33a", "#b8651a") +
        // L'aile
        '<path d="M34 60 Q46 50 58 58 Q52 72 38 70 Z" fill="#e07a1a" stroke="#b8651a" stroke-width="2" stroke-linejoin="round"/>' +
        // Le bec jaune et le barbillon rouge en dessous
        '<path d="M79 31 L91 36 L79 40 Z" fill="#ffd23f" stroke="#d9a400" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M76 41 Q80 41 80 46 Q80 52 75 51 Q72 46 76 41 Z" fill="#e8443b" stroke="#a82a22" stroke-width="2"/>' +
        oeil(70, 31, 3.8) +
        joue(66, 40) +
        '</svg>'
    },
    {
      id: "mouton", nom: "Un mouton", fond: "#d8f2e4",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // La laine toute bouclée (plein de ronds collés)
        avecContour(
          '<circle cx="50" cy="20" r="13"/><circle cx="31" cy="26" r="13"/><circle cx="69" cy="26" r="13"/>' +
          '<circle cx="21" cy="44" r="13"/><circle cx="79" cy="44" r="13"/>' +
          '<circle cx="23" cy="63" r="13"/><circle cx="77" cy="63" r="13"/>' +
          '<circle cx="36" cy="77" r="13"/><circle cx="64" cy="77" r="13"/><circle cx="50" cy="80" r="12"/>' +
          '<circle cx="50" cy="50" r="30"/>',
          "#ffffff", "#a9a3b8") +
        // Les oreilles foncées
        '<ellipse cx="24" cy="48" rx="11" ry="5" fill="#5a4a48" stroke="#3a2e2c" stroke-width="2" transform="rotate(20 24 48)"/>' +
        '<ellipse cx="76" cy="48" rx="11" ry="5" fill="#5a4a48" stroke="#3a2e2c" stroke-width="2" transform="rotate(-20 76 48)"/>' +
        // Le visage foncé
        '<ellipse cx="50" cy="56" rx="16" ry="20" fill="#5a4a48" stroke="#3a2e2c" stroke-width="2.5"/>' +
        // La petite frange de laine sur le front
        '<circle cx="42" cy="38" r="7" fill="#fff"/><circle cx="50" cy="35" r="7.5" fill="#fff"/><circle cx="58" cy="38" r="7" fill="#fff"/>' +
        // Les yeux blancs (pour bien les voir sur le visage foncé)
        oeilPoisson(43, 53, 4.5) + oeilPoisson(57, 53, 4.5) +
        // Le nez et le sourire en clair
        '<path d="M47 65 h6 l-3 3 Z" fill="#ffb3c6"/>' +
        '<path d="M44 70 q6 5 12 0" stroke="#ffd6e0" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
        joues(39, 61, 63) +
        '</svg>'
    },
    {
      id: "cheval", nom: "Un cheval", fond: "#ffe6ea",
      dessin:
        // (tout le dessin est poussé un peu à droite pour être bien centré)
        '<svg viewBox="0 0 100 100"><g transform="translate(5 0)">' +
        // La crinière qui tombe sur le côté
        avecContour('<path d="M38 16 Q14 24 16 62 Q22 74 30 70 Q26 50 36 36 Z"/>', "#5a3418", "#3a200c") +
        avecContour(
          // Les oreilles pointues
          '<path d="M33 30 L28 8 L44 20 Z"/>' +
          '<path d="M67 30 L72 8 L56 20 Z"/>' +
          // La longue tête et le museau
          '<ellipse cx="50" cy="42" rx="22" ry="24"/>' +
          '<ellipse cx="50" cy="72" rx="18" ry="16"/>' +
          '<path d="M30 46 L70 46 L66 66 L34 66 Z"/>',
          "#b9763d", "#6e4220") +
        // L'intérieur des oreilles
        '<path d="M33 25 L30 13 L40 20 Z M67 25 L70 13 L60 20 Z" fill="#8a5228"/>' +
        // La liste blanche au milieu du visage
        '<path d="M46 30 Q50 26 54 30 L53 60 Q50 64 47 60 Z" fill="#fff"/>' +
        // Le toupet de poils sur le front
        '<path d="M36 22 Q50 8 62 20 Q58 30 52 25 Q48 33 42 26 Q38 30 36 22 Z" fill="#5a3418" stroke="#3a200c" stroke-width="2" stroke-linejoin="round"/>' +
        // Le museau clair et les narines
        '<ellipse cx="50" cy="75" rx="16" ry="12" fill="#e8c39a"/>' +
        '<ellipse cx="43" cy="74" rx="2.5" ry="3.5" fill="#6e4220"/>' +
        '<ellipse cx="57" cy="74" rx="2.5" ry="3.5" fill="#6e4220"/>' +
        sourire(50, 81, 10) +
        oeil(38, 45, 4.3) + oeil(62, 45, 4.3) +
        joues(34, 66, 58) +
        '</g></svg>'
    },
    {
      id: "canard", nom: "Un canard", fond: "#ddf3ff",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // Les pattes orange
        '<path d="M38 78 l-2 10 h-7 l9 3 l5 -3 Z M54 78 l-2 10 h-7 l9 3 l5 -3 Z" fill="#ff8a2a" stroke="#d9601a" stroke-width="2" stroke-linejoin="round"/>' +
        avecContour(
          // Le corps avec la petite queue pointue, puis la tête
          '<path d="M14 50 Q8 40 12 36 Q22 46 34 50 Z"/>' +
          '<ellipse cx="44" cy="64" rx="30" ry="18"/>' +
          '<circle cx="64" cy="36" r="17"/>',
          "#ffd93b", "#d9a400") +
        // L'aile
        '<path d="M28 60 Q44 50 56 60 Q48 74 32 70 Z" fill="#ffc21a" stroke="#d9a400" stroke-width="2" stroke-linejoin="round"/>' +
        // La petite mèche sur la tête
        '<path d="M60 20 Q62 12 68 14 Q64 16 64 20 Z" fill="#ffd93b" stroke="#d9a400" stroke-width="2" stroke-linejoin="round"/>' +
        // Le grand bec orange
        '<path d="M76 38 Q92 34 94 42 Q90 48 76 46 Z" fill="#ff8a2a" stroke="#d9601a" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M77 42 Q86 43 93 42" stroke="#d9601a" stroke-width="1.5" fill="none"/>' +
        oeil(67, 32, 4.2) +
        joue(66, 43) +
        '</svg>'
    },
    {
      id: "lapin", nom: "Un lapin", fond: "#ffe3f0",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        avecContour(
          // Les deux grandes oreilles, puis la tête
          '<ellipse cx="36" cy="25" rx="9" ry="21" transform="rotate(-10 36 25)"/>' +
          '<ellipse cx="64" cy="25" rx="9" ry="21" transform="rotate(10 64 25)"/>' +
          '<ellipse cx="50" cy="63" rx="29" ry="26"/>',
          "#d4d0e2", "#7a7494") +
        // L'intérieur rose des oreilles
        '<ellipse cx="36" cy="26" rx="4.5" ry="15" fill="#ffb3c6" transform="rotate(-10 36 26)"/>' +
        '<ellipse cx="64" cy="26" rx="4.5" ry="15" fill="#ffb3c6" transform="rotate(10 64 26)"/>' +
        // Le museau tout blanc
        '<ellipse cx="44" cy="72" rx="8" ry="7" fill="#fff"/>' +
        '<ellipse cx="56" cy="72" rx="8" ry="7" fill="#fff"/>' +
        // Le petit nez rose et les deux grandes dents
        '<path d="M46 66 h8 l-4 4 Z" fill="#ff7fa0" stroke="#d9668f" stroke-width="1.5" stroke-linejoin="round"/>' +
        '<path d="M46 77 h8 v6 h-8 Z" fill="#fff" stroke="#7a7494" stroke-width="1.5"/>' +
        '<path d="M50 77 v6" stroke="#7a7494" stroke-width="1.2"/>' +
        // Les moustaches
        '<path d="M34 70 h-12 M34 74 l-11 3 M66 70 h12 M66 74 l11 3" stroke="#7a7494" stroke-width="1.6" stroke-linecap="round"/>' +
        oeil(39, 57, 4.5) + oeil(61, 57, 4.5) +
        joues(29, 71, 67) +
        '</svg>'
    },
    {
      id: "tracteur", nom: "Un tracteur", fond: "#e4f7d6",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // La fumée du pot d'échappement
        '<circle cx="76" cy="22" r="4" fill="#d9d9e3"/><circle cx="82" cy="14" r="5" fill="#e6e6ee"/>' +
        // Le pot d'échappement
        '<path d="M70 28 h6 v22 h-6 Z" fill="#5a5a66" stroke="#33333d" stroke-width="2"/>' +
        avecContour(
          // La cabine, puis le capot (le long nez du tracteur)
          '<path d="M16 22 h38 v42 h-38 Z"/>' +
          '<path d="M40 46 h44 q6 0 6 6 v18 h-50 Z"/>',
          "#e8443b", "#9e2a22") +
        // Le toit de la cabine
        '<path d="M12 16 h46 v8 h-46 Z" fill="#b8322a" stroke="#9e2a22" stroke-width="2.5" stroke-linejoin="round"/>' +
        // La fenêtre
        '<path d="M22 29 h26 v20 h-26 Z" fill="#bfe6ff" stroke="#9e2a22" stroke-width="2"/>' +
        '<path d="M26 33 l6 -0 l-6 8 Z" fill="#fff" opacity="0.7"/>' +
        // La calandre (la grille devant)
        '<path d="M86 54 v12 M82 54 v12" stroke="#9e2a22" stroke-width="2" stroke-linecap="round"/>' +
        // Le visage souriant sur le capot
        oeil(60, 55, 3.6) + oeil(72, 55, 3.6) +
        sourire(66, 62, 8) +
        joue(55, 62) + joue(77, 62) +
        // La grosse roue arrière
        '<circle cx="30" cy="70" r="20" fill="#3a3a44" stroke="#22222a" stroke-width="2.5"/>' +
        '<circle cx="30" cy="70" r="9" fill="#ffd23f" stroke="#d9a400" stroke-width="2"/>' +
        '<circle cx="30" cy="70" r="3" fill="#d9a400"/>' +
        // La petite roue avant
        '<circle cx="76" cy="78" r="12" fill="#3a3a44" stroke="#22222a" stroke-width="2.5"/>' +
        '<circle cx="76" cy="78" r="5" fill="#ffd23f" stroke="#d9a400" stroke-width="2"/>' +
        '</svg>'
    }
  ];

  // Le fer à cheval (porte-bonheur) dessiné au dos de chaque carte
  const DESSIN_DOS =
    '<svg viewBox="0 0 100 100" opacity="0.9">' +
    // Le fer : un grand rond ouvert en haut
    '<path d="M30 20 A30 30 0 1 0 70 20" stroke="#fff" stroke-width="17" fill="none"/>' +
    // Les deux petits talons au bout du fer
    '<path d="M19 14 h18 v9 h-18 Z M63 14 h18 v9 h-18 Z" fill="#fff"/>' +
    // Les trous pour les clous (des petits points de la couleur du dos)
    '<path d="M30 20 A30 30 0 1 0 70 20" stroke="#dc4a32" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="0 18" stroke-dashoffset="-9.4"/>' +
    '</svg>';

  ajouterMonde({
    id: "ferme",
    nom: "La Ferme",                        // le nom sur la tuile de l'accueil
    sousTitre: "Vache, cochon, tracteur…",
    titre: [["Memory", "#e04a2f"], ["de la", "#8a5a2a"], ["Ferme", "#3f8a2a"]],   // le titre du jeu, mot par mot, avec sa couleur
    couleurs: {
      accent: "#e8553b",          // rouge grange
      accentClair: "#ffe0d6",
      principal: "#c0661a",       // orange foin
      texte: "#5a3a1a",           // brun foncé
      fond: "linear-gradient(180deg, #fffbe0 0%, #fbeea0 55%, #f2d65c 100%)",   // champ de blé
      dos: "linear-gradient(135deg, #f47a4a, #c9362a)",   // rouge grange
      bouton: "linear-gradient(135deg, #ffc93c, #e8553b)",
      ombre: "150, 95, 30",
      voile: "rgba(90, 58, 26, 0.45)",
      barre: "#fbeea0"
    },
    cartes: CARTES,
    dos: DESSIN_DOS,
    mascotte: "coq",                  // le personnage qui saute quand on gagne
    titreVictoire: "Cocorico ! Bravo !",
    decor: ["🌻", "🐣", "☁️", "🌾"],          // ce qui flotte derrière le jeu
    confettis: ["🐔", "🐷", "🌻", "⭐", "🐮"],
    melodie: "fermeMathurin",                // la comptine (voir musique.js)
    sons: "clochette",                       // le type de bruitages (voir sons.js)
    secousse: false,                         // les cartes tremblent à la victoire ?
    ancienneCleRecord: ""                    // pas de vieux record à reprendre
  });
})();
