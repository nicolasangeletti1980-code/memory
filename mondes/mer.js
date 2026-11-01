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
      id: "hippocampe", nom: "Un hippocampe", fond: "#d6f3ef",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // La queue enroulée (un gros trait foncé, puis un trait clair dessus)
        '<path d="M44 64 Q38 86 53 89 Q65 90 64 80 Q63 72 55 75" stroke="#c9741a" stroke-width="14" fill="none" stroke-linecap="round"/>' +
        '<path d="M44 64 Q38 86 53 89 Q65 90 64 80 Q63 72 55 75" stroke="#ffb547" stroke-width="8.5" fill="none" stroke-linecap="round"/>' +
        // La nageoire du dos, avec ses petits rayons
        '<path d="M33 38 Q10 50 29 66 Z" fill="#ffe08a" stroke="#c9741a" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<path d="M31 44 l-9 4 M30 51 l-10 3 M30 58 l-7 2" stroke="#f0b040" stroke-width="1.8" stroke-linecap="round"/>' +
        // Le corps, la tête, le long museau et la petite couronne
        avecContour(
          '<ellipse cx="45" cy="50" rx="15" ry="20" transform="rotate(-12 45 50)"/>' +
          '<ellipse cx="52" cy="25" rx="14" ry="12"/>' +
          '<ellipse cx="70" cy="30" rx="11" ry="5" transform="rotate(14 70 30)"/>' +
          '<path d="M43 16 L45 6 L50 13 L54 5 L58 15 Z"/>',
          "#ffb547", "#c9741a") +
        // Le ventre clair avec ses rayures
        '<ellipse cx="51" cy="53" rx="7.5" ry="13" fill="#ffe08a" transform="rotate(-12 51 53)"/>' +
        '<path d="M46 45 h10 M45 51 h11 M45 57 h10 M45 63 h8" stroke="#e8a443" stroke-width="1.8" stroke-linecap="round"/>' +
        oeil(55, 22, 4.3) +
        // Le petit sourire au bout du museau
        '<path d="M74 33 q3 1.5 5 -1" stroke="#1d2b3a" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
        joue(53, 31) +
        '</svg>'
    },
    {
      id: "clown", nom: "Un poisson clown", fond: "#dcedff",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // La queue et les nageoires (orange bordé de noir)
        avecContour(
          '<path d="M24 52 L7 36 Q12 52 7 68 Z"/>' +
          '<path d="M34 36 Q48 18 64 34 Z"/>' +
          '<path d="M40 68 Q48 84 58 68 Z"/>' +
          // Le corps
          '<ellipse cx="50" cy="52" rx="32" ry="21"/>',
          "#ff7a1a", "#2b2b2b") +
        // Les trois bandes blanches (bordées de noir)
        '<path d="M64 33 Q70 52 64 71 Q58 52 64 33 Z" fill="#fff" stroke="#2b2b2b" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<path d="M44 31.5 Q52 52 44 72.5 Q36 52 44 31.5 Z" fill="#fff" stroke="#2b2b2b" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<path d="M24 41 Q28 52 24 63 Q20 52 24 41 Z" fill="#fff" stroke="#2b2b2b" stroke-width="2.5" stroke-linejoin="round"/>' +
        // Le bord noir des nageoires
        '<path d="M38 33 Q48 22 60 32 M44 74 Q48 80 54 74" stroke="#2b2b2b" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
        oeil(73, 46, 5) +
        sourire(76, 58, 8) +
        joue(71, 56) +
        '</svg>'
    },
    {
      id: "etoile", nom: "Une étoile de mer", fond: "#fff4c4",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // Une étoile à 5 branches aux bouts arrondis
        // (dessinée 2 fois : le contour foncé, puis le rose par-dessus)
        '<polygon points="50,13 61.5,38.5 89,41.5 68.5,60 74,87 50,73 26,87 31.5,60 11,41.5 38.5,38.5" ' +
        'fill="#e5647d" stroke="#c94461" stroke-width="12" stroke-linejoin="round"/>' +
        '<polygon points="50,13 61.5,38.5 89,41.5 68.5,60 74,87 50,73 26,87 31.5,60 11,41.5 38.5,38.5" ' +
        'fill="#ff8fa3" stroke="#ff8fa3" stroke-width="6" stroke-linejoin="round"/>' +
        // Les petits points sur l'étoile
        '<circle cx="50" cy="26" r="2.2" fill="#ffd0da"/><circle cx="77" cy="44" r="2.2" fill="#ffd0da"/>' +
        '<circle cx="68" cy="77" r="2.2" fill="#ffd0da"/><circle cx="32" cy="77" r="2.2" fill="#ffd0da"/>' +
        '<circle cx="23" cy="44" r="2.2" fill="#ffd0da"/>' +
        oeil(43, 51, 4.2) + oeil(57, 51, 4.2) +
        sourire(50, 60, 10) +
        joues(37, 63, 59) +
        '</svg>'
    },
    {
      id: "saint-jacques", nom: "Une coquille Saint-Jacques", fond: "#e8e2ff",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        avecContour(
          // Les deux petites "oreilles" en bas de la coquille
          '<path d="M36 76 L25 90 L50 87 L75 90 L64 76 Z"/>' +
          // L'éventail de la coquille
          '<path d="M50 84 L12 44 Q14 13 50 9 Q86 13 88 44 Z"/>',
          "#ffd27a", "#c98a1f") +
        // Les rayures qui partent du bas
        '<path d="M50 84 L20 30 M50 84 L33 16 M50 84 L50 11 M50 84 L67 16 M50 84 L80 30" stroke="#e3a33a" stroke-width="2.5" stroke-linecap="round"/>' +
        // Le visage, sur un petit nuage clair pour bien le voir
        '<ellipse cx="50" cy="48" rx="17" ry="12" fill="#ffe7b0"/>' +
        oeil(43, 45, 4.2) + oeil(57, 45, 4.2) +
        sourire(50, 53, 8) +
        joues(37, 63, 52) +
        // Une petite perle rose posée à côté
        '<circle cx="84" cy="80" r="7" fill="#ffd6ec" stroke="#e070a8" stroke-width="2"/>' +
        '<circle cx="82" cy="78" r="2" fill="#fff"/>' +
        '</svg>'
    },
    {
      id: "chirurgien", nom: "Dory, le poisson bleu", fond: "#ffe5d0",
      dessin:
        // Un poisson chirurgien bleu un peu étourdi, comme Dory :
        // corps ovale et allongé, grande tache noire en forme de palette,
        // queue jaune, très grands yeux mauves et grand sourire.
        '<svg viewBox="0 0 100 100">' +
        // La queue jaune
        avecContour('<path d="M20 52 L4 34 Q11 52 4 70 Z"/>', "#ffd23f", "#13235a") +
        // La nageoire du dos
        avecContour('<path d="M26 36 Q46 22 70 32 L66 38 L28 42 Z"/>', "#2860e0", "#13235a") +
        // Le corps bleu, ovale et allongé
        avecContour('<ellipse cx="50" cy="53" rx="34" ry="21"/>', "#3a7bff", "#13235a") +
        // La grande tache noire en forme de palette (avec son trou bleu)
        '<path d="M60 38 Q44 32 29 39 Q20 45 24 53 Q28 59 23 66 Q35 67 37 58 Q39 50 50 48 Q57 46 61 44 Z" fill="#0b1026"/>' +
        '<ellipse cx="35" cy="46" rx="5" ry="3.2" fill="#3a7bff"/>' +
        // La petite nageoire de côté, avec sa bande jaune
        '<path d="M52 64 Q56 76 66 72 Q62 66 58 62 Z" fill="#2860e0" stroke="#13235a" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M57 70 Q61 73 65 71.5" stroke="#ffd23f" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
        // Les deux très grands yeux ronds aux iris mauves
        '<circle cx="66" cy="44" r="9.5" fill="#fff" stroke="#13235a" stroke-width="2"/>' +
        '<circle cx="82" cy="46" r="7.5" fill="#fff" stroke="#13235a" stroke-width="2"/>' +
        '<circle cx="67.5" cy="45" r="6" fill="#9b6bd6"/><circle cx="83" cy="47" r="4.8" fill="#9b6bd6"/>' +
        oeil(68, 45.5, 3.5) + oeil(83.3, 47.3, 2.8) +
        // Le grand sourire joyeux, bouche ouverte
        '<path d="M70 58 Q79 71 88 57 Q79 61 70 58 Z" fill="#7a1f3a" stroke="#13235a" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<path d="M75 63.5 Q79 61.5 83 63 Q79 66.5 75 63.5 Z" fill="#ff7fa0"/>' +
        joue(64, 60) +
        '</svg>'
    },
    {
      id: "sirene", nom: "Une sirène", fond: "#ffe0ee",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // Les longs cheveux roux (derrière la tête et le dos)
        avecContour('<path d="M29 32 Q26 7 50 7 Q74 7 71 32 Q76 50 69 62 Q62 56 61 46 L39 46 Q38 56 31 62 Q24 50 29 32 Z"/>', "#ff5a3c", "#b8361e") +
        // La nageoire au bout de la queue
        avecContour('<path d="M54 84 Q64 72 82 78 Q74 84 74 95 Q64 88 54 88 Z"/>', "#2ec4b6", "#13897f") +
        // La queue de poisson turquoise
        avecContour('<path d="M39 56 L61 56 Q66 74 60 84 Q55 90 50 88 Q42 76 39 56 Z"/>', "#2ec4b6", "#13897f") +
        // Les écailles
        '<path d="M45 64 q3 3 6 0 q3 3 6 0 M47 72 q3 3 6 0 M50 80 q2.5 2.5 5 0" stroke="#13897f" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
        // Les bras et le buste
        '<path d="M42 48 Q33 52 35 60 M58 48 Q67 52 65 60" stroke="#e8a888" stroke-width="7" fill="none" stroke-linecap="round"/>' +
        '<path d="M42 48 Q33 52 35 60 M58 48 Q67 52 65 60" stroke="#ffd9c2" stroke-width="3.8" fill="none" stroke-linecap="round"/>' +
        avecContour('<ellipse cx="50" cy="50" rx="10" ry="9"/>', "#ffd9c2", "#e8a888") +
        // Le haut rose (un bandeau tout simple)
        '<path d="M40.5 49 Q50 53 59.5 49 L59 55 Q50 58 41 55 Z" fill="#ff8fc7" stroke="#d6559a" stroke-width="1.8" stroke-linejoin="round"/>' +
        // La tête
        avecContour('<circle cx="50" cy="28" r="14"/>', "#ffd9c2", "#e8a888") +
        // La frange rousse
        '<path d="M36 26 Q37 12 51 13 Q64 13 64 26 Q58 18 50 21 Q44 18 36 26 Z" fill="#ff5a3c"/>' +
        // Une étoile de mer jaune dans les cheveux
        '<polygon points="66,14 67.6,18.2 72,18.4 68.6,21.2 69.8,25.4 66,23 62.2,25.4 63.4,21.2 60,18.4 64.4,18.2" fill="#ffd23f" stroke="#d99a00" stroke-width="1.5" stroke-linejoin="round"/>' +
        oeil(44.5, 29, 3.4) + oeil(55.5, 29, 3.4) +
        sourire(50, 35, 7) +
        joues(40, 60, 34) +
        '</svg>'
    },
    {
      id: "jaune", nom: "Polochon, le poisson jaune", fond: "#def5d6",
      dessin:
        // Un poisson tropical jaune tout rond, comme Polochon :
        // corps dodu comme un ballon, larges bandes bleues,
        // nageoires bleues, grosses lèvres et petit air inquiet.
        // (Il regarde à gauche, pour ne pas ressembler à Dory.)
        '<svg viewBox="0 0 100 100">' +
        // La queue bleue (à droite) et la grande nageoire du dos
        avecContour('<path d="M78 54 L96 38 Q90 54 96 70 Z"/>', "#2f7fe0", "#164a9a") +
        avecContour('<path d="M30 32 Q40 4 70 20 Q66 28 64 32 Z"/>', "#2f7fe0", "#164a9a") +
        // Le corps tout rond
        avecContour('<circle cx="50" cy="56" r="31"/>', "#ffd93b", "#d99a00") +
        // Les larges bandes bleues qui suivent la forme ronde
        '<path d="M57 26 Q53 56 57 86 L67 81.5 Q63 56 67 30.5 Z" fill="#1f5fd6"/>' +
        '<path d="M73 35.5 Q70 56 73 76.5 L78 69 Q76 56 78 43 Z" fill="#1f5fd6"/>' +
        // La petite nageoire de côté, bleue
        '<path d="M50 68 Q56 82 64 74 Q60 70 56 64 Z" fill="#2f7fe0" stroke="#164a9a" stroke-width="2" stroke-linejoin="round"/>' +
        // Les grands yeux avec des sourcils un peu inquiets
        '<circle cx="31" cy="46" r="8" fill="#fff" stroke="#164a9a" stroke-width="2"/>' +
        '<circle cx="46" cy="44" r="8" fill="#fff" stroke="#164a9a" stroke-width="2"/>' +
        oeil(30, 47, 4.5) + oeil(45, 45, 4.5) +
        '<path d="M24 36 Q29 33 34 36 M42 34 Q47 32 52 34" stroke="#164a9a" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
        // La grande bouche aux lèvres épaisses
        '<ellipse cx="27" cy="63" rx="8" ry="6.5" fill="#ff9a3c" stroke="#c9601a" stroke-width="2"/>' +
        '<path d="M21 63 Q27 60.5 33 63 Q27 65.5 21 63 Z" fill="#7a1f3a"/>' +
        joue(40, 58) +
        '</svg>'
    },
    {
      id: "trident", nom: "Le trident de Poséidon", fond: "#f3ddf3",
      dessin:
        '<svg viewBox="0 0 100 100">' +
        // Le trident est dessiné 2 fois : en foncé (contour) puis en doré
        '<g stroke="#b07a08" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" fill="none">' +
        '<path d="M30 22 L30 36 Q30 48 50 48 Q70 48 70 36 L70 22 M50 14 L50 90"/></g>' +
        '<g stroke="#ffc83d" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" fill="none">' +
        '<path d="M30 22 L30 36 Q30 48 50 48 Q70 48 70 36 L70 22 M50 14 L50 90"/></g>' +
        // Les trois pointes
        '<path d="M23 25 L30 7 L37 25 Z M43 17 L50 2 L57 17 Z M63 25 L70 7 L77 25 Z" fill="#ffc83d" stroke="#b07a08" stroke-width="2.5" stroke-linejoin="round"/>' +
        // Le petit reflet de lumière sur le manche
        '<path d="M48.5 58 v20" stroke="#fff3c0" stroke-width="2" stroke-linecap="round"/>' +
        // La pierre précieuse
        '<circle cx="50" cy="49" r="6" fill="#2ec4b6" stroke="#b07a08" stroke-width="2"/>' +
        '<circle cx="48.3" cy="47.3" r="1.8" fill="#fff"/>' +
        etincelle(18, 60, 6, "#2f8fe0") +
        etincelle(82, 66, 5, "#2ec4b6") +
        etincelle(80, 86, 4, "#ff8fc7") +
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
