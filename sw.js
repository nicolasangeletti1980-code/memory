// ===================================================================
// Le "service worker" : un petit programme qui garde une copie des jeux
// dans le téléphone, pour pouvoir jouer même sans internet.
// ===================================================================

// Le nom de la copie. Si on change les jeux, on change ce numéro
// pour forcer une copie toute neuve.
const NOM_COPIE = "memory-myrtille-v4";

// On lit la liste des univers et leurs cartes,
// pour savoir quels fichiers (pages, dessins, sons) garder.
importScripts("mondes/outils.js");
LISTE_MONDES.forEach(function (id) {
  try {
    importScripts("mondes/" + id + ".js");
  } catch (e) {
    // univers introuvable : on continue sans lui
  }
});

// La liste des fichiers à garder dans le téléphone
const FICHIERS = [
  "./",
  "./index.html",
  "./jeu.html",
  "./jeu.js",
  "./sons.js",
  "./musique.js",
  "./mondes/outils.js",
  // Les anciennes adresses (favoris, raccourcis) : elles doivent marcher sans internet
  "./myrtille.html",
  "./mer.html",
  "./dino.html",
  "./manifest.webmanifest",
  "./icone-180.png",
  "./icone-192.png",
  "./icone-512.png"
];
LISTE_MONDES.forEach(function (id) {
  FICHIERS.push("./mondes/" + id + ".js");
  FICHIERS.push("./jeu.html?monde=" + id);
  if (!MONDES[id]) return;
  MONDES[id].cartes.forEach(function (carte) {
    FICHIERS.push("./sons/" + id + "/" + carte.id + ".wav");
  });
  FICHIERS.push("./sons/" + id + "/victoire.wav");
});

// 1. Installation : on copie tous les fichiers
//    (un fichier qui manque ne bloque pas les autres)
self.addEventListener("install", function (evenement) {
  evenement.waitUntil(
    caches.open(NOM_COPIE).then(function (copie) {
      return Promise.all(FICHIERS.map(function (fichier) {
        return copie.add(fichier).catch(function () {});
      }));
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

// Fabrique une réponse "morceau" (code 206) à partir du fichier complet.
// La demande ressemble à "bytes=0-" ou "bytes=1000-1999".
function morceau(donnees, plage, type) {
  const valeurs = /bytes=(\d*)-(\d*)/.exec(plage) || [];
  const taille = donnees.byteLength;
  const debut = valeurs[1] ? parseInt(valeurs[1], 10) : 0;
  const fin = valeurs[2] ? Math.min(parseInt(valeurs[2], 10), taille - 1) : taille - 1;
  return new Response(donnees.slice(debut, fin + 1), {
    status: 206,
    headers: {
      "Content-Type": type || "audio/wav",
      "Content-Range": "bytes " + debut + "-" + fin + "/" + taille,
      "Content-Length": String(fin - debut + 1),
      "Accept-Ranges": "bytes"
    }
  });
}

// 3. À chaque fichier demandé :
//    - avec internet : on prend la version en ligne (toujours à jour)
//      et on met la copie à jour ;
//    - sans internet : on donne la copie gardée dans le téléphone.
self.addEventListener("fetch", function (evenement) {
  const demande = evenement.request;
  if (demande.method !== "GET" || new URL(demande.url).origin !== self.location.origin) {
    return;   // on ne s'occupe que des fichiers du jeu
  }
  // Les sons sont demandés "par morceaux" par le lecteur audio
  // (surtout sur iPhone).
  // - avec internet : on les prend en ligne, comme le reste. (Si on mélange
  //   des morceaux venus d'internet et des morceaux découpés dans la copie,
  //   Chrome refuse le son : il reste muet.)
  // - sans internet : on découpe le morceau demandé dans la copie.
  if (demande.headers.has("range")) {
    evenement.respondWith(
      fetch(demande).catch(function () {
        return caches.match(demande.url).then(function (copie) {
          if (!copie) return Response.error();
          return copie.arrayBuffer().then(function (donnees) {
            return morceau(donnees, demande.headers.get("range"), copie.headers.get("content-type"));
          });
        });
      })
    );
    return;
  }
  evenement.respondWith(
    fetch(demande)
      .then(function (reponse) {
        // On ne garde que les réponses correctes (pas les erreurs 404)
        if (reponse.ok && reponse.status === 200) {
          const copieReponse = reponse.clone();
          caches.open(NOM_COPIE).then(function (copie) {
            copie.put(demande, copieReponse);
          });
        }
        return reponse;
      })
      .catch(function () {
        return caches.match(demande);
      })
  );
});
