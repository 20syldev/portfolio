---
title: Configurer un domaine Cloudflare avec GitHub Pages
description: Guide complet pour lier votre domaine Cloudflare à votre site GitHub Pages avec configuration DNS et emails.
category: github
slug: configuration/cloudflare
order: 4
---

## Introduction {#intro}

**Cloudflare** est un service de CDN (Content Delivery Network), de sécurité et de gestion DNS gratuit et très performant. Même si vous avez acheté votre domaine ailleurs (NameCheap, GoDaddy, OVH), vous pouvez utiliser Cloudflare pour gérer vos DNS et bénéficier de nombreux avantages.

### Avantages de Cloudflare

- DNS ultra-rapides et fiables
- CDN gratuit pour accélérer votre site
- Protection DDoS gratuite
- Analytics et statistiques détaillées
- Certificat SSL universel gratuit
- Redirection d'emails (via Email Routing, gratuit)
- Interface moderne et intuitive

### Prérequis

- Un domaine enregistré chez [NameCheap](/help/github/configuration/namecheap), [GoDaddy](/help/github/configuration/godaddy), [OVH](/help/github/configuration/ovh) ou tout autre registrar
- Un compte Cloudflare gratuit
- Un site GitHub Pages déjà configuré (voir [notre guide](/help/github/pages))
- Accès au panneau de contrôle de votre dépôt GitHub

## Configuration initiale de Cloudflare {#setup}

### Étape 1 : Ajouter votre domaine à Cloudflare

1. Créez un compte sur [Cloudflare](https://dash.cloudflare.com/sign-up)
2. Une fois connecté, cliquez sur **Add a Site** (Ajouter un site)
3. Entrez votre nom de domaine (example.com)
4. Cliquez sur **Add site**
5. Sélectionnez le plan **Free** (gratuit)
6. Cliquez sur **Continue**

### Étape 2 : Scanner les enregistrements DNS existants

1. Cloudflare va scanner automatiquement vos enregistrements DNS existants
2. Vérifiez que les enregistrements importants sont détectés
3. Cliquez sur **Continue**

### Étape 3 : Changer les nameservers

Cloudflare vous fournira deux nameservers (serveurs DNS), par exemple :

- `alice.ns.cloudflare.com`
- `bob.ns.cloudflare.com`

Vous devez configurer ces nameservers chez votre registrar :

#### Chez NameCheap

1. Allez dans **Domain List** > **Manage**
2. Dans **Nameservers**, sélectionnez **Custom DNS**
3. Entrez les deux nameservers Cloudflare
4. Sauvegardez

#### Chez GoDaddy

1. Allez dans **My Products** > **DNS**
2. Cliquez sur **Change** à côté de Nameservers
3. Sélectionnez **Enter my own nameservers**
4. Entrez les deux nameservers Cloudflare
5. Sauvegardez

#### Chez OVH

1. Dans l'espace client, allez dans **Serveurs DNS**
2. Cliquez sur **Modifier les serveurs DNS**
3. Choisissez **Ajouter un serveur DNS**
4. Entrez les deux nameservers Cloudflare
5. Supprimez les anciens serveurs OVH
6. Validez

> **Important** : Le changement de nameservers peut prendre de 2 à 48 heures pour se propager.

### Étape 4 : Vérifier l'activation

1. Retournez sur Cloudflare
2. Cliquez sur **Done, check nameservers**
3. Cloudflare vérifiera périodiquement et vous enverra un email quand votre site sera actif
4. Une fois actif, vous verrez **Status: Active** dans votre tableau de bord

## Configuration DNS {#dns}

Une fois votre domaine actif sur Cloudflare, configurez les DNS pour GitHub Pages.

### Étape 1 : Accéder aux paramètres DNS

1. Dans votre tableau de bord Cloudflare, cliquez sur votre domaine
2. Allez dans l'onglet **DNS** > **Records**

### Étape 2 : Configurer les enregistrements

#### Pour un domaine racine (example.com)

Supprimez les enregistrements A existants, puis ajoutez :

**Enregistrements A** (pour le domaine racine) :

Cliquez sur **Add record** pour chaque enregistrement :

| Type | Name | IPv4 address    | Proxy status    | TTL  |
| ---- | ---- | --------------- | --------------- | ---- |
| A    | @    | 185.199.108.153 | DNS only (gris) | Auto |
| A    | @    | 185.199.109.153 | DNS only (gris) | Auto |
| A    | @    | 185.199.110.153 | DNS only (gris) | Auto |
| A    | @    | 185.199.111.153 | DNS only (gris) | Auto |

> **IMPORTANT** : Le **Proxy status** doit être sur **DNS only** (nuage gris), PAS sur **Proxied** (nuage orange). GitHub Pages ne fonctionne pas avec le proxy Cloudflare activé.

#### Pour un sous-domaine (www.example.com)

Ajoutez un enregistrement CNAME :

| Type  | Name | Target                          | Proxy status    | TTL  |
| ----- | ---- | ------------------------------- | --------------- | ---- |
| CNAME | www  | `<votre-utilisateur>.github.io` | DNS only (gris) | Auto |

> **Important** : Remplacez `<votre-utilisateur>` par votre nom d'utilisateur GitHub.

### Étape 3 : Configurer GitHub Pages

1. Allez sur votre dépôt GitHub
2. Cliquez sur **Settings** > **Pages**
3. Dans la section **Custom domain**, entrez votre domaine :
    - Pour le domaine racine : `example.com`
    - Pour le sous-domaine : `www.example.com`
4. Cliquez sur **Save**
5. Attendez que la vérification DNS se termine
6. Une fois vérifié, cochez **Enforce HTTPS** pour activer le certificat SSL gratuit

### Étape 4 : Configuration SSL/TLS sur Cloudflare

1. Dans Cloudflare, allez dans **SSL/TLS**
2. Sélectionnez le mode **Full** ou **Full (strict)**
    - **Full** : Cloudflare se connecte à GitHub en HTTPS (certificat auto-signé accepté)
    - **Full (strict)** : Nécessite un certificat valide sur GitHub (recommandé une fois HTTPS activé)

> **Note** : N'utilisez PAS le mode "Flexible" car cela peut causer des boucles de redirection.

### Étape 5 : Vérifier la configuration

1. Attendez quelques minutes pour la propagation
2. Visitez votre domaine dans un navigateur
3. Votre site GitHub Pages devrait s'afficher
4. Vérifiez que HTTPS fonctionne

## Email Routing {#email}

Cloudflare propose **Email Routing** gratuit qui permet de rediriger les emails de votre domaine vers votre adresse personnelle, avec support du Catch-All !

### Étape 1 : Activer Email Routing

1. Dans votre tableau de bord Cloudflare, allez dans **Email** > **Email Routing**
2. Cliquez sur **Get started**
3. Cloudflare va automatiquement créer les enregistrements MX nécessaires
4. Cliquez sur **Enable Email Routing**

### Étape 2 : Ajouter une adresse de destination

1. Dans **Destination addresses**, cliquez sur **Add destination address**
2. Entrez votre adresse email personnelle (ex: votre.email@gmail.com)
3. Cloudflare enverra un email de vérification
4. Cliquez sur le lien dans l'email pour vérifier l'adresse

### Étape 3 : Créer des règles de routage

1. Dans **Routing rules**, cliquez sur **Create address**
2. Créez vos adresses :

**Exemple de configuration :**

| Custom address           | Action  | Destination           |
| ------------------------ | ------- | --------------------- |
| contact@votredomaine.com | Send to | votre.email@gmail.com |
| info@votredomaine.com    | Send to | votre.email@gmail.com |
| hello@votredomaine.com   | Send to | votre.email@gmail.com |

### Étape 4 : Configurer Catch-All

Pour recevoir tous les emails, même ceux envoyés à des adresses non configurées :

1. Dans **Routing rules**, section **Catch-all address**
2. Activez le **Catch-all**
3. Sélectionnez l'action **Send to** et choisissez votre adresse de destination
4. Cliquez sur **Save**

> **Exemple** : Avec Catch-All activé, les emails envoyés à `anything@votredomaine.com` seront tous redirigés vers votre adresse principale.

### Vérification automatique des enregistrements MX

Cloudflare configure automatiquement ces enregistrements MX :

| Type | Name | Mail server              | Priority | TTL  |
| ---- | ---- | ------------------------ | -------- | ---- |
| MX   | @    | route1.mx.cloudflare.net | 60       | Auto |
| MX   | @    | route2.mx.cloudflare.net | 87       | Auto |
| MX   | @    | route3.mx.cloudflare.net | 61       | Auto |

### Envoyer des emails avec votre domaine

**Email Routing** permet seulement de RECEVOIR des emails, pas d'en envoyer. Pour envoyer des emails avec votre domaine :

#### Option 1 : Gmail avec "Send mail as"

1. Dans Gmail, allez dans **Paramètres** > **Comptes et importation**
2. Dans **Envoyer des e-mails en tant que**, cliquez sur **Ajouter une autre adresse**
3. Entrez votre adresse personnalisée (ex: contact@votredomaine.com)
4. Utilisez un service SMTP comme :
    - **SendGrid** (gratuit jusqu'à 100 emails/jour)
    - **Mailgun** (gratuit jusqu'à 5000 emails/mois)
    - **Amazon SES** (très peu cher)

#### Option 2 : Service email complet (payant)

- **Google Workspace** : ~6€/mois (Gmail professionnel avec votre domaine)
- **Microsoft 365** : ~5€/mois
- **ProtonMail** : ~5€/mois (axé sur la confidentialité)

## Fonctionnalités avancées Cloudflare {#advanced}

### Page Rules (Règles de page)

Vous pouvez créer des règles pour améliorer votre site :

1. Allez dans **Rules** > **Page Rules**
2. Créez une règle pour forcer HTTPS :
    - URL : `http://votredomaine.com/*`
    - Setting : **Always Use HTTPS**

### Caching (Cache)

1. Allez dans **Caching** > **Configuration**
2. Réglez le **Browser Cache TTL** selon vos besoins
3. Activez **Respect Existing Headers** pour que GitHub Pages gère le cache

### Analytics

Cloudflare fournit des analytics détaillés gratuitement :

- Visiteurs uniques
- Bande passante utilisée
- Requêtes par pays
- Menaces bloquées
- Et plus encore

## Résolution des problèmes {#issues}

### Le site ne s'affiche pas

1. **Vérifiez le Proxy status** : Il DOIT être sur "DNS only" (gris), pas "Proxied" (orange)
2. **Vérifiez les nameservers** : Utilisez [DNS Checker](https://dnschecker.org) pour confirmer que les nameservers Cloudflare sont actifs
3. **Attendez la propagation** : Peut prendre jusqu'à 48h après le changement de nameservers
4. **Vérifiez le fichier CNAME** : GitHub crée automatiquement un fichier `CNAME` dans votre dépôt

### Boucle de redirection

Si vous obtenez "ERR_TOO_MANY_REDIRECTS" :

1. Allez dans **SSL/TLS** > **Overview**
2. Changez le mode vers **Full** ou **Full (strict)**
3. Assurez-vous que **Enforce HTTPS** est activé dans GitHub Pages
4. Videz le cache de votre navigateur

### HTTPS ne fonctionne pas

1. Vérifiez que **Enforce HTTPS** est activé dans GitHub Pages
2. Attendez 24h pour la génération du certificat SSL
3. Vérifiez le mode SSL/TLS dans Cloudflare (doit être Full ou Full strict)
4. Décochez puis recochez "Enforce HTTPS" dans GitHub

### Les emails ne fonctionnent pas

1. **Vérifiez que Email Routing est activé** dans Cloudflare
2. **Vérifiez l'adresse de destination** : elle doit être vérifiée (email de confirmation)
3. **Testez avec un email externe** : envoyez depuis Gmail ou autre
4. **Vérifiez les spams** : le premier email peut être marqué comme spam
5. **Consultez les logs** : Allez dans Email > Email Routing > Activity log

### Le proxy orange ne fonctionne pas

GitHub Pages **ne fonctionne pas** avec le proxy Cloudflare (nuage orange). Vous DEVEZ utiliser "DNS only" (nuage gris).

Si vous avez besoin des fonctionnalités du proxy :

- Utilisez **Cloudflare Workers** pour des fonctionnalités avancées
- Ou hébergez votre site ailleurs (Netlify, Vercel, etc.) qui supportent le proxy Cloudflare

## Conseils et bonnes pratiques {#tips}

### Sécurité

1. **Activez la vérification en deux étapes** sur votre compte Cloudflare
2. **Configurez SPF et DKIM** pour améliorer la délivrabilité des emails
3. **Utilisez le mode SSL/TLS "Full (strict)"** une fois HTTPS activé sur GitHub
4. **Activez DNSSEC** pour plus de sécurité (dans DNS > Settings)

### Performance

1. **Utilisez Auto TTL** pour les enregistrements DNS
2. **Activez "Minify"** dans **Speed > Optimization** pour HTML, CSS, JS
3. **Activez "Auto Minify"** pour réduire la taille des fichiers
4. **Utilisez "Brotli"** pour une meilleure compression

### Organisation

1. **Documentez votre configuration DNS** dans un fichier ou notes
2. **Utilisez Email Routing avec Catch-All** pour ne manquer aucun email
3. **Créez plusieurs adresses** pour différents usages (contact, support, hello, etc.)
4. **Surveillez les Analytics** pour comprendre le trafic de votre site

### Économies

1. **Le plan Free est largement suffisant** pour un site GitHub Pages
2. **Email Routing est gratuit** et illimité
3. **Le CDN Cloudflare est gratuit** et très performant
4. **Pas besoin de plan payant** sauf si vous avez des besoins très spécifiques

## Avantages de Cloudflare {#advantages}

- **DNS ultra-rapides** (1.1.1.1 est le DNS public le plus rapide au monde)
- **Email Routing gratuit avec Catch-All**
- **Analytics détaillés** sur le trafic
- **Protection DDoS** gratuite
- **SSL universel** (bien que GitHub fournisse déjà HTTPS)
- **Interface moderne** et facile à utiliser
- **API complète** pour l'automatisation
- **Support mondial** avec datacenters dans 300+ villes

## Récapitulatif {#summary}

**Configuration DNS :**

- Nameservers changés chez votre registrar
- 4 enregistrements A pointant vers GitHub Pages (nuage gris)
- 1 enregistrement CNAME pour www (nuage gris)
- Domaine personnalisé configuré dans GitHub Pages
- HTTPS activé sur GitHub Pages
- Mode SSL/TLS "Full" ou "Full (strict)" sur Cloudflare

**Configuration Email :**

- Email Routing activé
- Adresse de destination vérifiée
- Règles de routage créées
- Catch-All configuré

Votre site est maintenant accessible via votre domaine avec Cloudflare et des emails professionnels gratuits ! 🎉

## Ressources {#resources}

- [Documentation Cloudflare DNS](https://developers.cloudflare.com/dns/)
- [Documentation Email Routing](https://developers.cloudflare.com/email-routing/)
- [Documentation GitHub Pages Custom Domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [DNS Checker](https://dnschecker.org) - Vérifier la propagation DNS
- [Cloudflare Community](https://community.cloudflare.com) - Forum d'entraide
- [SSL Checker](https://www.sslshopper.com/ssl-checker.html) - Vérifier le certificat SSL

- [Cloudflare Status](https://www.cloudflarestatus.com) - État des services Cloudflare