// ===================================================================
// musique.js : la petite musique de fond, façon boîte à musique.
// Ce fichier est partagé par toutes les pages du jeu.
//
// Les airs sont des comptines traditionnelles françaises,
// très anciennes, donc libres de droits.
// Aucun fichier son : le navigateur fabrique les notes lui-même.
// ===================================================================

// ===== 1. Les notes =====
// Chaque note a un numéro (do = 72). Plus le numéro est grand, plus c'est aigu.
// "_bas" = la même note, mais plus grave.
const NOTES = {
  sol_bas: 67, la_bas: 69, si_bas: 71,
  do: 72, re: 74, mi: 76, fa: 77, sol: 79, la: 81
};

// ===== 2. Les comptines =====
// On écrit chaque air comme une suite de notes.
// "mi:2" veut dire : la note mi, qui dure 2 temps (sinon 1 temps).
// "-:2" veut dire : un silence de 2 temps.
// tempo = nombre de temps par minute (plus c'est grand, plus c'est rapide).
const MELODIES = {
  // « Ah ! vous dirai-je, maman »
  vousDiraiJe: {
    tempo: 100,
    notes:
      "do do sol sol la la sol:2 fa fa mi mi re re do:2 " +
      "sol sol fa fa mi mi re:2 sol sol fa fa mi mi re:2 " +
      "do do sol sol la la sol:2 fa fa mi mi re re do:2 -:4"
  },
  // « Au clair de la lune »
  clairDeLune: {
    tempo: 100,
    notes:
      "do do do re mi:2 re:2 do mi re re do:4 " +
      "do do do re mi:2 re:2 do mi re re do:4 " +
      "re re re re la_bas:2 la_bas:2 re do si_bas la_bas sol_bas:4 " +
      "do do do re mi:2 re:2 do mi re re do:4 -:4"
  },
  // « Dans la ferme de Mathurin » (air traditionnel de « Old MacDonald had a farm »)
  // Notes relevées sur noobnotes.net (en sol), transposées ici en do.
  fermeMathurin: {
    tempo: 120,
    notes:
      "do do do sol_bas la_bas la_bas sol_bas:2 mi mi re re do:3 " +
      "sol_bas do do do sol_bas la_bas la_bas sol_bas:2 mi mi re re do:3 " +
      "sol_bas:0.5 sol_bas:0.5 do do do:2 sol_bas:0.5 sol_bas:0.5 do do do:2 " +
      "do:0.5 do:0.5 do do:0.5 do:0.5 do do:0.5 do:0.5 do:0.5 do:0.5 do do " +
      "do do do sol_bas la_bas la_bas sol_bas:2 mi mi re re do:4 -:4"
  },
  // « Il était un petit navire » (chanson traditionnelle, domaine public)
  // Notes relevées sur la partition de Wikipédia (en sol), transposées ici en do.
  petitNavire: {
    tempo: 96,
    notes:
      "mi:0.5 mi:0.5 mi:0.5 sol_bas mi fa:0.5 mi:0.5 mi re:0.5 re:0.5 re:0.5 re:0.5 sol_bas re " +
      "mi:0.5 re:0.5 re do:0.5 mi:0.5 mi:0.5 mi:0.5 mi mi mi:0.5 sol:0.5 fa:0.5 mi:0.5 " +
      "re:0.5 re:0.5 re:0.5 re:0.5 re re re:0.5 fa:0.5 mi:0.5 re:0.5 do:0.5 sol_bas:0.5 do:0.5 mi:0.5 sol:2 mi " +
      // le refrain « Ohé ! Ohé ! matelot... »
      "sol mi sol fa:0.75 mi:0.25 re:2 re:0.5 mi:0.5 fa:0.5 sol:0.5 la sol la sol mi:3 " +
      "mi sol mi sol fa:0.75 mi:0.25 re:2 re:0.5 mi:0.5 fa:0.5 sol:0.5 la sol la sol do:2 -:4"
  },
  // « Promenons-nous dans les bois » (comptine du XVIIe siècle, domaine public)
  // Notes relevées sur la partition de Wikipédia (en fa), transposées ici en do.
  promenons: {
    tempo: 110,
    notes:
      "mi:0.5 mi:0.5 do mi:0.5 mi:0.5 do mi:0.5 mi:0.5 do:0.5 sol_bas:0.5 mi:0.5 mi:0.5 do " +
      "do:0.5 do:0.5 do do re do:0.5 do:0.5 re sol do " +
      "do:0.5 do:0.5 do do re do:0.5 do:0.5 re sol do " +
      // « Loup, y es-tu ? Que fais-tu ? M'entends-tu ? »
      "sol:0.5 sol:0.5 sol sol:0.5 sol:0.5 sol sol:0.5 sol:0.5 sol -:4"
  },
  // « Frère Jacques »
  frereJacques: {
    tempo: 120,
    notes:
      "do re mi do do re mi do " +
      "mi fa sol:2 mi fa sol:2 " +
      "sol:0.5 la:0.5 sol:0.5 fa:0.5 mi do sol:0.5 la:0.5 sol:0.5 fa:0.5 mi do " +
      "do sol_bas do:2 do sol_bas do:2 -:4"
  }
};

// ===== 3. Les réglages =====
const CLE_MUSIQUE = "memory-musique";   // le choix est gardé dans le téléphone
const VOLUME_MUSIQUE = 0.05;            // très doux (1 = très fort)

let musiqueActive = true;               // la musique est-elle voulue ?
try {
  musiqueActive = localStorage.getItem(CLE_MUSIQUE) !== "non";
} catch (e) {
  // mémoire bloquée : on garde la musique activée
}

let audioMusique = null;   // le synthétiseur de la musique
let volumeGeneral = null;  // le bouton de volume de la musique
let minuteurMusique = null;
let musiqueEnMarche = false;
let melodieChoisie = null;

// ===== 4. Transformer le texte d'une comptine en liste de notes =====
function lireMelodie(texte) {
  return texte.trim().split(/\s+/).map(function (morceau) {
    const parties = morceau.split(":");
    const nom = parties[0];
    const temps = parties[1] ? parseFloat(parties[1]) : 1;
    return { numero: nom === "-" ? null : NOTES[nom], temps: temps };
  });
}

// ===== 5. Jouer une note de boîte à musique =====
// Une note "pure" + deux notes plus aiguës et plus discrètes,
// qui s'éteignent doucement : ça sonne comme une petite boîte à musique.
function noteBoiteAMusique(numero, debut, duree) {
  const frequence = 440 * Math.pow(2, (numero - 69) / 12);
  const fin = debut + Math.max(duree * 1.6, 0.9);
  [[1, 1], [2, 0.25], [3, 0.08]].forEach(function (couche) {
    const oscillateur = audioMusique.createOscillator();
    const gain = audioMusique.createGain();
    oscillateur.type = "sine";
    oscillateur.frequency.value = frequence * couche[0];
    gain.gain.setValueAtTime(0.0001, debut);
    gain.gain.exponentialRampToValueAtTime(couche[1], debut + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, fin);
    oscillateur.connect(gain);
    gain.connect(volumeGeneral);
    oscillateur.start(debut);
    oscillateur.stop(fin + 0.05);
  });
}

// ===== 6. Jouer la comptine en entier, puis recommencer =====
function jouerUnTour() {
  const unTemps = 60 / melodieChoisie.tempo;   // durée d'un temps en secondes
  const depart = audioMusique.currentTime + 0.1;
  let t = depart;
  lireMelodie(melodieChoisie.notes).forEach(function (note) {
    if (note.numero) {
      noteBoiteAMusique(note.numero, t, note.temps * unTemps);
    }
    t += note.temps * unTemps;
  });
  // Quand l'air est fini, on le rejoue
  minuteurMusique = setTimeout(function () {
    if (musiqueEnMarche) jouerUnTour();
  }, (t - depart) * 1000);
}

function demarrerMusique() {
  if (musiqueEnMarche || !melodieChoisie) return;
  if (audioMusique === null) {
    const Synthe = window.AudioContext || window.webkitAudioContext;
    if (!Synthe) return;   // navigateur trop ancien : pas de musique
    audioMusique = new Synthe();
  }
  if (audioMusique.state === "suspended") {
    audioMusique.resume();
  }
  // Un nouveau bouton de volume à chaque départ
  volumeGeneral = audioMusique.createGain();
  volumeGeneral.gain.value = VOLUME_MUSIQUE;
  volumeGeneral.connect(audioMusique.destination);
  musiqueEnMarche = true;
  jouerUnTour();
}

function arreterMusique() {
  musiqueEnMarche = false;
  clearTimeout(minuteurMusique);
  if (volumeGeneral) {
    // On baisse le volume en douceur pour ne pas couper sèchement
    const t = audioMusique.currentTime;
    volumeGeneral.gain.setValueAtTime(volumeGeneral.gain.value, t);
    volumeGeneral.gain.linearRampToValueAtTime(0, t + 0.3);
  }
}

// Baisser la musique pendant quelques secondes (pendant le son de victoire),
// puis la remonter doucement.
function baisserMusique(secondes) {
  if (!musiqueEnMarche || !volumeGeneral) return;
  const t = audioMusique.currentTime;
  const volume = volumeGeneral.gain;
  volume.cancelScheduledValues(t);
  volume.setValueAtTime(volume.value, t);
  volume.linearRampToValueAtTime(VOLUME_MUSIQUE * 0.3, t + 0.2);   // on baisse
  volume.setValueAtTime(VOLUME_MUSIQUE * 0.3, t + secondes);
  volume.linearRampToValueAtTime(VOLUME_MUSIQUE, t + secondes + 0.8); // on remonte
}

// ===== 7. Brancher la musique sur une page =====
// - melodie : une des comptines de la liste MELODIES
// - bouton : le bouton 🎵 qui coupe ou remet la musique
function initMusique(melodie, bouton) {
  melodieChoisie = melodie;

  function afficherBouton() {
    bouton.textContent = musiqueActive ? "🎵" : "🔇";
    bouton.setAttribute("aria-label", musiqueActive ? "Couper la musique" : "Remettre la musique");
    bouton.classList.toggle("eteint", !musiqueActive);
  }
  afficherBouton();

  // Couper ou remettre la musique : il faut un appui long (voir appui.js)
  appuiLong(bouton, function () {
    musiqueActive = !musiqueActive;
    try {
      localStorage.setItem(CLE_MUSIQUE, musiqueActive ? "oui" : "non");
    } catch (e) {}
    afficherBouton();
    if (musiqueActive) {
      demarrerMusique();
    } else {
      arreterMusique();
    }
  });

  // Les navigateurs interdisent la musique avant qu'on ait touché l'écran :
  // elle démarre donc au premier toucher, n'importe où sur la page.
  function premierToucher() {
    if (!musiqueActive) return;
    // Si le 1er toucher était un glissement du doigt, le navigateur a laissé
    // le synthétiseur en pause. On jette les notes prévues et on relance.
    if (musiqueEnMarche && audioMusique.state === "suspended") {
      arreterMusique();
      volumeGeneral.disconnect();
    }
    demarrerMusique();
  }
  document.addEventListener("click", premierToucher);
  document.addEventListener("touchend", premierToucher);

  // Si on quitte l'appli (autre appli, écran éteint), la musique s'arrête,
  // puis elle reprend du début quand on revient.
  let reprendre = false;
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      reprendre = musiqueEnMarche;
      arreterMusique();
    } else if (reprendre && musiqueActive) {
      reprendre = false;
      demarrerMusique();
    }
  });
}
