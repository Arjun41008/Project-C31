const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

var left_rectangle, right_rectangle;
var bridge, jointPoint, jointPoint2;
var jointLink, jointLink2;
var last_link1, last_link2;

var zombie, zombie1,zombie2,zombie3,zombie4;
var backgroundImg;
var sadZombieImg;

var collided = false;

var edges;

var breakButton;

var stones = [];

function preload() {
  zombie1 = loadImage("./assets/zombie1.png");
  zombie2 = loadImage("./assets/zombie2.png");
  zombie3 = loadImage("./assets/zombie3.png");
  zombie4 = loadImage("./assets/zombie4.png");

  backgroundImg = loadImage("./assets/background.png");

  sadZombieImg = loadImage("./assets/sad_zombie.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  engine = Engine.create();
  world = engine.world;
  frameRate(80);

  edges = createEdgeSprites();

  zombie = createSprite(width / 2, height - 90);
  zombie.addAnimation("lefttoright", zombie1,zombie2,zombie1);
  zombie.addAnimation("righttoleft",zombie3,zombie4,zombie3);
  zombie.addAnimation("sad",sadZombieImg);
  zombie.scale = 0.07;
  zombie.velocityX = 4;

  breakButton = createButton("");
  breakButton.position(width - 200, height / 2 - 250);
  breakButton.size(20, 20);
  breakButton.class("breakbutton");
  breakButton.mouseClicked(handleButtonPress);

  left_rectangle = new Base(120, 200, 500, 100);
  right_rectangle = new Base(1220, 200, 500, 100);

  bridge = new Bridge(21, { x: 250, y: 300 });
  jointPoint = new Base(1000, 200, 20, 20);
  jointPoint2 = new Base(340, 200, 20, 20);

  last_link1 = bridge.body.bodies.length - 2;
  last_link2 = bridge.body.bodies.length - 21;

  Matter.Composite.add(bridge.body, jointPoint);
  jointLink = new Link(bridge, jointPoint, last_link1);
  jointLink2 = new Link(bridge, jointPoint2, last_link2);

  for (var i = 0; i <= 8; i++) {
    var x = random(width / 2 - 200, width / 2 + 300);
    var y = random(-10, 100);
    var stone = new Stone(x, y, 80, 80);
    stones.push(stone);
  }
}

function draw() {
  background(51);
  image(backgroundImg,0,0,width,height);

  Engine.update(engine);

  zombie.bounceOff(edges);

  left_rectangle.display();
  right_rectangle.display();

  jointPoint.display();
  jointPoint2.display();

  bridge.show();

  for (var stone of stones) {
    stone.display();

    var pos = stone.body.position;
    var d = dist(zombie.position.x,zombie.position.y,pos.x,pos.y);

    if(d <= 50) {
      zombie.velocityX = 0;
      Matter.Body.setVelocity(stone.body,{x:10,y:-10});
      zombie.changeAnimation("sad");
      collided = true;
    }
  }


  drawSprites();
}

function handleButtonPress() {
  jointLink.detach();
  jointLink2.detach();
  setTimeout(() => {
    bridge.break();
  },1500);
}
