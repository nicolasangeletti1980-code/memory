// ===================================================================
// Le "service worker" : un petit programme qui garde une copie des jeux
// dans le téléphone, pour pouvoir jouer même sans internet.
// ===================================================================

// Le nom de la copie. Si on change les jeux, on peut changer ce numéro
// pour forcer une copie toute neuve.
const NOM_COPIE = "memory-myrtille-v1";

// La liste des fichiers à garder dans le téléphone
const FICHIERS = [
  "./",
  "./index.html",
  "./myrtille.html",
  "./mer.html",
  "./dino.html",
  "./manifest.webmanifest",
  "./icone-180.png",
  "./icone-192.png",
  "./icone-512.png"
];

// 1. Installation : on copie tous les fichiers
self.addEventListener("install", function (evenement) {
  evenement.waitUntil(
    caches.open(NOM_COPIE).then(function (copie) {
      return copie.addAll(FICHIERS);
    })
  );
  self.skipWaiting();   // on devient actif tout de suite
});

// 2. Activation : on efface les vieilles copies
self.addEventListener("activate", function (evenement) {
  evenement.waitUntil(
    caches.keys().then(function (noms) {
      return Promise.all(noms.map(function (nom) {
        if (nom !== NOM_COPIE) {
          return caches.delete(nom);
        }
      }));
    })
  );
  self.clients.claim();
});

// 3. À chaque page demandée :
//    - avec internet : on prend la version en ligne (toujours à jour)
//      et on met la copie à jour ;
//    - sans internet : on donne la copie gardée dans le téléphone.
self.addEventListener("fetch", function (evenement) {
  const demande = evenement.request;
  if (demande.method !== "GET" || new URL(demande.url).origin !== self.location.origin) {
    return;   // on ne s'occupe que des fichiers du jeu
  }
  evenement.respondWith(
    fetch(demande)
      .then(function (reponse) {
        const copieReponse = reponse.clone();
        caches.open(NOM_COPIE).then(function (copie) {
          copie.put(demande, copieReponse);
        });
        return reponse;
      })
      .catch(function () {
        return caches.match(demande, { ignoreSearch: true });
      })
  );
});
