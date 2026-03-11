---
title: Installation de pfSense
description: Installation de pfSense sur bare-metal ou machine virtuelle, configuration initiale via console et premier accès WebGUI.
category: pfsense
slug: installation
order: 2
---

## Prérequis matériels {#hardware}

pfSense fonctionne sur du matériel modeste mais les besoins dépendent du débit réseau visé.

| Usage                     | CPU           | RAM    | Stockage | Interfaces réseau |
| ------------------------- | ------------- | ------ | -------- | ----------------- |
| Homelab / test            | 1 cœur 64-bit | 1 Go   | 8 Go     | 2 (WAN + LAN)     |
| Usage domestique (1 Gbps) | 2 cœurs       | 2 Go   | 16 Go    | 2+                |
| PME avec VPN + IDS        | 4 cœurs       | 4-8 Go | 32 Go    | 3+                |

> **Important :** pfSense nécessite une architecture **amd64** (64-bit). Les processeurs ARM ne sont pas supportés. Privilégie les cartes réseau Intel (igb/em) pour une compatibilité optimale avec FreeBSD.

### Bare-metal vs machine virtuelle

| Approche       | Avantages                                        | Inconvénients                                  |
| -------------- | ------------------------------------------------ | ---------------------------------------------- |
| **Bare-metal** | Performances maximales, accès direct au matériel | Matériel dédié nécessaire                      |
| **VM**         | Flexible, snapshots, facile à tester             | Overhead de virtualisation, passthrough réseau |

Pour de la virtualisation, les hyperviseurs compatibles : **Proxmox**, **VMware ESXi**, **VirtualBox**, **Hyper-V**. Assure-toi d'assigner au moins 2 interfaces réseau virtuelles à la VM.

## Téléchargement {#download}

L'image ISO est disponible sur le site officiel de Netgate. Choisis le format adapté :

| Format                 | Usage                                    |
| ---------------------- | ---------------------------------------- |
| **ISO (DVD)**          | Installation standard, bare-metal ou VM  |
| **USB Memstick (img)** | Installation depuis clé USB bootable     |
| **Serial**             | Matériel sans écran (appliance headless) |

```bash
# Verify checksum after download
sha256sum pfSense-CE-2.7.2-RELEASE-amd64.iso.gz
```

## Installation pas à pas {#install}

### 1. Démarrage sur le média d'installation

Boot depuis l'ISO ou la clé USB. L'écran de boot pfSense s'affiche :

```
╔══════════════════════════════════════════╗
║           pfSense Boot Menu              ║
║                                          ║
║  1. Boot Multi User [Enter]              ║
║  2. Boot Single User                     ║
║  3. Escape to loader prompt              ║
║  4. Reboot                               ║
╚══════════════════════════════════════════╝
```

Appuie sur **Enter** ou attends le timeout pour démarrer en mode multi-utilisateur.

### 2. Lancement de l'installeur

Accepte la licence, puis sélectionne **Install pfSense**.

```
┌──────────────────────────────────────────┐
│  Welcome to pfSense!                     │
│                                          │
│  [Install]     Install pfSense           │
│  [Rescue]      Rescue Shell              │
│  [Recover]     Recover config.xml        │
└──────────────────────────────────────────┘
```

### 3. Partitionnement

Pour la plupart des cas, choisis le partitionnement automatique :

| Option         | Description                                                      |
| -------------- | ---------------------------------------------------------------- |
| **Auto (ZFS)** | Recommandé — système de fichiers moderne, snapshots, compression |
| **Auto (UFS)** | Plus simple, moins de fonctionnalités                            |
| **Manual**     | Pour les configurations avancées                                 |

> **Conseil :** ZFS est recommandé pour sa fiabilité et ses capacités de snapshot. Si le stockage est très limité (< 8 Go), UFS consomme moins d'espace.

### 4. Finalisation

L'installeur copie les fichiers, puis propose de redémarrer. Retire le média d'installation avant le reboot.

## Configuration initiale via console {#console}

Au premier démarrage, pfSense détecte les interfaces réseau et propose de les assigner.

```
Valid interfaces are:

igb0    00:1a:2b:3c:4d:5e  (up)   Intel I210
igb1    00:1a:2b:3c:4d:5f  (up)   Intel I210

Do VLANs need to be set up first?
If VLANs will not be used, or only for optional interfaces,
should be not.

Enter the WAN interface name or 'a' for auto-detection: igb0
Enter the LAN interface name or 'a' for auto-detection: igb1
```

### Menu console

Après l'assignation, le menu console s'affiche :

```
pfSense - Netgate Device ID: abc123

WAN (wan)   -> igb0  -> v4: 192.168.0.50/24
LAN (lan)   -> igb1  -> v4: 192.168.1.1/24

 0) Logout (SSH only)            7) Ping host
 1) Assign Interfaces            8) Shell
 2) Set interface(s) IP address  9) pfTop
 3) Reset webConfigurator pwd   10) Filter Logs
 4) Reset to factory defaults   11) Restart webConfigurator
 5) Reboot system               12) PHP shell + tools
 6) Halt system                 13) Update from console
```

Les options essentielles :

| Option | Usage                                                |
| ------ | ---------------------------------------------------- |
| **1**  | Réassigner les interfaces (WAN, LAN, OPT)            |
| **2**  | Configurer l'adresse IP d'une interface manuellement |
| **3**  | Réinitialiser le mot de passe WebGUI                 |
| **8**  | Accéder au shell FreeBSD                             |

### Configurer l'IP LAN (si nécessaire)

Si le réseau LAN par défaut (192.168.1.1/24) ne convient pas :

```
Enter an option: 2

Available interfaces:
1 - WAN (igb0)
2 - LAN (igb1)

Enter the number of the interface: 2

Enter the new LAN IPv4 address: 192.168.10.1
Enter the new LAN IPv4 subnet bit count (1 to 31): 24

Do you want to enable the DHCP server on LAN? (y/n) y
Enter the start address of the IPv4 client address range: 192.168.10.100
Enter the end address of the IPv4 client address range: 192.168.10.200
```

## Premier accès WebGUI {#webgui}

Depuis un poste connecté au réseau LAN, ouvre un navigateur et accède à :

```
https://192.168.1.1
```

> **Note :** Le certificat SSL est auto-signé — le navigateur affichera un avertissement. C'est normal pour la première connexion.

### Identifiants par défaut

| Champ            | Valeur    |
| ---------------- | --------- |
| **Utilisateur**  | `admin`   |
| **Mot de passe** | `pfsense` |

> **Attention :** Change immédiatement le mot de passe par défaut après la première connexion. C'est la première mesure de sécurité à appliquer.

## Assistant de configuration {#wizard}

Au premier login, l'assistant de configuration se lance automatiquement. Il guide à travers les étapes essentielles :

### Étape 1 — Informations générales

- **Hostname** : nom de la machine (ex : `firewall`)
- **Domain** : domaine local (ex : `home.lan`)
- **DNS Servers** : serveurs DNS upstream (ex : `1.1.1.1`, `9.9.9.9`)

### Étape 2 — Fuseau horaire

Sélectionne le fuseau horaire et le serveur NTP.

### Étape 3 — Configuration WAN

| Paramètre         | Valeur typique                             |
| ----------------- | ------------------------------------------ |
| **Type**          | DHCP (la plupart des FAI)                  |
| **Block RFC1918** | Activé (bloque les IPs privées sur le WAN) |
| **Block bogon**   | Activé (bloque les IPs non routables)      |

### Étape 4 — Configuration LAN

Confirme ou modifie l'adresse IP du réseau LAN.

### Étape 5 — Mot de passe admin

Définis un mot de passe fort pour remplacer le mot de passe par défaut.

### Étape 6 — Appliquer

L'assistant applique la configuration et redémarre les services.

## Après l'installation {#post-install}

Checklist post-installation :

- [ ] &nbsp; Mot de passe admin changé
- [ ] &nbsp; DNS configuré (System > General Setup)
- [ ] &nbsp; Fuseau horaire correct
- [ ] &nbsp; Mise à jour vers la dernière version (System > Update)
- [ ] &nbsp; Vérifier la connectivité WAN (Diagnostics > Ping)
- [ ] &nbsp; Configurer les [règles de pare-feu](/help/pfsense/firewall)
- [ ] &nbsp; Planifier les [sauvegardes](/help/pfsense/advanced#backup)

## Pour aller plus loin {#next}

- [Interfaces réseau](/help/pfsense/interfaces) — configurer WAN, LAN, VLANs et bridges
- [Pare-feu pfSense](/help/pfsense/firewall) — créer des règles de filtrage
- [Services pfSense](/help/pfsense/services) — DHCP, DNS, NTP