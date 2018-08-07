var base = document.getElementById("base");
var i=1;
var scoreIncBy = 10;
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
var speedIncreaserInterval, alreadyHere=0, speedIncreaserSpeed = 20, onceTaken=0;
var beerInterval, beerAlreadyHere=0, speedDecreaserSpeed = 20, beerOnceTaken=1;
var normalKeyCodes = [87, 68, 83, 65];
var drunkKeyCodes = [83, 65, 87, 68];
var basicKeyCodes = normalKeyCodes;
var foiScore = 100;

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

    ///Testing///

    ////////////

    //Below was commented on 6/8/18
    // if(score%100==0 && score>190)
    // {
    //     fadeOutIn();
    // }

    //Below was added on 6/8/18
    if(score>foiScore)
    {
        fadeOutIn();
        foiScore+=100;
    }

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
        if(alreadyHere==1||beerAlreadyHere==1)
        {
//            $("#main").attr("src", "headNoMore.png");
        }
        else
        {
//            $("#main").attr("src", "headAfterSpeedNoMore.png");
        }
    }
    //Visible Character
    else if(score==70 || score==300 || score==500 || visibleNow)
    {
//        $("#main").attr("src", "head2.png");
    }

    //Base color changes
    if(score==100 || score==400)
    {
        document.getElementById("base").style.backgroundColor = "#617cc7";//"#fff";
        document.getElementById("base").style.boxShadow = "0px 0px";
    }
    else if(score==150 || score==155 || score==160)
    {
        document.getElementById("base").style.backgroundColor = "#b34c4c";
        document.getElementById("base").style.boxShadow = "10px 5px rgb(37, 30, 30)";
    }
    else if(score==200 || score==500)
    {
        document.getElementById("base").style.backgroundColor = "#8b4242";
        document.getElementById("base").style.boxShadow = "10px 5px rgb(37, 30, 30)";
    }

}

function fadeOutIn()
{
    for(var ii=0; ii<10; ii++)
    {
        $("#base").fadeOut();
        $("#base").fadeIn();
    }
}

function clearAll()
{
    $("#main").attr("src", "headDead.png");
    $("#gOText").fadeIn();
    
    $("#monster").fadeOut();
    $("#movingMonster").fadeOut();
    $("#speedIncreaser").fadeOut();
    $("#beer").fadeOut();

    clearInterval(beerInterval);
    clearInterval(speedIncreaserInterval);
    clearInterval(interval);
    clearInterval(foodInterval);
    clearInterval(monsterInterval);
    clearInterval(movingMonsterInterval);
    clearInterval(moveMyMonsterInterval);
    if(localStorage.getItem("b_hScore")<score||localStorage.getItem("b_hScore")==null)
    {
        var newHScore = prompt("Your Name, New Champion!");
        while(newHScore==""||newHScore==null)
        {
            newHScore = prompt("Just type your name!");
        }
        localStorage.setItem("b_hScore", score);
        localStorage.setItem("b_hName", newHScore);
    }
    //setTimeout(function(){ alert("GAME OVER\nFinal Score : "+score+"\nPress F5 to Play Again"); }, 2000);
}

function changeFace(x, y)
{
    var loc = "/home/superdhawan/Desktop/Snake/where/";
    x1 = $("#food").position().left;
    y1 = $("#food").position().top;
    if(x1==x)
    {
        if(y-y1>0)
        {
            $("#main").attr("src", loc+"up.png");
        }
        else
        {
            $("#main").attr("src", loc+"down.png");
        }
    }
    else if(y1==y)
    {
        if(x-x1<0)
        {
            $("#main").attr("src", loc+"right.png");
        }
        else
        {
            $("#main").attr("src", loc+"left.png");
        }
    }
    else
    {
        if(y-y1>0)
        {
            if(x-x1<0)
            {
                $("#main").attr("src", loc+"top-right.png");
            }
            else
            {
                $("#main").attr("src", loc+"top-left.png");
            }
        }
        else
        {
            if(x-x1<0)
            {
                $("#main").attr("src", loc+"bottom-right.png");
            }
            else
            {
                $("#main").attr("src", loc+"bottom-left.png");
            }
        }
    }
}

function moveSnake()
{
    var y = $("#main").position().top;
    var x = $("#main").position().left;

    changeFace(x, y);

    if(x+50>1350 || x<0 || y+50>600 || y<0)
    {
        clearAll();
    }
    // else if(x<0)
    // {
    //     clearAll();
    // }
    // else if(y+50>600)
    // {
    //     clearAll();
    // }
    // else if(y<0)
    // {
    //     clearAll();
    // }
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

        //console.log(parseInt($("#main").position().top), $("#food").position().top);
        //console.log($("#main").position().left, $("#food").position().left);
        //FOOD EATING EVENT
        if($("#main").position().top==$("#food").position().top)
        {
            if($("#main").position().left==$("#food").position().left)
            {
                audio.play();
                clearInterval(interval);
                interval = setInterval(moveSnake, speed);
                generateFood();
                score+=scoreIncBy;
                changesInDifficulty();
                document.getElementById("score").innerHTML = score;
            }
        }

        //MONSTER KILL EVENT
        if(monsterBorn==1)
        {
            if($("#main").position().top==$(".monster").position().top)
            {
                if($("#main").position().left==$(".monster").position().left)
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

        //Speed Increaser Event
        if(alreadyHere==1)
        {
            if($("#main").position().top==$("#speedIncreaser").position().top)
            {
                if($("#main").position().left==$("#speedIncreaser").position().left)
                {
                    //Put some audio here boi
//                    $("#main").attr("src", "headAfterSpeed.png");
                    document.getElementById("beer").parentNode.removeChild(document.getElementById("beer"));
                    document.getElementById("speedIncreaser").parentNode.removeChild(document.getElementById("speedIncreaser"));
                    beerAlreadyHere = 0;
                    alreadyHere = 0;
                    score+=5;
                    speed-=speedIncreaserSpeed;
                    scoreIncBy = 15;
                    onceTaken = 1;
                    clearInterval(interval);
                    interval = setInterval(moveSnake, speed);

                    clearInterval(beerInterval);
                    beerInterval = setInterval(generateBeer, 10000);
                    clearInterval(speedIncreaserInterval);
                    speedIncreaserInterval = setInterval(generateSpeedIncreaser, 10000);

                    document.getElementById("score").innerHTML = score;
                }
            }
        }

        //Beer Drinking Event
        if(beerAlreadyHere==1)
        {
            if($("#main").position().top==$("#beer").position().top)
            {
                if($("#main").position().left==$("#beer").position().left)
                {
                    //Put some audio here boi
                    basicKeyCodes = drunkKeyCodes;
//                    $("#main").attr("src", "headAfterSpeed.png");
                    document.getElementById("beer").parentNode.removeChild(document.getElementById("beer"));
                    document.getElementById("speedIncreaser").parentNode.removeChild(document.getElementById("speedIncreaser"));
                    beerAlreadyHere = 0;
                    alreadyHere = 0;
                    score+=5;
                    speed+=speedDecreaserSpeed;
                    scoreIncBy = 20;
                    beerOnceTaken = 1;
                    clearInterval(interval);
                    interval = setInterval(moveSnake, speed);

                    clearInterval(beerInterval);
                    beerInterval = setInterval(generateBeer, 10000);
                    clearInterval(speedIncreaserInterval);
                    speedIncreaserInterval = setInterval(generateSpeedIncreaser, 10000);

                    document.getElementById("score").innerHTML = score;
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

function generateMonster(monsterID)
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
        $("."+monsterID).css({top:y1,left:x1});
    }
    else
    {
        document.getElementById("base").innerHTML += '<img class="monster" id="'+monsterID+'" src="monster.png" width="50" style="position:relative; top:'+y1+'; left:'+x1+'">';
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

function generateSpeedIncreaser()
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
    if(alreadyHere==1)
    {
        $("#speedIncreaser").css({top:y1,left:x1});
    }
    else
    {
        if(onceTaken==1)
        {
            scoreIncBy = 10;
            speed+=speedIncreaserSpeed;
            clearInterval(interval);
            interval = setInterval(moveSnake, speed);
//            $("#main").attr("src", "head2.png");
        }
        document.getElementById("base").innerHTML += '<img id="speedIncreaser" src="speedIncreaser.png" width="50" style="position:relative; top:'+y1+'; left:'+x1+'">';
        //console.log($("#monster").position().left);
        //console.log($("#monster").position().top);
        alreadyHere = 1;
    }
}

function generateBeer()
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
    if(beerAlreadyHere==1)
    {
        $("#beer").css({top:y1,left:x1});
    }
    else
    {
        if(beerOnceTaken==1)
        {
            basicKeyCodes = normalKeyCodes;
            scoreIncBy = 10;
            speed-=speedDecreaserSpeed;
            clearInterval(interval);
            interval = setInterval(moveSnake, speed);
//            $("#main").attr("src", "head2.png");
        }
        document.getElementById("base").innerHTML += '<img id="beer" src="beer.png" width="50" style="position:relative; top:'+y1+'; left:'+x1+'">';
        //console.log($("#monster").position().left);
        //console.log($("#monster").position().top);
        beerAlreadyHere = 1;
    }
}

function getHighestScore()
{
    if(localStorage.getItem("b_hScore")!=null)
    {
        var b_hScore = localStorage.getItem("b_hScore");
        var b_hName = localStorage.getItem("b_hName");
        $("#highestScore").html(b_hScore);
        $("#highestScoreName").html(b_hName);
    }
}

$(document).ready(function(){
    /*for(var ii=0; ii<1301; ii++)
    {
        possiblePositionsX.push(ii);
    }*/
    getHighestScore();
    generateFood();
    interval = setInterval(moveSnake, speed);
    //foodInterval = setInterval(generateFood, 5000);
    monsterInterval = setInterval(function(){generateMonster("monster")}, 5000);
    movingMonsterInterval = setInterval(generateMovingMonster, movingMonsterGenerateTime);
    speedIncreaserInterval = setInterval(generateSpeedIncreaser, 10000);
    beerInterval = setInterval(generateBeer, 10000);
});

$(document).keydown(function(e){
    // var y = $("#main").position().top;
    // var x = $("#main").position().left;

    if (e.keyCode == basicKeyCodes[0]){ //W Up
        /*if(i!=2&&i!=0)
        {
            //clearInterval(interval);
            //$("#main").css({top:y-skipBy});
            i=0;
            //interval = setInterval(moveSnake, speed);
        }*/
        i=0;
    }
    if (e.keyCode == basicKeyCodes[1]){ //D Right
        /*if(i!=3&&i!=1)
        {
            //clearInterval(interval);
            //$("#main").css({left:y+skipBy});
            i=1;
            //interval = setInterval(moveSnake, speed);
        }*/
        i=1;
    }
    if (e.keyCode == basicKeyCodes[2]){ //S Down
        /*if(i!=0&&i!=2)
        {
            //clearInterval(interval);
            //$("#main").css({top:y+skipBy});
            i=2;
            //interval = setInterval(moveSnake, speed);
        }*/
        i=2;
    }
    if (e.keyCode == basicKeyCodes[3]){ //A Left
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