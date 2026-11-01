// Univers « Le Zoo » : les animaux sauvages du zoo.
// Pour créer un nouvel univers, copier ce fichier et changer son contenu.

// Tout est rangé dans une fonction pour que les noms utilisés ici
// ne se mélangent pas avec ceux des autres univers.
(function () {
  // La liste des 8 cartes du jeu.
  // - id : un nom unique pour reconnaître les paires
  //        (c'est aussi le nom du fichier son : sons/zoo/<id>.wav)
  // - nom : ce qui est lu à voix haute par le téléphone (accessibilité)
  // - fond : la couleur pastel de la face de la carte
  // - dessin : l'image SVG (une boîte de 100 x 100)
  const CARTES = [
    {
      id: "lion", nom: "Un lion", fond: "#e2f0ff",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // La grosse crinière (des ronds tout autour de la tête)
        avecContour(
          '<circle cx="80" cy="52" r="12"/><circle cx="74" cy="70" r="12"/><circle cx="59" cy="81" r="12"/>' +
          '<circle cx="41" cy="81" r="12"/><circle cx="26" cy="70" r="12"/><circle cx="20" cy="52" r="12"/>' +
          '<circle cx="26" cy="34" r="12"/><circle cx="41" cy="23" r="12"/><circle cx="59" cy="23" r="12"/>' +
          '<circle cx="74" cy="34" r="12"/><circle cx="50" cy="52" r="32"/>',
          "#d9772b", "#9a4a14") +
        avecContour(
          // Les petites oreilles rondes, puis le visage
          '<circle cx="33" cy="35" r="7"/><circle cx="67" cy="35" r="7"/>' +
          '<circle cx="50" cy="55" r="24"/>',
          "#ffcf5c", "#c98a2a") +
        '<circle cx="33" cy="35" r="3.5" fill="#e8a24a"/><circle cx="67" cy="35" r="3.5" fill="#e8a24a"/>' +
        // Le museau tout clair
        '<ellipse cx="44" cy="66" rx="8" ry="6.5" fill="#fff3d6"/>' +
        '<ellipse cx="56" cy="66" rx="8" ry="6.5" fill="#fff3d6"/>' +
        // Le nez marron et la bouche
        '<path d="M45 59 h10 q0 5 -5 6 q-5 -1 -5 -6 Z" fill="#7a3a1a"/>' +
        '<path d="M50 65 v3 M44 70 q6 5 12 0" stroke="#7a3a1a" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
        oeil(41, 50, 4.2) + oeil(59, 50, 4.2) +
        joues(33, 67, 61) +
        '</svg>'
    },
    {
      id: "elephant", nom: "Un éléphant", fond: "#fff3d0",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // La trompe (trait foncé épais, puis trait clair par-dessus)
        '<path d="M50 56 Q50 80 60 84 Q68 86 70 78" stroke="#5d6c8f" stroke-width="16" fill="none" stroke-linecap="round"/>' +
        avecContour(
          // Les très grandes oreilles, puis la tête
          '<ellipse cx="22" cy="46" rx="17" ry="24"/>' +
          '<ellipse cx="78" cy="46" rx="17" ry="24"/>' +
          '<ellipse cx="50" cy="44" rx="24" ry="25"/>',
          "#9db4dc", "#5d6c8f") +
        '<path d="M50 56 Q50 80 60 84 Q68 86 70 78" stroke="#9db4dc" stroke-width="11" fill="none" stroke-linecap="round"/>' +
        // Les petits plis sur la trompe
        '<path d="M46 70 h7 M47 76 h7" stroke="#5d6c8f" stroke-width="1.6" stroke-linecap="round"/>' +
        // L'intérieur rose des oreilles
        '<ellipse cx="20" cy="47" rx="10" ry="16" fill="#ffc2d4"/>' +
        '<ellipse cx="80" cy="47" rx="10" ry="16" fill="#ffc2d4"/>' +
        // Les deux petites défenses blanches
        '<path d="M38 60 Q36 70 42 72 Q41 66 43 61 Z M62 60 Q64 70 58 72 Q59 66 57 61 Z" fill="#fff" stroke="#9a9ab0" stroke-width="1.5" stroke-linejoin="round"/>' +
        oeil(40, 40, 4.5) + oeil(60, 40, 4.5) +
        joues(35, 65, 51) +
        '</svg>'
    },
    {
      id: "girafe", nom: "Une girafe", fond: "#dff4ff",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // Les deux petites cornes (ossicônes) avec leur boule
        '<path d="M44 22 L42 8 M60 22 L62 8" stroke="#a8641a" stroke-width="6" stroke-linecap="round"/>' +
        '<path d="M44 22 L42 8 M60 22 L62 8" stroke="#ffcf4a" stroke-width="2.5" stroke-linecap="round"/>' +
        '<circle cx="42" cy="8" r="4.5" fill="#a8641a"/><circle cx="62" cy="8" r="4.5" fill="#a8641a"/>' +
        avecContour(
          // Le long cou, les oreilles, puis la tête
          '<path d="M38 92 Q42 64 44 40 L62 40 Q62 66 68 92 Z"/>' +
          '<ellipse cx="30" cy="26" rx="9" ry="4.5" transform="rotate(-20 30 26)"/>' +
          '<ellipse cx="74" cy="26" rx="9" ry="4.5" transform="rotate(20 74 26)"/>' +
          '<ellipse cx="52" cy="30" rx="17" ry="15"/>',
          "#ffcf4a", "#a8641a") +
        // La petite crinière marron le long du cou
        '<path d="M43 44 Q41 66 38 88" stroke="#c9782a" stroke-width="4" fill="none" stroke-linecap="round"/>' +
        // Les taches marron sur le cou
        '<path d="M48 50 l7 -2 l3 6 l-5 5 l-6 -3 Z M52 66 l8 -1 l2 7 l-6 4 l-5 -4 Z M44 78 l6 0 l2 6 l-6 4 l-4 -4 Z M58 82 l5 -1 l3 6 l-6 2 Z" fill="#c97a2a" stroke-linejoin="round"/>' +
        // Le museau clair et les narines
        '<ellipse cx="52" cy="38" rx="12" ry="7.5" fill="#ffe9b0"/>' +
        '<circle cx="48" cy="37" r="1.6" fill="#7a4a1a"/><circle cx="56" cy="37" r="1.6" fill="#7a4a1a"/>' +
        sourire(52, 41, 7) +
        oeil(45, 27, 3.8) + oeil(59, 27, 3.8) +
        joues(39, 65, 34) +
        '</svg>'
    },
    {
      id: "zebre", nom: "Un zèbre", fond: "#ffe3ec",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // La crinière noire toute droite en haut de la tête
        '<path d="M38 22 L40 6 L46 14 L50 4 L54 14 L60 6 L62 22 Z" fill="#2b2b33" stroke="#2b2b33" stroke-width="2" stroke-linejoin="round"/>' +
        avecContour(
          // Les oreilles, la tête, puis le museau
          '<path d="M32 30 L22 10 L42 22 Z"/>' +
          '<path d="M68 30 L78 10 L58 22 Z"/>' +
          '<ellipse cx="50" cy="44" rx="22" ry="24"/>' +
          '<ellipse cx="50" cy="72" rx="17" ry="15"/>' +
          '<path d="M30 46 L70 46 L66 66 L34 66 Z"/>',
          "#ffffff", "#2b2b33") +
        // Le bout des oreilles en noir
        '<path d="M22 10 L25 18 L30 14 Z M78 10 L75 18 L70 14 Z" fill="#2b2b33"/>' +
        // Les rayures noires
        // (en V sur le front, en biais sur les joues)
        '<path d="M42 24 L50 29 L58 24 M40 32 L50 38 L60 32" stroke="#2b2b33" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M29 38 Q34 38 35 33 M28 48 Q33 47 34 42 M31 58 Q37 57 38 52 M71 38 Q66 38 65 33 M72 48 Q67 47 66 42 M69 58 Q63 57 62 52" stroke="#2b2b33" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
        // Le museau gris foncé avec les narines
        '<ellipse cx="50" cy="75" rx="15" ry="11" fill="#5a5a68"/>' +
        '<ellipse cx="44" cy="74" rx="2.5" ry="3.3" fill="#2b2b33"/>' +
        '<ellipse cx="56" cy="74" rx="2.5" ry="3.3" fill="#2b2b33"/>' +
        '<path d="M44 80 q6 4 12 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        oeil(41, 47, 4.3) + oeil(59, 47, 4.3) +
        joues(37, 63, 57) +
        '</svg>'
    },
    {
      id: "singe", nom: "Un singe", fond: "#fff1d6",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        avecContour(
          // Les grandes oreilles rondes, puis la tête
          '<circle cx="16" cy="52" r="11"/><circle cx="84" cy="52" r="11"/>' +
          '<circle cx="50" cy="50" r="31"/>' +
          // La petite mèche de poils sur le dessus
          '<path d="M44 22 Q46 10 56 12 Q50 16 52 22 Z"/>',
          "#9a5a2e", "#5e3415") +
        // L'intérieur des oreilles
        '<circle cx="16" cy="52" r="6" fill="#f5d3a8"/><circle cx="84" cy="52" r="6" fill="#f5d3a8"/>' +
        // Le visage beige en forme de cœur
        '<circle cx="40" cy="45" r="13" fill="#f5d3a8"/>' +
        '<circle cx="60" cy="45" r="13" fill="#f5d3a8"/>' +
        '<ellipse cx="50" cy="64" rx="22" ry="16" fill="#f5d3a8"/>' +
        // Les narines et le grand sourire
        '<circle cx="47" cy="59" r="1.7" fill="#5e3415"/><circle cx="53" cy="59" r="1.7" fill="#5e3415"/>' +
        '<path d="M38 65 Q50 80 62 65 Z" fill="#b0233a"/>' +
        '<path d="M44 71 Q50 76 56 71 Q50 69 44 71 Z" fill="#ff7fa0"/>' +
        oeil(40, 45, 4.5) + oeil(60, 45, 4.5) +
        joues(31, 69, 59) +
        '</svg>'
    },
    {
      id: "panda", nom: "Un panda", fond: "#dcf5d4",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // Les oreilles noires
        '<circle cx="24" cy="26" r="12" fill="#2b2b33"/><circle cx="76" cy="26" r="12" fill="#2b2b33"/>' +
        // La tête blanche
        '<ellipse cx="50" cy="55" rx="36" ry="32" fill="#fff" stroke="#2b2b33" stroke-width="2.5"/>' +
        // Les taches noires autour des yeux
        '<ellipse cx="35" cy="51" rx="9" ry="12" fill="#2b2b33" transform="rotate(30 35 51)"/>' +
        '<ellipse cx="65" cy="51" rx="9" ry="12" fill="#2b2b33" transform="rotate(-30 65 51)"/>' +
        // Les yeux blancs dans les taches
        oeilPoisson(36, 50, 4.3) + oeilPoisson(64, 50, 4.3) +
        // Le petit nez noir et la bouche
        '<ellipse cx="50" cy="64" rx="5.5" ry="4" fill="#2b2b33"/>' +
        '<path d="M50 67 v3 M44 71 q6 5 12 0" stroke="#2b2b33" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
        joues(27, 73, 66) +
        // Une feuille de bambou verte
        '<path d="M70 92 Q74 76 92 72 Q90 88 70 92 Z" fill="#7fd27f" stroke="#43a24e" stroke-width="2" stroke-linejoin="round"/>' +
        '</svg>'
    },
    {
      id: "hippopotame", nom: "Un hippopotame", fond: "#e0f7ec",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        avecContour(
          // Les petites oreilles, les bosses des yeux, le haut de la tête
          '<ellipse cx="28" cy="20" rx="6" ry="5"/><ellipse cx="72" cy="20" rx="6" ry="5"/>' +
          '<circle cx="36" cy="30" r="10"/><circle cx="64" cy="30" r="10"/>' +
          '<ellipse cx="50" cy="40" rx="24" ry="18"/>' +
          // Le très gros museau
          '<ellipse cx="50" cy="66" rx="38" ry="23"/>',
          "#b99ad8", "#6a4f94") +
        '<ellipse cx="28" cy="20" rx="2.5" ry="2" fill="#ff9fc0"/><ellipse cx="72" cy="20" rx="2.5" ry="2" fill="#ff9fc0"/>' +
        // Le museau un peu plus clair
        '<ellipse cx="50" cy="68" rx="32" ry="18" fill="#d2bdea"/>' +
        // Les deux grosses narines
        '<ellipse cx="38" cy="58" rx="4.5" ry="3" fill="#6a4f94"/>' +
        '<ellipse cx="62" cy="58" rx="4.5" ry="3" fill="#6a4f94"/>' +
        // La grande bouche avec deux petites dents
        '<path d="M30 70 Q50 86 70 70" stroke="#6a4f94" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
        '<path d="M38 75 l2 5 l3 -3 Z M62 75 l-2 5 l-3 -3 Z" fill="#fff" stroke="#6a4f94" stroke-width="1.2" stroke-linejoin="round"/>' +
        oeil(36, 30, 4.5) + oeil(64, 30, 4.5) +
        joues(22, 78, 66) +
        '</svg>'
    },
    {
      id: "manchot", nom: "Un manchot", fond: "#d8ecff",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // Les pattes orange
        '<ellipse cx="40" cy="89" rx="9" ry="4.5" fill="#ff9a2e" stroke="#d9661a" stroke-width="2"/>' +
        '<ellipse cx="60" cy="89" rx="9" ry="4.5" fill="#ff9a2e" stroke="#d9661a" stroke-width="2"/>' +
        avecContour(
          // Les deux ailerons, puis le corps en forme d'œuf
          '<ellipse cx="22" cy="58" rx="7" ry="18" transform="rotate(20 22 58)"/>' +
          '<ellipse cx="78" cy="58" rx="7" ry="18" transform="rotate(-20 78 58)"/>' +
          '<ellipse cx="50" cy="52" rx="28" ry="36"/>',
          "#2d3a5e", "#1a2238") +
        // Le ventre et le visage blancs
        '<circle cx="41" cy="38" r="11" fill="#fff"/>' +
        '<circle cx="59" cy="38" r="11" fill="#fff"/>' +
        '<ellipse cx="50" cy="62" rx="20" ry="24" fill="#fff"/>' +
        // Le petit bec orange
        '<path d="M44 44 L56 44 L50 52 Z" fill="#ff9a2e" stroke="#d9661a" stroke-width="2" stroke-linejoin="round"/>' +
        oeil(41, 37, 4.5) + oeil(59, 37, 4.5) +
        joues(35, 65, 47) +
        '</svg>'
    }
  ];

  // L'empreinte de patte de félin (comme le lion) dessinée au dos de chaque carte
  const DESSIN_DOS =
    '<svg viewBox="0 0 100 100" fill="#fff" opacity="0.9">' +
    // Le gros coussinet
    '<path d="M50 50 C38 50 25 62 27 75 C29 87 42 85 50 82 C58 85 71 87 73 75 C75 62 62 50 50 50 Z"/>' +
    // Les quatre doigts
    '<ellipse cx="20" cy="44" rx="8" ry="10" transform="rotate(-25 20 44)"/>' +
    '<ellipse cx="38" cy="25" rx="8.5" ry="11" transform="rotate(-8 38 25)"/>' +
    '<ellipse cx="62" cy="25" rx="8.5" ry="11" transform="rotate(8 62 25)"/>' +
    '<ellipse cx="80" cy="44" rx="8" ry="10" transform="rotate(25 80 44)"/>' +
    '</svg>';

  ajouterMonde({
    id: "zoo",
    nom: "Le Zoo",                          // le nom sur la tuile de l'accueil
    sousTitre: "Lion, éléphant, girafe…",
    titre: [["Memory", "#e8701a"], ["du", "#2f8f6a"], ["Zoo", "#a8521a"]],   // le titre du jeu, mot par mot, avec sa couleur
    couleurs: {
      accent: "#ec7414",          // orange savane
      accentClair: "#ffe4c4",
      principal: "#a8521a",       // ocre
      texte: "#5c3a1c",           // brun
      fond: "linear-gradient(180deg, #fff4e6 0%, #ffdcb8 55%, #f6b27a 100%)",   // sable de la savane
      dos: "linear-gradient(135deg, #f7a040, #b25e1e)",
      bouton: "linear-gradient(135deg, #ffb347, #ec7414)",
      ombre: "170, 100, 40",
      voile: "rgba(92, 58, 28, 0.45)",
      barre: "#ffdcb8"
    },
    cartes: CARTES,
    dos: DESSIN_DOS,
    mascotte: "singe",                // le personnage qui saute quand on gagne
    titreVictoire: "Youpi ! Bravo !",
    decor: ["🍌", "🌴", "🐾", "☀️"],          // ce qui flotte derrière le jeu
    confettis: ["🐒", "🦁", "🍌", "⭐", "🐘"],
    melodie: "vousDiraiJe",                  // la comptine (voir musique.js)
    sons: "clochette",                       // le type de bruitages (voir sons.js)
    secousse: false,                         // les cartes tremblent à la victoire ?
    ancienneCleRecord: ""                    // pas de vieux record à reprendre
  });
})();
