---
title: Guide du Markdown
description: Référence complète de la syntaxe Markdown standard pour rédiger du contenu structuré et lisible.
category: markdown
slug: guide
order: 1
---

## Introduction {#intro}

**Markdown** est un langage de balisage léger conçu pour être lisible en texte brut et convertissable en HTML. Créé par John Gruber en 2004, il est devenu le standard de facto pour la documentation, les README, les blogs et les wikis.

### Pourquoi utiliser le Markdown ?

- **Lisible brut** : Un fichier `.md` est compréhensible même sans rendu
- **Universel** : Supporté par GitHub, GitLab, VS Code, Notion, et des centaines d'autres outils
- **Rapide à écrire** : Pas de balises HTML à ouvrir et fermer
- **Portable** : Un simple fichier texte, compatible avec tout éditeur — et intégrable dans une app React ou un site de documentation avec des outils comme [React Markdown ou VitePress](/help/frameworks/markdown)
- **Versionnable** : Parfaitement adapté à Git (diff lisible, pas de fichiers binaires)

### Variantes et standards

Il existe plusieurs variantes du Markdown. Ce guide couvre le **CommonMark**, qui est la spécification la plus largement adoptée. Pour les extensions spécifiques à GitHub (alertes, mentions, diagrammes…), consultez le [guide GitHub Flavored Markdown](/help/markdown/github).

## Titres {#headings}

Les titres sont créés avec le caractère `#`. Plus il y a de `#`, plus le niveau est bas.

```md
# Titre niveau 1 (H1)

## Titre niveau 2 (H2)

### Titre niveau 3 (H3)

#### Titre niveau 4 (H4)

##### Titre niveau 5 (H5)

###### Titre niveau 6 (H6)
```

> **Convention** : Utilisez un seul H1 par document (le titre principal). Les H2 structurent les grandes sections, les H3 les sous-sections.

### Syntaxe alternative pour H1 et H2

```md
# Titre niveau 1

## Titre niveau 2
```

Cette syntaxe (style Setext) est moins courante mais valide.

## Mise en forme du texte {#text}

### Gras, italique, code inline

| Rendu               | Syntaxe               | Syntaxe alternative   |
| ------------------- | --------------------- | --------------------- |
| **gras**            | `**gras**`            | `__gras__`            |
| _italique_          | `_italique_`          | `*italique*`          |
| **_gras italique_** | `**_gras italique_**` | `***gras italique***` |
| `code inline`       | `` `code inline` ``   | —                     |

### Exemples

```md
Ce mot est en **gras**, celui-là en _italique_, et `ceci` est du code.

On peut aussi combiner : **_texte gras et italique_**.
```

### Retours à la ligne

En Markdown standard, un simple retour à la ligne dans le source ne crée **pas** de saut de ligne visible. Pour forcer un saut de ligne :

- Terminez la ligne par **deux espaces** puis appuyez sur Entrée
- Ou utilisez une **ligne vide** pour créer un nouveau paragraphe (méthode recommandée)

```md
Première ligne
Deuxième ligne (saut forcé par deux espaces)

Nouveau paragraphe (ligne vide)
```

## Listes {#lists}

### Liste non-ordonnée

Utilisez `-`, `*` ou `+` comme marqueur (soyez cohérent dans un même fichier) :

```md
- Premier élément
- Deuxième élément
- Troisième élément
```

### Liste ordonnée

Les numéros n'ont pas besoin d'être dans l'ordre — c'est le premier numéro qui compte :

```md
1. Premier élément
2. Deuxième élément
3. Troisième élément
```

```md
1. Premier élément
1. Deuxième élément ← le parser numérote automatiquement
1. Troisième élément
```

### Listes imbriquées

Indentez avec **4 espaces** (ou 2 selon le parser) pour créer un sous-niveau :

```md
- Fruits
    - Pomme
    - Banane
        - Banane jaune
        - Banane plantain
- Légumes
    - Carotte
    - Poireau
```

### Mélanger les types

```md
1. Installer les dépendances
2. Configurer le projet
    - Copier `.env.example` en `.env`
    - Remplir les variables d'environnement
3. Lancer le serveur
```

## Liens {#links}

### Lien inline

```md
[Texte du lien](https://exemple.com)
[Texte du lien](https://exemple.com "Titre au survol")
```

### Lien vers une section (ancre)

```md
[Aller aux listes](#lists)
[Voir l'introduction](#intro)
```

### Lien de référence

Utile pour ne pas surcharger le texte avec des URLs longues :

```md
Consultez [la documentation][doc] ou [le dépôt][repo].

[doc]: https://docs.exemple.com "Documentation officielle"
[repo]: https://github.com/user/repo
```

### Lien automatique

Les URLs entre chevrons deviennent des liens cliquables :

```md
<https://exemple.com>
<contact@exemple.com>
```

## Images {#images}

La syntaxe est identique aux liens, avec un `!` au début :

```md
![Texte alternatif](https://exemple.com/image.png)
![Logo](./images/logo.png "Titre au survol")
```

Le texte alternatif (`alt`) est affiché si l'image ne charge pas et est lu par les lecteurs d'écran — toujours le renseigner.

### Image avec lien

Combinez les deux syntaxes pour rendre une image cliquable :

```md
[![Texte alt](image.png)](https://exemple.com)
```

## Code {#code}

### Code inline

Entourez d'un ou plusieurs backticks :

```md
La commande `git status` affiche l'état du dépôt.
Pour du code contenant un backtick : `` `code` ``
```

### Blocs de code

Entourez de trois backticks et spécifiez le langage pour la coloration syntaxique :

````md
```javascript
function saluer(nom) {
    return `Bonjour, ${nom} !`;
}
```

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

```json
{
    "name": "mon-projet",
    "version": "1.0.0"
}
```
````

### Indentation (méthode alternative)

Indenter avec 4 espaces crée un bloc de code, mais la méthode des backticks est préférée :

```md
    // Ce code est indenté de 4 espaces
    console.log("Hello World");
```

## Blockquotes {#blockquotes}

```md
> Ceci est une citation.

> **Note** : Vous pouvez mettre du Markdown **à l'intérieur** d'une blockquote.

> Première ligne de la citation.
> Deuxième ligne de la même citation.
```

### Blockquotes imbriquées

```md
> Niveau 1
>
> > Niveau 2 (imbriqué)
> >
> > > Niveau 3
```

### Utilisation courante pour les callouts

```md
> **Astuce** : Activez le mode sombre pour réduire la fatigue oculaire.

> **Attention** : Cette opération est irréversible.
```

> Pour les alertes colorées avec icônes sur GitHub, voir le [guide GitHub Flavored Markdown](/help/markdown/github#alerts).

## Tableaux {#tables}

Les tableaux utilisent des `|` pour séparer les colonnes et des `-` pour la ligne d'en-tête :

```md
| Colonne 1 | Colonne 2 | Colonne 3 |
| --------- | --------- | --------- |
| Cellule   | Cellule   | Cellule   |
| Données   | Données   | Données   |
```

### Alignement des colonnes

Les deux-points `:` dans la ligne de séparation contrôlent l'alignement :

```md
| Gauche | Centre | Droite |
| :----- | :----: | -----: |
| Texte  | Texte  |  Texte |
| 1      |   2    |      3 |
```

### Conseils pour les tableaux

- Les `|` aux extrémités sont optionnels mais recommandés pour la lisibilité
- Les colonnes n'ont pas besoin d'être parfaitement alignées dans le source
- Tout Markdown inline (gras, italique, code, liens) fonctionne dans les cellules

## Règles horizontales {#rules}

Trois caractères identiques ou plus sur une ligne seule (avec espaces optionnels) :

```md
---
---

---
```

> **Conseil** : Préférez `---` pour éviter la confusion avec le frontmatter YAML (qui utilise aussi `---`) et les listes (`-`).

## Échappement {#escaping}

Pour afficher un caractère Markdown littéralement, précédez-le d'un antislash `\` :

```md
\*non italique\*
\# pas un titre
\[pas un lien\]
\`pas du code\`
```

Caractères nécessitant un échappement :

| Caractère | Description         |
| --------- | ------------------- |
| `\`       | Antislash           |
| `` ` ``   | Backtick            |
| `*`       | Astérisque          |
| `_`       | Underscore          |
| `{}`      | Accolades           |
| `[]`      | Crochets            |
| `()`      | Parenthèses         |
| `#`       | Dièse               |
| `+`       | Plus                |
| `-`       | Tiret               |
| `.`       | Point               |
| `!`       | Point d'exclamation |

## HTML brut {#html}

La plupart des parsers Markdown acceptent du HTML brut directement dans le fichier :

```md
Texte normal, puis <strong>HTML brut</strong>, puis retour au Markdown.

<div class="alerte">
  Ce bloc HTML est rendu tel quel.
</div>

Suite du contenu en **Markdown**.
```

> **Attention** : Pour des raisons de sécurité, certains parsers (dont GitHub) filtrent ou échappent le HTML brut. N'en abusez pas — si vous avez besoin de beaucoup de HTML, reconsidérez votre approche.

## Récapitulatif {#summary}

| Élément          | Syntaxe             |
| ---------------- | ------------------- |
| **Titre H1**     | `# Titre`           |
| **Titre H2**     | `## Titre`          |
| **Gras**         | `**texte**`         |
| **Italique**     | `_texte_`           |
| **Code inline**  | `` `code` ``        |
| **Lien**         | `[texte](url)`      |
| **Image**        | `![alt](url)`       |
| **Liste `-`**    | `- élément`         |
| **Liste `1.`**   | `1. élément`        |
| **Blockquote**   | `> texte`           |
| **Bloc de code** | ` ```lang ... ``` ` |
| **Tableau**      | `\| col \| col \|`  |
| **Règle**        | `---`               |
| **Échappement**  | `\*`                |