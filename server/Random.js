/**
 * Created by Alecxandrys on 08.05.2016.
 */
/**
 * @return {{}}
 */
FullRandomSignature=function(attackCount,toHit,toWound,coverSave,armorSave,woundCount,afterEffect)
{

    new SimpleSchema({
        attackCount:{type:Number},
        toHit:{type:Number,min:2,max:6},
        toWound:{type:Number,min:2,max:6},
        coverSave:{type:Number,min:2,max:7},//7-model can't use this
        armorSave:{type:Number,min:2,max:7},//7-model can't use this
        woundCount:{type:Number,min:1},
        afterEffect:{type:Number,min:1,max:7}//7-model can't use this
    }).validate({attackCount:attackCount,toHit:toHit,toWound:toWound,coverSave:coverSave,armorSave:armorSave,woundCount:woundCount,afterEffect:afterEffect});

    var result={};
    var success=0;
    var x;
    var i=0;

    for(i=0; i<attackCount; i++)
    {
        x=Math.floor(Math.random()*(6-1+1))+1;
        if(x>=toHit)
        {success++}
    }
    attackCount=success;
    success=0;
    for(i=0; i<attackCount; i++)
    {
        x=Math.floor(Math.random()*(6-1+1))+1;
        if(x>=toWound)
        {success++}
    }

    if(woundCount != 1)
    {
        attackCount=success;
        success=0;
        for(i=0; i<attackCount; i++)
        {
            x=Math.floor(Math.random()*(6-1+1))+1;
            if(x>=woundCount)
            {success++}
        }
    }
    result.success=success;
    if(afterEffect != 1)
    {
        attackCount=success;
        success=0;
        for(i=0; i<attackCount; i++)
        {

            x=Math.floor(Math.random()*(6-1+1))+1;
            if(x>=afterEffect)
            {success++}
        }
    }
    result.afterEffect=success;
    return result;
};
