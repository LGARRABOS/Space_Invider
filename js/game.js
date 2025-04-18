const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let player;
let cursors;
let bullets;
let lastFired = 0;
let aliens;
let score = 0;
let scoreText;
let lives = 3;
let livesText;
let moveAliensTimer;
let alienSpeed = 60; // Vitesse de descente des aliens
let gameOverText; // Texte de Game Over
let invulnerable = false; // Flag pour l'invulnérabilité temporaire
let isGameOver = false; // Flag pour indiquer que le jeu est terminé

function preload() {
    this.load.image('player', 'assets/images/player_sprite.png');
    this.load.image('alien', 'assets/images/alien_sprite.png');
}

function create() {
    createGraphics.call(this);
    initializeGame.call(this);
}

function update(time, delta) {
    if (isGameOver) return;

    handlePlayerMovement.call(this);
    handleShooting.call(this, time);
    updateBullets.call(this);
    checkAliensReachedBottom.call(this);

    // Vérifier si tous les aliens ont été détruits et créer une nouvelle vague
    if (aliens.countActive(true) === 0) {
        createAliens(this);
    }
}

function createGraphics() {
    // Créer un rectangle blanc pour les balles
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(0, 0, 5, 20); // Taille du rectangle
    graphics.generateTexture('bullet', 5, 20); // Générer la texture
    graphics.destroy(); // Détruire l'objet graphique après la génération de la texture
}

function initializeGame() {
    player = this.physics.add.sprite(config.width / 2, config.height - 100, 'player').setCollideWorldBounds(true);
    player.setScale(0.1); // Redimensionner le joueur

    bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 10 // Limiter le nombre maximum de projectiles
    });

    createAliens(this);

    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-SPACE', () => {
        if (isGameOver) {
            restartGame.call(this);
        } else {
            shootBullet(this.time.now);
        }
    }, this);

    scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '16px', fill: '#fff' });
    livesText = this.add.text(10, 30, 'Lives: 3', { fontSize: '16px', fill: '#fff' });

    this.physics.add.collider(bullets, aliens, hitAlien, null, this);
    this.physics.add.overlap(player, aliens, playerHit, null, this); // Utiliser overlap au lieu de collider

    this.physics.world.setBoundsCollision(true, true, true, false);

    // Démarrer le timer pour faire descendre les aliens
    moveAliensTimer = this.time.addEvent({
        delay: 2000, // Intervalle de temps en millisecondes
        callback: moveAliensDown,
        callbackScope: this,
        loop: true
    });
}

function handlePlayerMovement() {
    // Gestion des mouvements du joueur
    if (cursors.left.isDown) {
        player.setVelocityX(-300);
    } else if (cursors.right.isDown) {
        player.setVelocityX(300);
    } else {
        player.setVelocityX(0);
    }

    // Restriction des mouvements verticaux
    player.setVelocityY(0);
}

function handleShooting(time) {
    // Gestion des tirs
    if (cursors.space.isDown) {
        shootBullet(time);
    }
}

function updateBullets() {
    // Mise à jour des balles
    bullets.children.each(function(bullet) {
        if (bullet.active && bullet.y < 0) {
            bullet.setActive(false);
            bullet.setVisible(false);
        }
    }, this);
}

function checkAliensReachedBottom() {
    // Vérifier si un alien atteint le bas de l'écran
    aliens.children.each(function(alien) {
        if (alien.active && alien.y >= config.height - 30) { // Ajuster la valeur si nécessaire
            alienReachedBottom.call(this, alien);
        }
    }, this);
}

function shootBullet(time) {
    if (time > lastFired) {
        let bullet = bullets.get(player.x, player.y - 20);

        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.body.velocity.y = -300;
            lastFired = time + 150; // Délai entre les tirs
        }
    }
}

function hitAlien(bullet, alien) {
    bullet.destroy(); // Détruire la balle après le tir
    alien.destroy();
    score += 10;
    scoreText.setText('Score: ' + score);
}

function playerHit(player, alien) {
    if (!invulnerable) {
        alien.destroy(); // Détruire l'alien qui a touché le joueur
        loseLife.call(this);
    }
}

function alienReachedBottom(alien) {
    if (alien && alien.active) {
        alien.destroy(); // Détruire l'alien qui a atteint le bas
        loseLife.call(this);
    }
}

function loseLife() {
    lives -= 1; // Réduire le nombre de vies
    if (lives < 0) {
        lives = 0;
    }
    livesText.setText('Lives: ' + lives); // Mettre à jour l'affichage des vies

    if (lives > 0) {
        // Activer l'invulnérabilité temporaire
        invulnerable = true;
        player.setTint(0xff0000);
        this.time.addEvent({
            delay: 1000, // Durée de l'invulnérabilité en millisecondes
            callback: () => {
                invulnerable = false;
                player.clearTint();
            }
        });
    }

    if (lives <= 0) {
        // Si le joueur n'a plus de vies, arrêter le jeu
        isGameOver = true;
        this.physics.pause();
        player.setTint(0xff0000);
        // Ajouter un message de game over
        if (!gameOverText) {
            gameOverText = this.add.text(config.width / 2, config.height / 2, 'Game Over', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);
            gameOverText.setDepth(1); // Mettre le texte de game over au premier plan
        }
    }
}

function moveAliensDown() {
    if (isGameOver) return;

    aliens.children.each(function(alien) {
        alien.y += alienSpeed; // Descendre les aliens de la vitesse définie
    });
    // Ajouter de nouveaux aliens
    addNewAliens(this);
}

function createAliens(scene) {
    const alienSpacingX = 70; // Espacement horizontal entre les aliens
    const minDistance = 50; // Distance minimale entre les aliens
    const maxAlienCount = Math.floor(config.width / alienSpacingX); // Nombre maximum d'aliens pouvant tenir sur la largeur
    const alienCount = Phaser.Math.Between(3, maxAlienCount); // Randomiser le nombre d'aliens avec un minimum de 3

    aliens = scene.physics.add.group();

    const positions = [];
    for (let i = 0; i < alienCount; i++) {
        let x;
        do {
            x = Phaser.Math.Between(0, config.width - alienSpacingX);
        } while (positions.some(pos => Math.abs(pos - x) < minDistance));
        positions.push(x);
        let alien = aliens.create(x, 100, 'alien');
        alien.setScale(0.1); // Redimensionner les aliens
    }
}

function addNewAliens(scene) {
    const alienSpacingX = 70; // Espacement horizontal entre les aliens
    const minDistance = 50; // Distance minimale entre les aliens
    const maxAlienCount = Math.floor(config.width / alienSpacingX); // Nombre maximum d'aliens pouvant tenir sur la largeur
    const alienCount = Phaser.Math.Between(3, maxAlienCount); // Randomiser le nombre d'aliens avec un minimum de 3

    const yOffset = aliens.children.entries.length > 0 ? Math.min(...aliens.children.entries.map(alien => alien.y)) - 60 : 100; // Déterminer la position Y de la nouvelle vague

    const positions = [];
    for (let i = 0; i < alienCount; i++) {
        let x;
        do {
            x = Phaser.Math.Between(0, config.width - alienSpacingX);
        } while (positions.some(pos => Math.abs(pos - x) < minDistance));
        positions.push(x);
        let alien = aliens.create(x, yOffset, 'alien');
        alien.setScale(0.1); // Redimensionner les aliens
    }
}

function restartGame() {
    // Réinitialiser les variables globales
    score = 0;
    lives = 3;
    isGameOver = false;
    invulnerable = false;

    // Réinitialiser les textes de score et de vies
    scoreText.setText('Score: ' + score);
    livesText.setText('Lives: ' + lives);

    // Supprimer le texte de game over
    if (gameOverText) {
        gameOverText.destroy();
        gameOverText = null;
    }

    // Réactiver les collisions physiques
    this.physics.resume();

    // Réinitialiser le joueur
    player.clearTint();
    player.setPosition(config.width / 2, config.height - 100);

    // Supprimer les aliens et en créer de nouveaux
    aliens.clear(true, true);
    createAliens(this);

    // Supprimer les projectiles
    bullets.clear(true, true);

    // Redémarrer le timer pour faire descendre les aliens
    moveAliensTimer.paused = false;

    // Réinitialiser les collisions
    this.physics.add.collider(bullets, aliens, hitAlien, null, this);
    this.physics.add.overlap(player, aliens, playerHit, null, this);
}

window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
