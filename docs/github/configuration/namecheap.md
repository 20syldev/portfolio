---
title: Configurer un domaine NameCheap avec GitHub Pages
description: Guide complet pour lier votre domaine NameCheap à votre site GitHub Pages avec configuration DNS et emails.
category: github
slug: configuration/namecheap
order: 1
---

## Introduction {#intro}

**NameCheap** est un registrar de noms de domaine populaire et abordable. Ce guide vous montre comment configurer votre domaine NameCheap pour qu'il pointe vers votre site GitHub Pages, et comment configurer des emails professionnels.

### Prérequis

- Un compte NameCheap avec un domaine enregistré
- Un site GitHub Pages déjà configuré (voir [notre guide](/help/github/pages))
- Accès au panneau de contrôle de votre dépôt GitHub

## Configuration DNS {#dns}

### Étape 1 : Accéder à la gestion DNS

1. Connectez-vous à votre compte [NameCheap](https://namecheap.com)
2. Allez dans **Domain List** (Liste de domaines)
3. Cliquez sur **Manage** (Gérer) à côté de votre domaine
4. Allez dans l'onglet **Advanced DNS** (DNS avancé)

### Étape 2 : Configurer les enregistrements DNS

Vous devez créer plusieurs enregistrements DNS pour pointer vers GitHub Pages.

#### Pour un domaine racine (example.com)

Supprimez tous les enregistrements existants de type A et CNAME, puis ajoutez :

**Enregistrements A** (pour le domaine racine) :

| Type     | Host | Value           | TTL       |
| -------- | ---- | --------------- | --------- |
| A Record | @    | 185.199.108.153 | Automatic |
| A Record | @    | 185.199.109.153 | Automatic |
| A Record | @    | 185.199.110.153 | Automatic |
| A Record | @    | 185.199.111.153 | Automatic |

> **Note** : Le symbole `@` représente votre domaine racine (example.com).

#### Pour un sous-domaine (www.example.com)

Ajoutez un enregistrement CNAME :

| Type         | Host | Value                           | TTL       |
| ------------ | ---- | ------------------------------- | --------- |
| CNAME Record | www  | `<votre-utilisateur>.github.io` | Automatic |

> **Important** : Remplacez `<votre-utilisateur>` par votre nom d'utilisateur GitHub.

### Étape 3 : Configurer GitHub Pages

1. Allez sur votre dépôt GitHub
2. Cliquez sur **Settings** > **Pages**
3. Dans la section **Custom domain**, entrez votre domaine :
    - Pour le domaine racine : `example.com`
    - Pour le sous-domaine : `www.example.com`
4. Cliquez sur **Save**
5. Attendez que la vérification DNS se termine (cela peut prendre quelques minutes)
6. Une fois vérifié, cochez **Enforce HTTPS** pour activer le certificat SSL gratuit

### Étape 4 : Vérifier la configuration

1. Attendez 10-30 minutes pour la propagation DNS (peut prendre jusqu'à 48h dans de rares cas)
2. Visitez votre domaine dans un navigateur
3. Votre site GitHub Pages devrait s'afficher
4. Vérifiez que HTTPS fonctionne (cadenas vert dans la barre d'adresse)

## Configuration des emails {#email}

### Option 1 : Email Forwarding (Redirection gratuite)

NameCheap offre une redirection d'emails gratuite pour rediriger les emails reçus vers votre adresse personnelle.

#### Configuration de la redirection

1. Dans votre panneau NameCheap, allez dans **Domain List**
2. Cliquez sur **Manage** à côté de votre domaine
3. Dans l'onglet **Advanced DNS**, trouvez la section **Mail Settings**
4. Sélectionnez **Email Forwarding**
5. Cliquez sur **Add Forwarder** (Ajouter une redirection)

**Exemple de configuration :**

| Alias   | Forward To            |
| ------- | --------------------- |
| contact | votre.email@gmail.com |
| info    | votre.email@gmail.com |
| hello   | votre.email@gmail.com |

#### Activer Catch-All

Le Catch-All permet de recevoir tous les emails envoyés à n'importe quelle adresse de votre domaine :

1. Dans **Mail Settings**, activez l'option **Catch-All**
2. Entrez l'adresse email de destination (ex: votre.email@gmail.com)
3. Cliquez sur **Save**

> **Exemple** : Avec Catch-All activé, les emails envoyés à `anything@votredomaine.com` seront tous redirigés vers votre adresse principale.

#### Enregistrements DNS pour la redirection d'emails

NameCheap configure automatiquement les enregistrements MX nécessaires. Vérifiez que ces enregistrements sont présents dans **Advanced DNS** :

| Type      | Host | Value                | Priority | TTL       |
| --------- | ---- | -------------------- | -------- | --------- |
| MX Record | @    | mx1.privateemail.com | 10       | Automatic |
| MX Record | @    | mx2.privateemail.com | 10       | Automatic |

### Option 2 : NameCheap Private Email (Payant)

Pour envoyer et recevoir des emails professionnels, NameCheap propose **Private Email** (environ 1-2€/mois par boîte).

#### Souscription

1. Dans votre panneau NameCheap, cliquez sur votre domaine
2. Cherchez la section **Email** et cliquez sur **Add email**
3. Choisissez le plan **Private Email**
4. Sélectionnez le nombre de boîtes email nécessaires
5. Complétez l'achat

#### Configuration

1. Une fois activé, allez dans **Product List** > **Private Email**
2. Cliquez sur **Manage** pour votre domaine
3. Créez vos adresses email (ex: contact@votredomaine.com)
4. Accédez à votre webmail via [privateemail.com](https://privateemail.com)

#### Paramètres IMAP/SMTP

Pour configurer votre client email (Thunderbird, Outlook, Apple Mail) :

**IMAP (Réception) :**

- Serveur : `mail.privateemail.com`
- Port : 993
- Sécurité : SSL/TLS

**SMTP (Envoi) :**

- Serveur : `mail.privateemail.com`
- Port : 465 ou 587
- Sécurité : SSL/TLS
- Authentification : Oui

### Option 3 : Services externes (Gmail, Google Workspace, etc.)

Vous pouvez aussi utiliser des services comme Google Workspace ou Zoho Mail avec votre domaine NameCheap. Consultez la documentation de ces services pour les enregistrements MX à configurer.

## Résolution des problèmes {#issues}

### Le site ne s'affiche pas

1. **Vérifiez la propagation DNS** :
    - Utilisez [DNS Checker](https://dnschecker.org) pour vérifier que vos enregistrements DNS sont propagés
2. **Vérifiez les enregistrements A** :
    - Assurez-vous d'avoir les 4 adresses IP GitHub Pages
3. **Vérifiez le fichier CNAME** :
    - GitHub crée automatiquement un fichier `CNAME` dans votre dépôt
    - Ne le supprimez pas

### HTTPS ne fonctionne pas

1. Attendez 24h après la configuration (le certificat SSL peut prendre du temps)
2. Décochez puis recochez **Enforce HTTPS** dans GitHub Pages
3. Videz le cache de votre navigateur

### Les emails ne fonctionnent pas

1. **Vérifiez les enregistrements MX** dans Advanced DNS
2. **Testez la redirection** : envoyez un email à votre adresse personnalisée
3. **Vérifiez les spams** : le premier email peut être marqué comme spam
4. **Attendez la propagation** : les changements MX peuvent prendre jusqu'à 24h

### Erreur "Domain's DNS record could not be retrieved"

1. Attendez quelques minutes et réessayez
2. Vérifiez que les enregistrements DNS sont correctement configurés
3. Supprimez le domaine personnalisé dans GitHub et reconfigurez-le

## Conseils et bonnes pratiques {#tips}

### Sécurité

1. **Activez toujours HTTPS** sur GitHub Pages
2. **Activez la vérification en deux étapes** sur votre compte NameCheap
3. **Utilisez WhoisGuard** (protection de confidentialité gratuite avec NameCheap) pour masquer vos informations personnelles

### Performance

1. **Utilisez Automatic TTL** pour les enregistrements DNS (NameCheap l'optimise automatiquement)
2. **Configurez le domaine apex** (@) et le sous-domaine www pour une meilleure compatibilité

### Organisation

1. **Documentez votre configuration DNS** pour référence future
2. **Configurez Catch-All** pour ne manquer aucun email
3. **Créez des alias d'email** pour différents usages (contact, support, hello, etc.)

## Récapitulatif {#summary}

**Configuration DNS :**

- 4 enregistrements A pointant vers GitHub Pages
- 1 enregistrement CNAME pour www
- Domaine personnalisé configuré dans GitHub Pages
- HTTPS activé

**Configuration Email :**

- Redirection d'emails ou Private Email configuré
- Catch-All activé pour recevoir tous les emails
- Alias créés (contact@, info@, etc.)

Votre site est maintenant accessible via votre domaine personnalisé avec des emails professionnels ! 🎉

## Ressources {#resources}

- [Documentation officielle NameCheap](https://www.namecheap.com/support/knowledgebase/)
- [Documentation GitHub Pages Custom Domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [DNS Checker](https://dnschecker.org) - Vérifier la propagation DNS
- [SSL Checker](https://www.sslshopper.com/ssl-checker.html) - Vérifier le certificat SSL
- [Configurer Cloudflare](/help/github/configuration/cloudflare) - Déléguer vos DNS à Cloudflare pour le CDN et la protection DDoS
