var c = document.getElementById("Canvas");
const windowWidth = document.body.clientWidth
const windowHeight = document.body.clientHeight
c.width = windowWidth; //taking window width
c.height = windowHeight; //taking window height
const ctx = c.getContext("2d");
ctx.lineTo(windowWidth, windowHeight);
ctx.stroke();
var gameOver= false 
var ball,player,enemyArray
var NumberOfBalls = 3
var startGame = true
var wonGame = false
class Player{
    constructor(x,y,width,height,color){
        this.x = x       
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.dx = 0
        this.speed = 12
    }
    draw(){
        ctx.beginPath();
        ctx.rect(this.x, this.y,this.width,this.height)
        ctx.fillStyle = this.color
        ctx.fill();
    }
    move(){
        this.x = this.x + this.dx;
        if(this.x > windowWidth - this.width){
            this.x = windowWidth- this.width
        }
        if(this.x <0){
            this.x = 0
        }
    }
}

class Ball{
    constructor(x,y,radius,color){
        this.x = x       
        this.y = y
        this.radius = radius
        this.color = color
        this.dx = 0,
        this.dy = 0;
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y,this.radius,0,Math.PI*2,false)
        ctx.fillStyle = this.color
        ctx.fill();
    }
    move(){
        // // Bottom of the window
        if((this.dy > 0) && (this.y +this.dy > windowHeight - this.radius)){
            
            
            NumberOfBalls--
            if(NumberOfBalls === 0){
                gameOverCheck()
            }
            else if(NumberOfBalls > 0){
                startGame = true
                init()

            }
        }
        // Top of the window
        if((this.dy < 0) && (this.y +this.dy < this.radius)){
            this.dy = -this.dy
        }
        // Left of the window
        if((this.dx < 0) && (this.x +this.dx < this.radius)){
            this.dx = -this.dx
        }
        // Right of the window
        if((this.dx > 0) && (this.x +this.dx > windowWidth - this.radius)){
            this.dx = -this.dx
        }
this.x += this.dx
this.y += this.dy
    }
}

function gameOverCheck(){
    ctx.clearRect(0, 0, windowWidth, windowHeight);
    gameOver = true
    ctx.fillStyle = "white"
    ctx.font = "10vh Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", windowWidth/2, windowHeight/2);
    ctx.font = "5vh Arial";
    ctx.textAlign = "center";
    ctx.fillText("Click space to try again", windowWidth/2, windowHeight/2+windowHeight/15);

}
function colisionCheck(){
    console.log()
    for(let i = 0; i<enemyArray.length;i++){
        for(let j = 0; j<enemyArray[i].length;j++){
                if(ball.x >= enemyArray[i][j].x+ball.radius && ball.x <= enemyArray[i][j].x + enemyArray[i][j].width){
                    // Ball has to hit pad on height
                    if(ball.y >= enemyArray[i][j].y - ball.radius && ball.y <= enemyArray[i][j].y + enemyArray[i][j].height  ){
                        enemyArray[i][j] = false
                        ball.dy = getRandom(5,8)
                        ball.dx = Math.random()<0.5?-5:5
                    }
                }
            
           }
    }
    // ball has to go down
    if(ball.dy > 0){
        // Ball has to hit pad on width
        if(ball.x >= player.x && ball.x <= player.x + player.width){
            // Ball has to hit pad on height
            if(ball.y >= player.y - ball.radius -ball.dy && ball.y <= player.y + player.height+ball.dy  ){
                ball.dy = -getRandom(5,8)
                ball.dx = Math.random()<0.5?-getRandom(5,8):getRandom(5,8)
            }
        }
    }
}
function init(){
    if(NumberOfBalls === 3){
        enemyArray = generateEnemies()
    }


        ball = new Ball(windowWidth/2,windowHeight*24/25-15,15,"white")


    player = new Player(windowWidth/2-windowWidth/20,windowHeight*24/25,windowWidth/10,25, 'white')

}
function checkIfAllDestroyed(value){
return value===false
}
function startGameCheck(){
    welcomeScreen = true
    ctx.fillStyle = "white"
    ctx.font = "10vh Arial";
    ctx.textAlign = "center";
    var halfOfHeight = windowHeight/2
    if(NumberOfBalls === 3){

        ctx.fillText("Start game", windowWidth/2, halfOfHeight+windowHeight/12);
    }
    if(NumberOfBalls < 3){
        ctx.fillText(`You still have ${NumberOfBalls} chance`, windowWidth/2, halfOfHeight+windowHeight/12);
        
    }
    ctx.font = "5vh Arial";
    ctx.textAlign = "center";
    ctx.fillText("Click [Enter] to start again", windowWidth/2, halfOfHeight+windowHeight/7);
    ctx.fillText("Use left and right arrow to control pad", windowWidth/2, halfOfHeight+windowHeight/5);

}
function generateEnemies(){
    const rowOfEnemies = 5
    const columnOfEnemies = 10
    const widthOfEnemy = windowWidth/columnOfEnemies
    const heightOfEnemy = (windowHeight/2)/rowOfEnemies
    var enemies = Array.from(Array(columnOfEnemies), () => new Array(rowOfEnemies))
    // i = x position
    for(let i = 0; i<columnOfEnemies;i++){
        for(let j = 0; j<rowOfEnemies;j++){
            // x,y,width,height,color
            enemies[i][j] = new BlocksToDestroy(i*widthOfEnemy,j*heightOfEnemy,widthOfEnemy,heightOfEnemy,randomColorGenerator())
           }
    }
    return enemies
}
// event handler
function keyup(event){
    // enter 
    if(event === 13 ){
        if(startGame){
            startGame = false
            wonGame = false
            ball.dx = 5
            ball.dy = -5
        }
        if(wonGame){
            wonGame = false
            startGame = true
            console.log("hello",wonGame)
            NumberOfBalls = 3 

            init() 
        requestAnimationFrame(frame)
        }
    }
    // space
    if (event === 32 && gameOver){
        startGame = true
        gameOver = false
        NumberOfBalls = 3 
        init() 
        requestAnimationFrame(frame)
 
    }
    if(startGame === false){
        // left arrow
        if(event === 37 && player.dx < 0){
            player.dx = 0
        }
        // right arrow 
        if(event === 39 && player.dx >0){
            player.dx = 0
        }
    }
}
function getRandom(from,to){
    return Math.floor(Math.random() *to)+from

}
function wonGameCheck(){
    ctx.clearRect(0, 0, windowWidth, windowHeight);
    wonGame = true
    ctx.fillStyle = "white"
    ctx.font = "10vh Arial";
    ctx.textAlign = "center";
    var halfOfHeight = windowHeight/2
    ctx.fillText("🎉 You won the game 🎉", windowWidth/2, halfOfHeight);
    ctx.font = "5vh Arial";
    ctx.textAlign = "center";
    ctx.fillText("Click [Enter] to play again", windowWidth/2, halfOfHeight+windowHeight/12);
}
function keydown(event){
    if(startGame === false){
    // left arrow
    if(event == 37 ){
        player.dx = -player.speed
    }
    // right arrow 
    if(event == 39 ){
        player.dx = player.speed
    }
}}
class BlocksToDestroy{
    constructor(x,y,width,height,color){
        this.x = x       
        this.y = y
        this.width = width
        this.height = height
        this.color = color
    }
    draw(){
        ctx.beginPath()
        ctx.rect(this.x, this.y,this.width,this.height)
        ctx.fillStyle = this.color
        ctx.fill();
        ctx.strokeStyle= "white";
        ctx.lineWidth = 5
        ctx.strokeRect(this.x, this.y,this.width,this.height);
        
    }
}
function frame(){
    if(gameOver === false && wonGame === false ){
        ctx.clearRect(0, 0, windowWidth, windowHeight);
        for(let i = 0; i<enemyArray.length;i++){
            for(let j = 0; j<enemyArray[0].length;j++){
                if (enemyArray[i][j]){
                    
                    enemyArray[i][j].draw()
                }
            }
        }
        // If all enemies are destroyed show win screen
        if(enemyArray.every(row => row.every(checkIfAllDestroyed))){
            wonGame = true        
        }
        ball.draw()
        player.draw()
        ball.move()
        player.move()
        colisionCheck()
        requestAnimationFrame(frame)
        if(startGame){
            startGameCheck()
        }
        if(wonGame){
            wonGameCheck()
        }
    }
}

function randomColorGenerator(){
    var red = Math.random()*256|0
    var green = Math.random()*256|0
    var blue = Math.random()*256|0
    return `rgb(${red},${green},${blue})`
}
init() 
requestAnimationFrame(frame)
