var config = { //Налаштовуємо сцену
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    pixelArt: true,
    debug: true,
    physics: { //Налаштовуємо фізику
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var player;
var platform;
var score = 0;
var scoreText;
var worldWidth = config.width * 2;
var star;
var alien;
var spaceship;

var record = 0

function preload () //Завантажуємо графіку для гри
{
    this.load.image('platform', 'assets/platform.png');
    this.load.image('sky', 'assets/sky.png');
    //this.load.image('dude', 'assets/dude.png');
    //this.load.image('star', 'assets/mountain.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 32 }
    );
    // this.load.spritesheet('dudeleft', 
    //     'assets/dudeleft.png',
    //     { frameWidth: 32, frameHeight: 32 }
    // );
}

function create ()
{

    //Додаемо небо

    this.add.tileSprite(0, 0, worldWidth, 1080, "sky")
        .setOrigin(0, 0)
        .setScale(1)
        .setDepth(0);

    //Створюемо текст з рахунком
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    scoreText
        .setOrigin(0,0)
        .setDepth(1)

    // //Ініціалізуємо курсор Phaser
     cursors = this.input.keyboard.createCursorKeys();

    // //Створюемо фізичну групу
     platforms = this.physics.add.staticGroup();
     star = this.physics.add.group();
     alien = this.physics.add.group();
     spaceship = this.physics.add.group();

//platforms
var platforms;

platforms=this.physics.add.staticGroup();
for(var x=0; x<worldWidth; x=x+400){
    console.log(x)
    platforms.create(x, 1048, 'ground').setOrigin(0,0).refreshBody();
}

    
    //Створюємо об'єкти декорації
    for (let x = 0; x < worldWidth; x += Phaser.Math.FloatBetween(750, 1250)) {
        star.create(x, 180, 'star')
            .setOrigin(0.1, 0.1)
            .setScale(Phaser.Math.FloatBetween(0.5, 3.5))
            .setDepth(Phaser.Math.Between(1,10));
    }

    for (let x = 0; x < worldWidth; x += Phaser.Math.FloatBetween(1500, 2000)) {
        alien.create(x, 180, 'dude')
            .setOrigin(1, 0)
            .setScale(Phaser.Math.FloatBetween(0.1, 0.3))
            .setDepth(Phaser.Math.Between(1,10));
    }

    for (let x = 0; x < worldWidth; x += Phaser.Math.FloatBetween(1000, 1250)) {
        spaceship.create(x, 180, 'sky')
            .setOrigin(0, 0)
            .setScale(Phaser.Math.FloatBetween(0.1, 0.3))
            .setDepth(Phaser.Math.Between(1,10));
    }

    //Створюємо та налаштовуємо спрайт гравця
    player = this.physics.add.sprite(960, 1, 'dude').setScale(2).setDepth(4);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //Налаштування камери
    this.cameras.main.setBounds(0, 0, worldWidth, window.innerHeight);
    this.physics.world.setBounds(0, 0, worldWidth, window.innerHeight);

    //Слідкування камери за гравцем
    this.cameras.main.startFollow(player)

    // //Створюемо та налаштовуємо фізичний об'єкт бомби
    // bombs = this.physics.add.group();
    // this.physics.add.collider(bombs, platforms);
    // this.physics.add.collider(player, bombs, null, this);

    // //Змінено гравітацію гравця
    // player.body.setGravityY(0)

    // //Створюємо та налаштовуємо анімації
    // this.anims.create({
    //     key: 'left',
    //     frames: this.anims.generateFrameNumbers('dudeleft', { start: 0, end: 3 }),
    //     frameRate: 10,
    //     repeat: -1
    // });

    // this.anims.create({
    //     key: 'turn',
    //     frames: [{ key: 'dude', frame: 4 }],
    //     frameRate: 20
    // });

    // this.anims.create({
    //     key: 'right',
    //     frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    //     frameRate: 10,
    //     repeat: -1
    // });

    // //Додано колізії
    // this.physics.add.collider(player, platforms);
    // this.physics.add.collider(star, platforms);
    // this.physics.add.collider(alien, platforms);
    // this.physics.add.collider(spaceship, platforms);

}


function update ()
{
    // //Керування персонажем
    // if (cursors.left.isDown)
    // {
    //     player.setVelocityX(-160);
    //     player.anims.play('left', true);
    // }
    // else if (cursors.right.isDown)
    // {
    //     player.setVelocityX(160);
    //     player.anims.play('right', true);
    // }
    // else
    // {
    //     player.setVelocityX(0);
    //     player.anims.play('turn');
    // }

    // if (cursors.up.isDown && player.body.touching.down)
    // {
    //     player.setVelocityY(-330);
    // }
}