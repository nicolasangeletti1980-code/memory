// Univers « La Mer » : poissons, sirène et trésors de l'océan.
// Pour créer un nouvel univers, copier ce fichier et changer son contenu.

// Tout est rangé dans une fonction pour que les noms utilisés ici
// ne se mélangent pas avec ceux des autres univers.
(function () {
  // La liste des 8 cartes du jeu.
  // - id : un nom unique pour reconnaître les paires
  // - nom : ce qui est lu à voix haute par le téléphone (accessibilité)
  // - fond : la couleur pastel de la face de la carte
  // - dessin : l'image SVG
  const CARTES = [
    {
      id: "hippocampe", nom: "Un hippocampe", fond: "#fff3d6",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // La queue enroulée (un gros trait foncé, puis un trait clair dessus)
        '<path d="M44 64 Q38 84 52 87 Q63 88 62 79 Q61 72 54 75" stroke="#e08a1e" stroke-width="13" fill="none" stroke-linecap="round"/>' +
        '<path d="M44 64 Q38 84 52 87 Q63 88 62 79 Q61 72 54 75" stroke="#ffb547" stroke-width="8" fill="none" stroke-linecap="round"/>' +
        // La nageoire du dos
        '<path d="M34 39 Q12 50 30 65 Z" fill="#ffe08a" stroke="#e08a1e" stroke-width="2" stroke-linejoin="round"/>' +
        // Le corps, la tête, le museau et la petite couronne
        avecContour(
          '<ellipse cx="45" cy="50" rx="14" ry="19" transform="rotate(-12 45 50)"/>' +
          '<ellipse cx="52" cy="25" rx="13" ry="11"/>' +
          '<ellipse cx="68" cy="29" rx="10" ry="4.5" transform="rotate(14 68 29)"/>' +
          '<path d="M44 16 L46 7 L50 14 L54 6 L57 15 Z"/>',
          "#ffb547", "#e08a1e") +
        // Le ventre clair avec ses rayures
        '<ellipse cx="51" cy="52" rx="7" ry="13" fill="#ffe08a" transform="rotate(-12 51 52)"/>' +
        '<path d="M46 44 h10 M45 50 h11 M45 56 h10 M45 62 h8" stroke="#e8a443" stroke-width="1.6" stroke-linecap="round"/>' +
        oeil(55, 22, 3.5) +
        '<ellipse cx="52" cy="31" rx="4" ry="2.5" fill="#ff8fa3" opacity="0.6"/>' +
        '</svg>'
    },
    {
      id: "clown", nom: "Un poisson clown", fond: "#ffe8dc",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // La queue et les nageoires (orange bordé de noir)
        '<path d="M22 52 L6 37 Q11 52 6 67 Z" fill="#ff7a1a" stroke="#2b2b2b" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M36 34 Q50 20 64 34 Z" fill="#ff7a1a" stroke="#2b2b2b" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M42 70 Q50 82 58 70 Z" fill="#ff7a1a" stroke="#2b2b2b" stroke-width="2" stroke-linejoin="round"/>' +
        // Le corps
        '<ellipse cx="48" cy="52" rx="30" ry="20" fill="#ff7a1a" stroke="#2b2b2b" stroke-width="2"/>' +
        // Les deux bandes blanches
        '<ellipse cx="38" cy="52" rx="5" ry="18.5" fill="#fff" stroke="#2b2b2b" stroke-width="2"/>' +
        '<ellipse cx="59" cy="52" rx="4.5" ry="17.5" fill="#fff" stroke="#2b2b2b" stroke-width="2"/>' +
        oeilPoisson(68, 47, 5.5) +
        sourire(73, 58, 7) +
        '</svg>'
    },
    {
      id: "etoile", nom: "Une étoile de mer", fond: "#ffe3ea",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // Une étoile à 5 branches aux bouts arrondis
        '<polygon points="50,18 60,40.3 84.2,42.9 66.2,59.3 71.2,83.1 50,71 28.8,83.1 33.8,59.3 15.8,42.9 40,40.3" ' +
        'fill="#ff8fa3" stroke="#e5647d" stroke-width="7" stroke-linejoin="round"/>' +
        // Les petits points sur l'étoile
        '<circle cx="50" cy="30" r="2" fill="#ffd0da"/><circle cx="74" cy="46" r="2" fill="#ffd0da"/>' +
        '<circle cx="66" cy="73" r="2" fill="#ffd0da"/><circle cx="34" cy="73" r="2" fill="#ffd0da"/>' +
        '<circle cx="26" cy="46" r="2" fill="#ffd0da"/>' +
        oeil(44, 52, 3.2) + oeil(56, 52, 3.2) +
        sourire(50, 60, 9) +
        '</svg>'
    },
    {
      id: "saint-jacques", nom: "Une coquille Saint-Jacques", fond: "#fff6dc",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // Les deux petites "oreilles" en bas de la coquille
        '<path d="M38 78 L28 90 L50 87 L72 90 L62 78 Z" fill="#ffc35a" stroke="#d98f1f" stroke-width="2.5" stroke-linejoin="round"/>' +
        // L'éventail de la coquille
        '<path d="M50 84 L14 44 Q16 16 50 12 Q84 16 86 44 Z" fill="#ffd27a" stroke="#d98f1f" stroke-width="2.5" stroke-linejoin="round"/>' +
        // Les rayures qui partent du bas
        '<path d="M50 84 L22 32 M50 84 L34 19 M50 84 L50 14 M50 84 L66 19 M50 84 L78 32" stroke="#e3a33a" stroke-width="2.5" stroke-linecap="round"/>' +
        // Une perle rose
        '<circle cx="50" cy="56" r="7" fill="#ffd6ec" stroke="#ff8fc7" stroke-width="2"/>' +
        '<circle cx="48" cy="54" r="2" fill="#fff"/>' +
        '</svg>'
    },
    {
      id: "chirurgien", nom: "Un poisson chirurgien bleu", fond: "#e0f0ff",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // La queue jaune
        '<path d="M22 52 L6 36 Q11 52 6 68 Z" fill="#ffd23f" stroke="#1d2b4a" stroke-width="2" stroke-linejoin="round"/>' +
        // Le corps bleu
        '<ellipse cx="50" cy="52" rx="30" ry="22" fill="#2f6fe0" stroke="#1d2b4a" stroke-width="2"/>' +
        // La grande tache foncée sur le dos
        '<path d="M27 46 Q46 30 70 40 Q60 46 52 44 Q44 58 31 60 Q38 51 27 46 Z" fill="#13235a"/>' +
        // La petite nageoire jaune
        '<path d="M56 58 Q64 70 70 60 Z" fill="#ffd23f" stroke="#1d2b4a" stroke-width="1.5" stroke-linejoin="round"/>' +
        oeilPoisson(70, 47, 6.5) +
        sourire(74, 60, 7) +
        '</svg>'
    },
    {
      id: "sirene", nom: "Une sirène", fond: "#f0e4ff",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // Les longs cheveux (derrière la tête)
        '<path d="M35 27 Q34 9 50 10 Q67 9 66 28 Q71 46 61 52 L39 52 Q29 45 35 27 Z" fill="#ff5a3c"/>' +
        // La queue de poisson et ses nageoires
        '<path d="M52 79 Q40 94 32 86 Q42 84 52 79 Z" fill="#2ec4b6" stroke="#1a9488" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M52 79 Q64 95 72 86 Q62 84 52 79 Z" fill="#2ec4b6" stroke="#1a9488" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M41 53 L59 53 Q62 70 54 80 L50 82 Q43 70 41 53 Z" fill="#2ec4b6" stroke="#1a9488" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M45 62 q5 3 10 0 M46 70 q4 3 8 0" stroke="#1a9488" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
        // Les bras et le buste
        '<path d="M43 44 Q34 50 36 58 M57 44 Q66 50 64 58" stroke="#ffd9c2" stroke-width="4" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="50" cy="46" rx="8" ry="9" fill="#ffd9c2"/>' +
        // Le haut en coquillages
        '<circle cx="46" cy="45" r="3.5" fill="#ff8fc7"/><circle cx="54" cy="45" r="3.5" fill="#ff8fc7"/>' +
        // La tête et la frange
        '<circle cx="50" cy="26" r="11" fill="#ffd9c2"/>' +
        '<path d="M39 25 Q42 13 52 14 Q62 15 61 24 Q55 18 47 21 Q43 23 39 25 Z" fill="#ff5a3c"/>' +
        oeil(46, 27, 2.2) + oeil(54, 27, 2.2) +
        sourire(50, 32, 6) +
        '<ellipse cx="43" cy="31" rx="2.5" ry="1.5" fill="#ff8fa3" opacity="0.7"/>' +
        '<ellipse cx="57" cy="31" rx="2.5" ry="1.5" fill="#ff8fa3" opacity="0.7"/>' +
        '</svg>'
    },
    {
      id: "jaune", nom: "Un poisson jaune à rayures bleues", fond: "#fff9d6",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // La queue et la nageoire du dos (bleues)
        '<path d="M24 52 L7 38 Q13 52 7 66 Z" fill="#2f8fe0" stroke="#1d5fa8" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M36 32 Q50 14 64 32 Z" fill="#2f8fe0" stroke="#1d5fa8" stroke-width="2" stroke-linejoin="round"/>' +
        // Le corps tout rond
        '<ellipse cx="50" cy="53" rx="28" ry="25" fill="#ffd23f" stroke="#e0a800" stroke-width="2"/>' +
        // Les rayures bleues
        '<path d="M40 32 Q45 44 40 56" stroke="#2f8fe0" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        '<path d="M54 30 Q59 42 54 54" stroke="#2f8fe0" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        oeilPoisson(66, 47, 6.5) +
        sourire(70, 61, 8) +
        '<ellipse cx="60" cy="58" rx="4" ry="2.5" fill="#ff8fa3" opacity="0.6"/>' +
        '</svg>'
    },
    {
      id: "trident", nom: "Le trident de Poséidon", fond: "#e3f6ff",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // Le trident est dessiné 2 fois : en foncé (contour) puis en doré
        '<g stroke="#c48a0a" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none">' +
        '<path d="M30 22 L30 36 Q30 48 50 48 Q70 48 70 36 L70 22 M50 14 L50 90"/></g>' +
        '<g stroke="#ffc83d" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none">' +
        '<path d="M30 22 L30 36 Q30 48 50 48 Q70 48 70 36 L70 22 M50 14 L50 90"/></g>' +
        // Les trois pointes
        '<path d="M24 25 L30 8 L36 25 Z M44 17 L50 2 L56 17 Z M64 25 L70 8 L76 25 Z" fill="#ffc83d" stroke="#c48a0a" stroke-width="2.5" stroke-linejoin="round"/>' +
        // La pierre précieuse
        '<circle cx="50" cy="49" r="5" fill="#2ec4b6" stroke="#c48a0a" stroke-width="2"/>' +
        '<circle cx="48.5" cy="47.5" r="1.5" fill="#fff"/>' +
        etincelle(18, 60, 6, "#2f8fe0") +
        etincelle(82, 66, 5, "#2ec4b6") +
        '</svg>'
    }
  ];

  // Les petites bulles blanches dessinées au dos de chaque carte
  const DESSIN_DOS =
    '<svg viewBox="0 0 100 100" fill="none" stroke="#fff" stroke-width="5" opacity="0.9">' +
    '<circle cx="42" cy="58" r="22"/><circle cx="72" cy="30" r="12"/><circle cx="76" cy="62" r="6"/>' +
    '</svg>';

  ajouterMonde({
    id: "mer",
    nom: "La Mer",                       // le nom sur la tuile de l'accueil
    sousTitre: "Poissons, sirène, trident…",
    titre: [["Memory", "#ff7f50"], ["de la", "#2ec4b6"], ["Mer", "#1e88c7"]],   // le titre du jeu, mot par mot, avec sa couleur
    couleurs: {
      accent: "#ff7f50",          // corail
      accentClair: "#ffe0d6",
      principal: "#1e88c7",       // bleu océan
      texte: "#0b3d63",           // bleu nuit
      fond: "linear-gradient(180deg, #d6f7ff 0%, #8fdcf7 55%, #4fb8e8 100%)",
      dos: "linear-gradient(135deg, #4fc3f7, #1e6fc7)",
      bouton: "linear-gradient(135deg, #2ec4b6, #1e88c7)",
      ombre: "30, 110, 180",
      voile: "rgba(11, 61, 99, 0.45)",
      barre: "#bdf0ff"
    },
    cartes: CARTES,
    dos: DESSIN_DOS,
    mascotte: "sirene",                 // le personnage qui saute quand on gagne
    titreVictoire: "Splash ! Bravo !",
    decor: ["bulle", "bulle", "bulle", "bulle", "🐠", "🐚"],   // ce qui flotte derrière le jeu
    confettis: ["🐚", "🐠", "💙", "⭐", "✨"],
    melodie: "vousDiraiJe",                   // la comptine (voir musique.js)
    sons: "bulles",                     // le type de bruitages (voir sons.js)
    secousse: false,                    // les cartes tremblent à la victoire ?
    ancienneCleRecord: "memory-mer-record"       // pour garder les records d'avant
  });
})();
