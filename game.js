
 //import './score.js'
import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";
        
 // initialize kaboom context
 kaboom({
    width: 800,
    height:400,
    background: [ 0, 0, 0, "assets/TrainBG.png"],
});

import {Booster} from './main.js';

const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;




loadSprite("man", "assets/runmananime_withoutfall100.png", {
    sliceX: 17,
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
loadSprite("bags", "assets/bag.png");
//loadSprite("city", "assets/TrainBG.png");
loadSprite("coin", "assets/coin.png");
//loadSprite("boost", "assets/booster.png");
Booster();


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
    let SPEED = 500;    
    let BagCollide = true;
    let score = 0; 
    let stamina = 10;

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
            //scale(0.12),
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
        

        //add background city
        /*add([
            sprite("city"),
            pos(0, height()-12*FLOOR_HEIGHT),
            origin("topleft"),
            area(),
            layer("mid"),
        ]);
        */


        // For spawning bags in loop
        function spawnBags(){
                    //add bags 
            add([
                    sprite("bags"),
                    pos(width(), height() - FLOOR_HEIGHT),
                    area(),
                    origin("botleft"),
                    layer("top"),
                    scale(0.5),
                    move(LEFT, SPEED),
                    cleanup(3),
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
                add([
                    sprite("coin"),
                    pos(width() + 500, height() - 4*FLOOR_HEIGHT),
                    area(),
                    origin("botleft"),
                    layer("top"),
                    scale(0.5),
                    move(LEFT, SPEED),
                    cleanup(2),
                    
                    "coin", // add a tag here
                ]);
            // wait a random amount of time to spawn next tree
            wait(rand(5, 10), (spawnCoins));
            
        }

         //start spawning trees
        spawnCoins();

        //For spawning boosters
        function spawnBoost(){
            //add coins 
        add([
            sprite("boost"),
            pos(width() + 1000, height() - 4*FLOOR_HEIGHT),
            area(),
            origin("botleft"),
            layer("top"),
            scale(0.8),
            move(LEFT, SPEED),
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


        //add score for every coin
        player.collides("coin", () => {
            score += 50;
        });

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
