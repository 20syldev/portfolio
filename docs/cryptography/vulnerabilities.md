---
title: Vulnérabilités cryptographiques
description: Erreurs d'implémentation courantes, attaques connues et cas réels — WEP, Heartbleed, padding oracle, timing attacks.
category: cryptography
slug: vulnerabilities
order: 7
---

## Introduction {#intro}

Les algorithmes cryptographiques modernes sont mathématiquement solides — personne ne casse AES-256 ou ChaCha20 par la force brute. Pourtant, la grande majorité des attaques réelles ne ciblent pas les maths, mais **l'implémentation** : une IV réutilisée, un message d'erreur trop bavard, un temps de réponse qui varie.

Comprendre ces vulnérabilités est essentiel pour écrire du code sécurisé et choisir les bons outils.

## Réutilisation d'IV et de nonce {#iv-reuse}

Un **IV** (vecteur d'initialisation) ou **nonce** (number used once) est une valeur unique ajoutée au chiffrement pour garantir qu'un même message chiffré deux fois produise un résultat différent. Si cette valeur est réutilisée, les conséquences sont catastrophiques.

### AES-CTR — fuite du texte en clair {#ctr-reuse}

En mode CTR, le chiffrement fonctionne par XOR entre le flux de clé et le texte en clair. Si le même nonce est réutilisé avec la même clé, le flux de clé est identique — et un simple XOR entre les deux chiffrés révèle le XOR des textes en clair :

```
Chiffrement normal :
C₁ = P₁ ⊕ KeyStream(nonce, key)
C₂ = P₂ ⊕ KeyStream(nonce, key)    ← même nonce !

Attaque :
C₁ ⊕ C₂ = P₁ ⊕ P₂                  ← les textes en clair sont liés
```

Avec de l'analyse fréquentielle ou du texte connu, un attaquant peut retrouver les deux messages.

### AES-GCM — authentification cassée {#gcm-reuse}

En mode GCM, la réutilisation du nonce est encore pire : elle permet non seulement de retrouver les textes en clair, mais aussi de **forger le tag d'authentification**. L'attaquant peut alors modifier les messages chiffrés sans détection.

### WEP — l'exemple historique {#wep}

Le protocole WEP (Wi-Fi, 1997) utilisait un IV de seulement **24 bits**, soit environ 16 millions de valeurs possibles. Sur un réseau occupé, les IVs étaient réutilisés en quelques minutes. Combiné avec le chiffrement RC4 (flux), cela permettait de casser complètement la clé en capturant suffisamment de paquets.

> **Prévention** : utiliser des nonces suffisamment longs (96 bits minimum), des compteurs, ou des algorithmes qui gèrent les nonces de manière sûre comme XChaCha20 (nonce de 192 bits, quasi impossible à réutiliser par accident).

## Padding oracle {#padding-oracle}

### Padding PKCS#7 {#pkcs7}

En mode CBC, les données doivent être un multiple de la taille du bloc (16 octets pour AES). Le **padding PKCS#7** complète le dernier bloc : si 3 octets manquent, on ajoute `03 03 03`.

### L'attaque {#padding-attack}

Un **padding oracle** existe quand un serveur révèle — par un message d'erreur, un code HTTP différent ou un temps de réponse — si le padding d'un message déchiffré est valide ou non. En exploitant cette information, un attaquant peut déchiffrer un message complet **sans connaître la clé**, octet par octet, en modifiant le chiffré et en observant la réponse.

### POODLE (2014) {#poodle}

L'attaque POODLE ciblait SSLv3, qui utilisait CBC avec un padding non déterministe. Un attaquant pouvait forcer un navigateur à rétrograder de TLS vers SSLv3 (downgrade attack), puis exploiter le padding oracle pour déchiffrer les cookies de session HTTPS.

> **Prévention** : utiliser des modes AEAD (GCM, ChaCha20-Poly1305) qui assurent chiffrement et authentification en même temps. Ne jamais révéler de détails sur les erreurs de déchiffrement — retourner un message générique.

## Attaques par canal auxiliaire {#side-channel}

Les **attaques par canal auxiliaire** (side-channel attacks) n'exploitent pas l'algorithme lui-même, mais des informations physiques qui fuient pendant l'exécution : temps de calcul, consommation électrique, émissions électromagnétiques.

### Timing attacks {#timing}

L'attaque la plus courante en logiciel. Si la comparaison d'un secret s'arrête dès qu'un octet diffère, le temps de réponse révèle combien d'octets sont corrects :

```python
# Vulnerable: early return leaks timing information
def check_password(input, stored):
    for i in range(len(input)):
        if input[i] != stored[i]:
            return False
    return True

# Secure: constant-time comparison
import hmac
def check_password(input, stored):
    return hmac.compare_digest(input, stored)
```

La version vulnérable retourne plus vite si le premier octet est faux. En mesurant précisément le temps de réponse, un attaquant peut deviner le secret octet par octet.

### Autres canaux auxiliaires {#other-channels}

- **Cache timing** — L'accès à la mémoire cache du processeur est plus rapide qu'à la mémoire principale. En mesurant les temps d'accès, un attaquant peut déduire quelles données ont été utilisées (attaques Flush+Reload, Spectre).
- **Analyse de puissance** — Sur du matériel embarqué (cartes à puce), la consommation électrique varie selon les opérations effectuées, révélant des bits de clé.

> **Prévention** : utiliser des implémentations à **temps constant** (constant-time), des bibliothèques spécialisées (libsodium, BoringSSL), et éviter les branches conditionnelles qui dépendent de données secrètes.

## Cas réels célèbres {#real-world}

| Année | Vulnérabilité | Cause                     | Impact                          |
| ----- | ------------- | ------------------------- | ------------------------------- |
| 2001  | WEP cracking  | IV 24 bits réutilisé      | Wi-Fi cassé en minutes          |
| 2011  | BEAST         | CBC en TLS 1.0            | Déchiffrement partiel HTTPS     |
| 2014  | Heartbleed    | Buffer over-read OpenSSL  | Fuite de clés privées serveur   |
| 2014  | POODLE        | Padding oracle SSLv3      | Déchiffrement de sessions HTTPS |
| 2017  | SHAttered     | Collision SHA-1           | Deux PDFs différents, même hash |
| 2017  | KRACK         | Réinstallation nonce WPA2 | Déchiffrement trafic Wi-Fi      |
| 2019  | Dragonblood   | WPA3 side-channel         | Récupération mot de passe Wi-Fi |

Chacune de ces vulnérabilités a eu un impact majeur et a forcé des mises à jour de protocoles à l'échelle mondiale.

## Heartbleed en détail {#heartbleed}

Heartbleed (CVE-2014-0160) est l'une des vulnérabilités les plus graves de l'histoire d'Internet. Elle touchait **OpenSSL**, la bibliothèque utilisée par environ deux tiers des serveurs web.

### Le mécanisme {#heartbleed-mechanism}

L'extension **Heartbeat** de TLS permet de maintenir une connexion active : le client envoie un message avec un payload et sa longueur, le serveur renvoie le même payload. Le bug : OpenSSL ne vérifiait pas que la longueur déclarée correspondait à la longueur réelle du payload.

```
Client                         Serveur
  │    Heartbeat: "hello" (5)     │
  │  ──────────────────────────>  │
  │                               │  Lit 5 octets, renvoie "hello" ✓
  │  <──────────────────────────  │
  │                               │
  │    Heartbeat: "hi" (65535)    │    ← longueur mensongère !
  │  ──────────────────────────>  │
  │                               │  Lit 65535 octets en mémoire !
  │  <──────────────────────────  │  "hi" + clés privées + mots de passe...
```

### Ce qui fuitait {#heartbleed-leak}

Le serveur renvoyait jusqu'à **64 Ko** de mémoire adjacente au buffer, pouvant contenir :

- **Clés privées TLS** du serveur — permettant de déchiffrer tout le trafic passé et futur
- **Cookies de session** — permettant de se connecter en tant qu'un autre utilisateur
- **Mots de passe** en transit — envoyés par d'autres utilisateurs au même moment

Le correctif était simple : vérifier que la longueur déclarée ne dépasse pas la taille réelle du payload. Mais le mal était fait — tous les serveurs affectés devaient révoquer et régénérer leurs certificats TLS.

## Bonnes pratiques {#best-practices}

- **Utiliser des bibliothèques éprouvées** (OpenSSL, libsodium, BoringSSL) — ne jamais implémenter sa propre cryptographie
- **Utiliser des modes AEAD** (AES-GCM, ChaCha20-Poly1305) au lieu de CBC seul
- **Ne jamais réutiliser un IV ou un nonce** avec la même clé
- **Comparaisons à temps constant** pour tout secret (mots de passe, tokens, HMAC)
- **Maintenir les bibliothèques à jour** — les correctifs de sécurité sont critiques
- **Préférer les protocoles modernes** — TLS 1.3, WPA3, SSH avec des algorithmes récents
- **Ne pas révéler d'informations d'erreur** — un message générique pour toute erreur de déchiffrement

## Pour aller plus loin {#next}

- [Chiffrement symétrique](/help/cryptography/symmetric) — AES, modes d'opération
- [Fonctions de hachage](/help/cryptography/hashing) — SHA-256, collisions
- [Hash cracking](/help/hacking/hashing) — attaques pratiques sur les hash