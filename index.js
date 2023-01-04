const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");

canvas.width = Math.min(window.innerWidth, 1200);
canvas.height = Math.min(window.innerHeight, 600);

class Sprite{
    constructor({position, details, animation}){
        this.position = position;
        this.details = details;
        this.animation = animation;

        this.image = new Image();
        this.image.onload = () => {
            this.loaded = true;
        }

        if(this.animation.type == "character"){ this.image.src = `./0x72_DungeonTilesetII_v1.4/frames/${this.animation.character}_${this.animation.name}_anim_f${this.animation.frame}.png`; }
        else if(this.animation.type == "weapon"){ this.image.src = `./0x72_DungeonTilesetII_v1.4/frames/weapon_${this.animation.name}.png`; }
        this.loaded = false;
    }
    draw(){
        if(!this.loaded){ return; }

        c.save();
        c.imageSmoothingEnabled = false; 
        if(this.animation.type == "character"){
            if(this.lastDir === "right"){ c.drawImage(this.image, this.position.x, this.position.y, this.details.width, this.details.height); }
            else {
                c.scale(-1, 1);
                c.drawImage(this.image, -this.position.x - this.details.width, this.position.y, this.details.width, this.details.height);
            }
        }else if(this.animation.type == "weapon"){
            const enemyAbovePlayer = this.position.y + this.details.height >= player.position.y + player.details.height + 5;
            const enemyToTheLeft = this.position.x < player.position.x;

            if(enemyToTheLeft && !enemyAbovePlayer  && this.animation.name != "bow") {
                if(this.attack < 0){
                    c.scale(-1, 1);
                    c.drawImage(this.image, -this.position.x - this.details.width, this.position.y, this.details.width, this.details.height);
                }else {
                    c.scale(1, -1);
                    c.translate(this.position.x + this.details.width / 2, -(this.position.y + this.details.height / 2) - this.details.height);
                    c.rotate(-Math.PI/2);
                    c.drawImage(this.image, -this.details.width - 7, -this.details.height, this.details.width, this.details.height);
                }
            }else if(this.animation.name != "bow") {
                if (enemyAbovePlayer) {
                    c.translate(this.position.x + this.details.width / 2, this.position.y + this.details.height / 2);
                    c.rotate(Math.PI);
    
                    if (this.attack < 0) {
                        c.drawImage(this.image, -this.details.width + 6, -this.details.height / .7, this.details.width, this.details.height);
                    } else {
                        const enemyToLeftOfPlayer = this.position.x <= player.position.x;
                        if (enemyToLeftOfPlayer) {
                            c.rotate(Math.PI / 2);
                            c.drawImage(this.image, -this.details.width - 7, -this.details.height, this.details.width, this.details.height);
                        } else {
                            c.rotate(-Math.PI / 2);
                            c.drawImage(this.image, this.details.width - 7, -this.details.height, this.details.width, this.details.height);
                        }
                    }
                } else {
                    if (this.attack < 0) {
                        c.drawImage(this.image, this.position.x, this.position.y, this.details.width, this.details.height);
                    } else {
                        const enemyToRightOfPlayer = this.position.x > player.position.x;
                        c.translate(this.position.x + this.details.width / 2, this.position.y + this.details.height / 2);
                        if (enemyToRightOfPlayer) {
                            c.rotate(Math.PI / 2);
                            c.drawImage(this.image, this.details.width / 2, -this.details.height, this.details.width, this.details.height);
                        } else {
                            c.rotate(-Math.PI / 2);
                            c.drawImage(this.image, -this.details.width / .6, -this.details.height + 3, this.details.width, this.details.height);
                        }
                    }
                }
            }else {
                // if the weapon is a bow
                c.translate(this.position.x + this.details.width / 2, this.position.y + this.details.height / 2);
                c.rotate(this.angle);
                c.drawImage(this.image, this.details.width/2, -this.details.height/2, this.details.width, this.details.height);
            }
            this.attack --;
        } 
        c.restore();
        
        if(this.currFrame > 5){
            this.animation.frame = this.animation.frame + 1 > 3 ? 0 : this.animation.frame + 1;
            this.currFrame = 0;
        }else this.currFrame ++;

        this.image.onload = () => {
            this.loaded = true;
        }
        if(this.animation.type == "character"){ this.image.src = `./0x72_DungeonTilesetII_v1.4/frames/${this.animation.character}_${this.animation.name}_anim_f${this.animation.frame}.png`; }
        else if(this.animation.type == "weapon"){ this.image.src = `./0x72_DungeonTilesetII_v1.4/frames/weapon_${this.animation.name}.png`; }
        this.loaded = false;
    }
}

class Player extends Sprite{
    constructor({position, details, velocity, stats, animation}){
        super({
            position: position,
            details: details,
            animation: animation,
        })
        this.position = position;
        this.details = details;
        this.velocity = velocity;
        this.stats = stats;
        this.animation = animation;

        // player movemnet
        this.dir = [false/*up*/, false/*down*/, false/*left*/, false/*right*/]

        this.currFrame = 0;
        this.lastDir = "right";
    }
    update(){
        // Player movement

        // Going up
        if(this.dir[0] && (this.position.y - this.stats.speed) > 0){
            this.velocity.y = this.stats.speed;
        }else if(this.velocity.y == this.stats.speed){
            this.velocity.y = 0;
        }
        //Going Down
        if(this.dir[1] && (this.position.y - this.stats.speed + this.details.height) < canvas.height){
            this.velocity.y = -this.stats.speed;
        }else if(this.velocity.y == -this.stats.speed){
            this.velocity.y = 0;
        }
        //Going Left
        if(this.dir[2] && (this.position.x - this.stats.speed) > 0){
            this.velocity.x = this.stats.speed;
            this.lastDir = "left";
        }else if(this.velocity.x == this.stats.speed){
            this.velocity.x = 0;
        }
        //Going Right
        if(this.dir[3] && (this.position.x - this.stats.speed + this.details.width) < canvas.width){
            this.velocity.x = -this.stats.speed;
            this.lastDir = "right";
        }else if(this.velocity.x == -this.stats.speed){
            this.velocity.x = 0;
        }

        this.draw();
        this.position.x -= (this.dir[0] || this.dir[1]) && (this.dir[2] || this.dir[3]) ? this.velocity.x/1.5 : this.velocity.x;
        this.position.y -= (this.dir[0] || this.dir[1]) && (this.dir[2] || this.dir[3]) ? this.velocity.y/1.5 :this.velocity.y;
    }
}

class Weapon extends Sprite{
    constructor({position, details, stats, animation}){
        super({
            position: position,
            details: details,
            animation: animation,
        })
        this.position = position;
        this.details = details;
        this.stats = stats;
        this.animation = animation;

        this.attack = 0;
        this.angle = 0;
    }
    update(){
        this.angle = Math.atan2(mousePos.y - this.position.y, mousePos.x - this.position.x);
        const angle1 = Math.atan2(mousePos.y - player.position.y+(player.details.height/1.5), mousePos.x - player.position.x+(player.details.width/2));

        this.draw();

        this.position.x = (player.position.x+(player.details.width/2)) + 35 * Math.cos(angle1) - this.details.width/2;
        this.position.y = (player.position.y+(player.details.height/1.5)) + 35 * Math.sin(angle1) - this.details.height;
    }
}

class Projectile{
    constructor({position, details, velocity, name}){
        this.position = position;
        this.details = details;
        this.velocity = velocity;
        this.name = name;

        if(this.name == "arrow"){
            this.image = new Image();
            this.image.onload = () => {
                this.loaded = true;
            }

            this.image.src = "./0x72_DungeonTilesetII_v1.4/frames/weapon_arrow.png";
            this.loaded = false;
        }else{
            this.alpha = 1;
        }
    }

    draw(){

        if(this.name == "arrow"){
            if(!this.loaded){ return; }

            c.save();
            c.imageSmoothingEnabled = false; 
            c.translate(this.position.x + this.details.width / 2, this.position.y + this.details.height / 2);
            c.rotate(Math.PI/2);
            c.rotate(this.details.rotation);
            c.drawImage(this.image, this.details.width/2, -this.details.height/2, this.details.width, this.details.height);
            c.restore();
        }else if(this.name == "redMagic"){
            for(var i=0; i<10; i++){
                particles.push(new Particle(this.position.x + getRandomNumber(5, -5), this.position.y + getRandomNumber(5, -5), "red", 1));
            }
        }else if(this.name == "greenMagic"){
            for(var i=0; i<10; i++){
                particles.push(new Particle(this.position.x + getRandomNumber(5, -5), this.position.y + getRandomNumber(5, -5), "lightgreen", 1));
            }
        }
    }

    update(){
        this.draw();
        this.position.x -= this.velocity.x;
        this.position.y -= this.velocity.y;
    }
}

class Particle{
    constructor(x, y, color, alpha){
        this.x = x;
        this.y = y;
        this.color = color;
        this.alpha = alpha;
    }
    draw(){
        this.alpha -= 0.5;

        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, 3, 3);
    }
}

class Enemy extends Sprite{
    constructor({position, details, velocity, stats, animation}){
        super({
            position: position,
            details: details,
            animation: animation,
        })
        this.position = position;
        this.details = details;
        this.velocity = velocity;
        this.stats = stats;
        this.animation = animation;

        this.dir = [false/*up*/, false/*down*/, false/*left*/, false/*right*/];
        this.stop = false;

        this.currFrame = 0;
        this.lastDir = "right";
    }
    update(){
        const playerAngle = Math.atan2(player.position.y - this.position.y, player.position.x - this.position.x);
        this.velocity.x -= Math.cos(playerAngle) * this.stats.speed;
        this.velocity.y -= Math.sin(playerAngle) * this.stats.speed;

        if(-Math.cos(playerAngle) < 0){ this.lastDir = "right"; }
        else{ this.lastDir = "left"; }

        this.animation.name = "run";

        // hp bar
        c.fillStyle = 'black';
        c.beginPath();
        c.roundRect(this.position.x-10, this.position.y-20, this.details.width+20, 10, 25);
        c.fill();
        c.fillStyle = 'red';
        c.beginPath();
        c.roundRect(this.position.x-8, this.position.y-18, (this.details.width+16)*(this.stats.health/this.stats.maxhealth), 6, 25);
        c.fill();


        if(this.position.y - this.velocity.y <= 0){
            this.velocity.y = 0;
            this.stop = true;
        }
        //Going Down
        if(this.position.y - this.velocity.y + this.details.height >= canvas.height){
            this.velocity.y = 0;
            this.stop = true;
        }
        //Going Left
        if(this.position.x - this.velocity.x <= 0){
            this.velocity.x = 0;
            this.stop = true;
        }
        //Going Right
        if(this.position.x - this.velocity.x + this.details.width >= canvas.width){
            this.velocity.x = 0;
            this.stop = true;
        }

        this.draw();
        this.position.x -= (this.dir[0] || this.dir[1]) && (this.dir[2] || this.dir[3]) ? this.velocity.x/1.5 : this.velocity.x;
        this.position.y -= (this.dir[0] || this.dir[1]) && (this.dir[2] || this.dir[3]) ? this.velocity.y/1.5 :this.velocity.y;
        if(!this.stop){
            this.velocity.x += Math.cos(playerAngle) * this.stats.speed;
            this.velocity.y += Math.sin(playerAngle) * this.stats.speed;
        }else {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }
        this.stop = false;
        console.log(this.velocity.x);
    }
}

let player;
let weapon;
let mousePos = {x:0, y:0};
let drawImagePos;
let playerKnockback;

let enemies = [];
let projectiles = [];
let particles = [];

const weapons = {
    anime_sword: {
        weaponName: "anime_sword",
        width: 20,
        height: 40
    },
    axe: {
        weaponName: "axe",
        width: 15,
        height: 30
    },
    baton_with_spikes: {
        weaponName: "baton_with_spikes",
        width: 20,
        height: 40
    },
    big_hammer: {
        weaponName: "big_hammer",
        width: 17,
        height: 45
    },
    bow: {
        weaponName: "bow",
        width: 17,
        height: 37
    },
    cleaver: {
        weaponName: "cleaver",
        width: 17,
        height: 35
    },
    duel_sword: {
        weaponName: "duel_sword",
        width: 15,
        height: 50
    },
    golden_sword: {
        weaponName: "golden_sword",
        width: 17,
        height: 40
    },
    green_magic_staff: {
        weaponName: "green_magic_staff",
        width: 13,
        height: 60
    },
    hammer: {
        weaponName: "hammer",
        width: 15,
        height: 30
    },
    katana: {
        weaponName: "katana",
        width: 11,
        height: 45
    },
    knife: {
        weaponName: "knife",
        width: 10,
        height: 30
    },
    knight_sword: {
        weaponName: "knight_sword",
        width: 17,
        height: 45
    },
    lavish_sword: {
        weaponName: "lavish_sword",
        width: 17,
        height: 45
    },
    mace: {
        weaponName: "mace",
        width: 17,
        height: 33
    },
    machete: {
        weaponName: "machete",
        width: 10,
        height: 30
    },
    red_gem_sword: {
        weaponName: "red_gem_sword",
        width: 17,
        height: 40
    },
    red_magic_staff: {
        weaponName: "red_magic_staff",
        width: 13,
        height: 60
    },
    regular_sword: {
        weaponName: "regular_sword",
        width: 17,
        height: 40
    },
    rusty_sword: {
        weaponName: "rusty_sword",
        width: 17,
        height: 40
    },
    saw_sword: {
        weaponName: "saw_sword",
        width: 17,
        height: 45
    },
    spear: {
        weaponName: "spear",
        width: 11,
        height: 75
    },
}

const enemyData = {
    big_demon: {
        name: "big_demon",
        width: 100,
        height: 120,
    },
    big_zombie: {
        name: "big_zombie",
        width: 100,
        height: 120,
    },
    chort: {
        name: "chort",
        width: 35,
        height: 40,
    },
    goblin: {
        name: "goblin",
        width: 35,
        height: 35,
    },
    ice_zombie: {
        name: "ice_zombie",
        width: 35,
        height: 35,
    },
    imp: {
        name: "imp",
        width: 30,
        height: 30,
    },
    masked_orc: {
        name: "masked_orc",
        width: 32,
        height: 35,
    },
    necromancer: {
        name: "necromancer",
        width: 30,
        height: 35,
    },
    ogre: {
        name: "ogre",
        width: 80,
        height: 100,
    },
    orc_shaman: {
        name: "orc_shaman",
        width: 30,
        height: 35,
    },
    orc_warrior: {
        name: "orc_warrior",
        width: 30,
        height: 35,
    },
    skelet: {
        name: "skelet",
        width: 35,
        height: 40,
    },
    swampy: {
        name: "swampy",
        width: 25,
        height: 25,
    },
    tiny_zombie: {
        name: "tiny_zombie",
        width: 30,
        height: 30,
    },
    wogol: {
        name: "wogol",
        width: 35,
        height: 40,
    },
    zombie: {
        name: "zombie",
        width: 35,
        height: 35,
    },
}

const currEnemy = Object.keys(enemyData)[Math.floor(Math.random()*Object.keys(enemyData).length)];
let currWeapon =  Object.keys(weapons)[Math.floor(Math.random()*Object.keys(weapons).length)];

let frame;
function Update(){
    frame = requestAnimationFrame(Update);

    c.fillStyle = "white";
    c.fillRect(0, 0, canvas.width, canvas.height);
    

    if(!player.dir[0] && !player.dir[1] && !player.dir[2] && !player.dir[3]){ player.animation.name = "idle"; }

    // player health bar
    c.fillStyle = 'black';
    c.beginPath();
    c.roundRect(2, 2, 135, 17, 25);
    c.fill();
    c.fillStyle = 'red';
    c.beginPath();
    c.roundRect(7, 7, 125*(player.stats.health/player.stats.maxhealth), 7, 25);
    c.fill();

    player.update();
    weapon.update();

    projectiles.forEach((projectile, index) => {
        if(projectile.position.x + 100 <= 0 || projectile.position.x - 100 >= canvas.width || projectile.position.y + 100 <= 0 || projectile.position.y - 100 >= canvas.height){
            projectiles.splice(index, 1);
        }

        projectile.update();
    })
    particles.forEach((particle, index) => {
        if(particle.alpha <= 0){ particles.splice(index, 1); }
        particle.draw();
    })
    enemies.forEach((enemy, index) => {
        // player damage
        if(collision(player, enemy) && playerKnockback == undefined){
            player.stats.health -= enemy.stats.attack;

            playerKnockback = enemy;
            setTimeout(() => {
                playerKnockback = undefined;
            }, 70);
        }

        // enemy death
        const weaponHitbox = {
            position: {
                x: weapon.position.x,
                y: weapon.position.y
            },
            details: {
                width: weapon.details.height,
                height: weapon.details.height*2
            }
        }
        if(weapon.attack > 0 && collision(weaponHitbox, enemy)){
            enemy.stats.health -= weapon.stats.attack;

            weapon.attack = 0;

            enemyKockback(enemy);
        }

        projectiles.forEach((projectile, projectileIndex) => {
            if(collision(projectile, enemy)){
                setTimeout(() => {
                    projectiles.splice(projectileIndex, 1);
                }, 0);
                enemyKockback(enemy);
                enemy.stats.health -= weapon.stats.attack;
            }
        })

        if(enemy.stats.health <= 0){
            enemies.splice(index, 1);
        }

        enemy.update();
    })

    if(playerKnockback != undefined){
        const angle = Math.atan2(player.position.y - playerKnockback.position.y, player.position.x - playerKnockback.position.x);
        player.position.x -= Math.cos(angle)* -10;
        player.position.y -= Math.sin(angle)* -10;
    }

    // gameover
    if(player.stats.health <= 0){
        setTimeout(() => {
            cancelAnimationFrame(frame);
        }, 100);
    }
}

function selectCharacter(name){
    player = new Player({
        position: {
            x: canvas.width/2,
            y: canvas.height/2,
        },
        details: {
            width: 30,
            height: 60,
        },
        velocity: {
            x:0,
            y:0
        },
        stats: {
            maxhealth: document.querySelector(`.characterSelection .${name} .stats .health`).innerHTML.substring(document.querySelector(`.characterSelection .${name} .stats .health`).innerHTML.indexOf("-")+2),
            health: document.querySelector(`.characterSelection .${name} .stats .health`).innerHTML.substring(document.querySelector(`.characterSelection .${name} .stats .health`).innerHTML.indexOf("-")+2),
            defence: document.querySelector(`.characterSelection .${name} .stats .defence`).innerHTML.substring(document.querySelector(`.characterSelection .${name} .stats .defence`).innerHTML.indexOf("-")+2),
            attack: document.querySelector(`.characterSelection .${name} .stats .attack`).innerHTML.substring(document.querySelector(`.characterSelection .${name} .stats .attack`).innerHTML.indexOf("-")+2),
            speed: document.querySelector(`.characterSelection .${name} .stats .speed`).innerHTML.substring(document.querySelector(`.characterSelection .${name} .stats .speed`).innerHTML.indexOf("-")+2),
        },
        animation: {
            type: "character",
            character: name+"_"+document.querySelector(`.characterSelection .${name} .gender`).value,
            name:"idle",
            frame:0
        },
    });

    weapon = new Weapon({
        position: {
            x: canvas.width/2+player.details.width,
            y: canvas.height/2,
        },
        details: {
            width: weapons[currWeapon].width, 
            height: weapons[currWeapon].height,
        },
        stats: {
            attack: 10,
        },
        animation: {
            type: "weapon",
            name: weapons[currWeapon].weaponName,
        }
    });

    enemies.push(new Enemy({
        position: {
            x: canvas.width/2+100 - enemyData[currEnemy].width/2,
            y: canvas.height/2 - enemyData[currEnemy].height/2
        },
        details: {
            width: enemyData[currEnemy].width,
            height: enemyData[currEnemy].height
        },
        velocity: {
            x: 0,
            y: 0
        },
        stats: {
            maxhealth: 100,
            health: 100,
            defence: 0,
            attack: 10,
            speed: 2
        },
        animation: {
            type: "character",
            character: enemyData[currEnemy].name,
            name: "idle",
            frame: 0
        },
    }));

    document.querySelector(".characterSelection").style.visibility = "hidden";
    Update();
}

const getRandomNumber = (max, min) => (Math.random()*(max - min))+min;

const collision = (rect1, rect2) => !(((rect1.position.y + rect1.details.height) < (rect2.position.y)) || (rect1.position.y > (rect2.position.y + rect2.details.height)) || ((rect1.position.x + rect1.details.width) < rect2.position.x) || (rect1.position.x > (rect2.position.x + rect2.details.width)));

function drawHitbox(sprite){
    c.strokeStyle = "blue";
    c.strokeRect(sprite.position.x, sprite.position.y, sprite.details.width, sprite.details.height);
}

function enemyKockback(object){
    const angle = Math.atan2(object.position.y - mousePos.y, object.position.x - mousePos.x);
    object.velocity.x -= -Math.cos(angle)* 10;
    object.velocity.y -= -Math.sin(angle)* 10;
    setTimeout(() => {
        object.velocity.x += -Math.cos(angle)* 10;
        object.velocity.y += -Math.sin(angle)* 10;
    }, 70);

}

window.onmousemove = (e) => {
    mousePos.x = e.x - (window.innerWidth - canvas.width)/2;
    mousePos.y = e.y - (window.innerHeight - canvas.height)/2;
}

window.onmousedown = (e) => {
    if(weapon == null){ return; }

    // attack
    if(weapon.animation.name != "bow"){
        weapon.attack = 5;
    }

    let projectileName = "";
    if(weapon.animation.name == "bow"){ projectileName = "arrow"; }
    else if(weapon.animation.name == "green_magic_staff"){ projectileName = "greenMagic"; }
    else if(weapon.animation.name == "red_magic_staff"){ projectileName = "redMagic"; }

    const angle = Math.atan2(mousePos.y - weapon.position.y, mousePos.x - (weapon.position.x - weapon.details.width/2));

    if(weapon.animation.name == "bow" || weapon.animation.name == "green_magic_staff" || weapon.animation.name == "red_magic_staff"){
        projectiles.push(new Projectile({
            position: {
                x: weapon.position.x + weapon.details.width/2,
                y: weapon.position.y + weapon.details.height/2
            },
            details: {
                width: 10,
                height: 20,
                rotation: angle
            },
            velocity: {
                x: Math.cos(angle)* -8,
                y: Math.sin(angle)* -8
            },
            name: projectileName
        }))
    }
}

window.addEventListener("keydown", (event) => {
    if(player == null){ return; }

    if(event.key.toLowerCase() == "w"){
        player.animation.name = "run";
        player.dir[0] = true;
    }
    if(event.key.toLowerCase() == "s"){
        player.animation.name = "run";
        player.dir[1] = true;
    }
    if(event.key.toLowerCase() == "a"){
        player.animation.name = "run";
        player.dir[2] = true;
    }
    if(event.key.toLowerCase() == "d"){
        player.animation.name = "run";
        player.dir[3] = true;
    }
})

window.addEventListener("keyup", (event) => {
    if(player == null){ return; }

    if(event.key.toLowerCase() == "w"){
        player.dir[0] = false;
    }
    if(event.key.toLowerCase() == "s"){
        player.dir[1] = false;
    }
    if(event.key.toLowerCase() == "a"){
        player.dir[2] = false;
    }
    if(event.key.toLowerCase() == "d"){
        player.dir[3] = false;
    }
})
