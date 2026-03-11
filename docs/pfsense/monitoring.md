---
title: Monitoring et logs
description: Surveillance pfSense, logs système et firewall, packages de monitoring (pfBlockerNG, Suricata, ntopng) et export syslog.
category: pfsense
slug: monitoring
order: 7
---

## Dashboard {#dashboard}

Le dashboard pfSense (page d'accueil WebGUI) affiche l'état du système en temps réel via des widgets configurables.

### Widgets recommandés

| Widget                 | Information affichée                       |
| ---------------------- | ------------------------------------------ |
| **System Information** | Uptime, CPU, RAM, version pfSense          |
| **Interfaces**         | État et trafic de chaque interface         |
| **Gateways**           | Latence et disponibilité des passerelles   |
| **Traffic Graphs**     | Graphiques de bande passante en temps réel |
| **Firewall Logs**      | Dernières entrées des logs firewall        |
| **Services Status**    | État des services (DHCP, DNS, VPN, etc.)   |
| **WireGuard**          | Statut des tunnels et peers connectés      |

Pour personnaliser le dashboard : cliquer sur **+** en haut à droite pour ajouter des widgets, et les glisser-déposer pour réorganiser.

## Logs système {#logs}

Les logs se consultent dans **Status > System Logs**.

### Catégories de logs

| Onglet       | Contenu                                          |
| ------------ | ------------------------------------------------ |
| **System**   | Démarrage, arrêt, erreurs système                |
| **Firewall** | Paquets bloqués et autorisés (si logging activé) |
| **DHCP**     | Attributions et renouvellements de baux          |
| **DNS**      | Requêtes DNS (si logging activé dans Unbound)    |
| **VPN**      | Connexions WireGuard, OpenVPN, IPsec             |
| **Gateway**  | Changements d'état des passerelles               |
| **Resolver** | Logs détaillés du DNS Resolver                   |

### Filtrer les logs firewall

Dans **Status > System Logs > Firewall** :

```
 ┌─────────────────────────────────────────────────────────────────────────┐
 │  Filters:                                                               │
 │  Interface: [WAN ▼]  Action: [Block ▼]  Protocol: [Any ▼]               │
 │                                                                         │
 │  Date/Time         │ Action │ Interface │ Source         │ Destination  │
 │  ──────────────────┼────────┼───────────┼────────────────┼────────────  │
 │  2025-03-10 14:23  │ Block  │ WAN       │ 45.33.32.156   │ WAN:22       │
 │  2025-03-10 14:22  │ Block  │ WAN       │ 185.220.101.4  │ WAN:443      │
 │  2025-03-10 14:21  │ Block  │ WAN       │ 91.240.118.50  │ WAN:3389     │
 └─────────────────────────────────────────────────────────────────────────┘
```

> **Conseil :** Active le logging sur les règles de blocage importantes. Les logs firewall sont essentiels pour identifier les tentatives d'intrusion et diagnostiquer les problèmes de connectivité.

### Paramètres de logging

Dans **Status > System Logs > Settings** :

| Paramètre                     | Recommandation                         |
| ----------------------------- | -------------------------------------- |
| **Log packets by default**    | ✓ (log les paquets bloqués par défaut) |
| **Log entries to show**       | 500-1000                               |
| **Reverse display**           | ✓ (entrées récentes en premier)        |
| **Log firewall rule matches** | Normal (ou Verbose pour le debug)      |

## Graphiques et statistiques {#graphs}

### Traffic Graphs

Dans **Status > Traffic Graph** : graphiques en temps réel du trafic par interface.

### Monitoring

Dans **Status > Monitoring** : graphiques historiques (CPU, mémoire, trafic, states, etc.) avec sélection de la période.

| Graphique        | Utilité                                          |
| ---------------- | ------------------------------------------------ |
| **System**       | CPU, mémoire, processus                          |
| **Traffic**      | Bande passante par interface                     |
| **Packet Types** | Répartition TCP/UDP/ICMP                         |
| **Quality**      | Latence et perte de paquets par passerelle       |
| **States**       | Nombre de connexions actives dans le state table |

## Packages de monitoring {#packages}

### pfBlockerNG

Filtrage DNS et IP avancé. Bloque les publicités, trackers, malwares et réseaux malveillants.

**Installation :** System > Package Manager > pfBlockerNG-devel

| Fonctionnalité     | Description                                          |
| ------------------ | ---------------------------------------------------- |
| **DNSBL**          | Blocage DNS (similaire à Pi-hole)                    |
| **IP Lists**       | Blocage par listes d'IPs (GeoIP, feeds de menaces)   |
| **GeoIP Blocking** | Bloquer le trafic par pays                           |
| **Feeds**          | Listes de blocage communautaires (auto-mises à jour) |
| **Reports**        | Statistiques de blocage détaillées                   |

Listes DNSBL recommandées :

| Liste                  | Contenu               |
| ---------------------- | --------------------- |
| **EasyList**           | Publicités            |
| **EasyPrivacy**        | Trackers              |
| **Steven Black Hosts** | Publicités + malwares |
| **Malware Domains**    | Domaines malveillants |

### Suricata / Snort (IDS/IPS)

Systèmes de détection et prévention d'intrusions qui analysent le trafic réseau en temps réel.

| Critère         | Suricata                                | Snort                        |
| --------------- | --------------------------------------- | ---------------------------- |
| **Performance** | Multi-thread (meilleur sur multi-cœurs) | Single-thread                |
| **Règles**      | ET Open, Snort rules                    | Snort rules (community/paid) |
| **Recommandé**  | ✓ (pour la plupart des cas)             | Plus mature                  |

> **Attention :** L'IDS/IPS peut consommer beaucoup de ressources (CPU, RAM). Sur du matériel modeste, active-le uniquement sur l'interface WAN et avec un jeu de règles réduit.

### ntopng

Analyse approfondie du trafic réseau avec visualisation graphique.

- Identification des flux par application, protocole, hôte
- Top talkers (appareils qui consomment le plus de bande passante)
- Historique de trafic détaillé
- Alertes sur comportements anormaux

> **Note :** ntopng nécessite de la RAM supplémentaire (2+ Go recommandés). Il est optionnel mais très utile pour comprendre les patterns de trafic.

## Export syslog {#syslog}

Pour centraliser les logs sur un serveur externe (Graylog, ELK, Splunk, syslog-ng).

Dans **Status > System Logs > Settings > Remote Logging Options** :

| Paramètre                  | Exemple                        |
| -------------------------- | ------------------------------ |
| **Enable Remote Logging**  | ✓                              |
| **Source Address**         | Any                            |
| **IP Protocol**            | IPv4                           |
| **Remote Log Servers**     | 192.168.1.50:514               |
| **Remote Syslog Contents** | Firewall Events, System Events |

```
pfSense  ────  syslog (UDP 514)  ────>  Serveur de logs
                                        (Graylog, ELK, etc.)
```

> **Conseil :** Exporter les logs vers un serveur dédié permet de les conserver plus longtemps, de les analyser avec des outils puissants et de les protéger en cas de compromission de pfSense.

## Alertes {#alerts}

### Notifications intégrées

Dans **System > Advanced > Notifications** :

| Méthode      | Description             |
| ------------ | ----------------------- |
| **SMTP**     | Alertes par email       |
| **Growl**    | Notifications desktop   |
| **Telegram** | Via script personnalisé |

### Événements à surveiller

- Changement d'état d'une passerelle (WAN down/up)
- Utilisation CPU/RAM élevée
- Mises à jour disponibles
- Certificats qui expirent
- Connexions VPN échouées

## Pour aller plus loin {#next}

- [Configuration avancée](/help/pfsense/advanced) — haute disponibilité, multi-WAN, hardening
- [Pare-feu pfSense](/help/pfsense/firewall) — optimiser les règles avec les logs
- [VPN WireGuard](/help/pfsense/vpn) — monitorer les connexions VPN