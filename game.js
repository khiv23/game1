var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};


var score = 0;
var scoreText;
var gameOver = false;
var player;
//var vorog;
var stars;
var bombs;
var platforms;
var cursors;
var life = 5;

var worldWidth = 9600;

var game = new Phaser.Game(config);



function preload() {
    this.load.image('sky', 'assets/fon.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('star', 'assets/brown.png');
    this.load.image('kysh', 'assets/kysh.png');
    this.load.image('platformStart', 'assets/platformStart.png');
    this.load.image('platformOne', 'assets/platformOne.png');
    this.load.image('platformFinish', 'assets/platformFinish.png');
    this.load.spritesheet('dude', 'assets/red.png', { frameWidth: 32, frameHeight: 48 });

}

function create() {
    //  A simple background for our game reset
    this.add.tileSprite(0, 0, 9600, 1080, 'sky').setOrigin(0, 0);

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    for (var x = 0; x < worldWidth; x = x + 128) {

        //   console.log(x)
        platforms.create(x, 1040, 'ground').setOrigin(0, 0).refreshBody().setScale(1);
    }

    for (var x = 0; x < worldWidth; x = x + Phaser.Math.Between(600, 400)) {
        var y = Phaser.Math.FloatBetween(700, 93 * 10)
        platforms.create(x, y, 'platformStart');
        var i;
        for (i = 1; i < Phaser.Math.Between(0, 5); i++) {
            platforms.create(x + 100 * i, y, 'platformOne');
        }
        platforms.create(x + 100 * i, y, 'platformFinish');
    }

    // The player and its settings
    player = this.physics.add.sprite(800, 800, 'dude');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.setDepth(5);

    //Створення ворога
    // vorog = this.physics.add.group();


    //vorog.create(50, 16, 'vorog')
    //   .setBounce(18)
    // .setCollideWorldBounds(true)
    //  .setVelocity(Phaser.Math.Between(-200, 200), 100)
    // .allowGravity = false;

    //  vorog = this.physics.add.group({
    //   key: 'vorog',
    //     repeat: 20    ,
    //  setXY: { x: 12, y: 0, stepX: 50 }
    //});

    this.cameras.main.setBounds(0, 0, worldWidth, 1080);
    this.physics.world.setBounds(0, 0, worldWidth, 1080);

    this.cameras.main.startFollow(player);
    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //Додаємо об'єкти випадковим чином на всю ширину екрану
    kysh = this.physics.add.staticGroup();

    for (var x = 0; x < worldWidth; x = x + Phaser.Math.FloatBetween(200, 500)) {
        kysh
            .create(x, 1080 - 30, 'kysh')
            .setOrigin(0, 1)
            .setScale(Phaser.Math.FloatBetween(0.5, 2))
            .setDepth(Phaser.Math.Between(1, 10));
    }


    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    stars = this.physics.add.group({
        key: 'star',
        repeat: 1000,
        setXY: { x: 12, y: 0, stepX: 70 }
    });


    stars.children.iterate(function (child) {

        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    //Додаємо бомби
    //bombs = this.physics.add.group();


    bombs = this.physics.add.group({
        key: 'bomb',
        repeat: 100,
        setXY: { x: 250, y: 350, stepX: 100 }
    });

    bombs.children.iterate(function (child) {

        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
        .setBounce(0.999)
        .setCollideWorldBounds(true)
        .setVelocity(Phaser.Math.Between(-200, 200), 100)

    });

   




    //  The score

    scoreText = this.add.text(16, 16, 'Очок: 0', { fontSize: '32px', fill: '#fff' })
        .setOrigin(0, 0)
        .setScrollFactor(0)
    //Life
    lifeText = this.add.text(1500, 16, showLife(), { fontSize: '32px', fill: '#fff' })
        .setOrigin(0, 0)
        .setScrollFactor(0)



    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    //  this.physics.add.collider(vorog, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
    // this.physics.add.collider(player, vorog, hitBomb, null, this);
}

function update() {
    if (gameOver) {
        return;
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

function collectStar(player, star) {
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);
    timerOn = true;
    if (stars.countActive(true) === 0) {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);


    }
}

function hitBomb(player, bomb) {
    bomb.disableBody(true, true);
    //this.physics.pause();
    life -= 1;
    lifeText.setText(showLife());

    //player.setTint(0xff0000);
    console.log('boom')
    player.anims.play('turn');

    if (life == 0) {
        player.setTint(0xff0000);
        gameOver();
    }



}
//function hitvorog(player, vorog) {
// vorog.disableBody(true, true);
//this.physics.pause();
//life -= 1;
// lifeText.setText(showLife());

// player.setTint(0xff0000);

//  player.anims.play('turn');

//gameOver = true;
// }


//Формування смуги життя
function showLife() {
    var lifeLine = ' Життя: '
    for (var i = 0; i < life; i++) {
        lifeLine += '💚'
    }
    return lifeLine
}