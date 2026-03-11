---
title: Pare-feu pfSense
description: Règles de filtrage pfSense, aliases, NAT, port forwarding, règles flottantes et bonnes pratiques de sécurité.
category: pfsense
slug: firewall
order: 4
---

## Logique de filtrage {#logic}

pfSense utilise **pf** (Packet Filter), le pare-feu natif de FreeBSD. Les règles sont évaluées **par interface**, dans l'ordre, et la **première correspondance** s'applique.

```
 Paquet entrant sur l'interface
          │
          ▼
     Règle 1  ────  Correspond ?  ──  Oui  ──>  Action (Pass/Block)
          │
         Non
          │
          ▼
     Règle 2  ────  Correspond ?  ──  Oui  ──>  Action (Pass/Block)
          │
         Non
          │
          ▼
        (...)
          │
          ▼
     Règle par défaut  ──────────────────>  Block (deny all)
```

> **Important :** Les règles sont évaluées sur le trafic **entrant** sur l'interface. Pour le trafic LAN vers Internet, les règles se configurent sur l'interface LAN (pas WAN).

### Règles par défaut

| Interface | Règle par défaut                                      |
| --------- | ----------------------------------------------------- |
| **WAN**   | Tout est bloqué en entrée (sauf le trafic de réponse) |
| **LAN**   | Tout est autorisé (règle "Default allow LAN to any")  |
| **OPTx**  | Tout est bloqué (aucune règle par défaut)             |

## Créer une règle {#create}

Dans **Firewall > Rules**, sélectionne l'interface puis **+ Add** :

| Paramètre       | Description                                     | Exemple              |
| --------------- | ----------------------------------------------- | -------------------- |
| **Action**      | Pass, Block ou Reject                           | Pass                 |
| **Interface**   | Interface sur laquelle la règle s'applique      | LAN                  |
| **Direction**   | In (entrant) ou Out (sortant, rarement utilisé) | In                   |
| **Protocol**    | TCP, UDP, TCP/UDP, ICMP, Any                    | TCP                  |
| **Source**      | Adresse ou réseau source                        | LAN net              |
| **Destination** | Adresse ou réseau destination                   | Any                  |
| **Dest. Port**  | Port ou plage de ports                          | 443 (HTTPS)          |
| **Description** | Texte descriptif (recommandé)                   | Allow HTTPS from LAN |
| **Log**         | Journaliser les paquets correspondants          | ☐                    |

### Exemple : autoriser le trafic web depuis le LAN

```
Action      : Pass
Interface   : LAN
Protocol    : TCP
Source      : LAN net
Destination : Any
Dest. Port  : 80, 443
Description : Allow HTTP/HTTPS from LAN
```

### Exemple : autoriser le ping (ICMP)

```
Action      : Pass
Interface   : LAN
Protocol    : ICMP
ICMP Type   : Echo Request
Source      : LAN net
Destination : Any
Description : Allow ping from LAN
```

## Aliases {#aliases}

Les aliases regroupent des adresses IP, réseaux ou ports sous un nom unique. Ils simplifient la gestion des règles.

Dans **Firewall > Aliases** :

| Type           | Exemple de nom | Contenu                         |
| -------------- | -------------- | ------------------------------- |
| **Host(s)**    | `Admin_PCs`    | 192.168.1.10, 192.168.1.11      |
| **Network(s)** | `Trusted_Nets` | 192.168.1.0/24, 10.0.0.0/24     |
| **Port(s)**    | `Web_Ports`    | 80, 443, 8080                   |
| **URL**        | `Blocklist`    | URL d'une liste d'IPs à bloquer |

```
┌────────────────────────────────────────────────┐
│  Alias: Web_Ports                              │
│  Type: Port(s)                                 │
│  Values: 80, 443, 8080                         │
│                                                │
│  Utilisé dans :                                │
│  Rule: Pass TCP LAN net → Any port Web_Ports   │
└────────────────────────────────────────────────┘
```

> **Conseil :** Utilise systématiquement des aliases. Quand un réseau ou un port change, il suffit de modifier l'alias — toutes les règles qui l'utilisent sont mises à jour automatiquement.

## NAT {#nat}

### Port forwarding (DNAT)

Redirige le trafic entrant sur le WAN vers un serveur interne.

Dans **Firewall > NAT > Port Forward** :

| Paramètre            | Exemple                              |
| -------------------- | ------------------------------------ |
| **Interface**        | WAN                                  |
| **Protocol**         | TCP                                  |
| **Dest. Address**    | WAN address                          |
| **Dest. Port Range** | 8443                                 |
| **Redirect Target**  | 192.168.1.50                         |
| **Redirect Port**    | 443                                  |
| **Description**      | Forward HTTPS to internal web server |

```
Internet  ──>  WAN:8443  ── [NAT] ──>  192.168.1.50:443
                                       (serveur web)
```

> **Note :** pfSense crée automatiquement une règle de pare-feu associée. Vérifie qu'elle est correcte dans **Firewall > Rules > WAN**.

### Outbound NAT

Par défaut, pfSense fait du NAT automatique (masquerade) pour tout le trafic sortant depuis le LAN vers le WAN. Modes disponibles :

| Mode          | Description                                         |
| ------------- | --------------------------------------------------- |
| **Automatic** | NAT automatique pour toutes les interfaces internes |
| **Hybrid**    | Automatique + règles manuelles                      |
| **Manual**    | Contrôle total, règles manuelles uniquement         |
| **Disable**   | Pas de NAT sortant (routage pur)                    |

### 1:1 NAT

Mappe une IP publique complète vers une IP interne. Utile quand tu disposes de plusieurs IPs publiques.

```
203.0.113.10 (publique)  <── 1:1 ──>  192.168.1.50 (interne)
```

## Règles flottantes {#floating}

Les règles flottantes (Floating Rules) s'appliquent sur **plusieurs interfaces** simultanément. Elles sont évaluées **avant** les règles par interface.

Cas d'usage :

- Bloquer un réseau sur toutes les interfaces
- Appliquer du traffic shaping global
- Règles de QoS

```
 Paquet entrant
       │
       ▼
   Floating Rules   ──>  Évaluées en premier (si "quick" activé)
       │
       ▼
   Interface Rules  ──>  Évaluées ensuite
```

> **Attention :** Les règles flottantes avec l'option **quick** court-circuitent les règles par interface. Utilise-les avec parcimonie.

## Flux de paquets dans pfSense {#packet-flow}

```
 Paquet entrant (WAN/LAN/OPT)
              │
              ▼
     ┌──────────────────┐
     │  Floating Rules  │
     │    (si quick)    │
     └────────┬─────────┘
              │
              ▼
     ┌───────────────────┐
     │  Interface Rules  │
     │  (par interface)  │
     └────────┬──────────┘
              │
              ▼
     ┌──────────────────┐         ┌───────────────┐
     │     NAT Rules    │  ────>  │  Destination  │
     │  (port forward)  │         │    interne    │
     └────────┬─────────┘         └───────────────┘
              │
              ▼
     ┌──────────────────┐
     │     Routage      │
     │  (table routes)  │
     └────────┬─────────┘
              │
              ▼
     ┌──────────────────┐
     │   Outbound NAT   │
     │   (masquerade)   │
     └────────┬─────────┘
              │
              ▼
       Paquet sortant
```

## Bonnes pratiques {#best-practices}

- **Documenter chaque règle** — ajouter une description claire et explicite
- **Principe du moindre privilège** — n'autoriser que ce qui est strictement nécessaire
- **Règles spécifiques en premier** — l'ordre compte, première correspondance gagne
- **Utiliser les aliases** — facilite la maintenance et la lisibilité
- **Activer les logs sur les règles de blocage** — aide au diagnostic
- **Réviser régulièrement** — supprimer les règles obsolètes
- **Tester après chaque changement** — vérifier la connectivité depuis chaque réseau

## Diagnostic {#diagnostics}

Outils intégrés pour vérifier le comportement du pare-feu :

| Outil              | Menu                            | Usage                           |
| ------------------ | ------------------------------- | ------------------------------- |
| **Firewall Logs**  | Status > System Logs > Firewall | Voir les paquets bloqués/passés |
| **States**         | Diagnostics > States            | Connexions actives              |
| **pfTop**          | Diagnostics > pfTop             | Trafic en temps réel            |
| **Packet Capture** | Diagnostics > Packet Capture    | Capture de paquets (tcpdump)    |
| **Test Port**      | Diagnostics > Test Port         | Tester la connectivité TCP      |

```bash
# From the pfSense shell (option 8 in console)
# View active firewall states
pfctl -s state

# View firewall rules loaded
pfctl -sr

# View NAT rules
pfctl -sn

# Reset state table (use with caution)
pfctl -F state
```

## Pour aller plus loin {#next}

- [Services pfSense](/help/pfsense/services) — DHCP et DNS derrière le pare-feu
- [VPN WireGuard](/help/pfsense/vpn) — règles de pare-feu pour le tunnel VPN
- [Monitoring](/help/pfsense/monitoring) — surveillance et logs
- [Pare-feu Linux](/help/hardening/firewall) — comparaison avec UFW et iptables