# ft_transcendence

## Description
ft_transcendence est le projet final du tronc commun de l'École 42. Il s'agit de créer une application web complète permettant de jouer au Pong en ligne avec des fonctionnalités modernes comme les tournois, le chat en temps réel, et l'authentification.

## Fonctionnalités principales
- 🎮 **Jeu Pong** en temps réel multijoueur
- 🏆 **Système de tournois** avec brackets
- 💬 **Chat en temps réel** avec channels
- 👤 **Profils utilisateurs** et amis
- 🔐 **Authentification 2FA** (Google, 42)
- 📊 **Statistiques** et historique des parties
- 🎨 **Interface moderne** et responsive
- 🔒 **Sécurité** web avancée

## Technologies utilisées

### Frontend
- **Framework** : React/Vue.js/Angular ou Vanilla JS
- **Styling** : CSS3, Bootstrap/Tailwind
- **WebSockets** : Pour le temps réel

### Backend
- **Framework** : Django/Flask/Node.js
- **Base de données** : PostgreSQL
- **API** : REST ou GraphQL
- **Authentication** : OAuth2, JWT

### DevOps
- **Containerisation** : Docker & Docker Compose
- **Reverse Proxy** : Nginx
- **SSL/TLS** : Certificats HTTPS
- **Base de données** : PostgreSQL en conteneur

## Architecture
```
ft_transcendence/
├── docker-compose.yml    # Orchestration des services
├── frontend/            # Application client
│   ├── src/
│   ├── public/
│   └── Dockerfile
├── backend/             # API serveur
│   ├── api/
│   ├── models/
│   ├── services/
│   └── Dockerfile
├── database/            # Configuration PostgreSQL
├── nginx/               # Configuration reverse proxy
└── ssl/                 # Certificats SSL
```

## Modules bonus
- **Module Web** : Framework moderne (React/Vue/Angular)
- **Module User Management** : Authentification avancée
- **Module Gaming** : Variantes de Pong ou autres jeux
- **Module AI-Algo** : IA pour jouer contre
- **Module Cybersecurity** : Sécurité renforcée
- **Module DevOps** : Infrastructure monitoring
- **Module Graphics** : Interface 3D avancée

## Installation et déploiement

### Prérequis
- Docker et Docker Compose
- Domaine avec certificat SSL
- Clés API (42, Google) pour OAuth

### Lancement
```bash
git clone <repository-url>
cd ft_transcendence
docker-compose up --build
```

### Configuration
1. Configurer les variables d'environnement
2. Générer les certificats SSL
3. Configurer OAuth applications
4. Initialiser la base de données

## Gameplay

### Pong multijoueur
- Contrôles clavier fluides
- Synchronisation en temps réel
- Système de score et timer
- Reconnexion automatique

### Tournois
- Création de tournois public/privé
- Système d'élimination
- Classements et récompenses
- Notifications en temps réel

## Sécurité implémentée
- 🔒 **HTTPS** obligatoire
- 🛡️ **Protection CSRF/XSS**
- 🔑 **Authentification 2FA**
- 💾 **Hashage sécurisé** des mots de passe
- 🚫 **Protection injection SQL**
- 🔐 **Validation** côté serveur
- 🍪 **Gestion sécurisée** des sessions

## Fonctionnalités sociales
- **Profils utilisateurs** personnalisables
- **Système d'amis** avec invitations
- **Chat global** et channels privés
- **Statut en ligne** des utilisateurs
- **Historique des parties**
- **Achievements** et badges

## Performance et scalabilité
- **WebSockets** pour le temps réel
- **Cache Redis** pour les sessions
- **Optimisation** des requêtes DB
- **Load balancing** pour la montée en charge
- **Monitoring** des performances

## Tests et qualité
- **Tests unitaires** backend
- **Tests d'intégration** API
- **Tests end-to-end** Selenium
- **Sécurité** avec OWASP ZAP
- **Performance** avec JMeter

## Compétences développées
- Architecture d'applications web modernes
- Développement full-stack
- Sécurité web avancée
- DevOps et containerisation
- Gestion de projet complexe
- Programmation temps réel
- UI/UX design

## Contraintes 42
- **Single Page Application** obligatoire
- **3 frameworks/langages** différents minimum
- **Docker** pour tous les services
- **Sécurité** de niveau production
- **Code maintenable** et documenté

## Auteur
Alexandre Pommier (apommier) - École 42

## Équipe (si applicable)
- Développeur Frontend
- Développeur Backend  
- DevOps Engineer
- Security Specialist

## Licence
Projet académique - École 42