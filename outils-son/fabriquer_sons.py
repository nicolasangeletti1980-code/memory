#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# =====================================================================
# fabriquer_sons.py : fabrique TOUS les bruitages du jeu de Memory.
#
# Ce programme écrit 54 fichiers .wav dans le dossier « sons/ » :
#   sons/<univers>/<carte>.wav   (le son quand on trouve une paire)
#   sons/<univers>/victoire.wav  (le son de fin de partie)
#
# Aucun son n'est téléchargé : tout est FABRIQUÉ par calcul
# (on additionne des notes, on filtre du bruit, on imite une gorge...).
#
# Pour refaire les sons :   python3 outils-son/fabriquer_sons.py
# Pour écouter un aperçu :  python3 outils-son/fabriquer_sons.py --apercu DOSSIER
#   (écrit apercu-<univers>.wav dans DOSSIER : les 9 sons à la suite)
#
# Il faut seulement Python 3 et numpy.
# Le hasard est « figé » : on obtient exactement les mêmes sons à chaque fois.
# =====================================================================

import os
import sys
import wave
import zlib

import numpy as np

SR = 22050          # nombre d'échantillons par seconde (qualité du son)
CRETE = 0.7         # volume maximum d'un fichier (0,7 = -3 dB, sans saturer)

ICI = os.path.dirname(os.path.abspath(__file__))
DOSSIER_SONS = os.path.normpath(os.path.join(ICI, "..", "sons"))

# Le « dé » qui fabrique le hasard (il est remis à zéro pour chaque son)
de = np.random.default_rng(1)


# =====================================================================
# 1. Petits outils de base
# =====================================================================

def nb(duree):
    """Nombre d'échantillons pour une durée en secondes."""
    return int(round(duree * SR))


def temps(duree):
    """Le temps (en secondes) de chaque échantillon : 0, 1/22050, 2/22050..."""
    return np.arange(nb(duree)) / SR


def courbe(points, duree, log=False):
    """Une courbe qui passe par des points (temps, valeur).
    log=True : passage « en douceur » adapté aux hauteurs de notes."""
    t = temps(duree)
    ts = [p[0] for p in points]
    vs = [p[1] for p in points]
    if log:
        return np.exp(np.interp(t, ts, np.log(vs)))
    return np.interp(t, ts, vs)


def bruit_lent(n, vitesse):
    """Une petite variation au hasard, lente (vitesse en changements par seconde).
    Sert à rendre les voix moins « robot » (elles tremblent un peu)."""
    k = max(3, int(n / SR * vitesse) + 3)
    points = de.standard_normal(k)
    x = np.linspace(0, k - 1, n)
    i = np.floor(x).astype(int)
    i = np.minimum(i, k - 2)
    f = x - i
    f = (1 - np.cos(np.pi * f)) / 2          # passage arrondi d'un point à l'autre
    return points[i] * (1 - f) + points[i + 1] * f


def phase(frequence):
    """Transforme une hauteur (qui peut changer) en angle pour sinus."""
    return 2 * np.pi * np.cumsum(frequence) / SR


def rms(x):
    """Le volume moyen d'un son."""
    return float(np.sqrt(np.mean(x ** 2) + 1e-12))


def assembler(morceaux):
    """Met des sons bout à bout ou les superpose.
    morceaux = liste de (début en secondes, son)."""
    fin = max(nb(debut) + len(son) for debut, son in morceaux)
    total = np.zeros(fin)
    for debut, son in morceaux:
        i = nb(debut)
        total[i:i + len(son)] += son
    return total


def montee_exp(n_montee, n_total, volume, fin=1e-4):
    """Enveloppe « comme sons.js » : monte de 0,0001 à volume, puis
    redescend à 0,0001 (rampes exponentielles du navigateur)."""
    env = np.full(n_total, fin)
    a = np.arange(n_montee) / max(n_montee, 1)
    env[:n_montee] = 1e-4 * (volume / 1e-4) ** a
    return env


# =====================================================================
# 2. Les filtres (pour « sculpter » le bruit et les sons)
# =====================================================================

def filtre_fft(x, gain):
    """Filtre un son entier d'un coup : gain(f) dit combien on garde
    de chaque fréquence f (1 = tout, 0 = rien)."""
    n = len(x)
    taille = 1 << int(np.ceil(np.log2(n + 2048)))
    spectre = np.fft.rfft(x, taille)
    f = np.fft.rfftfreq(taille, 1 / SR)
    return np.fft.irfft(spectre * gain(np.maximum(f, 1.0)), taille)[:n]


def resonance(f, centre, largeur):
    """La forme d'une « bosse » de fréquences autour de centre
    (comme une caisse de résonance, ou la bouche qui fait une voyelle)."""
    return 1.0 / np.sqrt(1.0 + ((f * f - centre * centre) / (f * largeur)) ** 2)


def bruit_filtre(n, forme):
    """Du bruit (« chhhh ») dont la couleur change avec le temps.
    forme(t, f) donne le gain de chaque fréquence f à l'instant t.
    (On découpe le bruit en petits morceaux, on filtre chacun, on recolle.)"""
    N, pas = 512, 128
    fenetre = np.hanning(N + 1)[:N]
    x = de.standard_normal(n + 2 * N)
    sortie = np.zeros(n + 2 * N)
    poids = np.zeros(n + 2 * N)
    f = np.maximum(np.fft.rfftfreq(N, 1 / SR), 1.0)
    for debut in range(0, n + N, pas):
        morceau = x[debut:debut + N] * fenetre
        spectre = np.fft.rfft(morceau) * forme(debut / SR, f)
        sortie[debut:debut + N] += np.fft.irfft(spectre, N) * fenetre
        poids[debut:debut + N] += fenetre ** 2
    sortie = sortie / np.maximum(poids, 1e-3)
    y = sortie[N // 2:N // 2 + n]
    return y / rms(y)                       # volume moyen = 1


def valeur(p, i):
    """Lit un réglage qui peut être un nombre fixe ou une courbe."""
    return p if np.isscalar(p) else p[min(i, len(p) - 1)]


def bruit_bande(n, centre, largeur):
    """Bruit gardé autour d'une fréquence (centre et largeur fixes ou courbes)."""
    def forme(t, f):
        i = int(t * SR)
        # (au carré : les fréquences loin du centre disparaissent plus vite)
        return resonance(f, valeur(centre, i), valeur(largeur, i)) ** 2
    return bruit_filtre(n, forme)


def passe_bas_biquad(x, frequence, q_db):
    """Le filtre « lowpass » exact du navigateur (BiquadFilterNode).
    Sert à refaire le rugissement des dinos exactement comme sons.js."""
    w0 = 2 * np.pi * frequence / SR_DINO
    alpha = np.sin(w0) / (2 * 10 ** (q_db / 20))
    c = np.cos(w0)
    b0, b1, b2 = (1 - c) / 2, 1 - c, (1 - c) / 2
    a0, a1, a2 = 1 + alpha, -2 * c, 1 - alpha
    b0, b1, b2, a1, a2 = b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0
    y = np.zeros(len(x))
    x1 = x2 = y1 = y2 = 0.0
    for i in range(len(x)):
        xi = x[i]
        yi = b0 * xi + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2
        x2, x1, y2, y1 = x1, xi, y1, yi
        y[i] = yi
    return y


# =====================================================================
# 3. La « gorge » : une voix d'animal fabriquée
# On additionne toutes les harmoniques d'une note (la vibration de la gorge),
# puis on donne à chacune un volume selon la forme de la bouche
# (les « formants » : ce qui fait la différence entre « a », « ou », « i »...).
# =====================================================================

def voix(f0, formants, amp, souffle=0.0, pente=1.0, rugosite=0.0,
         fmax=5000, vibrato=(0, 0), tremblement=0.01):
    """
    f0        : la hauteur de la voix (courbe en Hz)
    formants  : liste de (fréquence, largeur, force) de la bouche ;
                chaque valeur peut être un nombre ou une courbe
    amp       : la courbe de volume
    souffle   : ajoute de l'air (bruit) passé dans la même bouche
    pente     : grand = son doux et sombre ; petit = son brillant, cuivré
    rugosite  : 0 à 1, voix rauque (« grrr »)
    fmax      : on ne fabrique rien au-dessus (pas de sons qui piquent)
    vibrato   : (vitesse en Hz, profondeur) : la voix qui chevrote
    tremblement : petites variations au hasard de la hauteur (naturel)
    """
    n = len(f0)
    t = np.arange(n) / SR
    f0 = f0 * (1 + tremblement * bruit_lent(n, 20))
    if vibrato[1]:
        f0 = f0 * (1 + vibrato[1] * np.sin(2 * np.pi * vibrato[0] * t))
    bouche = [(np.broadcast_to(np.asarray(F, float), (n,)),
               np.broadcast_to(np.asarray(B, float), (n,)),
               np.broadcast_to(np.asarray(G, float), (n,))) for F, B, G in formants]
    ph = phase(f0)
    son = np.zeros(n)
    kmax = int(fmax / max(f0.min(), 20)) + 1
    for k in range(1, kmax + 1):
        fk = k * f0
        g = np.zeros(n)
        for F, B, G in bouche:
            g += G * resonance(fk, F, B)
        g *= k ** (-pente) * np.clip((fmax - fk) / (0.2 * fmax), 0, 1)
        if g.max() < 1e-6:
            continue
        son += g * np.sin(k * ph + de.uniform(0, 2 * np.pi))
    if rugosite:
        # la voix « se dédouble » (sous-harmonique) et frémit : c'est rauque
        son *= 1 + rugosite * 0.8 * np.sin(ph / 2 + de.uniform(0, 6))
        son *= 1 + rugosite * 0.5 * bruit_lent(n, 45)
    son /= rms(son)
    if souffle:
        def forme(tt, f):
            i = min(int(tt * SR), n - 1)
            g = sum(G[i] * resonance(f, F[i], B[i]) for F, B, G in bouche)
            return g * np.clip((fmax - f) / (0.2 * fmax), 0, 1)
        son += souffle * bruit_filtre(n, forme)
    return son * amp


# =====================================================================
# 4. Les instruments magiques : clochettes, bulles, boîte à musique, harpe
# =====================================================================

def cloche(frequence, duree, volume):
    """La clochette de fée de sons.js : une note + deux notes plus aiguës
    et plus discrètes. (On enlève celles qui seraient trop aiguës.)"""
    n = nb(duree + 0.05)
    t = np.arange(n) / SR
    son = np.zeros(n)
    for mult, rel in ((1, 1), (2.76, 0.3), (5.4, 0.12)):
        f = frequence * mult
        if f > 6500:
            continue                          # trop aigu pour de petites oreilles
        v = volume * rel * (0.5 if f > 4500 else 1)
        env = montee_exp(nb(0.01), n, v)
        reste = (t - 0.01) / (duree - 0.01)
        descente = (t >= 0.01) & (t < duree)
        env[descente] = v * (1e-4 / v) ** reste[descente]
        son += env * np.sin(2 * np.pi * f * t)
    return son


def bulle(frequence, volume, taille=1.0):
    """La bulle de sons.js : une note qui monte très vite (« bloup »).
    taille > 1 : une bulle plus grosse, plus lente."""
    d = 0.2 * taille
    t = temps(d)
    monte = 0.1 * taille
    f = frequence * 2.6 ** (np.minimum(t, monte) / monte)
    env = np.full(len(t), 1e-4)
    a = t < 0.01
    env[a] = 1e-4 * (volume / 1e-4) ** (t[a] / 0.01)
    b = (t >= 0.01) & (t < 0.16 * taille)
    env[b] = volume * (1e-4 / volume) ** ((t[b] - 0.01) / (0.16 * taille - 0.01))
    return env * np.sin(phase(f))


def note_boite(frequence, duree=0.9, volume=1.0):
    """Une note de boîte à musique : une lamelle de métal pincée.
    Un « ting » aigu très court au début, puis une note ronde qui s'éteint."""
    t = temps(duree)
    son = np.sin(2 * np.pi * frequence * t) * np.exp(-t / 0.5)
    son += 0.18 * np.sin(2 * np.pi * 2.01 * frequence * t) * np.exp(-t / 0.18)
    aigu = 6.27 * frequence                   # le « ting » de la lamelle
    if aigu > 5500:
        aigu = 3.0 * frequence
    son += 0.25 * np.sin(2 * np.pi * aigu * t) * np.exp(-t / 0.035)
    son *= np.minimum(t / 0.002, 1)
    fin = np.minimum((duree - t) / 0.05, 1)  # s'éteint sans clic
    return volume * son * fin


def corde_harpe(frequence, duree=1.2, volume=1.0):
    """Une corde de harpe pincée : beaucoup d'harmoniques au début,
    les aiguës s'éteignent plus vite que la note principale."""
    t = temps(duree)
    son = np.zeros(len(t))
    for k in range(1, 14):
        fk = k * frequence
        if fk > 5000:
            break
        force = abs(np.sin(k * np.pi * 0.18)) / k ** 1.1
        tenue = 0.9 / (1 + 0.7 * (k - 1)) * (440 / frequence) ** 0.3
        son += force * np.exp(-t / tenue) * np.sin(2 * np.pi * fk * t + de.uniform(0, 6))
    son *= np.minimum(t / 0.003, 1)
    return volume * son


# =====================================================================
# 5. Le rugissement des dinos : copie EXACTE de rugissement() de sons.js
# (calculé deux fois plus finement puis ramené à 22050, comme un navigateur)
# =====================================================================

SR_DINO = 2 * SR


def rugissement(duree, hauteur, volume):
    n = int(round((duree + 0.1) * SR_DINO))   # les sources s'arrêtent à duree + 0,1 s
    t = np.arange(n) / SR_DINO
    # 1) La voix : une note rauque (dent de scie) qui monte un peu puis redescend
    f = np.where(
        t < duree * 0.25,
        hauteur * 0.8 * (1.3 / 0.8) ** (t / (duree * 0.25)),
        hauteur * 1.3 * (0.6 / 1.3) ** (np.minimum(t - duree * 0.25, duree * 0.75) / (duree * 0.75)))
    ph = 2 * np.pi * np.cumsum(f) / SR_DINO
    dent = np.zeros(n)
    for k in range(1, int(SR_DINO / 2 / (hauteur * 0.6)) + 1):
        dent += np.where(k * f < SR_DINO / 2, (-1) ** (k + 1) * np.sin(k * ph) / k, 0)
    dent *= 2 / np.pi
    # 2) Le souffle de la gorge (bruit, volume 0,5)
    souffle = (de.random(n) * 2 - 1) * 0.5
    # 3) Le filtre qui garde les graves (fréquence = hauteur x 6, Q = 3)
    filtre = passe_bas_biquad(dent + souffle, hauteur * 6, 3)
    # 4) La saturation : rend le son rauque
    sature = np.tanh(np.clip(filtre, -1, 1) * 4)
    # 5) Le « grrrr » : le volume tremble 30 fois par seconde
    grr = 0.6 + 0.4 * np.sin(2 * np.pi * 30 * t)
    # 6) Le volume général : monte vite, tient, puis s'éteint
    env = np.full(n, 1e-4)
    a = t < 0.06
    env[a] = 1e-4 * (volume / 1e-4) ** (t[a] / 0.06)
    env[(t >= 0.06) & (t < duree * 0.6)] = volume
    c = (t >= duree * 0.6) & (t < duree)
    env[c] = volume * (1e-4 / volume) ** ((t[c] - duree * 0.6) / (duree * 0.4))
    son = sature * grr * env
    # On repasse à 22050 échantillons/s (on enlève proprement les aigus en trop)
    spectre = np.fft.rfft(son)
    garde = len(spectre) // 2 + 1
    return np.fft.irfft(spectre[:garde], 2 * (garde - 1)) / 2


# =====================================================================
# 6. Les sons de chaque univers
# =====================================================================

# ---------------------------- MYRTILLE ------------------------------

def myrtille_myrtille():
    # Un petit « ploc » rond (comme une goutte) puis une clochette
    t = temps(0.12)
    f = 320 * 2.8 ** (np.minimum(t, 0.04) / 0.04)
    ploc = np.sin(phase(f)) * np.exp(-t / 0.03) * np.minimum(t / 0.002, 1)
    return assembler([(0, 0.45 * ploc), (0.1, cloche(1568, 0.9, 0.15)),
                      (0.17, cloche(2093, 0.8, 0.10))])


def myrtille_lettre_m():
    # Une note claire + un petit scintillement d'étoiles
    morceaux = [(0, cloche(1568, 1.1, 0.16)), (0, cloche(784, 1.0, 0.05))]
    for f, debut in ((3136, .10), (2637, .17), (3520, .24), (2349, .31),
                     (3136, .38), (2637, .45), (3520, .52)):
        morceaux.append((debut, cloche(f, 0.35, 0.035)))
    return assembler(morceaux)


def myrtille_prenom():
    # « Myr - til - le » : trois notes qui montent
    return assembler([(0, cloche(784, 0.8, 0.15)), (0.18, cloche(1046.5, 0.8, 0.15)),
                      (0.36, cloche(1318.5, 1.0, 0.16))])


def myrtille_surnom():
    # « Mi - mi » : deux fois la note mi
    return assembler([(0, cloche(1318.5, 0.6, 0.16)), (0.26, cloche(1318.5, 0.9, 0.16))])


def aboiement(hauteur=1.0, d=0.24):
    """Un « ouaf » de gros chien gentil : la bouche passe de « ou » à « a »."""
    f0 = courbe([(0, 190), (0.035, 290), (0.12, 250), (d, 185)], d, log=True) * hauteur
    F1 = courbe([(0, 350), (0.04, 700), (0.14, 650), (d, 450)], d)
    F2 = courbe([(0, 800), (0.04, 1250), (0.14, 1150), (d, 950)], d)
    amp = courbe([(0, 0), (0.012, 1), (0.06, 0.9), (0.16, 0.45), (d, 0)], d)
    return voix(f0, [(F1, 180, 1), (F2, 220, 0.7), (2500, 300, 0.25), (3400, 400, 0.1)],
                amp, souffle=0.45, pente=0.9, rugosite=0.3, fmax=4500)


def myrtille_hovawart():
    return assembler([(0, aboiement(1.0, 0.25)), (0.37, 0.85 * aboiement(1.1, 0.21))])


def sonnette(d=0.55, coups=6):
    """« Driiing » : le petit marteau tape la sonnette plusieurs fois très vite."""
    t = temps(d)
    morceaux = []
    for i in range(coups):
        force = 1 - 0.08 * i
        s = (np.sin(2 * np.pi * 1650 * t + i) + 0.7 * np.sin(2 * np.pi * 1692 * t + 2 * i)) * np.exp(-t / 0.28)
        s += 0.2 * np.sin(2 * np.pi * 3950 * t + 3 * i) * np.exp(-t / 0.08)
        s *= np.minimum(t / 0.001, 1)
        morceaux.append((i * 0.042, force * s))
    son = assembler(morceaux)
    return son * np.minimum((len(son) - np.arange(len(son))) / nb(0.05), 1)


def myrtille_trottinette():
    # « Dring dring » de sonnette + un petit « fiou » de vitesse
    d = 0.45
    centre = courbe([(0, 500), (0.2, 2000), (d, 900)], d, log=True)
    fiou = bruit_bande(nb(d), centre, centre * 0.7)
    fiou *= np.sin(np.pi * np.linspace(0, 1, nb(d))) ** 2
    sifflet = np.sin(phase(courbe([(0, 1500), (d, 800)], d, log=True)))
    sifflet *= np.sin(np.pi * np.linspace(0, 1, nb(d))) ** 2
    return assembler([(0, 0.5 * sonnette(0.45, 6)), (0.33, 0.5 * sonnette(0.5, 6)),
                      (0.78, 0.35 * fiou + 0.12 * sifflet)])


def myrtille_ours_blanc():
    # Boîte à musique : le début de « Au clair de la lune » (do do do ré mi ré)
    notes = [(0, 1046.5), (0.16, 1046.5), (0.32, 1046.5), (0.48, 1174.7),
             (0.64, 1318.5), (0.96, 1174.7)]
    return assembler([(debut, note_boite(f, 0.62 if debut > 0.9 else 0.5)) for debut, f in notes])


def myrtille_ours_marron():
    # Boîte à musique plus grave : le début de la berceuse de Brahms
    # (mi mi sol, mi mi sol, do)
    notes = [(0, 659.3), (0.12, 659.3), (0.24, 784), (0.54, 659.3),
             (0.66, 659.3), (0.78, 784), (1.08, 1046.5)]
    morceaux = [(debut, note_boite(f, 0.5)) for debut, f in notes]
    morceaux.append((1.08, 0.5 * note_boite(523.25, 0.5)))  # un do grave en plus : câlin
    return assembler(morceaux)


def myrtille_victoire():
    # clochetteVictoire de sons.js : une cascade de clochettes
    morceaux = [(i * 0.11, cloche(f, 1.2, 0.13))
                for i, f in enumerate([1046.5, 1318.5, 1568, 2093, 2637, 3136])]
    morceaux += [(0.8, cloche(f, 2, 0.08)) for f in (2093, 2637, 3136)]
    return assembler(morceaux)


# ------------------------------- MER --------------------------------

def mer_hippocampe():
    # Bulles douces qui se balancent, comme l'hippocampe
    return assembler([(0, bulle(420, .3)), (0.14, bulle(520, .3)), (0.26, bulle(470, .28)),
                      (0.42, bulle(620, .3)), (0.56, bulle(740, .25))])


def mer_clown():
    # Bulles rigolotes très rapides, en zigzag
    hauteurs = [500, 800, 560, 880, 620, 960, 700, 1100]
    return assembler([(i * 0.055, bulle(f, .3, 0.8)) for i, f in enumerate(hauteurs)])


def mer_etoile():
    # Une bulle puis un « ting » étoilé
    return assembler([(0, bulle(600, .25)), (0.08, cloche(2093, 0.9, 0.16)),
                      (0.12, cloche(3136, 0.6, 0.06)), (0.2, cloche(2637, 0.5, 0.05))])


def mer_saint_jacques():
    # Une vague douce : un « chhhh » qui monte et redescend
    d = 1.4
    coupure = courbe([(0, 400), (0.45, 1400), (d, 300)], d, log=True)

    def forme(t, f):
        c = valeur(coupure, int(t * SR))
        return 1 / np.sqrt(1 + (f / c) ** 4)
    vague = bruit_filtre(nb(d), forme) * courbe([(0, 0), (0.04, 0.3), (0.45, 1), (0.9, 0.6), (d, 0)], d)
    return assembler([(0, 0.15 * vague), (0.95, bulle(500, .12)), (1.1, bulle(650, .1))])


def mer_chirurgien():
    # Grosses bulles lentes : « bloup... bloup... bloup »
    return assembler([(0, bulle(260, .35, 1.5)), (0.18, bulle(330, .35, 1.5)),
                      (0.36, bulle(300, .35, 1.5)), (0.52, bulle(520, .2))])


def mer_sirene():
    # Une harpe en glissando qui monte (gamme douce) puis résonne
    gamme = [392, 440, 523.25, 587.3, 659.3, 784, 880, 1046.5, 1174.7, 1318.5, 1568]
    morceaux = [(i * 0.055, corde_harpe(f, 1.0, 0.5)) for i, f in enumerate(gamme)]
    morceaux.append((0.6, corde_harpe(523.25, 0.9, 0.3)))
    return assembler(morceaux)


def mer_jaune():
    # Trois petites bulles qui montent vite, puis une grosse bulle ronde
    return assembler([(0, bulle(700, .25, 0.7)), (0.09, bulle(850, .25, 0.7)),
                      (0.18, bulle(1000, .25, 0.7)), (0.34, bulle(380, .35, 1.4))])


def mer_trident():
    # Un scintillement magique qui part du grave et monte jusqu'à l'aigu
    gamme = [261.6, 329.6, 392, 523.25, 659.3, 784, 1046.5, 1318.5, 1568, 2093, 2637]
    morceaux = [(i * 0.07, cloche(f, 0.7, 0.12)) for i, f in enumerate(gamme)]
    morceaux += [(0.78, cloche(f, 0.7, 0.05)) for f in (2093, 3136)]
    return assembler(morceaux)


def mer_victoire():
    # bullesVictoire de sons.js, puis encore des bulles et un « ting » final
    hauteurs = [300, 420, 360, 520, 460, 640, 580, 780, 700, 900]
    morceaux = [(i * 0.08, bulle(f, .3)) for i, f in enumerate(hauteurs)]
    morceaux.append((1.0, bulle(1100, .35)))
    for i, f in enumerate([600, 750, 680, 850, 1000, 1250]):
        morceaux.append((1.15 + i * 0.06, bulle(f, .18, 0.8)))
    morceaux.append((1.55, cloche(2093, 0.9, 0.1)))
    return assembler(morceaux)


# ------------------------------- DINOS -------------------------------
# Les valeurs « cri » de mondes/dino.js (hauteur, durée)
CRIS_DINO = {
    "trex": (110, 0.8), "triceratops": (170, 0.5), "diplodocus": (75, 1.0),
    "stegosaure": (140, 0.6), "pteranodon": (650, 0.45), "ankylosaure": (120, 0.55),
    "bebe": (520, 0.3), "volcan": (50, 1.0),
}


def dino(nom):
    hauteur, duree = CRIS_DINO[nom]
    return lambda: rugissement(duree, hauteur, 0.25)


def dino_victoire():
    # rugissementVictoire : le grand rugissement du T-rex (un grave + un aigu)
    return assembler([(0, rugissement(1.9, 90, 0.35)), (0.05, rugissement(1.7, 150, 0.2))])


# ------------------------------ FERME --------------------------------

def ferme_vache():
    # « Meuuuh » : grave, long ; la bouche s'ouvre (m -> eu) puis se referme
    d = 1.45
    f0 = courbe([(0, 105), (0.25, 125), (0.6, 140), (1.1, 128), (d, 105)], d, log=True)
    F1 = courbe([(0, 280), (0.18, 330), (0.45, 650), (1.0, 600), (d, 380)], d)
    F2 = courbe([(0, 900), (0.45, 1150), (1.0, 1100), (d, 850)], d)
    nez = courbe([(0, 1), (0.25, 0.6), (0.5, 0.3), (d, 0.5)], d)   # le « mmm » du nez
    amp = courbe([(0, 0), (0.06, 0.35), (0.3, 1), (1.05, 0.9), (d, 0)], d)
    return voix(f0, [(250, 100, nez), (F1, 160, 1), (F2, 200, 0.5), (2400, 300, 0.15)],
                amp, souffle=0.2, pente=1.0, rugosite=0.15, vibrato=(4.5, 0.01), fmax=4000)


def grognement_cochon(d=0.27, hauteur=1.0):
    f0 = courbe([(0, 120), (0.06, 190), (0.16, 175), (d, 130)], d, log=True) * hauteur
    F1 = courbe([(0, 350), (0.08, 600), (d, 450)], d)
    F2 = courbe([(0, 900), (0.1, 1600), (d, 1300)], d)
    amp = courbe([(0, 0), (0.02, 0.8), (0.07, 1), (0.18, 0.7), (d, 0)], d)
    # rugosité forte = le « grrr » du groin
    return voix(f0, [(300, 120, 0.8), (F1, 150, 1), (F2, 250, 0.45), (2600, 400, 0.15)],
                amp, souffle=0.5, pente=0.8, rugosite=0.75, fmax=4000, tremblement=0.03)


def ferme_cochon():
    # « Groin - groin »
    return assembler([(0, grognement_cochon(0.27)), (0.36, 0.9 * grognement_cochon(0.25, 1.08))])


def cocorico(d_fin=0.75, force=1.0):
    """Le chant du coq : « co - co - ri - cooooo » (montée puis tenue)."""
    d = 0.48 + d_fin
    f0 = courbe([(0, 470), (0.11, 520), (0.14, 500), (0.26, 560), (0.29, 600), (0.45, 720),
                 (0.48, 720), (0.48 + d_fin * 0.4, 770), (0.48 + d_fin * 0.8, 710), (d, 560)],
                d, log=True)
    F1 = courbe([(0, 650), (0.26, 650), (0.3, 450), (0.45, 450), (0.5, 750),
                 (0.48 + d_fin * 0.7, 700), (d, 500)], d)
    F2 = courbe([(0, 1050), (0.26, 1050), (0.3, 2000), (0.45, 2000), (0.5, 1200),
                 (0.48 + d_fin * 0.7, 1150), (d, 900)], d)
    # le volume : 3 petites syllabes séparées, puis la longue note
    amp = courbe([(0, 0), (0.02, 0.6), (0.09, 0.6), (0.12, 0.1), (0.15, 0.65), (0.24, 0.65),
                  (0.27, 0.1), (0.3, 0.8), (0.44, 0.8), (0.47, 0.3), (0.52, 1),
                  (0.48 + d_fin * 0.8, 0.95), (d, 0)], d)
    vib = (10, 0.012)
    return force * voix(f0, [(F1, 200, 1), (F2, 250, 0.7), (2900, 400, 0.25)], amp,
                        souffle=0.3, pente=0.65, rugosite=0.12, vibrato=vib, fmax=5000)


def ferme_coq():
    return cocorico(0.8)


def ferme_mouton():
    # « Bêêêê » qui chevrote (le son tremble 7 fois par seconde)
    d = 1.0
    t = temps(d)
    f0 = courbe([(0, 250), (0.12, 300), (0.7, 285), (d, 255)], d, log=True)
    F1 = courbe([(0, 420), (0.08, 650), (0.8, 620), (d, 500)], d)
    tremble = 1 - 0.45 * (0.5 + 0.5 * np.sin(2 * np.pi * 7 * t - np.pi / 2)) * np.minimum(t / 0.15, 1)
    amp = courbe([(0, 0), (0.03, 1), (0.75, 0.85), (d, 0)], d) * tremble
    return voix(f0, [(260, 100, 0.4), (F1, 160, 1), (1850, 220, 0.6), (2650, 300, 0.25)],
                amp, souffle=0.3, pente=0.9, rugosite=0.2, vibrato=(7, 0.03), fmax=4500)


def ferme_cheval():
    # Hennissement : très aigu au début, puis descend en chevrotant,
    # et finit par un petit « brrr » de lèvres
    d = 1.15
    t = temps(d)
    f0 = courbe([(0, 650), (0.08, 980), (0.25, 920), (0.6, 720), (0.9, 520), (d, 400)], d, log=True)
    profond = 0.02 + 0.06 * np.minimum(t / 0.6, 1)
    f0 = f0 * (1 + profond * np.sin(2 * np.pi * 11 * t))
    F1 = courbe([(0, 500), (0.15, 800), (d, 750)], d)
    F2 = courbe([(0, 2200), (0.2, 1600), (d, 1300)], d)
    amp = courbe([(0, 0), (0.04, 1), (0.6, 0.85), (0.95, 0.6), (d, 0)], d)
    bouche = [(F1, 250, 1), (F2, 300, 0.6), (2700, 400, 0.2)]
    haut = voix(f0, bouche, amp, souffle=0.35, pente=0.8, rugosite=0.15, fmax=5000)
    bas = voix(f0 * 0.43, bouche, amp, souffle=0.0, pente=0.9, rugosite=0.3, fmax=4000)
    # le « brrr » final (lèvres qui vibrent)
    db = 0.35
    tb = temps(db)
    brr = voix(courbe([(0, 160), (db, 120)], db, log=True), [(500, 300, 1), (1200, 400, 0.4)],
               courbe([(0, 0), (0.03, 1), (db, 0)], db) * (0.5 + 0.5 * np.sin(2 * np.pi * 24 * tb)),
               souffle=0.8, pente=1.0, rugosite=0.5, fmax=3000)
    return assembler([(0, haut + 0.35 * bas), (1.02, 0.5 * brr)])


def coin(d=0.19, hauteur=1.0):
    f0 = courbe([(0, 300), (0.05, 330), (d, 250)], d, log=True) * hauteur
    F1 = courbe([(0, 500), (0.06, 900), (d, 750)], d)
    amp = courbe([(0, 0), (0.008, 1), (0.1, 0.9), (d, 0)], d)
    # son « nasillard » : résonances étroites et voix très riche
    return voix(f0, [(F1, 120, 1), (1500, 140, 0.9), (2500, 180, 0.4)], amp,
                souffle=0.35, pente=0.4, rugosite=0.5, fmax=4500)


def ferme_canard():
    # « Coin - coin »
    return assembler([(0, coin(0.19)), (0.27, coin(0.2, 0.95))])


def ferme_lapin():
    # Le lapin grignote : de tout petits « crac » très rapides
    morceaux = []
    for debut in (0.0, 0.1, 0.19, 0.3, 0.41, 0.62, 0.72, 0.82, 0.93, 1.04):
        for j in range(de.integers(3, 6)):
            d = 0.025
            t = temps(d)
            crac = bruit_bande(nb(d), de.uniform(1500, 3200), 1500) * np.exp(-t / 0.004)
            morceaux.append((debut + j * de.uniform(0.006, 0.012), 0.3 * crac))
        t = temps(0.03)
        dent = np.sin(2 * np.pi * de.uniform(700, 950) * t) * np.exp(-t / 0.008)
        morceaux.append((debut, 0.25 * dent))
    return assembler(morceaux)


def coup_moteur(force=1.0):
    """Une explosion du moteur diesel : un « boum » grave + un « teuf » d'air."""
    d = 0.14
    t = temps(d)
    boum = np.sin(phase(courbe([(0, 120), (d, 55)], d, log=True))) * np.exp(-t / 0.04)
    teuf = bruit_bande(nb(d), 550, 600) * np.exp(-t / 0.03)
    return force * (0.6 * boum + 0.8 * teuf) * np.minimum(t / 0.002, 1)


def ferme_tracteur():
    # Le démarreur tourne (« rrr-rrr »), puis le moteur part : « teuf-teuf-teuf »
    d = 0.42
    t = temps(d)
    demarreur = voix(courbe([(0, 70), (d, 95)], d), [(300, 300, 1), (900, 500, 0.3)],
                     courbe([(0, 0), (0.03, 1), (d, 0.6)], d) * (0.55 + 0.45 * np.sin(2 * np.pi * 7 * t)),
                     souffle=0.4, pente=1.0, rugosite=0.4, fmax=2500)
    morceaux = [(0, 0.25 * demarreur)]
    debut, ecart, i = 0.42, 0.2, 0
    while debut < 1.45:
        morceaux.append((debut, coup_moteur(1.0 if i % 2 == 0 else 0.75)))
        debut += ecart
        ecart = max(0.12, ecart * 0.9)
        i += 1
    son = assembler(morceaux)
    fin = np.minimum((len(son) - np.arange(len(son))) / nb(0.25), 1)
    return son * fin


def ferme_victoire():
    # Un « cocorico » triomphal, plus long, puis trois clochettes joyeuses
    return assembler([(0, cocorico(1.25)), (1.6, cloche(1046.5, 1.0, 0.04)),
                      (1.7, cloche(1318.5, 1.0, 0.04)), (1.8, cloche(1568, 1.0, 0.05))])


# ------------------------------- ZOO ---------------------------------

def zoo_lion():
    # Le rugissement du lion : « RRRAAOOUH », grave, rauque, avec une bouche ouverte
    d = 1.5
    f0 = courbe([(0, 110), (0.3, 170), (0.6, 190), (1.1, 140), (d, 85)], d, log=True)
    F1 = courbe([(0, 500), (0.4, 750), (1.0, 600), (d, 420)], d)
    F2 = courbe([(0, 900), (0.4, 1200), (1.0, 950), (d, 750)], d)
    amp = courbe([(0, 0), (0.08, 0.5), (0.4, 1), (0.9, 0.9), (d, 0)], d)
    son = voix(f0, [(F1, 250, 1), (F2, 300, 0.6), (2400, 400, 0.2)], amp,
               souffle=0.6, pente=0.8, rugosite=0.6, fmax=4000, tremblement=0.03)
    son = np.tanh(1.5 * son / np.abs(son).max()) * amp   # un peu de « saturation » sauvage
    return son


def zoo_elephant():
    # Le barrissement : un coup de trompette cuivré et un peu tremblant
    d = 1.15
    t = temps(d)
    f0 = courbe([(0, 300), (0.1, 500), (0.3, 530), (0.75, 480), (d, 380)], d, log=True)
    f0 = f0 * (1 + 0.025 * np.sin(2 * np.pi * 6 * t))
    amp = courbe([(0, 0), (0.05, 0.8), (0.15, 1), (0.85, 0.9), (d, 0)], d)
    amp = amp * (1 + 0.2 * np.sin(2 * np.pi * 23 * t))
    return voix(f0, [(950, 450, 1), (1800, 500, 0.8), (2700, 500, 0.35)], amp,
                souffle=0.35, pente=0.35, rugosite=0.35, fmax=4500)


def zoo_girafe():
    # La girafe mâche doucement des feuilles : « crounch... crounch... »
    morceaux = []
    for debut in (0.0, 0.32, 0.64, 0.98):
        d = 0.18
        t = temps(d)
        env = np.sin(np.pi * t / d) ** 2
        machoire = bruit_bande(nb(d), 450, 400) * env
        feuilles = bruit_bande(nb(d), 2000, 1500) * env * (bruit_lent(nb(d), 60) > 0.6)
        morceaux.append((debut, 0.3 * machoire + 0.12 * feuilles))
    return assembler(morceaux)


def zoo_zebre():
    # Le zèbre : un « kwa » aboyé puis deux « ha » soufflés
    def syllabe(d, f0pts, F1, F2, souffle, force):
        return force * voix(courbe(f0pts, d, log=True), [(F1, 250, 1), (F2, 300, 0.6), (2600, 400, 0.2)],
                            courbe([(0, 0), (0.01, 1), (d * 0.5, 0.8), (d, 0)], d),
                            souffle=souffle, pente=0.7, rugosite=0.5, fmax=4500)
    return assembler([(0, syllabe(0.2, [(0, 650), (0.05, 900), (0.2, 600)], 800, 1400, 0.5, 1.0)),
                      (0.26, syllabe(0.13, [(0, 480), (0.13, 400)], 750, 1250, 0.9, 0.7)),
                      (0.43, syllabe(0.13, [(0, 470), (0.13, 380)], 750, 1250, 0.9, 0.6))])


def singe(force=1.0):
    """« Hou - hou - ha - ha » : deux « hou » soufflés puis deux « ha » excités."""
    def syllabe(d, f0pts, F1, F2, souffle, pente):
        return voix(courbe(f0pts, d, log=True), [(F1, 180, 1), (F2, 250, 0.5), (2600, 400, 0.1)],
                    courbe([(0, 0), (0.025, 1), (d * 0.6, 0.85), (d, 0)], d),
                    souffle=souffle, pente=pente, rugosite=0.2, fmax=4500)
    return force * assembler([
        (0.00, 0.7 * syllabe(0.16, [(0, 300), (0.16, 400)], 380, 800, 0.5, 1.2)),
        (0.22, 0.8 * syllabe(0.16, [(0, 330), (0.16, 440)], 380, 800, 0.5, 1.2)),
        (0.45, 1.0 * syllabe(0.15, [(0, 560), (0.05, 720), (0.15, 600)], 900, 1500, 0.3, 0.8)),
        (0.65, 1.0 * syllabe(0.16, [(0, 600), (0.05, 780), (0.16, 640)], 900, 1500, 0.3, 0.8))])


def zoo_singe():
    return singe()


def zoo_panda():
    # Le panda : un petit bêlement aigu et doux
    d = 0.55
    t = temps(d)
    f0 = courbe([(0, 380), (0.08, 450), (d, 390)], d, log=True)
    amp = courbe([(0, 0), (0.03, 1), (0.35, 0.8), (d, 0)], d) * (1 - 0.35 * (0.5 + 0.5 * np.sin(2 * np.pi * 9 * t)))
    return voix(f0, [(300, 120, 0.4), (650, 180, 1), (1700, 250, 0.5), (2600, 350, 0.15)], amp,
                souffle=0.3, pente=1.0, rugosite=0.1, vibrato=(9, 0.025), fmax=4500)


def zoo_hippopotame():
    # « Hon - hon - hon » : gros grognements graves venus du nez
    def hon(d):
        f0 = courbe([(0, 85), (0.06, 115), (d, 80)], d, log=True)
        amp = courbe([(0, 0), (0.015, 1), (0.1, 0.8), (d, 0)], d)
        return voix(f0, [(280, 120, 1), (700, 200, 0.6), (1500, 300, 0.2), (2400, 400, 0.08)], amp,
                    souffle=0.35, pente=0.8, rugosite=0.5, fmax=3500, tremblement=0.03)
    return assembler([(0, hon(0.3)), (0.36, 0.9 * hon(0.24)), (0.66, 0.8 * hon(0.22))])


def zoo_manchot():
    # Le manchot « braie » comme un petit âne : « hii - haaa, hii - haaa »
    def hii(d=0.12):
        return voix(courbe([(0, 750), (d, 950)], d, log=True), [(500, 250, 1), (2000, 400, 0.6)],
                    courbe([(0, 0), (0.02, 1), (d, 0)], d), souffle=1.2, pente=0.9, rugosite=0.3, fmax=4000)

    def haa(d=0.3):
        return voix(courbe([(0, 480), (0.08, 560), (d, 460)], d, log=True),
                    [(900, 250, 1), (1400, 300, 0.7), (2600, 400, 0.25)],
                    courbe([(0, 0), (0.02, 1), (d * 0.7, 0.85), (d, 0)], d),
                    souffle=0.4, pente=0.6, rugosite=0.55, fmax=4500)
    return assembler([(0, 0.5 * hii()), (0.13, haa(0.26)), (0.44, 0.5 * hii()), (0.57, haa(0.26)),
                      (0.88, 0.5 * hii()), (1.01, haa(0.42))])


def zoo_victoire():
    # Une petite fanfare (ta-ta-ta-taaa) puis le singe : « hou-hou-ha-ha »
    def trompette(f, d):
        t = temps(d)
        f0 = f * (1 - 0.03 * np.exp(-t / 0.03))     # la note « glisse » un tout petit peu en partant
        amp = courbe([(0, 0), (0.03, 1), (d - 0.06, 0.85), (d, 0)], d)
        vib = (5.5, 0.008) if d > 0.3 else (0, 0)
        return voix(f0, [(1100, 900, 1), (2300, 900, 0.4)], amp, souffle=0.04, pente=0.6,
                    vibrato=vib, fmax=5000, tremblement=0.003)
    fanfare = assembler([(0, trompette(392, 0.13)), (0.15, trompette(523.25, 0.13)),
                         (0.3, trompette(659.3, 0.13)), (0.45, trompette(784, 0.6))])
    fanfare += 0.4 * assembler([(0.45, trompette(523.25, 0.6))])[:len(fanfare)]
    return assembler([(0, 0.8 * fanfare), (1.2, 1.1 * singe())])


# ------------------------------ FORÊT --------------------------------

def foret_renard():
    # Le renard glapit : trois petits cris aigus « waou ! »
    def jappe(d, h):
        f0 = courbe([(0, 700), (0.05, 1050), (d, 760)], d, log=True) * h
        F1 = courbe([(0, 1000), (d, 700)], d)
        F2 = courbe([(0, 1800), (d, 1200)], d)
        return voix(f0, [(F1, 300, 1), (F2, 350, 0.6), (2800, 400, 0.15)],
                    courbe([(0, 0), (0.01, 1), (d * 0.5, 0.8), (d, 0)], d),
                    souffle=0.4, pente=0.8, rugosite=0.3, fmax=4500)
    return assembler([(0, jappe(0.17, 1.0)), (0.25, jappe(0.16, 1.04)), (0.5, jappe(0.2, 0.97))])


def foret_herisson():
    # Le hérisson renifle : « sniff-sniff-sniff », puis un petit « pff »
    morceaux = []
    for debut in (0, 0.09, 0.18, 0.27, 0.55, 0.64, 0.73):
        d = 0.06
        t = temps(d)
        def forme(tt, f):
            return resonance(f, 1300, 600) + 0.6 * resonance(f, 2600, 800)
        sniff = bruit_filtre(nb(d), forme) * np.sin(np.pi * t / d) ** 1.5
        morceaux.append((debut, de.uniform(0.25, 0.35) * sniff))
    d = 0.12
    t = temps(d)
    pff = bruit_bande(nb(d), 600, 700) * np.exp(-t / 0.04) * np.minimum(t / 0.004, 1)
    morceaux.append((0.95, 0.35 * pff))
    return assembler(morceaux)


def foret_ecureuil():
    # L'écureuil : petits « tchik-tchik » rapides
    morceaux = []
    for i, debut in enumerate((0, 0.1, 0.2, 0.3, 0.52, 0.62, 0.72)):
        d = 0.05
        t = temps(d)
        tch = bruit_bande(nb(d), 3200, 1800) * np.exp(-t / 0.008)
        ik = np.sin(phase(courbe([(0, 2500), (d, 1700)], d, log=True))) * np.exp(-t / 0.015)
        morceaux.append((debut, 0.12 * tch + 0.35 * ik * np.minimum(t / 0.002, 1)))
    return assembler(morceaux)


def hou_hibou(d, f, tremolo=0.0):
    """Un « hou » de chouette hulotte : une note pure et douce."""
    t = temps(d)
    f0 = courbe([(0, f * 0.92), (0.06, f * 1.02), (d, f * 0.95)], d, log=True)
    amp = courbe([(0, 0), (0.06, 1), (d * 0.7, 0.85), (d, 0)], d)
    if tremolo:
        amp = amp * (1 - 0.45 * (0.5 + 0.5 * np.sin(2 * np.pi * tremolo * t)) * np.minimum(t / 0.1, 1))
    return voix(f0, [(f, 150, 1), (900, 300, 0.3)], amp, souffle=0.12, pente=2.5, fmax=3000,
                tremblement=0.004)


def hibou():
    return assembler([(0, hou_hibou(0.38, 420)), (0.56, hou_hibou(0.65, 400, tremolo=13))])


def foret_hibou():
    return hibou()


def foret_cerf():
    # Le brame du cerf : un très long « ooooôôh » grave qui gronde
    d = 1.5
    f0 = courbe([(0, 90), (0.25, 120), (0.65, 135), (1.15, 110), (d, 80)], d, log=True)
    F1 = courbe([(0, 280), (0.5, 380), (d, 300)], d)
    F2 = courbe([(0, 600), (0.5, 750), (d, 620)], d)
    amp = courbe([(0, 0), (0.15, 0.6), (0.6, 1), (1.2, 0.9), (d, 0)], d)
    return voix(f0, [(F1, 150, 1), (F2, 200, 0.6), (1800, 300, 0.2)], amp,
                souffle=0.35, pente=0.85, rugosite=0.5, fmax=3500, tremblement=0.03)


def foret_ours():
    # L'ours grogne : « grrrooouh » (grave, pas méchant)
    d = 1.1
    t = temps(d)
    f0 = courbe([(0, 75), (0.3, 95), (0.7, 88), (d, 68)], d, log=True)
    amp = courbe([(0, 0), (0.1, 0.8), (0.4, 1), (0.8, 0.8), (d, 0)], d)
    amp = amp * (0.7 + 0.3 * np.sin(2 * np.pi * 22 * t))     # le « rrr »
    F1 = courbe([(0, 350), (0.4, 500), (d, 380)], d)
    return voix(f0, [(F1, 200, 1), (900, 250, 0.6), (2200, 400, 0.15)], amp,
                souffle=0.5, pente=0.8, rugosite=0.8, fmax=3500, tremblement=0.04)


def foret_champignon():
    # « Pop ! » magique, puis trois étincelles qui montent
    d = 0.12
    t = temps(d)
    pop = np.sin(phase(courbe([(0, 250), (0.03, 1100), (d, 1200)], d, log=True)))
    pop *= np.exp(-t / 0.025) * np.minimum(t / 0.001, 1)
    claque = bruit_bande(nb(0.02), 1500, 2000) * np.exp(-temps(0.02) / 0.003)
    return assembler([(0, 0.5 * pop), (0, 0.15 * claque), (0.1, cloche(2093, 0.45, 0.07)),
                      (0.17, cloche(2637, 0.45, 0.07)), (0.24, cloche(3136, 0.6, 0.07))])


def foret_coccinelle():
    # Les petites ailes vrombissent doucement, puis « bzzz » elle s'envole
    d = 1.25
    t = temps(d)
    f0 = courbe([(0, 140), (0.5, 145), (0.8, 220), (d, 260)], d, log=True)
    centre = courbe([(0, 700), (0.5, 800), (0.8, 1400), (d, 900)], d, log=True)
    amp = courbe([(0, 0), (0.1, 0.45), (0.5, 0.5), (0.65, 1), (0.9, 0.6), (d, 0)], d)
    amp = amp * (1 + 0.15 * np.sin(2 * np.pi * 8 * t))
    return voix(f0, [(centre, 600, 1), (2200, 800, 0.2)], amp, souffle=0.4, pente=0.6,
                fmax=4000, tremblement=0.02)


def foret_victoire():
    # La chouette fait « hou-hou », puis un carillon doux dans les arbres
    morceaux = [(0, hibou())]
    for i, f in enumerate([1046.5, 1318.5, 1174.7, 1568, 1318.5, 1760, 2093]):
        morceaux.append((1.1 + i * 0.16 + 0.03 * (i % 2), cloche(f, 1.1, 0.03)))
    return assembler(morceaux)


# =====================================================================
# 7. La liste complète : univers -> (nom du fichier, fonction)
# =====================================================================

UNIVERS = {
    "myrtille": [("myrtille", myrtille_myrtille), ("lettre-m", myrtille_lettre_m),
                 ("prenom", myrtille_prenom), ("surnom", myrtille_surnom),
                 ("hovawart", myrtille_hovawart), ("trottinette", myrtille_trottinette),
                 ("ours-blanc", myrtille_ours_blanc), ("ours-marron", myrtille_ours_marron),
                 ("victoire", myrtille_victoire)],
    "mer": [("hippocampe", mer_hippocampe), ("clown", mer_clown), ("etoile", mer_etoile),
            ("saint-jacques", mer_saint_jacques), ("chirurgien", mer_chirurgien),
            ("sirene", mer_sirene), ("jaune", mer_jaune), ("trident", mer_trident),
            ("victoire", mer_victoire)],
    "dino": [(nom, dino(nom)) for nom in ("trex", "triceratops", "diplodocus", "stegosaure",
                                          "pteranodon", "ankylosaure", "bebe", "volcan")]
            + [("victoire", dino_victoire)],
    "ferme": [("vache", ferme_vache), ("cochon", ferme_cochon), ("coq", ferme_coq),
              ("mouton", ferme_mouton), ("cheval", ferme_cheval), ("canard", ferme_canard),
              ("lapin", ferme_lapin), ("tracteur", ferme_tracteur), ("victoire", ferme_victoire)],
    "zoo": [("lion", zoo_lion), ("elephant", zoo_elephant), ("girafe", zoo_girafe),
            ("zebre", zoo_zebre), ("singe", zoo_singe), ("panda", zoo_panda),
            ("hippopotame", zoo_hippopotame), ("manchot", zoo_manchot), ("victoire", zoo_victoire)],
    "foret": [("renard", foret_renard), ("herisson", foret_herisson), ("ecureuil", foret_ecureuil),
              ("hibou", foret_hibou), ("cerf", foret_cerf), ("ours", foret_ours),
              ("champignon", foret_champignon), ("coccinelle", foret_coccinelle),
              ("victoire", foret_victoire)],
}


# =====================================================================
# 8. La finition : nettoyer, mettre tout le monde au même volume, écrire
# =====================================================================

def adoucir_aigus(x):
    """Baisse doucement ce qui est au-dessus de 6-7 kHz (rien qui pique)."""
    return filtre_fft(x, lambda f: 1 / np.sqrt(1 + (f / 6500) ** 12))


def couper_silences(x):
    """Enlève le silence au début (le son part tout de suite) et à la fin."""
    a = np.abs(x)
    haut = a.max()
    debut = max(int(np.argmax(a > haut * 0.01)) - nb(0.001), 0)
    fin = len(a) - int(np.argmax(a[::-1] > haut * 0.003)) + nb(0.04)
    x = x[debut:min(fin, len(x))]
    if len(x) < nb(0.4):                      # au moins 0,4 s (on complète par du silence)
        x = np.concatenate([x, np.zeros(nb(0.4) - len(x))])
    return x


def fondus(x):
    """Fondu d'entrée (5 ms) et de sortie (30 ms) : jamais de « clic »."""
    x = x.copy()
    e, s = nb(0.005), nb(0.03)
    x[:e] *= np.sin(np.linspace(0, np.pi / 2, e)) ** 2
    x[-s:] *= np.cos(np.linspace(0, np.pi / 2, s)) ** 2
    x[0] = x[-1] = 0.0
    return x


def sonie(x):
    """Le volume « ressenti » (approximatif, en dB) : on pèse les fréquences
    comme l'oreille (les très graves comptent moins, les médiums un peu plus),
    puis on fait la moyenne des moments où le son est vraiment présent."""
    def oreille(f):
        passe_haut = (f / 60) ** 2 / np.sqrt(1 + (f / 60) ** 4)
        brillance = 1 + 0.6 * (f / 2000) ** 2 / (1 + (f / 2000) ** 2)
        return passe_haut * brillance
    y = filtre_fft(x, oreille)
    taille, pas = nb(0.05), nb(0.025)
    energies = np.array([np.mean(y[i:i + taille] ** 2)
                         for i in range(0, max(len(y) - taille, 1), pas)])
    garde = energies[energies > energies.max() * 10 ** (-20 / 10)]   # 20 dB sous le max
    return 10 * np.log10(np.mean(garde) + 1e-12)


def limiteur(x, plafond):
    """Baisse le volume juste aux endroits qui dépassent le plafond,
    en douceur (on ne coupe pas brutalement les pointes)."""
    besoin = np.minimum(1.0, plafond / np.maximum(np.abs(x), 1e-9))
    l = nb(0.012)
    fen = np.lib.stride_tricks.sliding_window_view(np.pad(besoin, l, mode="edge"), 2 * l + 1)
    mini = fen.min(axis=1)
    lisse = np.convolve(mini, np.hanning(l + 2)[1:-1] / np.hanning(l + 2)[1:-1].sum(), mode="same")
    # (chaque point du gain lissé est une moyenne de minimums : il ne dépasse
    #  jamais le gain nécessaire, donc aucune pointe ne passe le plafond)
    return np.clip(x * lisse, -plafond, plafond)


def ecrire_wav(chemin, x):
    os.makedirs(os.path.dirname(chemin), exist_ok=True)
    donnees = np.round(np.clip(x, -1, 1) * 32767).astype("<i2")
    with wave.open(chemin, "wb") as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(SR)
        f.writeframes(donnees.tobytes())


def fabriquer_tout():
    """Fabrique les 54 sons « bruts », puis les égalise ensemble."""
    global de
    bruts = {}
    for univers, liste in UNIVERS.items():
        for nom, fonction in liste:
            de = np.random.default_rng(zlib.crc32(f"{univers}/{nom}".encode()))
            x = fonction()
            x = couper_silences(adoucir_aigus(x))
            bruts[(univers, nom)] = x / np.abs(x).max() * CRETE
    # Le volume ressenti de chaque son quand sa pointe est à 0,7
    sonies = {cle: sonie(x) for cle, x in bruts.items()}
    # La cible : un niveau que presque tous les sons atteignent
    # (les sons très « pointus », comme les clochettes, sont un peu limités)
    cible = np.percentile(list(sonies.values()), 25)
    finis = {}
    for cle, x in bruts.items():
        gain_db = cible - sonies[cle]
        gain_db = min(gain_db, 6.0)         # au plus 6 dB de limitation
        y = x * 10 ** (gain_db / 20)
        if np.abs(y).max() > CRETE:
            y = limiteur(y, CRETE)
        # si le son est encore un peu « en dessous », on le laisse ainsi
        finis[cle] = fondus(y)
        if "--details" in sys.argv:
            print(f"{cle[0]}/{cle[1]:14s} sonie à 0,7 : {sonies[cle]:6.1f} dB   gain : {gain_db:+5.1f} dB")
    return finis


def main():
    finis = fabriquer_tout()
    for (univers, nom), x in finis.items():
        ecrire_wav(os.path.join(DOSSIER_SONS, univers, nom + ".wav"), x)
    print(f"{len(finis)} fichiers écrits dans {DOSSIER_SONS}")
    if "--apercu" in sys.argv:
        dossier = sys.argv[sys.argv.index("--apercu") + 1]
        for univers, liste in UNIVERS.items():
            morceaux = []
            for nom, _ in liste:
                morceaux += [finis[(univers, nom)], np.zeros(nb(0.4))]
            ecrire_wav(os.path.join(dossier, f"apercu-{univers}.wav"), np.concatenate(morceaux[:-1]))
        print(f"Aperçus écrits dans {dossier}")


if __name__ == "__main__":
    main()
