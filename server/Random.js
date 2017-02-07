/**
 * Created by Alecxandrys on 08.05.2016.
 */

test=function(count,shoot,hit,penetrate,wound,afterEffect)
{
    var result={};
    console.time('testFullRandomSignature');
    result.test1=FullRandomSignature(count,shoot,hit,penetrate,wound,afterEffect);
    console.timeEnd('testFullRandomSignature');
    shoot=6-shoot;
    hit=6-hit;
    penetrate=6-penetrate;
    wound=6-wound;
    afterEffect=6-afterEffect;
    console.time('testOptimalSignature');
    result.test2=OptimalSignature(count,shoot,hit,penetrate,wound,afterEffect);
    console.timeEnd('testOptimalSignature');
    return result;
};
/**
 * @return {{}}
 */
FullRandomSignature=function(count,shoot,hit,penetrate,wound,afterEffect)
{

    new SimpleSchema({
        count:{type:Number},
        shoot:{type:Number,min:1,max:6},
        hit:{type:Number,min:2,max:6},
        penetrate:{type:Number,min:2,max:6},
        wound:{type:Number,min:1,max:6},
        afterEffect:{type:Number,min:1,max:6}
    }).validate({count:count,shoot:shoot,hit:hit,penetrate:penetrate,wound:wound,afterEffect:afterEffect});

    var result={};
    var success=0;
    var x;

    if(shoot != 1)
    {
        for(var i=0; i<count; i++)
        {
            //Math.floor(Math.random() * (max - min + 1)) + min
            x=Math.floor(Math.random()*(6-1+1))+1;
            if(x>=shoot)
            {success++}
        }
        count=success;
        success=0;
    }
    for(i=0; i<count; i++)
    {
        x=Math.floor(Math.random()*(6-1+1))+1;
        if(x>=hit)
        {success++}
    }
    count=success;
    success=0;
    for(i=0; i<count; i++)
    {
        x=Math.floor(Math.random()*(6-1+1))+1;
        if(x>=penetrate)
        {success++}
    }

    if(wound != 1)
    {
        count=success;
        success=0;
        for(i=0; i<count; i++)
        {
            x=Math.floor(Math.random()*(6-1+1))+1;
            if(x>=wound)
            {success++}
        }
    }
    result.success=success;
    if(afterEffect != 1)
    {
        count=success;
        success=0;
        for(i=0; i<count; i++)
        {

            x=Math.floor(Math.random()*(6-1+1))+1;
            if(x>=afterEffect)
            {success++}
        }
    }
    result.afterEffect=success;
    return result;
};

OptimalSignature=function(count,shoot,hit,penetrate,wound,afterEffect)
{
    //5%2-mod
    //5/2|0-div

    new SimpleSchema({
        count:{type:Number},
        shoot:{type:Number,min:0,max:5},
        hit:{type:Number,min:0,max:4},
        penetrate:{type:Number,min:0,max:4},
        wound:{type:Number,min:0,max:5},
        afterEffect:{type:Number,min:0,max:5}
    }).validate({count:count,shoot:shoot,hit:hit,penetrate:penetrate,wound:wound,afterEffect:afterEffect});

    var result={};
    var del;
    var x=Math.floor(Math.random()*199999-100000+1)+100000;

    //y=15x - (x/5)*5*(x-4) - (x/8)*5*(x-7)
    //0 15 30 45 60 70 80 90 95 100
    if(shoot != 5)
    {
        del=x%10%5+shoot;
        count=count*((15*del-(del/5 | 0)*5*(del-4)-(del/8 | 0)*5*(del-7))/100);
        x=x/10 | 0;
    }

    //hit
    del=x%10%5+hit;
    count=count*((15*del-(del/5 | 0)*5*(del-4)-(del/8 | 0)*5*(del-7))/100);
    x=x/10 | 0;
    //penetrate
    del=x%10%5+penetrate;
    count=count*((15*del-(del/5 | 0)*5*(del-4)-(del/8 | 0)*5*(del-7))/100);
    x=x/10 | 0;

    if(wound != 5)
    {
        del=x%10%5+wound;
        count=count*((15*del-(del/5 | 0)*5*(del-4)-(del/8 | 0)*5*(del-7))/100);
        x=x/10 | 0;
    }
    result.success=Math.floor(count);
    if(afterEffect != 5)
    {
        del=x%10%5+afterEffect;
        count=count*((15*del-(del/5 | 0)*5*(del-4)-(del/8 | 0)*5*(del-7))/100);
    }
    result.afterEffect=Math.floor(count);

    return result;
};