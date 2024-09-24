//Board
let board;
let boardWidth = 1200;
let boardHeight = 730;

let context;

//Bird
let luckyImg;
let luckyWidth = 40;
let luckyHeight = 74;
let luckyX = boardWidth/2;
let luckyY = boardHeight - 400;
let luckybait = {
    x : luckyX,
    y : luckyY,
    width : luckyWidth,
    height : luckyHeight
}

//Pipes
let pipeArray = [];
let pipeWidth = 20;
let pipeHeight = 40;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImage;
let bottomPipeImage;

//Gamephysics
let velocityX = -1; //Moving left
let velocityY = 0; //luckybait jumping speed
let gravity = 0;
let gameOver = false;
let score = 0;


window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    
    context = board.getContext("2d");


    luckyImg = new Image();
    luckyImg.src = "/images/luckybait2.png";
    luckyImg.onload = function(){
        context.drawImage(luckyImg, luckybait.x, luckybait.y, luckybait.width, luckybait.height)
    }

    topPipeImage = new Image();
    bottomPipeImage = new Image();
    topPipeImage.src = "../images/koppartråd.png";
    bottomPipeImage.src = "./koppartråd.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //every 1.5 seconds
    document.addEventListener("keydown", moveBird);
    document.addEventListener("touchstart", moveBird);
    document.addEventListener("keydown", restartGame);
    document.addEventListener("keyup", stopBird)
}

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0, 0, board.width, board.height)
    
    //Bird
    //velocityY += gravity;
    luckybait.x = Math.max(0,luckybait.x + velocityY);
    luckybait.x = Math.min(boardWidth - luckyWidth ,luckybait.x + velocityY);
    context.drawImage(luckyImg, luckybait.x, luckybait.y, luckybait.width, luckyHeight);
    if(luckybait.y > board.height) gameOver = true;

    //Pipes
    for(let i = 0; i < pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        if(!pipe.passed && luckybait.x > pipe.x + pipe.width) {
            pipe.passed = true;
            score += 0.5;
        }
        if(detectCollision(luckybait, pipe)){
            gameOver = true;
        }
    }

    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);
    if(gameOver){
        context.fillStyle = "black";
        context.font = "25px sans-serif";
        context.fillText("Game over", boardWidth/2 - 55, boardHeight/2);
    }
}

function placePipes(){
    if(gameOver){
        return;
    }
    let randomPipeY = pipeY - pipeHeight/4 - Math.random() * (pipeHeight/2);
    let openingSpace = boardHeight/4;
    let topPipe = {
        img : topPipeImage,
        x : pipeX,
        y : 300,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    // let bottomPipe = {
    //     img : bottomPipeImage,
    //     x : pipeX,
    //     y : randomPipeY + pipeHeight + openingSpace,
    //     width : pipeWidth,
    //     height : pipeHeight,
    //     passed : false
    // }

    pipeArray.push(topPipe)
    // pipeArray.push(bottomPipe)
}

function moveBird(e){
    if(e.code == "ArrowRight"){
        velocityY = +3
    }
    if(e.code == "ArrowLeft"){
        velocityY = -3
    }
}

function stopBird(e){
    velocityY = 0;
}

function detectCollision(a, b){
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}

function restartGame(e){
    if(gameOver && e.code == "ArrowUp"){
        gameOver = false;
        pipeArray = []
        luckybait.x = luckyX;
        luckybait.y = luckyY;
        score = 0;
    }
}