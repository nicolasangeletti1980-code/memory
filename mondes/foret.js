// Univers « La Forêt » : les animaux de la forêt, le champignon et la coccinelle.
// Pour créer un nouvel univers, copier ce fichier et changer son contenu.

// Tout est rangé dans une fonction pour que les noms utilisés ici
// ne se mélangent pas avec ceux des autres univers.
(function () {
  // Les piquants du hérisson : une ligne en zigzag (pointe, creux,
  // pointe, creux...) qui suit un demi-cercle au-dessus de son dos.
  // On calcule les points avec une boucle plutôt que de tous les écrire.
  function piquants() {
    let points = "";
    for (let i = 0; i <= 18; i++) {
      const angle = Math.PI * (1 - (i / 18) * 0.9);   // de la gauche vers la droite
      const longueur = (i % 2 === 0) ? 1 : 0.8;        // pointe (1) ou creux (0.8)
      const x = 44 + 38 * longueur * Math.cos(angle);
      const y = 74 - 40 * longueur * Math.sin(angle);
      points += x.toFixed(1) + "," + y.toFixed(1) + " ";
    }
    return '<polygon points="' + points + '"/>';
  }

  // La liste des 8 cartes du jeu.
  // - id : un nom unique pour reconnaître les paires
  //        (c'est aussi le nom du fichier son : sons/foret/<id>.wav)
  // - nom : ce qui est lu à voix haute par le téléphone (accessibilité)
  // - fond : la couleur pastel de la face de la carte
  // - dessin : l'image SVG (une boîte de 100 x 100)
  const CARTES = [
    {
      id: "renard", nom: "Un renard", fond: "#e2efff",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        avecContour(
          // Les grandes oreilles pointues, puis la tête en triangle
          '<path d="M18 42 L16 6 L44 30 Z"/>' +
          '<path d="M82 42 L84 6 L56 30 Z"/>' +
          '<path d="M10 38 Q18 27 50 27 Q82 27 90 38 Q86 62 50 88 Q14 62 10 38 Z"/>',
          "#f28a30", "#a8501a") +
        // L'intérieur clair des oreilles et le bout noir
        '<path d="M22 34 L20 16 L36 28 Z M78 34 L80 16 L64 28 Z" fill="#ffe2c4"/>' +
        '<path d="M16 6 L16.6 17 L25 13.5 Z M84 6 L83.4 17 L75 13.5 Z" fill="#3a2a2a" stroke="#3a2a2a" stroke-width="2.5" stroke-linejoin="round"/>' +
        // Les joues blanches
        '<path d="M11 41 Q22 58 40 60 Q48 64 50 87 Q20 66 11 41 Z" fill="#fff"/>' +
        '<path d="M89 41 Q78 58 60 60 Q52 64 50 87 Q80 66 89 41 Z" fill="#fff"/>' +
        // Le petit nez noir au bout du museau
        '<ellipse cx="50" cy="79" rx="5.5" ry="4" fill="#2b2b33"/>' +
        oeil(36, 47, 4.5) + oeil(64, 47, 4.5) +
        joues(28, 72, 57) +
        '</svg>'
    },
    {
      id: "herisson", nom: "Un hérisson", fond: "#fff1d6",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // Les petites pattes
        '<ellipse cx="34" cy="86" rx="7" ry="4.5" fill="#d9a878" stroke="#8a5a34" stroke-width="2"/>' +
        '<ellipse cx="58" cy="86" rx="7" ry="4.5" fill="#d9a878" stroke="#8a5a34" stroke-width="2"/>' +
        // Le dos plein de piquants
        avecContour(piquants() + '<ellipse cx="44" cy="72" rx="34" ry="13"/>', "#8a5e40", "#4a2e1a") +
        // Quelques traits clairs sur les piquants
        '<path d="M26 56 l-5 -6 M38 50 l-2 -8 M52 50 l2 -8 M30 68 l-6 -4 M44 62 l-1 -7" stroke="#b88a62" stroke-width="2.5" stroke-linecap="round"/>' +
        // Le visage clair avec son museau pointu (il regarde à droite)
        avecContour('<path d="M58 52 Q72 48 80 60 L92 68 Q90 74 82 76 Q70 86 58 82 Q50 68 58 52 Z"/>', "#f3d3a5", "#a8744a") +
        // La petite oreille
        '<circle cx="63" cy="54" r="4.5" fill="#e8b98a" stroke="#a8744a" stroke-width="2"/>' +
        // Le nez noir tout au bout
        '<circle cx="91" cy="68" r="3.8" fill="#2b2b33"/>' +
        oeil(73, 62, 4) +
        sourire(80, 74, 7) +
        joue(68, 71) +
        // Une petite feuille d'automne piquée sur le dos
        '<path d="M34 40 Q36 30 46 30 Q44 40 34 40 Z" fill="#ff9a3c" stroke="#c9601a" stroke-width="1.8" stroke-linejoin="round"/>' +
        '</svg>'
    },
    {
      id: "ecureuil", nom: "Un écureuil", fond: "#efe6ff",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // La très grosse queue en panache, derrière
        avecContour('<path d="M48 86 Q8 88 8 56 Q8 22 32 11 Q52 4 58 18 Q60 28 50 29 Q42 32 42 46 Q42 60 52 68 Z"/>', "#c4562a", "#7a2e12") +
        '<path d="M15 60 Q12 32 32 19 M22 72 Q32 82 44 81 M34 30 Q30 46 36 62" stroke="#e8925a" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
        // Les petits pieds
        '<ellipse cx="52" cy="87" rx="8" ry="4" fill="#c4562a" stroke="#7a2e12" stroke-width="2"/>' +
        '<ellipse cx="68" cy="87" rx="8" ry="4" fill="#c4562a" stroke="#7a2e12" stroke-width="2"/>' +
        avecContour(
          // L'oreille avec sa touffe, le corps, la tête et le museau
          '<path d="M56 30 L55 12 L68 26 Z"/>' +
          '<ellipse cx="60" cy="66" rx="16" ry="20"/>' +
          '<circle cx="65" cy="39" r="14"/>' +
          '<ellipse cx="77" cy="44" rx="7" ry="6"/>',
          "#d96a32", "#7a2e12") +
        // Le ventre clair
        '<ellipse cx="63" cy="70" rx="9" ry="13" fill="#ffe2c4"/>' +
        // La noisette dans les pattes
        '<ellipse cx="72" cy="62" rx="7" ry="8" fill="#b7793a" stroke="#6e4220" stroke-width="2"/>' +
        '<path d="M64 59 Q72 50 80 59 Q72 56 64 59 Z" fill="#7a4a1a" stroke="#6e4220" stroke-width="2" stroke-linejoin="round"/>' +
        '<ellipse cx="66" cy="63" rx="4" ry="3" fill="#d96a32" stroke="#7a2e12" stroke-width="1.5"/>' +
        '<ellipse cx="78" cy="63" rx="4" ry="3" fill="#d96a32" stroke="#7a2e12" stroke-width="1.5"/>' +
        // Le nez, l'œil et la joue
        '<circle cx="83" cy="43" r="2.3" fill="#2b2b33"/>' +
        oeil(68, 36, 4.2) +
        joue(70, 46) +
        '</svg>'
    },
    {
      id: "hibou", nom: "Un hibou", fond: "#e2f5e0",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // La branche sur laquelle il est perché
        '<path d="M6 90 H94" stroke="#6e4220" stroke-width="9" stroke-linecap="round"/>' +
        '<path d="M6 90 H94" stroke="#a8743a" stroke-width="4.5" stroke-linecap="round"/>' +
        avecContour(
          // Les aigrettes (les plumes en forme d'oreilles), puis le corps
          '<path d="M24 32 L18 8 L40 22 Z"/>' +
          '<path d="M76 32 L82 8 L60 22 Z"/>' +
          '<ellipse cx="50" cy="54" rx="31" ry="33"/>',
          "#9b86c2", "#5e4a8a") +
        // Les ailes un peu plus foncées
        '<path d="M20 52 Q12 70 24 82 Q30 70 28 54 Z M80 52 Q88 70 76 82 Q70 70 72 54 Z" fill="#7f6aad"/>' +
        // Le ventre clair avec des petites plumes en V
        '<ellipse cx="50" cy="70" rx="18" ry="15" fill="#f3e6ff"/>' +
        '<path d="M42 66 l3 3 l3 -3 M52 66 l3 3 l3 -3 M47 74 l3 3 l3 -3" stroke="#b9a6dc" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        // Les deux très grands yeux
        '<circle cx="37" cy="41" r="13" fill="#fff" stroke="#ffcf3a" stroke-width="3.5"/>' +
        '<circle cx="63" cy="41" r="13" fill="#fff" stroke="#ffcf3a" stroke-width="3.5"/>' +
        oeil(38, 42, 7) + oeil(62, 42, 7) +
        // Le petit bec orange
        '<path d="M45 51 L55 51 L50 59 Z" fill="#ff9a2e" stroke="#d9661a" stroke-width="2" stroke-linejoin="round"/>' +
        // Les pattes orange agrippées à la branche
        '<path d="M40 86 l-3 5 M43 86 v5 M46 86 l3 5 M54 86 l-3 5 M57 86 v5 M60 86 l3 5" stroke="#ff9a2e" stroke-width="3" stroke-linecap="round"/>' +
        joues(27, 73, 55) +
        '</svg>'
    },
    {
      id: "cerf", nom: "Un cerf", fond: "#ffe6ea",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // Les grands bois (trait foncé épais, puis trait clair par-dessus)
        '<path d="M40 36 Q34 22 24 6 M35 26 Q26 24 14 18 M30 16 Q36 10 38 4 M60 36 Q66 22 76 6 M65 26 Q74 24 86 18 M70 16 Q64 10 62 4" stroke="#8a5a2a" stroke-width="9" fill="none" stroke-linecap="round"/>' +
        '<path d="M40 36 Q34 22 24 6 M35 26 Q26 24 14 18 M30 16 Q36 10 38 4 M60 36 Q66 22 76 6 M65 26 Q74 24 86 18 M70 16 Q64 10 62 4" stroke="#f3e0b5" stroke-width="4.5" fill="none" stroke-linecap="round"/>' +
        avecContour(
          // Les oreilles, la tête, puis le museau
          '<ellipse cx="22" cy="46" rx="12" ry="6" transform="rotate(-25 22 46)"/>' +
          '<ellipse cx="78" cy="46" rx="12" ry="6" transform="rotate(25 78 46)"/>' +
          '<ellipse cx="50" cy="56" rx="21" ry="22"/>' +
          '<ellipse cx="50" cy="76" rx="14" ry="12"/>',
          "#d8a05a", "#8a5a2a") +
        // L'intérieur clair des oreilles
        '<ellipse cx="21" cy="46" rx="7" ry="3" fill="#fbe6cc" transform="rotate(-25 21 46)"/>' +
        '<ellipse cx="79" cy="46" rx="7" ry="3" fill="#fbe6cc" transform="rotate(25 79 46)"/>' +
        // Le museau clair et le gros nez
        '<ellipse cx="50" cy="78" rx="12" ry="9" fill="#f5dcb5"/>' +
        '<ellipse cx="50" cy="73" rx="5.5" ry="4" fill="#4a2e1a"/>' +
        sourire(50, 80, 8) +
        oeil(41, 55, 4.5) + oeil(59, 55, 4.5) +
        joues(35, 65, 65) +
        '</svg>'
    },
    {
      id: "ours", nom: "Un ours", fond: "#dff3f3",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        avecContour(
          // Les petites oreilles rondes
          '<circle cx="23" cy="27" r="11"/><circle cx="77" cy="27" r="11"/>' +
          // La grosse tête, avec des touffes de poils sur les côtés et en haut
          '<ellipse cx="50" cy="57" rx="35" ry="30"/>' +
          '<path d="M17 56 L6 62 L17 68 L9 74 L22 76 Z"/>' +
          '<path d="M83 56 L94 62 L83 68 L91 74 L78 76 Z"/>' +
          '<path d="M42 29 L47 21 L50 28 L54 20 L58 29 Z"/>',
          "#6b4127", "#3a2010") +
        '<circle cx="23" cy="27" r="5.5" fill="#a0663a"/><circle cx="77" cy="27" r="5.5" fill="#a0663a"/>' +
        // Le museau beige
        '<ellipse cx="50" cy="69" rx="17" ry="13" fill="#e8c79a"/>' +
        // La grosse truffe et la bouche
        '<ellipse cx="50" cy="63" rx="7" ry="5" fill="#2b1a10"/>' +
        '<ellipse cx="48" cy="61.5" rx="2.2" ry="1.3" fill="#fff" opacity="0.6"/>' +
        '<path d="M50 67 v4 M43 72 q7 6 14 0" stroke="#2b1a10" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
        // Les yeux (avec un rond clair autour pour bien les voir sur le poil foncé)
        '<circle cx="35" cy="50" r="6.5" fill="#8a5a38"/><circle cx="65" cy="50" r="6.5" fill="#8a5a38"/>' +
        oeil(35, 50, 4.5) + oeil(65, 50, 4.5) +
        joues(27, 73, 63) +
        '</svg>'
    },
    {
      id: "champignon", nom: "Un champignon", fond: "#e6f7d9",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // Des petites touffes d'herbe
        '<path d="M14 92 l3 -9 l3 6 l3 -8 l2 11 Z M76 92 l3 -10 l3 7 l3 -6 l2 9 Z" fill="#7fd27f" stroke="#43a24e" stroke-width="1.5" stroke-linejoin="round"/>' +
        // Le pied du champignon
        avecContour('<path d="M34 50 Q30 78 28 88 Q50 95 72 88 Q70 78 66 50 Z"/>', "#fff3dc", "#c9a46a") +
        // Le chapeau rouge
        avecContour('<path d="M8 52 Q8 10 50 10 Q92 10 92 52 Q50 62 8 52 Z"/>', "#e8443b", "#9e2a22") +
        // Les pois blancs
        '<circle cx="30" cy="30" r="6.5" fill="#fff"/><circle cx="52" cy="21" r="5" fill="#fff"/>' +
        '<circle cx="72" cy="32" r="7" fill="#fff"/><circle cx="19" cy="46" r="3.5" fill="#fff"/>' +
        '<circle cx="48" cy="42" r="4.5" fill="#fff"/><circle cx="83" cy="47" r="3.5" fill="#fff"/>' +
        // Le visage sur le pied
        oeil(42, 69, 4.2) + oeil(58, 69, 4.2) +
        sourire(50, 77, 9) +
        joues(36, 64, 77) +
        '</svg>'
    },
    {
      id: "coccinelle", nom: "Une coccinelle", fond: "#fff6c8",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // La grande feuille verte sur laquelle elle se promène
        '<path d="M8 92 Q4 44 36 22 Q64 4 94 6 Q96 36 80 62 Q60 94 8 92 Z" fill="#9ad46a" stroke="#4f9a3a" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<path d="M12 88 Q50 50 90 10" stroke="#c7ec9e" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        // Les deux antennes avec leur boule
        '<path d="M45 22 Q42 12 36 10 M55 22 Q58 12 64 10" stroke="#2b2b33" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
        '<circle cx="36" cy="10" r="3.2" fill="#2b2b33"/><circle cx="64" cy="10" r="3.2" fill="#2b2b33"/>' +
        // La tête noire
        '<circle cx="50" cy="31" r="14" fill="#2b2b33"/>' +
        // Le corps rouge
        avecContour('<circle cx="50" cy="60" r="26"/>', "#e8443b", "#9e2a22") +
        // La ligne au milieu et les points noirs
        '<path d="M50 35 V85" stroke="#9e2a22" stroke-width="2.5"/>' +
        '<circle cx="38" cy="48" r="5" fill="#2b2b33"/><circle cx="62" cy="48" r="5" fill="#2b2b33"/>' +
        '<circle cx="34" cy="64" r="4.5" fill="#2b2b33"/><circle cx="66" cy="64" r="4.5" fill="#2b2b33"/>' +
        '<circle cx="42" cy="77" r="4" fill="#2b2b33"/><circle cx="58" cy="77" r="4" fill="#2b2b33"/>' +
        // Le petit reflet de lumière sur le dos
        '<ellipse cx="36" cy="56" rx="3" ry="6" fill="#fff" opacity="0.35" transform="rotate(30 36 56)"/>' +
        // Les yeux blancs sur la tête noire
        oeilPoisson(44, 26, 3.6) + oeilPoisson(56, 26, 3.6) +
        '</svg>'
    }
  ];

  // La feuille d'arbre dessinée au dos de chaque carte
  const DESSIN_DOS =
    '<svg viewBox="0 0 100 100" opacity="0.9">' +
    // La queue de la feuille
    '<path d="M50 80 V96" stroke="#fff" stroke-width="6" stroke-linecap="round"/>' +
    // La feuille
    '<path d="M50 4 Q86 24 80 56 Q74 80 50 86 Q26 80 20 56 Q14 24 50 4 Z" fill="#fff"/>' +
    // Les nervures (de la couleur du dos)
    '<path d="M50 18 V80 M50 36 L37 26 M50 36 L63 26 M50 52 L32 40 M50 52 L68 40 M50 68 L34 58 M50 68 L66 58" stroke="#5f8a58" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
    '</svg>';

  ajouterMonde({
    id: "foret",
    nom: "La Forêt",                        // le nom sur la tuile de l'accueil
    sousTitre: "Renard, hibou, hérisson…",
    titre: [["Memory", "#d0602a"], ["de la", "#8a5a3a"], ["Forêt", "#3f6b45"]],   // le titre du jeu, mot par mot, avec sa couleur
    couleurs: {
      accent: "#d0602a",          // orange-roux du renard
      accentClair: "#fbe0c8",
      principal: "#4f7d4a",       // vert sapin
      texte: "#2e4a2c",           // vert sapin foncé
      fond: "linear-gradient(180deg, #f4f7ea 0%, #dde8cc 55%, #b7cc9e 100%)",   // mousse et sauge
      dos: "linear-gradient(135deg, #86a877, #3f6b45)",
      bouton: "linear-gradient(135deg, #ec8c3e, #c9542a)",
      ombre: "60, 90, 55",
      voile: "rgba(46, 74, 44, 0.45)",
      barre: "#dde8cc"
    },
    cartes: CARTES,
    dos: DESSIN_DOS,
    mascotte: "hibou",                // le personnage qui saute quand on gagne
    titreVictoire: "Hou hou ! Bravo !",
    decor: ["🍂", "🍁", "🌰", "🍄"],          // ce qui flotte derrière le jeu
    confettis: ["🦊", "🦉", "🍁", "⭐", "🍄"],
    melodie: "promenons",                  // la comptine (voir musique.js)
    sons: "clochette",                       // le type de bruitages (voir sons.js)
    secousse: false,                         // les cartes tremblent à la victoire ?
    ancienneCleRecord: ""                    // pas de vieux record à reprendre
  });
})();
