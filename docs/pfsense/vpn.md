---
title: VPN WireGuard sur pfSense
description: Configuration complète d'un tunnel WireGuard sur pfSense, côté serveur et client, règles de pare-feu et troubleshooting.
category: pfsense
slug: vpn
order: 6
---

## Vue d'ensemble {#overview}

WireGuard permet de créer un tunnel VPN chiffré entre un PC distant et pfSense, donnant accès au réseau local depuis n'importe où.

```
 ┌──────────────┐                                      ┌──────────────────┐
 │  PC distant  │                                      │     pfSense      │
 │              │  ════════ Tunnel WireGuard ════════  │                  │
 │  wg0:        │          Internet (UDP 51820)        │  tun_wg0:        │
 │  10.10.10.2  │  ─────────────────────────────────>  │  10.10.10.1      │
 └──────────────┘                                      └────────┬─────────┘
                                                                │
                                                            LAN (igb1)
                                                          192.168.1.1/24
                                                                │
                                                       ┌────────┴─────────┐
                                                       │   Réseau local   │
                                                       │  192.168.1.0/24  │
                                                       │   NAS, serveurs  │
                                                       └──────────────────┘
```

Le PC distant obtient une IP dans le réseau VPN (10.10.10.0/24) et peut accéder au réseau local (192.168.1.0/24) à travers le tunnel.

## Prérequis {#prerequisites}

- pfSense 2.5.0+ (WireGuard disponible via package) ou pfSense Plus 23.01+
- Une IP publique ou un DDNS sur l'interface WAN de pfSense
- Le port UDP 51820 accessible depuis Internet (ou un autre port au choix)

## Installation du package {#install}

Dans **System > Package Manager > Available Packages** :

1. Rechercher **WireGuard**
2. Cliquer sur **Install**
3. Confirmer l'installation

Après installation, le menu **VPN > WireGuard** apparaît.

## Configuration côté pfSense (serveur) {#server}

### Étape 1 — Créer un tunnel

Dans **VPN > WireGuard > Tunnels**, cliquer sur **+ Add Tunnel** :

| Paramètre          | Valeur                                               |
| ------------------ | ---------------------------------------------------- |
| **Enable**         | ✓                                                    |
| **Description**    | WireGuard VPN                                        |
| **Listen Port**    | 51820                                                |
| **Interface Keys** | Cliquer sur **Generate** pour créer la paire de clés |

> **Important :** Note la **clé publique** du tunnel — elle sera nécessaire pour la configuration du client.

```
Tunnel Settings:
  ├── Description  : WireGuard VPN
  ├── Listen Port  : 51820
  ├── Private Key  : [auto-generated, never share]
  └── Public Key   : <SERVER_PUBLIC_KEY>  ← à copier pour le client
```

Sauvegarder le tunnel.

### Étape 2 — Ajouter un peer (le PC distant)

D'abord, générer les clés côté client (voir [section client](#client)). Puis dans **VPN > WireGuard > Peers**, cliquer sur **+ Add Peer** :

| Paramètre          | Valeur                                         |
| ------------------ | ---------------------------------------------- |
| **Enable**         | ✓                                              |
| **Tunnel**         | tun_wg0 (le tunnel créé à l'étape 1)           |
| **Description**    | PC distant                                     |
| **Public Key**     | `<CLIENT_PUBLIC_KEY>` (clé publique du client) |
| **Allowed IPs**    | 10.10.10.2/32                                  |
| **Pre-shared Key** | (optionnel, couche de sécurité supplémentaire) |
| **Keep Alive**     | 25 (secondes, utile si derrière un NAT)        |

> **AllowedIPs côté serveur :** Indique quelle IP le peer est autorisé à utiliser. `10.10.10.2/32` signifie que ce client utilise uniquement cette IP dans le tunnel.

### Étape 3 — Assigner l'interface WireGuard

Dans **Interfaces > Assignments** :

1. Dans la liste déroulante, sélectionner **tun_wg0**
2. Cliquer sur **+ Add**
3. Cliquer sur le nom de la nouvelle interface (OPTx)
4. Configurer :

| Paramètre              | Valeur          |
| ---------------------- | --------------- |
| **Enable**             | ✓               |
| **Description**        | WIREGUARD       |
| **IPv4 Configuration** | Static IPv4     |
| **IPv4 Address**       | 10.10.10.1 / 24 |

> **Pourquoi assigner l'interface ?** Cela permet de créer des règles de pare-feu spécifiques pour le trafic WireGuard et d'utiliser l'interface dans les règles NAT.

### Étape 4 — Règles de pare-feu

Deux ensembles de règles sont nécessaires :

**1. Autoriser WireGuard sur le WAN** (Firewall > Rules > WAN) :

```
Action      : Pass
Interface   : WAN
Protocol    : UDP
Source      : Any
Destination : WAN address
Dest. Port  : 51820
Description : Allow WireGuard VPN
```

**2. Autoriser le trafic depuis le tunnel** (Firewall > Rules > WIREGUARD) :

```
# Allow tunnel traffic to reach LAN
Action      : Pass
Interface   : WIREGUARD
Protocol    : Any
Source      : WIREGUARD net
Destination : LAN net
Description : Allow WireGuard to LAN

# Allow tunnel traffic to reach Internet (optional, full tunnel mode)
Action      : Pass
Interface   : WIREGUARD
Protocol    : Any
Source      : WIREGUARD net
Destination : Any
Description : Allow WireGuard to Internet
```

### Étape 5 — Outbound NAT (si full tunnel)

Si le PC distant doit accéder à Internet via pfSense (full tunnel), vérifier le NAT sortant dans **Firewall > NAT > Outbound** :

- En mode **Automatic** : rien à faire, pfSense gère automatiquement
- En mode **Hybrid/Manual** : ajouter une règle pour le réseau 10.10.10.0/24 vers le WAN

## Configuration côté client (PC distant) {#client}

### Générer les clés

```bash
# Install WireGuard
sudo apt install wireguard

# Generate key pair
wg genkey | tee private.key | wg pubkey > public.key

# Display public key (to configure as peer on pfSense)
cat public.key

# Optional: generate pre-shared key
wg genpsk > preshared.key
```

### Fichier de configuration

```ini
# /etc/wireguard/wg0.conf — Client configuration
[Interface]
PrivateKey = <CLIENT_PRIVATE_KEY>
Address = 10.10.10.2/24
DNS = 10.10.10.1

[Peer]
PublicKey = <SERVER_PUBLIC_KEY>
PresharedKey = <PRESHARED_KEY>
Endpoint = <PFSENSE_WAN_IP>:51820
AllowedIPs = 192.168.1.0/24, 10.10.10.0/24
PersistentKeepalive = 25
```

| Paramètre               | Description                               |
| ----------------------- | ----------------------------------------- |
| **PrivateKey**          | Clé privée du client (ne jamais partager) |
| **Address**             | IP du client dans le tunnel VPN           |
| **DNS**                 | Serveur DNS à utiliser via le tunnel      |
| **PublicKey**           | Clé publique du serveur pfSense           |
| **PresharedKey**        | Clé pré-partagée (optionnelle)            |
| **Endpoint**            | IP publique (ou DDNS) de pfSense + port   |
| **AllowedIPs**          | Réseaux accessibles via le tunnel         |
| **PersistentKeepalive** | Intervalle keepalive en secondes          |

### Split tunnel vs full tunnel

```ini
# Split tunnel — only private networks through VPN
AllowedIPs = 192.168.1.0/24, 10.10.10.0/24

# Full tunnel — all traffic through VPN
AllowedIPs = 0.0.0.0/0, ::/0
```

| Mode      | AllowedIPs côté client    | Usage                         |
| --------- | ------------------------- | ----------------------------- |
| **Split** | Réseaux privés uniquement | Accès au LAN, Internet direct |
| **Full**  | `0.0.0.0/0, ::/0`         | Tout passe par pfSense        |

> **Conseil :** Le split tunnel est recommandé pour un usage quotidien — il préserve la bande passante et la latence pour le trafic Internet tout en sécurisant l'accès au réseau local.

### Connexion

```bash
# Start the tunnel
sudo wg-quick up wg0

# Check tunnel status
sudo wg show

# Verify connectivity to pfSense LAN
ping 192.168.1.1

# Verify connectivity to a device on the LAN
ping 192.168.1.50

# Stop the tunnel
sudo wg-quick down wg0

# Enable at boot
sudo systemctl enable wg-quick@wg0
```

### Client Windows / macOS / mobile

WireGuard dispose d'applications natives pour toutes les plateformes. La configuration est identique — importe le fichier `.conf` ou scanne un QR code.

```bash
# Generate QR code from config (useful for mobile)
sudo apt install qrencode
qrencode -t ansiutf8 < /etc/wireguard/wg0.conf
```

## Ajouter d'autres peers {#multi-peers}

Pour chaque nouveau client, répéter le processus :

1. Générer une paire de clés sur le client
2. Ajouter un peer sur pfSense avec une IP unique (10.10.10.3/32, 10.10.10.4/32, etc.)
3. Créer le fichier de configuration client avec les bonnes clés

| Peer       | IP tunnel     | Description        |
| ---------- | ------------- | ------------------ |
| PC distant | 10.10.10.2/32 | Laptop principal   |
| Téléphone  | 10.10.10.3/32 | Mobile             |
| PC bureau  | 10.10.10.4/32 | Desktop secondaire |

## OpenVPN sur pfSense {#openvpn}

pfSense intègre aussi OpenVPN nativement (sans package additionnel). OpenVPN est plus adapté dans certains cas :

| Situation                                 | Recommandation    |
| ----------------------------------------- | ----------------- |
| Usage général, performance                | WireGuard         |
| Réseau restrictif (pare-feu bloque UDP)   | OpenVPN (TCP 443) |
| Besoin d'authentification par certificats | OpenVPN           |
| Compatibilité maximale                    | OpenVPN           |
| Simplicité de configuration               | WireGuard         |

Pour plus de détails sur les protocoles VPN, voir [VPN et tunneling](/help/networking/vpn).

## Troubleshooting {#troubleshooting}

### Le tunnel ne s'établit pas

| Vérification              | Commande / Action                        |
| ------------------------- | ---------------------------------------- |
| Port ouvert sur le WAN ?  | Firewall > Rules > WAN (UDP 51820)       |
| Service WireGuard actif ? | VPN > WireGuard > Status                 |
| Clés correctes ?          | Vérifier que la clé publique correspond  |
| Endpoint accessible ?     | `ping <PFSENSE_WAN_IP>` depuis le client |
| NAT/DDNS correct ?        | Vérifier l'IP publique dans le Endpoint  |

### Le tunnel est établi mais pas de trafic

| Vérification                      | Commande / Action                  |
| --------------------------------- | ---------------------------------- |
| Règles pare-feu WIREGUARD ?       | Firewall > Rules > WIREGUARD       |
| AllowedIPs correct côté client ?  | Vérifier les réseaux dans le .conf |
| AllowedIPs correct côté pfSense ? | VPN > WireGuard > Peers            |
| Interface assignée et activée ?   | Interfaces > Assignments           |
| Routage correct ?                 | Diagnostics > Routes               |

### Commandes utiles

```bash
# On the client
# Show tunnel status and last handshake
sudo wg show

# Test connectivity to the VPN gateway
ping 10.10.10.1

# Trace route through the tunnel
traceroute -n 192.168.1.1

# On pfSense shell (option 8)
# Check WireGuard interface
ifconfig tun_wg0

# View WireGuard status
wg show

# Check routing table
netstat -rn
```

### Handshake réussi mais pas de trafic

Si `wg show` montre un handshake récent mais le trafic ne passe pas :

1. Vérifier les règles de pare-feu sur l'interface WIREGUARD
2. Vérifier que l'interface est bien assignée dans pfSense
3. Vérifier les `AllowedIPs` des deux côtés
4. Tester avec `Diagnostics > Packet Capture` sur l'interface tun_wg0

## Pour aller plus loin {#next}

- [Pare-feu pfSense](/help/pfsense/firewall) — affiner les règles pour le tunnel VPN
- [Monitoring](/help/pfsense/monitoring) — surveiller le trafic VPN
- [VPN et tunneling](/help/networking/vpn) — protocoles VPN en détail (WireGuard, OpenVPN, IPsec)
- [Configuration avancée](/help/pfsense/advanced) — multi-WAN et haute disponibilité avec VPN