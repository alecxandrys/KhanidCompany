/**
 * Created by Alecxandrys on 08.05.2016.
 */
/**
 * @return {{}}
 */
attackSignature=function(attackCount,toHit,toWound,coverSave,armorSave,woundCount,afterEffect,rules)
{
    new SimpleSchema({
        attackCount:{type:Number},
        toHit:{type:Number,min:2,max:6},
        toWound:{type:Number,min:2,max:6},
        coverSave:{type:Number,min:2,max:7},//7-model can't use this
        armorSave:{type:Number,min:2,max:7},//7-model can't use this, also invulnerable field if AP>ArmSv
        woundCount:{type:Number,min:1},
        afterEffect:{type:Number,min:1,max:7}//7-model can't use this
    }).validate({
        attackCount:attackCount,
        toHit:toHit,
        toWound:toWound,
        coverSave:coverSave,
        armorSave:armorSave,
        woundCount:woundCount,
        afterEffect:afterEffect
    });

    var result={toHit:[],toWound:[],coverSave:[],armorSave:[],woundCount:0,afterEffect:[]};

    //Math.floor(Math.random() * (max - min + 1)) + min
    for(let i=0; i<attackCount; i++)
    {
        let x=Math.floor(Math.random()*(6-1+1))+1;
        result.toHit.push(x);
        if(x>=toHit)
        {
            x=Math.floor(Math.random()*(6-1+1))+1;
            result.toWound.push(x);
            if (x>=toWound)//penetrate, now use saves
            {
                x=Math.floor(Math.random()*(6-1+1))+1;
                if (coverSave!=7) {result.coverSave.push(x);}
                if (x<coverSave || coverSave==7)
                {
                    x=Math.floor(Math.random()*(6-1+1))+1;
                    if (armorSave!=7) {result.armorSave.push(x);}
                    if (x<armorSave ||armorSave==7)
                    {
                        woundCount++;
                        x=Math.floor(Math.random()*(6-1+1))+1;
                        if (afterEffect!=7) {result.afterEffect.push(x);}
                    }
                }
            }
        }
    }
};
