// ===================================================================
// sons.js : les bruitages du jeu (paire trouvée, victoire).
// Partagé par tous les univers.
//
// Chaque paire a son propre son, dans un fichier .wav :
//   sons/<univers>/<carte>.wav    (exemple : sons/ferme/vache.wav)
//   sons/<univers>/victoire.wav   (le son de la fin de partie)
//
// Si un fichier ne peut pas être joué (très vieux téléphone par exemple),
// le navigateur fabrique un son de secours, selon le type choisi par l'univers :
//   "clochette"   : clochette de fée
//   "bulles"      : bulles
//   "rugissement" : cris de dinosaures
// ===================================================================

const CLE_SON = "memory-son";   // bruitages activés ou non (gardé dans le téléphone)

let sonActif = true;
try {
  sonActif = localStorage.getItem(CLE_SON) !== "non";
} catch (e) {}

let audio = null;   // le synthétiseur des bruitages

// Le synthétiseur ne peut démarrer qu'après un toucher de l'écran :
// on le prépare donc au premier toucher de carte.
function preparerAudio() {
  if (audio === null) {
    const Synthe = window.AudioContext || window.webkitAudioContext;
    if (!Synthe) {
      return null;   // navigateur trop ancien : on joue sans son
    }
    audio = new Synthe();
  }
  if (audio.state === "suspended") {
    audio.resume();
  }
  return audio;
}

// ===================================================================
// 1. La clochette de fée
// ===================================================================

// Une note de clochette : une note principale + des notes plus aiguës et
// plus discrètes, comme une vraie cloche.
function note(frequence, debut, duree, volume) {
  const t = audio.currentTime + debut;
  [[1, volume], [2.76, volume * 0.3], [5.4, volume * 0.12]].forEach(function (couche) {
    const oscillateur = audio.createOscillator();  // fabrique le son
    const gain = audio.createGain();               // règle le volume
    oscillateur.type = "sine";
    oscillateur.frequency.value = frequence * couche[0];
    // Le son monte très vite puis s'éteint doucement
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(couche[1], t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duree);
    oscillateur.connect(gain);
    gain.connect(audio.destination);               // vers le haut-parleur
    oscillateur.start(t);
    oscillateur.stop(t + duree + 0.05);
  });
}

function clochettePaire() {
  [1318.5, 1568, 2093].forEach(function (f, i) { note(f, i * 0.07, 0.9, 0.15); });
}

function clochetteVictoire() {
  [1046.5, 1318.5, 1568, 2093, 2637, 3136].forEach(function (f, i) { note(f, i * 0.11, 1.2, 0.13); });
  [2093, 2637, 3136].forEach(function (f) { note(f, 0.8, 2, 0.08); });
}

// ===================================================================
// 2. Les bulles
// ===================================================================

// Une bulle : un son qui monte très vite puis s'éteint ("bloup")
function bulle(frequence, debut, volume) {
  const t = audio.currentTime + debut;
  const oscillateur = audio.createOscillator();
  const gain = audio.createGain();
  oscillateur.type = "sine";
  oscillateur.frequency.setValueAtTime(frequence, t);
  oscillateur.frequency.exponentialRampToValueAtTime(frequence * 2.6, t + 0.1);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
  oscillateur.connect(gain);
  gain.connect(audio.destination);
  oscillateur.start(t);
  oscillateur.stop(t + 0.2);
}

function bullesPaire() {
  [380, 500, 650].forEach(function (f, i) { bulle(f, i * 0.09, 0.35); });
}

function bullesVictoire() {
  [300, 420, 360, 520, 460, 640, 580, 780, 700, 900].forEach(function (f, i) { bulle(f, i * 0.08, 0.3); });
  bulle(1100, 1, 0.35);
}

// ===================================================================
// 3. Les rugissements de dinosaures
// ===================================================================

// Un "souffle" (du bruit, comme "chhhh") fabriqué une seule fois
let souffle = null;
function fabriquerSouffle() {
  if (souffle === null) {
    souffle = audio.createBuffer(1, audio.sampleRate, audio.sampleRate);
    const donnees = souffle.getChannelData(0);
    for (let i = 0; i < donnees.length; i++) {
      donnees[i] = Math.random() * 2 - 1;   // des valeurs au hasard = du bruit
    }
  }
  return souffle;
}

// Une "saturation" qui rend le son plus rauque, plus sauvage
function fabriquerSaturation() {
  const saturation = audio.createWaveShaper();
  const courbe = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    courbe[i] = Math.tanh((i / 128 - 1) * 4);
  }
  saturation.curve = courbe;
  return saturation;
}

// Un rugissement : debut et duree en secondes,
// hauteur grave (petit nombre) ou aiguë (grand nombre), volume de 0 à 1
function rugissement(debut, duree, hauteur, volume) {
  const t = audio.currentTime + debut;

  // 1) La voix : une note rauque qui monte un peu puis redescend
  const voix = audio.createOscillator();
  voix.type = "sawtooth";
  voix.frequency.setValueAtTime(hauteur * 0.8, t);
  voix.frequency.exponentialRampToValueAtTime(hauteur * 1.3, t + duree * 0.25);
  voix.frequency.exponentialRampToValueAtTime(hauteur * 0.6, t + duree);

  // 2) Le souffle de la gorge
  const bruit = audio.createBufferSource();
  bruit.buffer = fabriquerSouffle();
  bruit.loop = true;
  const volumeBruit = audio.createGain();
  volumeBruit.gain.value = 0.5;

  // 3) Un filtre qui garde surtout les sons graves (= gros animal)
  const filtre = audio.createBiquadFilter();
  filtre.type = "lowpass";
  filtre.frequency.value = hauteur * 6;
  filtre.Q.value = 3;

  // 4) Le volume qui tremble très vite : c'est le "grrrr"
  const grr = audio.createOscillator();
  grr.frequency.value = 30;
  const forceGrr = audio.createGain();
  forceGrr.gain.value = 0.4;
  const tremblement = audio.createGain();
  tremblement.gain.value = 0.6;
  grr.connect(forceGrr);
  forceGrr.connect(tremblement.gain);

  // 5) Le volume général : monte vite, tient, puis s'éteint
  const enveloppe = audio.createGain();
  enveloppe.gain.setValueAtTime(0.0001, t);
  enveloppe.gain.exponentialRampToValueAtTime(volume, t + 0.06);
  enveloppe.gain.setValueAtTime(volume, t + duree * 0.6);
  enveloppe.gain.exponentialRampToValueAtTime(0.0001, t + duree);

  // On branche tout : voix + souffle -> filtre -> saturation -> grrr -> volume -> haut-parleur
  const saturation = fabriquerSaturation();
  voix.connect(filtre);
  bruit.connect(volumeBruit);
  volumeBruit.connect(filtre);
  filtre.connect(saturation);
  saturation.connect(tremblement);
  tremblement.connect(enveloppe);
  enveloppe.connect(audio.destination);

  [voix, bruit, grr].forEach(function (source) {
    source.start(t);
    source.stop(t + duree + 0.1);
  });
}

function rugissementPaire(carte) {
  const cri = carte.cri || { hauteur: 120, duree: 0.6 };
  rugissement(0, cri.duree, cri.hauteur, 0.25);
}

// Le GRAND rugissement du T-rex : un grave et un plus aigu mélangés
function rugissementVictoire() {
  rugissement(0, 1.9, 90, 0.35);
  rugissement(0.05, 1.7, 150, 0.2);
}

// ===================================================================
// 4. Les fichiers .wav (un par paire, plus un pour la victoire)
// ===================================================================
const lecteurs = {};

// Le chemin du fichier son d'une carte (ou de la victoire)
function fichierSon(monde, nom) {
  return "sons/" + monde.id + "/" + nom + ".wav";
}

// On charge les fichiers à l'avance pour qu'ils partent tout de suite
function prechargerSons(monde) {
  const noms = monde.cartes.map(function (c) { return c.id; });
  noms.push("victoire");
  noms.forEach(function (nom) {
    const fichier = fichierSon(monde, nom);
    if (!lecteurs[fichier]) {
      const lecteur = new Audio(fichier);
      lecteur.preload = "auto";
      lecteurs[fichier] = lecteur;
    }
  });
}

// Joue un fichier ; en cas de problème, joue le son de secours.
// Si le fichier ne démarre pas au bout de 1,5 seconde (réseau bloqué...),
// on joue aussi le son de secours, pour ne jamais rester dans le silence.
function jouerFichier(fichier, sonDeSecours) {
  const lecteur = lecteurs[fichier];
  let regle = false;   // devient vrai dès que l'on sait quel son est joué
  function secours() {
    if (regle) return;
    regle = true;
    lecteur.pause();
    sonDeSecours();
  }
  if (!lecteur || lecteur.error) {
    sonDeSecours();
    return;
  }
  lecteur.addEventListener("playing", function () { regle = true; }, { once: true });
  setTimeout(secours, 1500);
  lecteur.currentTime = 0;
  const lecture = lecteur.play();
  if (lecture && lecture.catch) {
    lecture.catch(secours);   // en cas d'échec : le son de secours
  }
}

// Le son de secours, fabriqué par le navigateur (s'il en est capable)
function secoursPaire(monde, carte) {
  if (!preparerAudio()) return;
  if (monde.sons === "bulles") bullesPaire();
  else if (monde.sons === "rugissement") rugissementPaire(carte);
  else clochettePaire();
}

function secoursVictoire(monde) {
  if (!preparerAudio()) return;
  if (monde.sons === "bulles") bullesVictoire();
  else if (monde.sons === "rugissement") rugissementVictoire();
  else clochetteVictoire();
}

// ===================================================================
// 5. Ce que le jeu appelle
// ===================================================================

// Paire trouvée : le son de la carte
function sonPaire(monde, carte) {
  if (!sonActif) return;
  preparerAudio();
  jouerFichier(fichierSon(monde, carte.id), function () { secoursPaire(monde, carte); });
}

// Victoire
function sonVictoire(monde) {
  if (!sonActif) return;
  preparerAudio();
  jouerFichier(fichierSon(monde, "victoire"), function () { secoursVictoire(monde); });
}

// Le bouton 🔔 : couper ou remettre les bruitages
function brancherBoutonSon(bouton) {
  function afficher() {
    bouton.textContent = sonActif ? "🔔" : "🔕";
    bouton.setAttribute("aria-label", sonActif ? "Couper les bruitages" : "Remettre les bruitages");
    bouton.classList.toggle("eteint", !sonActif);
  }
  afficher();
  // Couper ou remettre les bruitages : il faut un appui long (voir appui.js)
  appuiLong(bouton, function () {
    sonActif = !sonActif;
    try {
      localStorage.setItem(CLE_SON, sonActif ? "oui" : "non");
    } catch (e) {}
    afficher();
    if (sonActif && preparerAudio()) clochettePaire();   // petit son pour confirmer
  });
}
