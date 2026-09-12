---
name: ZPKI
description: Gestionnaire de certificats X.509 adossé à OpenSSL, par ZENETYS.
longDescription: "Gestionnaire de PKI développé et open-sourcé par ZENETYS : un CLI Bash au-dessus d'OpenSSL, une API Node.js qui l'expose en HTTP et une interface web sans framework pour créer, renouveler, révoquer et télécharger les certificats de plusieurs autorités de certification."
tags: ["Node.js", "Bash", "OpenSSL", "PKI"]
github: "https://github.com/zenetys/zpki"
demo: "https://tools.zenetys.com/zpki/"
---

## À propos {#about}

ZPKI est un gestionnaire de **PKI** (infrastructure à clés publiques) développé et open-sourcé par [ZENETYS](https://www.zenetys.com), pour administrer ses autorités de certification internes et celles de ses clients.
L'outil se découpe en trois couches : un **CLI Bash** qui enveloppe OpenSSL, une **API Node.js** qui expose ses actions en HTTP, et une **interface web** pour piloter l'ensemble depuis un navigateur.
J'ai développé l'interface et l'API, le CLI étant un travail collectif de l'équipe. Une démo est disponible sur [tools.zenetys.com/zpki](https://tools.zenetys.com/zpki/) et le code est publié sur [github.com/zenetys/zpki](https://github.com/zenetys/zpki).

## Pourquoi ce projet ? {#why}

Gérer une autorité de certification à la main revient à enchaîner des commandes `openssl` longues et faciles à rater : générer la clé, écrire le fichier de configuration, produire la CSR, la signer avec les bonnes extensions, mettre à jour l'index puis régénérer la CRL — le tout en ressaisissant la passphrase à chaque étape.
L'objectif était donc de :

- **encapsuler les séquences OpenSSL** derrière des actions nommées, reproductibles et scriptables
- **donner une vue d'ensemble** des certificats d'une CA : statut, dates, type, noms alternatifs
- **déléguer les opérations courantes** — créer, renouveler, révoquer, télécharger — à une interface web, sans donner d'accès shell au serveur

## Le CLI {#cli}

`zpki` est un script Bash qui pilote OpenSSL et matérialise chaque autorité dans son propre répertoire : sa configuration, sa clé, son certificat, sa CRL et un index `ca.idz` qui recense les certificats émis.
Les actions couvrent tout le cycle de vie : `create-ca`, `ca-create-crt`, `ca-sign-csr`, `ca-update-crt`, `ca-revoke-crt`, `ca-disable-crt`, `ca-update-crl`, `ca-update-db`, ainsi que les `ca-dump-*` qui extraient un certificat, une CSR, une clé ou un export PKCS#12.
Les valeurs par défaut sont surchargeables par variables d'environnement : RSA 4096 bits, empreinte **SHA-256**, validité de 366 jours et chiffrement AES-256 des clés privées.
Enfin, `ca-list --json` sort l'inventaire de la CA dans un format machine — c'est exactement ce que l'API sert à l'interface.

## L'API {#api}

L'API est une application **Express** en modules ES qui sert l'interface en statique et traduit chaque appel HTTP en invocation du CLI : `/list`, `/create`, `/renew`, `/revoke`, `/disable`, `/subject-alt` et la famille `/download-*`.
Une autorité correspond à un **profil**, découvert en listant les répertoires qui contiennent un `ca.idz` — le résultat est mis en cache et le profil courant est mémorisé dans la session.
Elle n'implémente aucune logique cryptographique en propre : toute la PKI reste dans le CLI, l'API ne fait que l'exposer proprement.

## Sécurité {#security}

La passphrase de la CA est le point sensible de l'outil, et tout est construit autour :

- **Validée avant d'être acceptée** — `ca-test-password` vérifie la passphrase, puis elle est conservée **côté serveur** dans la session et n'est jamais renvoyée au navigateur
- **Expirée automatiquement** — un délai configurable (dix minutes par défaut) la retire de la session, et le verrou de l'interface l'efface immédiatement à la demande
- **Transmise par l'environnement** — les passphrases arrivent à OpenSSL via des variables d'environnement, jamais en argument de ligne de commande où elles seraient visibles dans la liste des processus
- **Entrées contrôlées** — le nom commun est validé par une expression régulière et chaque argument passé au shell est échappé avant exécution
- **Privilèges séparés** — en production, le service tourne sous un utilisateur dédié qui appelle le CLI via `sudo -u` vers l'utilisateur propriétaire des données, avec une règle sudoers restreinte aux deux scripts

## L'interface {#ui}

L'interface a été entièrement refondue : la version Bootstrap historique a laissé place à un front-end **sans framework ni étape de build**, en HTML statique, modules ES natifs et CSS maison.
Le code est découpé par responsabilité — `core` pour l'état, les requêtes et le thème, `components` pour la table, les modales et les notifications, `features` pour les certificats, les filtres et le verrou, `views` pour chaque modale, `i18n` pour les traductions.

- **Inventaire** — un tableau listant statut, nom commun, numéro de série, type, dates de validité, téléchargements et actions
- **Recherche et filtres** — des filtres valides / expirés / révoqués / désactivés combinables et une recherche, dont l'état est reflété dans l'URL pour être partagé ou rechargé
- **Création multi-SAN** — nom commun, noms alternatifs `DNS:` et `IP:` ajoutés sous forme de tags avec validation de format, type serveur ou utilisateur, et fenêtre de validité
- **Renouvellement** — régénération du certificat existant, avec l'option de régénérer aussi la CSR pour prendre en compte de nouveaux SAN
- **Révocation et désactivation** — confirmées par une modale, la CRL étant régénérée dans la foulée
- **Verrou de session** — un cadenas dans la barre latérale ouvre la saisie de la passphrase et permet de reverrouiller l'interface à tout moment
- **Téléchargements** — `.crt`, `.csr`, `.key`, export `.p12` protégé par une passphrase d'export, certificat de la CA et CRL
- **Multi-CA** — un sélecteur bascule d'une autorité à l'autre, le verrou étant réinitialisé à chaque changement
- **Raccourcis clavier** — `Alt+N` pour un nouveau certificat, `Alt+F` pour la recherche, `Alt+U` et `Alt+L` pour le verrou, `Alt+C` pour changer de CA, `Alt+D` pour télécharger, `Alt+K` pour l'aide, plus la navigation du tableau aux flèches
- **Bilingue et thèmes** — français et anglais traduits côté client, thème clair ou sombre aligné sur la préférence système puis sur le choix mémorisé

## Déploiement {#deploy}

Tout se configure par variables d'environnement, dans un fichier `.env` ou directement dans l'unité systemd : adresse et port d'écoute, répertoire de base des CA, commandes à invoquer, durées d'expiration et proxys de confiance.
Le service s'installe derrière un reverse proxy, ce qui permet de le servir sur la même origine que les autres outils — c'est ainsi qu'il s'affiche dans la visionneuse intégrée de [Zenetys Tools](/projet/zeportal).
Un **mode démo** est également prévu : il affiche dans l'interface la passphrase à utiliser, pour une instance publique de démonstration.

## Stack technique {#tech}

Le CLI est écrit en **Bash** au-dessus d'**OpenSSL**, l'API en **Node.js** avec **Express** (modules ES, express-session, cors et dotenv), et l'interface en HTML, CSS et JavaScript natifs, sans dépendance ni bundler.
Le projet est publié sous licence **MIT**.

## Ressources {#resources}

- **Code source** — [github.com/zenetys/zpki](https://github.com/zenetys/zpki), publié en open source par ZENETYS
- **Démo en ligne** — [tools.zenetys.com/zpki](https://tools.zenetys.com/zpki/)
- **Démo vidéo** — une présentation est disponible sur la [page alternance](/alternance#zpki)