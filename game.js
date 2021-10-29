
 //import './score.js'
import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";
        
 // initialize kaboom context
 kaboom({
    width: 800,
    height:400,
});

import {Booster} from './main.js';

const FLOOR_HEIGHT = 0;//48;
const JUMP_FORCE = 700;




loadSprite("man", "assets/FinalCharImages/FinalMalesprite_100x100/runmananime.png", {
    sliceX: 16,
    sliceY: 1,
    anims:{
        "fall":{
            from: 16,
            to:16,
        },
        "jump":{
            from: 8,
            to: 15,
        },
        "run":{
            from:0,
            to:7,
            loop: true,
        },
    }
});
loadSprite("bag1", "assets/bags/bag1.png");
loadSprite("bag2", "assets/bags/bag2.png");
loadSprite("bag3", "assets/bags/bag3.png");


loadSprite("train", "assets/halftrainBack.png");
loadSprite("city", "assets/Background.png");

loadSprite("coin", "assets/coin_sprite.png", {
    sliceX: 10,
    sliceY: 1,
    anims:{
        "rot":{
            from: 0,
            to:5,
            loop: true,
        },
        "explo":{
            from:6,
            to:9,
        }
    }
});
loadSprite("boost", "assets/booster.png");
//Booster();


// For scenes
scene("menu", () => {
    add([
        text("Enter your age:", {
            width: width(),
            size: 50,
        })
    ]);
});


scene("game", () => {
    let SPEED = 600;    
    let BagCollide = true;
    let score = 0; 
    let stamina = 11;

        layers([
            "bottom",
            "mid",
            "top"
        ], "top");

        gravity(2000);

        const player = add([
            sprite("man", {
                anims: "run",
            }),
            pos(50, height()),
            outline(4),
            origin("botleft"),
            layer("top"),
            scale(2.3), //for 100x100
            //scale(0.5),for 1080
            area(),
            body(),
        ]);

        //For jump
        function jump(){
            if (player.grounded()){
                player.jump(JUMP_FORCE);
                player.play("jump");
            };
        };

        keyPress("space", jump);
        mouseDown(jump);
        mouseIsReleased(player.play("run"));

        mouseRelease(() => {
                player.play("run");
        });


        //for platform
        add([
            rect(width(), FLOOR_HEIGHT),
            pos(0, height()),
            outline(4),
            origin("botleft"),
            area(),
            layer("top"),
            solid(),
            color(127, 200, 255),
        ]);
        

        //add background train
        add([
            sprite("train"),
            pos(0, 0),
            origin("topleft"),
            area(),
            scale(1.12),
            move(LEFT, SPEED),
            layer("mid"),
        ]);
        
        //add background city
        add([
            sprite("city"),
            pos(0, 30),
            origin("topleft"),
            area(),
            scale(0.5),
            move(LEFT, SPEED*0.3),
            layer("bottom"),
        ]);
        


        // For spawning bags in loop
        function spawnBags(){
                    //add bags 
            add([
                    sprite(choose(["bag1", "bag2", "bag3"])),
                    pos(width(), height()),
                    area(),
                    origin("botleft"),
                    layer("top"),
                    scale(0.8),
                    move(LEFT, SPEED),
                    cleanup(2),
                    "bag", // add a tag here
                ]);
            // wait a random amount of time to spawn next tree
            wait(rand(1, 4), (spawnBags));
            
        }

        //start spawning bags
        spawnBags();
    
        //For adding coins
        function spawnCoins(){
                    //add coins  
                const coin = add([
                    sprite("coin", {
                        anims: "rot",
                    }),
                    pos(width() + 500, height()- 250),
                    area(),
                    origin("botleft"),
                    layer("top"),
                    scale(0.7),
                    move(LEFT, SPEED),
                    "coin", // add a tag here
                ]);
                coin.play("rot");

            //add score for every coin
            player.collides("coin", () => {
                score += 50;
                coin.stop()
                coin.destroy();
            });
                
            // wait a random amount of time to spawn next tree
            wait(rand(2, 3), (spawnCoins));
        }

         //start spawning trees
        spawnCoins();

        //For spawning boosters
        function spawnBoost(){
                //add coins 
            add([
                sprite("boost"),
                pos(width() + 1000, height()- 50),
                area(),
                origin("botleft"),
                layer("top"),
                scale(0.8),
                move(LEFT, SPEED, loop=true),
                cleanup(2),
                
                "boost", // add a tag here
            ]);
            // wait a random amount of time to spawn next tree
            wait(rand(10, 15), (spawnBoost));
            
        }

        //start spawning trees
        spawnBoost();

    
        //add scores
        const scoreLabel = add([
            text(score),
            pos(24, 24),
            layer("top"),
        ])
        
        //add stamina label
        const staminaLabel = add([
            text(stamina),
            pos(350, 24),
            layer("top"),
        ])


       

        //after colliding with boosters
        player.collides("boost", () => {
            SPEED = SPEED*2;
            BagCollide = false;  
            setTimeout(Boostfunc, 5000);
        });

        function Boostfunc(){
            SPEED = SPEED/2;
            BagCollide = true;
        };

        // lose if player collides with any game obj with tag "bag"
        if(BagCollide){
            player.collides("bag", () => {
                shake();
                destroy(player);
                go("lose", Math.floor(score));// go to "lose" scene here
                burp();
            });
        };

        if(stamina == 5){
            //go("station", stamina);//go to "station level"
            go("lose", Math.floor(score));// go to "los
        };   

        // increment score every frame
        action(() => {
            score+=0.2;
            scoreLabel.text = Math.floor(score) ;
            //for increasing speed every 400        
            /*if (score%50==0){
                SPEED=SPEED+500;
            };*/
              //stamina calc
            stamina = stamina - (0.005);
            staminaLabel.text = Math.floor(stamina) ;  
            
        });        

});

scene("station", (stamina, score) => {
    gravity(2000);
    
    const VadaPav = add([
        sprite("man", {
            anims: "run",
        }),
        pos(50, height()),
        outline(4),
        origin("botleft"),
        layer("top"),
        //scale(0.12),
        area(),
        body(),
    ]);

     //for platform
     add([
        rect(width(), FLOOR_HEIGHT),
        pos(0, height()),
        outline(4),
        origin("botleft"),
        area(),
        layer("top"),
        solid(),
        color(127, 200, 255),
    ]);


    //add scores
    const scoreLabel = add([
        text(score),
        pos(24, 24),
        layer("top"),
    ])

    //add stamina


    // increment score every frame
    action(() => {
        score+=0.2;
        scoreLabel.text = Math.floor(score);
        //stamina calc
        //staminaLabel.text = Math.floor(stamina) ;   

    });       

})

//Scene after lost/ colliding with the bag
scene("lose",  (score) => {
    add([
        text("Retry !"),
        pos(width()/2, height()/2 - 80),
        scale(2),
        origin("center"),
    ]);

    add([
        text(score),
        pos(width()/2, height()/2 + 80),
        scale(1),
        origin("center"),
    ]);
   

    // go back to game with space is pressed
    keyPress("space", () => go("game"));
    mouseClick(() => go("game"));

});

go("game");
//go("menu");
