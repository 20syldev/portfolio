---
title: VPN et tunneling
description: Protocoles VPN (WireGuard, OpenVPN, IPsec), cas d'usage, configuration pratique et comparaison.
category: networking
slug: vpn
order: 7
---

## Qu'est-ce qu'un VPN ? {#intro}

Un VPN (Virtual Private Network) crée un tunnel chiffré entre deux points à travers un réseau non fiable. Les cas d'usage principaux : accès distant sécurisé, connectivité site-à-site, confidentialité.

```
┌────────────┐                                        ┌────────────┐
│   Client   │  ═════════ Tunnel chiffré ═══════════  │  Serveur   │
│            │  ───────────────────────────────────>  │    VPN     │
│  10.0.0.2  │         Internet (non fiable)          │  10.0.0.1  │
└────────────┘                                        └──────┬─────┘
                                                             │
                                                      ┌──────┴─────┐
                                                      │   Réseau   │
                                                      │   privé    │
                                                      │  10.0.0.0  │
                                                      └────────────┘
```

À ne pas confondre avec un tunnel SSH : le VPN opère au niveau réseau, le tunnel SSH au niveau applicatif. Voir [tunnels SSH](/help/ssh/usage#tunnels) pour la comparaison.

## Comparaison des protocoles {#protocols}

| Critère        | WireGuard               | OpenVPN                 | IPsec/IKEv2        |
| -------------- | ----------------------- | ----------------------- | ------------------ |
| Année          | 2018                    | 2001                    | 1995 (IKEv2: 2005) |
| Lignes de code | ~4 000                  | ~100 000                | ~400 000           |
| Performance    | Excellent               | Bon                     | Bon                |
| Chiffrement    | ChaCha20, Curve25519    | OpenSSL (configurable)  | Configurable       |
| Port           | UDP 51820               | UDP 1194 / TCP 443      | UDP 500, 4500      |
| Configuration  | Simple                  | Complexe                | Complexe           |
| Audit          | Facile (petit codebase) | Difficile               | Difficile          |
| Mobile         | Excellent               | Correct                 | Natif iOS/Android  |
| Furtivité      | Faible (UDP only)       | Bonne (TCP 443 = HTTPS) | Moyenne            |

## WireGuard {#wireguard}

Moderne, simple, rapide — recommandé pour la plupart des usages.

```bash
# Install
sudo apt install wireguard

# Generate key pair
wg genkey | tee private.key | wg pubkey > public.key
```

```ini
# /etc/wireguard/wg0.conf — Server configuration
[Interface]
PrivateKey = <server_private_key>
Address = 10.0.0.1/24
ListenPort = 51820

# Enable IP forwarding and NAT
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
PublicKey = <client_public_key>
AllowedIPs = 10.0.0.2/32
```

```bash
# Start the tunnel
sudo wg-quick up wg0

# Check status
sudo wg show

# Enable at boot
sudo systemctl enable wg-quick@wg0
```

La configuration client est similaire, avec le serveur en `[Peer]` et `Endpoint = server_ip:51820`.

## OpenVPN {#openvpn}

Plus mature, supporte TCP (permet de contourner les pare-feu via le port 443). Utilise une PKI complète : certificat CA, certificat serveur, certificats clients.

```bash
# Install
sudo apt install openvpn easy-rsa

# Quick overview of steps:
# 1. Initialize PKI and generate CA
# 2. Generate server certificate
# 3. Generate client certificate
# 4. Configure server (server.conf)
# 5. Distribute client .ovpn profile
```

Recommandé pour les environnements d'entreprise et les réseaux restreints par un pare-feu.

## Split tunnel vs full tunnel {#split-tunnel}

| Mode         | Description                                          | Usage                                |
| ------------ | ---------------------------------------------------- | ------------------------------------ |
| Full tunnel  | Tout le trafic passe par le VPN                      | Sécurité maximale, confidentialité   |
| Split tunnel | Seul le trafic vers le réseau privé passe par le VPN | Performance, économie bande passante |

```ini
# WireGuard — full tunnel (route everything through VPN)
AllowedIPs = 0.0.0.0/0, ::/0

# WireGuard — split tunnel (only private network)
AllowedIPs = 10.0.0.0/24, 192.168.1.0/24
```

## Pour aller plus loin {#next}

- [Routage et NAT](/help/networking/routing) — comprendre les tables de routage
- [Pare-feu Linux](/help/hardening/firewall) — configurer UFW avec un VPN
- [SSH tunnels](/help/ssh/usage) — alternative applicative au VPN