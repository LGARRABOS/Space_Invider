# Space Invaders

Un mini-jeu inspiré de Space Invaders, réalisé à 100% avec l'aide de l'intelligence artificielle.

## 🎮 Description

Space Invaders est un jeu d'arcade en 2D dans lequel le joueur contrôle un vaisseau spatial et doit éliminer des vagues d’aliens ennemis. Il a été entièrement généré avec l'aide d'une IA, depuis le code jusqu'aux visuels et à la logique du jeu.

## 🚀 Fonctionnalités

- Déplacement horizontal du joueur
- Tir de projectiles
- Apparition et mouvement des aliens ennemis
- Détection de collisions
- Système de score
- Sprites personnalisés générés par IA

## 🛠️ Technologies

- HTML5
- JavaScript (vanilla)
- Node.js (serveur local)

## 📁 Structure du projet

```
space-invaders/
├── assets/
│   └── images/
│       ├── alien_sprite.png
│       └── player_sprite.png
├── js/
│   ├── game.js
│   └── gameLogic.js
├── test/
│   ├── gameLogic.test.js
│   └── server.test.js
├── index.html
├── package.json
├── server.js
└── README.md
```

## ▶️ Lancer le jeu

1. Installe Node.js si ce n'est pas déjà fait.
2. Ouvre un terminal dans le dossier du projet.
3. Installe les dépendances (optionnel) et lance le serveur local :

   - soit via npm :

     ```bash
     npm start
     ```

   - soit avec le script d'exécution automatique `start.sh` (il installe les dépendances manquantes puis lance le serveur) :

     ```bash
     ./start.sh
     ```

   Le jeu est ensuite accessible à l'adresse [http://localhost:3000](http://localhost:3000). Tu peux aussi définir la variable d'environnement `PORT` pour utiliser un autre port.

4. Pour arrêter le serveur, utilise `Ctrl + C` dans le terminal.

## 🧪 Tests

Des tests automatisés vérifient la logique de progression de la difficulté ainsi que le serveur HTTP. Ils se lancent avec :

```bash
npm test
```


## 🤖 Créé avec l'aide de l'IA

Ce projet a été entièrement conçu avec l'accompagnement d'une IA : du design à la logique de jeu, dans un esprit d'exploration des capacités actuelles de l'intelligence artificielle dans le développement de jeux vidéo.

## 📄 Licence

Ce projet est open-source. Tu peux le modifier et le distribuer librement.
