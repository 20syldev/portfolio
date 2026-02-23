---
title: Configurer un domaine OVH avec GitHub Pages
description: Guide complet pour lier votre domaine OVH à votre site GitHub Pages avec configuration DNS et emails.
category: github
slug: configuration/ovh
order: 3
---

## Introduction {#intro}

**OVH** (maintenant **OVHcloud**) est un hébergeur et registrar européen très populaire, particulièrement en France. Ce guide vous montre comment configurer votre domaine OVH pour qu'il pointe vers votre site GitHub Pages, et comment configurer des emails professionnels.

### Prérequis

- Un compte OVH avec un domaine enregistré
- Un site GitHub Pages déjà configuré (voir [notre guide](/help/github/pages))
- Accès au panneau de contrôle de votre dépôt GitHub

## Configuration DNS {#dns}

### Étape 1 : Accéder à la zone DNS

1. Connectez-vous à votre [espace client OVH](https://www.ovh.com/manager/)
2. Dans le menu de gauche, allez dans **Noms de domaine**
3. Cliquez sur votre domaine
4. Allez dans l'onglet **Zone DNS**

### Étape 2 : Configurer les enregistrements DNS

#### Pour un domaine racine (example.com)

Dans la zone DNS, vous devez modifier ou ajouter des enregistrements.

**Supprimer les enregistrements existants :**

Supprimez les enregistrements A existants qui pointent vers les serveurs OVH (généralement des IP comme 213.186.x.x ou 91.121.x.x).

**Ajouter les enregistrements A pour GitHub Pages :**

Cliquez sur **Ajouter une entrée** > **A**

| Type | Sous-domaine | Cible           | TTL  |
| ---- | ------------ | --------------- | ---- |
| A    | (vide)       | 185.199.108.153 | 3600 |
| A    | (vide)       | 185.199.109.153 | 3600 |
| A    | (vide)       | 185.199.110.153 | 3600 |
| A    | (vide)       | 185.199.111.153 | 3600 |

> **Note** : Le sous-domaine vide représente votre domaine racine (example.com).

#### Pour un sous-domaine (www.example.com)

Supprimez l'enregistrement CNAME existant pour "www" s'il existe, puis ajoutez :

Cliquez sur **Ajouter une entrée** > **CNAME**

| Type  | Sous-domaine | Cible                            | TTL  |
| ----- | ------------ | -------------------------------- | ---- |
| CNAME | www          | `<votre-utilisateur>.github.io.` | 3600 |

> **Important** :
>
> - Remplacez `<votre-utilisateur>` par votre nom d'utilisateur GitHub
> - N'oubliez pas le point final (`.`) à la fin de la cible pour OVH

### Étape 3 : Valider les modifications

1. Vérifiez que tous les enregistrements sont corrects
2. Cliquez sur **Valider** ou **Appliquer la configuration**
3. OVH affichera un message indiquant que les modifications seront effectives sous 4 à 24 heures

> **Astuce** : En pratique, les modifications OVH sont souvent propagées en 10-30 minutes.

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

1. Attendez 10-30 minutes pour la propagation DNS
2. Visitez votre domaine dans un navigateur
3. Votre site GitHub Pages devrait s'afficher
4. Vérifiez que HTTPS fonctionne (cadenas vert dans la barre d'adresse)

## Configuration des emails {#email}

### Option 1 : Redirection Email (Gratuite)

OVH propose une redirection d'emails gratuite et illimitée, très pratique pour un portfolio ou un site personnel.

#### Configuration de la redirection

1. Dans votre espace client OVH, allez dans **Noms de domaine**
2. Cliquez sur votre domaine
3. Allez dans l'onglet **Emails** > **Redirections**
4. Cliquez sur **Ajouter une redirection**
5. Configurez la redirection :

**Exemple de configuration :**

| De (adresse à rediriger) | Vers (destination)    |
| ------------------------ | --------------------- |
| contact@votredomaine.com | votre.email@gmail.com |
| info@votredomaine.com    | votre.email@gmail.com |
| hello@votredomaine.com   | votre.email@gmail.com |

#### Configurer un Catch-All

OVH permet facilement de configurer un Catch-All :

1. Dans **Redirections**, cliquez sur **Ajouter une redirection**
2. Pour l'adresse source, utilisez : `*@votredomaine.com`
3. Pour la destination, entrez : `votre.email@gmail.com`
4. Validez

> **Important** : Tous les emails envoyés à n'importe quelle adresse de votre domaine seront redirigés vers votre email principal.

#### Enregistrements MX pour les redirections

OVH configure automatiquement les enregistrements MX nécessaires. Vérifiez dans **Zone DNS** que ces enregistrements sont présents :

| Type | Sous-domaine | Cible             | Priorité | TTL  |
| ---- | ------------ | ----------------- | -------- | ---- |
| MX   | (vide)       | mx1.mail.ovh.net. | 1        | 3600 |
| MX   | (vide)       | mx2.mail.ovh.net. | 5        | 3600 |
| MX   | (vide)       | mx3.mail.ovh.net. | 10       | 3600 |

### Option 2 : MX Plan (Email Pro - Payant)

OVH propose **MX Plan** (environ 1€/mois par adresse) pour des emails professionnels complets avec webmail.

#### Souscription

1. Dans l'espace client, allez dans **Emails**
2. Cliquez sur **Commander** > **MX Plan**
3. Choisissez le nombre de comptes nécessaires
4. Complétez la commande

#### Configuration

1. Une fois activé, allez dans **Emails** > **Mes adresses email**
2. Créez vos comptes email (ex: contact@votredomaine.com)
3. Définissez les mots de passe
4. Accédez au webmail via [webmail.ovh.net](https://webmail.ovh.net)

#### Paramètres IMAP/SMTP pour MX Plan

Pour configurer votre client email (Thunderbird, Outlook, Apple Mail) :

**IMAP (Réception) :**

- Serveur : `ssl0.ovh.net`
- Port : 993
- Sécurité : SSL/TLS
- Nom d'utilisateur : votre adresse email complète

**SMTP (Envoi) :**

- Serveur : `ssl0.ovh.net`
- Port : 465 (SSL) ou 587 (STARTTLS)
- Sécurité : SSL/TLS
- Authentification : Oui
- Nom d'utilisateur : votre adresse email complète

### Option 3 : Email Pro ou Exchange (Professionnel)

Pour des besoins plus avancés, OVH propose :

- **Email Pro** : Solution professionnelle avec 10 GB par compte
- **Exchange** : Solution Microsoft Exchange complète avec calendrier partagé, contacts, etc.

Ces solutions sont plus coûteuses (3-10€/mois par compte) mais offrent plus de fonctionnalités.

### Option 4 : Services externes (Google Workspace, etc.)

Vous pouvez utiliser Google Workspace ou d'autres services avec votre domaine OVH.

#### Configuration des enregistrements MX pour Google Workspace

Dans votre zone DNS OVH, supprimez les enregistrements MX existants et ajoutez :

| Type | Sous-domaine | Cible                    | Priorité | TTL  |
| ---- | ------------ | ------------------------ | -------- | ---- |
| MX   | (vide)       | ASPMX.L.GOOGLE.COM.      | 1        | 3600 |
| MX   | (vide)       | ALT1.ASPMX.L.GOOGLE.COM. | 5        | 3600 |
| MX   | (vide)       | ALT2.ASPMX.L.GOOGLE.COM. | 5        | 3600 |
| MX   | (vide)       | ALT3.ASPMX.L.GOOGLE.COM. | 10       | 3600 |
| MX   | (vide)       | ALT4.ASPMX.L.GOOGLE.COM. | 10       | 3600 |

> **Note** : N'oubliez pas le point final (`.`) pour chaque cible.

## Résolution des problèmes {#issues}

### Le site ne s'affiche pas

1. **Vérifiez la propagation DNS** :
    - Utilisez [DNS Checker](https://dnschecker.org) pour vérifier la propagation
    - Utilisez aussi l'outil OVH : **Zone DNS** > **Vérifier la propagation**
2. **Vérifiez les enregistrements A** :
    - Assurez-vous d'avoir les 4 adresses IP GitHub Pages
    - Vérifiez qu'il n'y a pas d'anciens enregistrements A
3. **Mode DNS OVH** :
    - Vérifiez que vous utilisez les DNS OVH et non des DNS externes
4. **Fichier CNAME GitHub** :
    - Ne supprimez pas le fichier `CNAME` créé automatiquement par GitHub

### HTTPS ne fonctionne pas

1. Attendez 24h après la configuration (le certificat SSL peut prendre du temps)
2. Décochez puis recochez **Enforce HTTPS** dans GitHub Pages
3. Videz le cache de votre navigateur
4. Vérifiez que vous n'avez pas de redirection HTTPS forcée dans OVH (désactivez-la pour GitHub Pages)

### Les emails ne fonctionnent pas

1. **Vérifiez les enregistrements MX** dans la zone DNS
2. **Vérifiez que les redirections sont actives** dans l'onglet Emails > Redirections
3. **Testez avec un email externe** : envoyez un email depuis Gmail ou autre
4. **Consultez les logs** : OVH fournit des logs de livraison dans l'espace client
5. **Vérifiez les spams** : le premier email peut être marqué comme spam
6. **Attendez la propagation** : les changements MX peuvent prendre jusqu'à 24h

### Erreur "Domain's DNS record could not be retrieved"

1. Attendez quelques minutes et réessayez
2. Vérifiez que les enregistrements DNS sont corrects (notamment le point final pour CNAME)
3. Supprimez le domaine personnalisé dans GitHub et reconfigurez-le
4. Vérifiez que les DNS du domaine pointent bien vers les serveurs OVH

### Propagation DNS lente

Si la propagation prend plus de 4 heures :

1. Vérifiez que vous utilisez bien les serveurs DNS OVH :
    - Allez dans **Serveurs DNS** (onglet du domaine)
    - Ils doivent être du type `dnsXX.ovh.net` et `nsXX.ovh.net`
2. Si vous avez récemment changé de DNS, attendez 24-48h
3. Videz le cache DNS local :
    - Windows : `ipconfig /flushdns`
    - Mac : `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`
    - Linux : `sudo systemd-resolve --flush-caches`

### Zone DNS en lecture seule

Si vous ne pouvez pas modifier la zone DNS :

1. Le domaine est peut-être en **mode DNS externe** (utilise des DNS non-OVH)
2. Allez dans **Serveurs DNS** et réactivez les DNS OVH si nécessaire
3. Attendez 24-48h pour la propagation complète

## Conseils et bonnes pratiques {#tips}

### Sécurité

1. **Activez toujours HTTPS** sur GitHub Pages
2. **Activez la vérification en deux étapes** sur votre compte OVH
3. **Activez la protection WHOIS** pour masquer vos informations personnelles
4. **Configurez un SPF record** pour améliorer la délivrabilité des emails :

Dans Zone DNS, ajoutez un enregistrement TXT :

| Type | Sous-domaine | Valeur                         | TTL  |
| ---- | ------------ | ------------------------------ | ---- |
| TXT  | (vide)       | v=spf1 include:mx.ovh.com ~all | 3600 |

### Performance

1. **Utilisez TTL 3600** (1 heure) pour un bon équilibre entre rapidité et flexibilité
2. **Configurez apex et www** pour une meilleure compatibilité
3. **Activez DNSSEC** dans OVH pour plus de sécurité (optionnel)

### Organisation

1. **Documentez vos modifications DNS** avec des commentaires (OVH le permet)
2. **Utilisez la redirection gratuite avec Catch-All** pour recevoir tous les emails
3. **Créez des alias** pour différents usages (contact, support, hello, etc.)
4. **Surveillez la date d'expiration** de votre domaine dans l'espace client

### Économies

1. **La redirection email OVH est gratuite et illimitée** : profitez-en !
2. **Comparez MX Plan avec des alternatives** avant de souscrire
3. **Activez le renouvellement automatique** pour éviter de perdre votre domaine
4. **Profitez des promotions OVH** lors des renouvellements

## Avantages OVH {#advantages}

- **Redirection email gratuite et illimitée** avec Catch-All
- Interface en français
- Support client réactif (téléphone, chat, tickets)
- Propagation DNS généralement rapide (10-30 minutes)
- Nombreuses options avancées (DNSSEC, DynHost, etc.)
- Prix compétitifs pour les noms de domaine en .fr
- Infrastructure européenne (RGPD compliant)

## Récapitulatif {#summary}

**Configuration DNS :**

- 4 enregistrements A pointant vers GitHub Pages
- 1 enregistrement CNAME pour www (avec point final)
- Anciens enregistrements supprimés
- Domaine personnalisé configuré dans GitHub Pages
- HTTPS activé

**Configuration Email :**

- Redirections configurées ou MX Plan activé
- Catch-All configuré (recommandé)
- Enregistrements MX vérifiés
- Enregistrement SPF ajouté (optionnel mais recommandé)

Votre site est maintenant accessible via votre domaine OVH avec des emails professionnels ! 🎉

## Ressources {#resources}

- [Documentation OVH Zone DNS](https://docs.ovh.com/fr/domains/editer-ma-zone-dns/)
- [Documentation OVH Redirection Email](https://docs.ovh.com/fr/emails/guide-des-redirections-emails/)
- [Documentation GitHub Pages Custom Domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [DNS Checker](https://dnschecker.org) - Vérifier la propagation DNS
- [MXToolbox](https://mxtoolbox.com) - Tester les enregistrements MX et email
- [Configurer Cloudflare](/help/github/configuration/cloudflare) - Déléguer vos DNS à Cloudflare pour le CDN et la protection DDoS
- [SSL Checker](https://www.sslshopper.com/ssl-checker.html) - Vérifier le certificat SSL