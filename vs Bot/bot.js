var b_speed = 300;
var b_skipBy = 50;
var b_interval;
var b_i=1;
var b_calc_interval;

function moveBot()
{
    var y = $("#bot").position().top;
    var x = $("#bot").position().left;

    console.log(y, x);

    if(x+50>1350 || x<0 || y+50>600 || y<0)
    {
        alert("You Win!");
    }
    else{
        switch(b_i){
            case 0: $("#bot").css({top:y-b_skipBy});
                    break;
            case 1: $("#bot").css({left:x+b_skipBy});
                    break;
            case 2: $("#bot").css({top:y+b_skipBy});
                    break;
            case 3: $("#bot").css({left:x-b_skipBy});
                    break;
        }
        //FOOD EATING EVENT
        if($("#bot").position().top==$("#food").position().top)
        {
            if($("#bot").position().left==$("#food").position().left)
            {
                audio.play();
                generateFood();
                clearInterval(b_calc_interval);
                b_calc_interval = setInterval(calcPosition, 0);
            }
        }
    }
}

function calcPosition()
{
    var y = $("#bot").position().top;
    var x = $("#bot").position().left;
    var y1 = $("#food").position().top;
    var x1 = $("#food").position().left;

    if(x1==x)
    {
        if(y-y1>0)
        {
            b_i = 0;
        }
        else
        {
            b_i = 2;
        }
    }
    else if(y1==y)
    {
        if(x-x1<0)
        {
            b_i = 1;
        }
        else
        {
            b_i = 3;
        }
    }
    else
    {
        if(y-y1>0)
        {
            b_i = 0;
        }
        else
        {
            b_i = 2;
        }
    }
}

$(document).ready(function()
{
    b_interval = setInterval(moveBot, b_speed);
    b_calc_interval = setInterval(calcPosition, 0);
});