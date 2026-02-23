---
title: Configurer un domaine GoDaddy avec GitHub Pages
description: Guide complet pour lier votre domaine GoDaddy à votre site GitHub Pages avec configuration DNS et emails.
category: github
slug: configuration/godaddy
order: 2
---

## Introduction {#intro}

**GoDaddy** est l'un des plus grands registrars de noms de domaine au monde. Ce guide vous montre comment configurer votre domaine GoDaddy pour qu'il pointe vers votre site GitHub Pages, et comment configurer des emails professionnels.

### Prérequis

- Un compte GoDaddy avec un domaine enregistré
- Un site GitHub Pages déjà configuré (voir [notre guide](/help/github/pages))
- Accès au panneau de contrôle de votre dépôt GitHub

## Configuration DNS {#dns}

### Étape 1 : Accéder à la gestion DNS

1. Connectez-vous à votre compte [GoDaddy](https://godaddy.com)
2. Cliquez sur votre nom d'utilisateur en haut à droite, puis sur **Mes produits**
3. Trouvez votre domaine dans la liste et cliquez sur **DNS** à côté
4. Vous êtes maintenant dans le gestionnaire DNS

### Étape 2 : Configurer les enregistrements DNS

#### Pour un domaine racine (example.com)

Dans la section **Enregistrements**, modifiez ou ajoutez les enregistrements suivants :

**Enregistrements A** (pour le domaine racine) :

Supprimez l'enregistrement A existant pointant vers le parking GoDaddy, puis ajoutez :

| Type | Nom | Valeur          | TTL          |
| ---- | --- | --------------- | ------------ |
| A    | @   | 185.199.108.153 | 600 secondes |
| A    | @   | 185.199.109.153 | 600 secondes |
| A    | @   | 185.199.110.153 | 600 secondes |
| A    | @   | 185.199.111.153 | 600 secondes |

> **Note** : Le symbole `@` représente votre domaine racine (example.com).

#### Pour un sous-domaine (www.example.com)

Modifiez ou ajoutez un enregistrement CNAME :

| Type  | Nom | Valeur                          | TTL     |
| ----- | --- | ------------------------------- | ------- |
| CNAME | www | `<votre-utilisateur>.github.io` | 1 heure |

> **Important** : Remplacez `<votre-utilisateur>` par votre nom d'utilisateur GitHub. N'ajoutez pas de point final.

### Étape 3 : Supprimer les enregistrements par défaut

GoDaddy crée souvent des enregistrements par défaut qui peuvent interférer. Supprimez :

- Les enregistrements A pointant vers l'IP de parking GoDaddy (généralement 184.168.x.x)
- L'enregistrement CNAME de "www" s'il pointe vers "@" ou vers une autre destination

### Étape 4 : Configurer GitHub Pages

1. Allez sur votre dépôt GitHub
2. Cliquez sur **Settings** > **Pages**
3. Dans la section **Custom domain**, entrez votre domaine :
    - Pour le domaine racine : `example.com`
    - Pour le sous-domaine : `www.example.com`
4. Cliquez sur **Save**
5. Attendez que la vérification DNS se termine (cela peut prendre quelques minutes)
6. Une fois vérifié, cochez **Enforce HTTPS** pour activer le certificat SSL gratuit

### Étape 5 : Vérifier la configuration

1. Attendez 10-30 minutes pour la propagation DNS (peut prendre jusqu'à 48h dans de rares cas)
2. Visitez votre domaine dans un navigateur
3. Votre site GitHub Pages devrait s'afficher
4. Vérifiez que HTTPS fonctionne (cadenas vert dans la barre d'adresse)

## Configuration des emails {#email}

### Option 1 : Email Forwarding (Redirection gratuite)

GoDaddy offre une redirection d'emails gratuite basique pour rediriger un nombre limité d'adresses.

#### Configuration de la redirection

1. Dans **Mes produits**, trouvez votre domaine
2. Cliquez sur **Email** ou **Gérer** dans la section Email
3. Sélectionnez **Redirection d'emails** (Email Forwarding)
4. Cliquez sur **Créer une adresse de redirection**

**Exemple de configuration :**

| Adresse à transférer     | Vers                  |
| ------------------------ | --------------------- |
| contact@votredomaine.com | votre.email@gmail.com |
| info@votredomaine.com    | votre.email@gmail.com |

> **Limitation** : GoDaddy limite généralement le nombre de redirections gratuites (souvent à 100 par domaine). Consultez votre plan pour les détails.

#### Configuration manuelle des enregistrements MX

Si la redirection automatique ne fonctionne pas, ajoutez manuellement les enregistrements MX dans votre DNS :

| Type | Nom | Valeur                      | Priorité | TTL     |
| ---- | --- | --------------------------- | -------- | ------- |
| MX   | @   | smtp.secureserver.net       | 0        | 1 heure |
| MX   | @   | mailstore1.secureserver.net | 10       | 1 heure |

### Option 2 : Microsoft 365 via GoDaddy (Payant)

GoDaddy propose Microsoft 365 (anciennement Office 365) pour des emails professionnels complets.

#### Souscription

1. Dans **Mes produits**, cherchez la section **Microsoft 365**
2. Cliquez sur **Ajouter** ou **Voir les plans**
3. Choisissez le plan adapté (Business Basic, Standard, Premium)
4. Complétez l'achat et suivez les instructions de configuration

#### Configuration

1. GoDaddy configure automatiquement les enregistrements DNS nécessaires
2. Accédez à votre webmail via [outlook.office.com](https://outlook.office.com)
3. Créez vos adresses email depuis le portail Microsoft 365

#### Paramètres IMAP/SMTP (Microsoft 365)

**IMAP (Réception) :**

- Serveur : `outlook.office365.com`
- Port : 993
- Sécurité : SSL/TLS

**SMTP (Envoi) :**

- Serveur : `smtp.office365.com`
- Port : 587
- Sécurité : STARTTLS
- Authentification : Oui

### Option 3 : Google Workspace (anciennement G Suite)

Vous pouvez utiliser Google Workspace avec votre domaine GoDaddy pour avoir Gmail avec votre adresse personnalisée.

#### Configuration des enregistrements MX pour Google Workspace

Dans votre gestionnaire DNS GoDaddy, ajoutez ces enregistrements MX :

| Type | Nom | Valeur                  | Priorité | TTL     |
| ---- | --- | ----------------------- | -------- | ------- |
| MX   | @   | ASPMX.L.GOOGLE.COM      | 1        | 1 heure |
| MX   | @   | ALT1.ASPMX.L.GOOGLE.COM | 5        | 1 heure |
| MX   | @   | ALT2.ASPMX.L.GOOGLE.COM | 5        | 1 heure |
| MX   | @   | ALT3.ASPMX.L.GOOGLE.COM | 10       | 1 heure |
| MX   | @   | ALT4.ASPMX.L.GOOGLE.COM | 10       | 1 heure |

Supprimez tous les autres enregistrements MX avant d'ajouter ceux de Google.

### Configuration Catch-All

GoDaddy ne propose pas de Catch-All gratuit avec la simple redirection. Pour un Catch-All :

1. **Avec Microsoft 365** : Configurez une boîte partagée qui reçoit tous les emails
2. **Avec Google Workspace** : Activez le routage Catch-All dans les paramètres Gmail
3. **Alternative** : Utilisez un service externe comme [ImprovMX](https://improvmx.com) (gratuit) ou [Forward Email](https://forwardemail.net) (gratuit)

#### Alternative avec ImprovMX (Gratuit avec Catch-All)

1. Inscrivez-vous sur [ImprovMX](https://improvmx.com)
2. Ajoutez votre domaine
3. Configurez les enregistrements MX dans GoDaddy :

| Type | Nom | Valeur           | Priorité | TTL     |
| ---- | --- | ---------------- | -------- | ------- |
| MX   | @   | mx1.improvmx.com | 10       | 1 heure |
| MX   | @   | mx2.improvmx.com | 20       | 1 heure |

4. Activez le Catch-All dans les paramètres ImprovMX
5. Tous les emails seront redirigés vers votre adresse principale

## Résolution des problèmes {#issues}

### Le site ne s'affiche pas

1. **Vérifiez la propagation DNS** :
    - Utilisez [DNS Checker](https://dnschecker.org) pour vérifier que vos enregistrements DNS sont propagés
2. **Supprimez le parking GoDaddy** :
    - Assurez-vous d'avoir supprimé tous les enregistrements A pointant vers les IP de parking
3. **Vérifiez le fichier CNAME** :
    - GitHub crée automatiquement un fichier `CNAME` dans votre dépôt
    - Ne le supprimez pas
4. **Désactivez le proxy GoDaddy** :
    - Si vous utilisez le proxy GoDaddy, désactivez-le pour GitHub Pages

### HTTPS ne fonctionne pas

1. Attendez 24h après la configuration (le certificat SSL peut prendre du temps)
2. Décochez puis recochez **Enforce HTTPS** dans GitHub Pages
3. Videz le cache de votre navigateur
4. Vérifiez que vous n'avez pas activé le SSL/TLS de GoDaddy (désactivez-le pour GitHub Pages)

### Les emails ne fonctionnent pas

1. **Vérifiez les enregistrements MX** dans le gestionnaire DNS
2. **Testez la redirection** : envoyez un email à votre adresse personnalisée
3. **Vérifiez les spams** : le premier email peut être marqué comme spam
4. **Attendez la propagation** : les changements MX peuvent prendre jusqu'à 48h
5. **Supprimez les anciens MX** : assurez-vous qu'il n'y a pas de conflit entre plusieurs enregistrements MX

### Erreur "Domain's DNS record could not be retrieved"

1. Attendez quelques minutes et réessayez
2. Vérifiez que les enregistrements DNS sont correctement configurés
3. Supprimez le domaine personnalisé dans GitHub et reconfigurez-le
4. Assurez-vous que le domaine n'est pas en période de grâce ou suspendu

### Le DNS ne se propage pas

GoDaddy peut parfois mettre du temps à propager les changements :

1. Essayez de diminuer le TTL à 600 secondes (10 minutes) avant de faire des changements
2. Après avoir fait les changements, attendez au moins 1 heure
3. Utilisez `nslookup votredomaine.com` en ligne de commande pour vérifier
4. Videz le cache DNS de votre ordinateur : `ipconfig /flushdns` (Windows) ou `sudo dscacheutil -flushcache` (Mac)

## Conseils et bonnes pratiques {#tips}

### Sécurité

1. **Activez toujours HTTPS** sur GitHub Pages
2. **Activez la vérification en deux étapes** sur votre compte GoDaddy
3. **Utilisez la protection de confidentialité du domaine** pour masquer vos informations personnelles dans WHOIS
4. **Désactivez le renouvellement automatique des options payantes** si vous ne les utilisez pas

### Performance

1. **Utilisez des TTL courts** (600 secondes) pendant la configuration, puis augmentez à 3600-86400 une fois stable
2. **Configurez le domaine apex** (@) et le sous-domaine www pour une meilleure compatibilité
3. **Désactivez les services non utilisés** comme le parking ou le constructeur de site GoDaddy

### Organisation

1. **Documentez votre configuration DNS** pour référence future
2. **Créez des alias d'email** pour différents usages (contact, support, hello, etc.)
3. **Surveillez la date d'expiration** de votre domaine pour éviter de le perdre

### Économies

1. **N'achetez que ce dont vous avez besoin** : GoDaddy propose souvent de nombreux upsells
2. **Comparez les prix des emails** : Microsoft 365 via GoDaddy peut être plus cher que direct
3. **Utilisez des alternatives gratuites** comme ImprovMX pour les redirections email avec Catch-All

## Récapitulatif {#summary}

**Configuration DNS :**

- 4 enregistrements A pointant vers GitHub Pages
- 1 enregistrement CNAME pour www
- Enregistrements de parking GoDaddy supprimés
- Domaine personnalisé configuré dans GitHub Pages
- HTTPS activé

**Configuration Email :**

- Redirection d'emails ou service payant configuré
- Enregistrements MX correctement définis
- Alias créés (contact@, info@, etc.)

Votre site est maintenant accessible via votre domaine GoDaddy avec des emails professionnels ! 🎉

## Ressources {#resources}

- [Documentation officielle GoDaddy DNS](https://www.godaddy.com/help/manage-dns-680)
- [Documentation GitHub Pages Custom Domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [DNS Checker](https://dnschecker.org) - Vérifier la propagation DNS
- [ImprovMX](https://improvmx.com) - Service de redirection email gratuit avec Catch-All
- [Configurer Cloudflare](/help/github/configuration/cloudflare) - Déléguer vos DNS à Cloudflare pour le CDN et la protection DDoS
- [SSL Checker](https://www.sslshopper.com/ssl-checker.html) - Vérifier le certificat SSL