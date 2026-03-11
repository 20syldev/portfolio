---
title: Diagnostic réseau
description: Méthodologie de dépannage réseau et outils pratiques — ping, traceroute, ss, ip, tcpdump, nmap, curl.
category: networking
slug: diagnostics
order: 8
---

## Méthodologie de dépannage {#methodology}

Face à un problème réseau, la méthode la plus efficace est l'approche **bottom-up** : on vérifie chaque [couche du modèle OSI](/help/networking/models) en partant de la plus basse.

| Étape | Couche      | Question à se poser                           | Outil de vérification     |
| ----- | ----------- | --------------------------------------------- | ------------------------- |
| 1     | Physique    | Le câble est-il branché ? Le Wi-Fi connecté ? | `ip link`, LED du switch  |
| 2     | Liaison     | L'interface a-t-elle une adresse MAC ?        | `ip link show`            |
| 3     | Réseau      | Ai-je une adresse IP ? La passerelle répond ? | `ip addr`, `ping gateway` |
| 4     | Transport   | Le port distant est-il ouvert ?               | `ss`, `nmap`, `telnet`    |
| 5     | Application | Le service répond-il correctement ?           | `curl`, `dig`, `wget`     |

> **Principe clé** : si `ping` vers la passerelle échoue, inutile de chercher un problème DNS ou HTTP. Résolvez d'abord le niveau inférieur.

## ping {#ping}

`ping` envoie des paquets **ICMP Echo Request** et attend les **Echo Reply**. C'est le premier réflexe pour tester la connectivité.

```bash
# Test connectivity to a host (4 packets)
ping -c 4 192.168.1.1

# Test with a domain name (also validates DNS)
ping -c 4 google.com

# Continuous ping (Ctrl+C to stop)
ping 192.168.1.1
```

```
PING 192.168.1.1 (192.168.1.1) 56(84) bytes of data.
64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=1.23 ms
64 bytes from 192.168.1.1: icmp_seq=2 ttl=64 time=0.98 ms
64 bytes from 192.168.1.1: icmp_seq=3 ttl=64 time=1.05 ms

--- 192.168.1.1 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2003ms
rtt min/avg/max/mdev = 0.980/1.086/1.230/0.104 ms
```

| Information      | Signification                                             |
| ---------------- | --------------------------------------------------------- |
| `ttl=64`         | Time To Live — nombre de sauts restants                   |
| `time=1.23 ms`   | Latence aller-retour (round-trip time)                    |
| `0% packet loss` | Aucune perte — connexion fiable                           |
| `icmp_seq`       | Numéro de séquence pour détecter les pertes/réordonnances |

> **Attention** : Certains serveurs et pare-feu bloquent ICMP. L'absence de réponse au `ping` ne signifie pas forcément que l'hôte est hors ligne.

## traceroute {#traceroute}

`traceroute` révèle le chemin emprunté par les paquets et identifie les routeurs intermédiaires. Voir la section dédiée dans [Routage et NAT](/help/networking/routing).

```bash
# Trace the route to a destination
traceroute google.com

# Alternative without root privileges
tracepath google.com

# ICMP mode (similar to Windows tracert)
sudo traceroute -I google.com
```

Utile pour identifier à quel point du réseau se situe un problème (réseau local, FAI, destination).

## ss / netstat {#ss}

`ss` (Socket Statistics) remplace `netstat` et affiche les connexions réseau, ports en écoute et sockets actifs.

```bash
# Show all listening TCP ports
ss -tlnp

# Show all listening UDP ports
ss -ulnp

# Show all established connections
ss -tnp

# Show connections to a specific port
ss -tnp | grep :443

# Show socket summary statistics
ss -s
```

```
State    Recv-Q  Send-Q  Local Address:Port   Peer Address:Port   Process
LISTEN   0       128     0.0.0.0:22           0.0.0.0:*           users:(("sshd",pid=1234))
LISTEN   0       511     0.0.0.0:80           0.0.0.0:*           users:(("nginx",pid=5678))
ESTAB    0       0       192.168.1.10:52341   93.184.216.34:443   users:(("firefox",pid=9012))
```

| Flag | Signification                               |
| ---- | ------------------------------------------- |
| `-t` | TCP seulement                               |
| `-u` | UDP seulement                               |
| `-l` | Ports en écoute uniquement (LISTEN)         |
| `-n` | Adresses numériques (pas de résolution DNS) |
| `-p` | Afficher le processus associé               |
| `-s` | Résumé statistique                          |

> `netstat` est encore disponible sur beaucoup de systèmes (paquet `net-tools`), mais `ss` est plus rapide et plus complet.

## ip addr / ip link {#ip}

La commande `ip` est l'outil standard pour gérer les interfaces réseau sous Linux.

```bash
# Show all interfaces with their IP addresses
ip addr show

# Show only interface status (up/down)
ip link show

# Show a specific interface
ip addr show dev eth0

# Bring an interface up
sudo ip link set eth0 up

# Bring an interface down
sudo ip link set eth0 down

# Show the routing table
ip route show

# Show ARP/neighbor cache
ip neigh show
```

```
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 state UP
    link/ether aa:bb:cc:dd:ee:ff brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.10/24 brd 192.168.1.255 scope global dynamic eth0
    inet6 fe80::a8bb:ccff:fedd:eeff/64 scope link
```

| Champ          | Signification                                           |
| -------------- | ------------------------------------------------------- |
| `UP,LOWER_UP`  | Interface active, câble connecté                        |
| `mtu 1500`     | Taille maximale d'un paquet (Maximum Transmission Unit) |
| `link/ether`   | Adresse MAC                                             |
| `inet`         | Adresse IPv4 avec masque CIDR                           |
| `inet6`        | Adresse IPv6 (ici link-local)                           |
| `scope global` | Adresse utilisable en dehors du lien local              |

## tcpdump {#tcpdump}

`tcpdump` capture les paquets réseau en temps réel. C'est l'outil de base pour l'analyse de trafic en ligne de commande.

```bash
# Capture all traffic on all interfaces
sudo tcpdump -i any

# Capture traffic on a specific interface
sudo tcpdump -i eth0

# Capture only TCP traffic on port 80
sudo tcpdump -i any tcp port 80 -n

# Capture DNS traffic
sudo tcpdump -i any port 53 -n

# Capture traffic to/from a specific host
sudo tcpdump -i any host 192.168.1.1 -n

# Save capture to a file (for Wireshark analysis)
sudo tcpdump -i any -w capture.pcap

# Limit to 100 packets
sudo tcpdump -i any -c 100 -n

# Show packet content in ASCII
sudo tcpdump -i any -A port 80
```

| Flag | Signification                                     |
| ---- | ------------------------------------------------- |
| `-i` | Interface à écouter (`any` = toutes)              |
| `-n` | Pas de résolution DNS (plus rapide)               |
| `-c` | Nombre de paquets à capturer                      |
| `-w` | Écrire dans un fichier `.pcap`                    |
| `-A` | Afficher le contenu en ASCII                      |
| `-X` | Afficher en hexadécimal et ASCII                  |
| `-v` | Mode verbeux (`-vv`, `-vvv` pour plus de détails) |

## nmap {#nmap}

`nmap` est un scanner de ports et d'hôtes. C'est un outil essentiel en administration système et en sécurité.

```bash
# Scan common ports on a host
nmap 192.168.1.1

# Scan specific ports
nmap -p 22,80,443 192.168.1.1

# Scan a range of ports
nmap -p 1-1000 192.168.1.1

# Scan all hosts on a subnet
nmap 192.168.1.0/24

# Service/version detection
nmap -sV 192.168.1.1

# OS detection (requires root)
sudo nmap -O 192.168.1.1

# Fast scan (top 100 ports)
nmap -F 192.168.1.1

# Ping scan only (discover hosts, no port scan)
nmap -sn 192.168.1.0/24
```

> **Important** : ne scannez que des machines que vous êtes **autorisé** à scanner. Le scan de ports non autorisé est illégal dans de nombreuses juridictions.

## curl / wget {#curl-wget}

Pour tester la couche Application ([HTTP/HTTPS](/help/networking/protocols)) :

```bash
# Fetch HTTP headers only
curl -I https://example.com

# Full request with response body
curl https://example.com

# Verbose output (TLS handshake, headers, etc.)
curl -v https://example.com

# Test a specific HTTP method
curl -X POST -d '{"key":"value"}' -H "Content-Type: application/json" https://api.example.com

# Follow redirects
curl -L https://example.com

# Download a file with wget
wget https://example.com/file.tar.gz

# Download with curl
curl -O https://example.com/file.tar.gz
```

## Résumé des outils {#summary}

| Outil        | Couche OSI             | Rôle principal                                        | Flags courants                |
| ------------ | ---------------------- | ----------------------------------------------------- | ----------------------------- |
| `ping`       | 3 — Réseau             | Tester la connectivité                                | `-c` (count), `-i` (interval) |
| `traceroute` | 3 — Réseau             | Tracer le chemin réseau                               | `-I` (ICMP), `-n` (no DNS)    |
| `ss`         | 4 — Transport          | Lister les connexions et ports                        | `-tlnp`, `-ulnp`, `-s`        |
| `ip addr`    | 2/3 — Liaison/Réseau   | Gérer les interfaces et adresses                      | `show`, `add`, `del`          |
| `ip route`   | 3 — Réseau             | Gérer la [table de routage](/help/networking/routing) | `show`, `add`, `del`          |
| `tcpdump`    | 2-7 — Toutes           | Capturer et analyser les paquets                      | `-i`, `-n`, `-w`, port/host   |
| `nmap`       | 3-4 — Réseau/Transport | Scanner les ports et services                         | `-p`, `-sV`, `-sn`, `-F`      |
| `curl`       | 7 — Application        | Tester les requêtes HTTP                              | `-I`, `-v`, `-X`, `-L`        |
| `dig`        | 7 — Application        | Interroger le [DNS](/help/networking/dns)             | `+short`, `+trace`, `-x`      |

## Pour aller plus loin {#next}

- [Modèles OSI et TCP/IP](/help/networking/models) — comprendre les couches pour mieux diagnostiquer
- [DNS en profondeur](/help/networking/dns) — `dig`, `nslookup` et résolution de problèmes DNS
- [Routage et NAT](/help/networking/routing) — tables de routage et `traceroute` en détail