var base = document.getElementById("base");
var i=1;
var pause = 0;
var speed = 300;
var interval;
var foodInterval;
var score = 0;
var audio = new Audio('mainBurp.mp3');
var monsterGrowl = new Audio('Monster.m4a');
var monsterKill = new Audio('MonsterKill.mp3');
var skipBy = 50;
var possiblePositionsX = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300];
var possiblePositionsY = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550];
var monsterBorn = 0, movingMonsterBorn = 0;
var movingMonsterCoordinates = [0, 0];
var moveMyMonsterInterval, movingMonsterInterval, movingMonsterGenerateTime=10000;
var verticalOrHorizontal = 0;
var invisibleNow=0, visibleNow=0;


/*
function upB()
{
    i=0;
}
function downB()
{
    i=2;
}
function leftB()
{
    i=3;
}
function rightB()
{
    i=1;
}
*/

function changesInDifficulty()
{
    //Speed Change Monitoring
    if(score<300)
    {
        speed-=5;
    }
    else if(score>500)
    {
        speed-=1;
        if(invisibleNow==0)
        {
            invisibleNow = Math.floor(Math.random()*2);
            if(invisibleNow==1)
            {
                visibleNow = 0;
            }
        }
        else if(visibleNow==0)
        {
            visibleNow = Math.floor(Math.random()*2);
            if(visibleNow==1)
            {
                invisibleNow = 0;
            }
        }
    }

    //Invisible Character
    if(score==50 || score==250 || score==400 || invisibleNow)
    {
        $("#main").attr("src", "headNoMore.png");
    }
    //Visible Character
    else if(score==70 || score==300 || score==500 || visibleNow)
    {
        $("#main").attr("src", "head2.png");
    }

    //Base color changes
    if(score==100 || score==400)
    {
        document.getElementById("base").style.backgroundColor = "#2345a3";//"#fff";
    }
    else if(score==150)
    {
        document.getElementById("base").style.backgroundColor = "#a32323";
    }
    else if(score==200 || score==500)
    {
        document.getElementById("base").style.backgroundColor = "#860000";   
    }

}

function clearAll()
{
    $("#main").fadeOut();
    clearInterval(interval);
    clearInterval(foodInterval);
    clearInterval(monsterInterval);
    clearInterval(movingMonsterInterval);
    clearInterval(moveMyMonsterInterval);
    alert("GAME OVER\nFinal Score : "+score+"\nPress F5 to Play Again");
}

function moveSnake()
{
    var y = $("#main").position().top;
    var x = $("#main").position().left;

    if(x+50>1350)
    {
        clearAll();
    }
    else if(x<0)
    {
        clearAll();
    }
    else if(y+50>600)
    {
        clearAll();
    }
    else if(y<0)
    {
        clearAll();
    }
    else{
        //console.log(x);
        switch(i){
            case 0: $("#main").css({top:y-skipBy});
                    break;
            case 1: $("#main").css({left:x+skipBy});
                    break;
            case 2: $("#main").css({top:y+skipBy});
                    break;
            case 3: $("#main").css({left:x-skipBy});
                    break; 
        }

        console.log(parseInt($("#main").position().top), $("#food").position().top);
        console.log($("#main").position().left, $("#food").position().left);
        //FOOD EATING EVENT
        if($("#main").position().top==$("#food").position().top)
        {
            if($("#main").position().left==$("#food").position().left)
            {
                audio.play();
                clearInterval(interval);
                interval = setInterval(moveSnake, speed);
                generateFood();
                score+=10;
                changesInDifficulty();
                document.getElementById("score").innerHTML = score;
            }
        }

        //MONSTER KILL EVENT
        if(monsterBorn==1)
        {
            if($("#main").position().top==$("#monster").position().top)
            {
                if($("#main").position().left==$("#monster").position().left)
                {
                    monsterKill.play();
                    clearAll();
                }
            }
        }

        //Moving Monster Kill Event
        if(movingMonsterBorn==1)
        {
            if($("#main").position().top==$("#movingMonster").position().top)
            {
                if($("#main").position().left==$("#movingMonster").position().left)
                {
                    monsterKill.play();
                    clearAll();
                }
            }
        }
    }
}

function generateFood()
{
    var x = Math.floor((Math.random() * (possiblePositionsX.length-1)) + 0);
    var y = Math.floor((Math.random() * (possiblePositionsY.length-1)) + 0);
    $("#food").css({top:possiblePositionsY[y],left:possiblePositionsX[x]-4});
}

function generateMonster()
{
    var x = Math.floor((Math.random() * (possiblePositionsX.length-1)) + 0);
    var y = Math.floor((Math.random() * (possiblePositionsY.length-1)) + 0);
    while(possiblePositionsX[x]-108==$("#food").position().left||possiblePositionsY[y]-50==$("#food").position().top)
    {
        var x = Math.floor((Math.random() * (possiblePositionsX.length-1)) + 0);
        var y = Math.floor((Math.random() * (possiblePositionsY.length-1)) + 0);
    }
    var x1 = possiblePositionsX[x]-108;
    var y1 = possiblePositionsY[y]-50;
    monsterGrowl.play();
    if(monsterBorn==1)
    {
        $("#monster").css({top:y1,left:x1});
    }
    else
    {
        document.getElementById("base").innerHTML += '<img id="monster" src="monster.png" width="50" style="position:relative; top:'+y1+'; left:'+x1+'">';
        //console.log($("#monster").position().left);
        //console.log($("#monster").position().top);
        monsterBorn = 1;
    }
}

function moveMyMonster()
{
    if(movingMonsterBorn==1)
    {
        document.getElementById("movingMonster").parentNode.removeChild(document.getElementById("movingMonster"));
    }
    movingMonsterBorn = 1;
    if(verticalOrHorizontal)
    {
        var x1 = possiblePositionsX[movingMonsterCoordinates[0]];
        var y1 = possiblePositionsY[movingMonsterCoordinates[1]];
        document.getElementById("base").innerHTML += '<img id="movingMonster" src="movingMonster.png" width="50" style="position:absolute; top:'+y1+'; left:'+x1+'">';
        movingMonsterCoordinates[0]++;
        if(movingMonsterCoordinates[0]>possiblePositionsX.length)
        {
            movingMonsterBorn = 0;
            document.getElementById("movingMonster").parentNode.removeChild(document.getElementById("movingMonster"));
            clearInterval(moveMyMonsterInterval);
        }
    }
    else
    {
        var x1 = possiblePositionsX[movingMonsterCoordinates[0]];
        var y1 = possiblePositionsY[movingMonsterCoordinates[1]];
        document.getElementById("base").innerHTML += '<img id="movingMonster" src="movingMonster.png" width="50" style="position:absolute; top:'+y1+'; left:'+x1+'">';
        movingMonsterCoordinates[1]++;
        if(movingMonsterCoordinates[1]>possiblePositionsY.length)
        {
            movingMonsterBorn = 0;
            document.getElementById("movingMonster").parentNode.removeChild(document.getElementById("movingMonster"));
            clearInterval(moveMyMonsterInterval);
        }
    }
}

function generateMovingMonster()
{
    movingMonsterCoordinates = [0, 0];
    verticalOrHorizontal = Math.floor(Math.random()*2);
    //1->Horizontal|2->Vertical//
    if(verticalOrHorizontal)
    {
        movingMonsterCoordinates[1] = Math.floor((Math.random() * (possiblePositionsY.length-1)) + 0);
    }
    else
    {
        movingMonsterCoordinates[0] = Math.floor((Math.random() * (possiblePositionsX.length-1)) + 0);
    }
    moveMyMonsterInterval = setInterval(moveMyMonster, 100);
}

$(document).ready(function(){
    generateFood();
    interval = setInterval(moveSnake, speed);
    //foodInterval = setInterval(generateFood, 5000);
    monsterInterval = setInterval(generateMonster, 5000);
    movingMonsterInterval = setInterval(generateMovingMonster, movingMonsterGenerateTime);
});

$(document).keydown(function(e){
    var y = $("#main").position().top;
    var x = $("#main").position().left;

    if (e.keyCode == 87){ //W Up
        /*if(i!=2&&i!=0)
        {
            //clearInterval(interval);
            //$("#main").css({top:y-skipBy});
            i=0;
            //interval = setInterval(moveSnake, speed);
        }*/
        i=0;
    }
    if (e.keyCode == 68){ //D Right
        /*if(i!=3&&i!=1)
        {
            //clearInterval(interval);
            //$("#main").css({left:y+skipBy});
            i=1;
            //interval = setInterval(moveSnake, speed);
        }*/
        i=1;
    }
    if (e.keyCode == 83){ //S Down
        /*if(i!=0&&i!=2)
        {
            //clearInterval(interval);
            //$("#main").css({top:y+skipBy});
            i=2;
            //interval = setInterval(moveSnake, speed);
        }*/
        i=2;
    }
    if (e.keyCode == 65){ //A Left
        /*if(i!=1&&i!=3)
        {
            //clearInterval(interval);
            //$("#main").css({left:y-skipBy});
            i=3;
            //interval = setInterval(moveSnake, speed);
        }*/
        i=3;
    }
    if (e.keyCode == 32){ //Space Pause
        alert("PAUSE");
    }
});