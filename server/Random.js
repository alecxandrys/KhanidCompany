/**
 * Created by Alecxandrys on 08.05.2016.
 */
/**
 let options={
attackCount:model.rangeWeapon.attackCount,
skill:model.ballisticSkill,
toWound:toWound(),
coverSave:coverSave(),
armorSave:armorSave(),
afterEffect:afterEffect(),
rules:[]
};
 * attackCount,toHit,toWound,coverSave,armorSave,remainingWound,afterEffect,rules
 * @return {{}}
 */
attackSignature=function(model,target,order,type)
{
    let result={skill:[],toWound:[],coverSave:[],armorSave:[],remainingWound:0,afterEffect:[]};
    let options={};
    let instanceDeath=model.rangeWeapon.strength>=(target.toughness*2);

    options.coverSave=7;
    if(type == 'range')
    {
        options.attackCount=model.rangeWeapon.attackCount;
        if(order.snapshoot)
        {
            options.skill=1;
        }
        else
        {
            options.skill=model.ballisticSkill;
        }
        options.enemySkill=null;
        options.strength=model.rangeWeapon.strength;
        if (model.rangeWeapon.AP>=target.armorSave)
        {
            options.armorSave=target.armorSave;
        }
        else {
            options.armorSave=7;
        }
    }
    else
    {
        options.attackCount=model.attackCount;
        options.skill=model.weaponSkill;
        options.enemySkill=target.weaponSkill;
        options.strength=model.strength;
        if(model.meleeWeapon)
        {
            options.strength=options.strength+model.meleeWeapon.strength;
        }
        if (model.meleeWeapon.AP>=target.armorSave)
        {
            options.armorSave=target.armorSave;
        }
        else {
            options.armorSave=7;
        }
    }
    //FNP,protocol and other, which add save or work after unsaved wound
    options.afterEffect=7;//not implemented yet
    //Math.floor(Math.random() * (max - min + 1)) + min
    for(let i=0; i<options.attackCount; i++)
    {
        let x=Math.floor(Math.random()*(6-1+1))+1;
        if(x == 1 && options.skill>5)//reroll, if 6 and more in WS or BS skill
        {
            x=Math.floor(Math.random()*(6-1+1))+1;
            options.skill=options.skill-5;
        }
        result.skill.push(x);
        if(x>=toHit(options.skill,options.enemySkill))
        {
            x=Math.floor(Math.random()*(6-1+1))+1;
            result.toWound.push(x);
            if(x>=toWound(options.strength,target.toughness))//penetrate, now use saves
            {
                x=Math.floor(Math.random()*(6-1+1))+1;
                if(options.coverSave != 7)//not in cover
                {
                    result.coverSave.push(x);
                }
                if(x<options.coverSave || options.coverSave == 7)//cover
                {
                    x=Math.floor(Math.random()*(6-1+1))+1;
                    if(options.armorSave != 7)//dont have armor or invul save
                    {
                        result.armorSave.push(x);
                    }
                    if(x<options.armorSave || options.armorSave == 7)
                    {
                        x=Math.floor(Math.random()*(6-1+1))+1;
                        if(options.afterEffect != 7)
                        {
                            result.afterEffect.push(x);
                        }
                        result.remainingWound++;
                    }
                }
            }
        }
    }
    result.sucesses=false;
    if (result.remainingWound!=0)
    {
        if(instanceDeath)
        {
            result.remainingWound--;
            target.isPlaced=false;//target destroyed instantly
        }
        else
        {
            if(target.wound<=result.remainingWound)
            {
                target.isPlaced=false;
                result.remainingWound=result.remainingWound-target.wound;
            }
            else
            {
                target.wound-=result.remainingWound
            }
        }
        result.sucesses=true;
    }
    return result;
};
let toHit=(skill,enemySkill) =>
{
    if(enemySkill == null)//range attack
    {
        return 7-skill
    }
    else //melee attack
    {
        if(skill == enemySkill || skill == (enemySkill+1))
        {
            return 4;
        }
        else if(skill>(enemySkill+1))
        {
            return 5;
        }
        else
        {
            return 3;
        }
    }

};
let toWound=(strength,toughness) =>
{
    if(strength == toughness)
    {
        return 4;
    }
    else if((strength-toughness)< -1)
    {
        return 2
    }
    else if((strength-toughness) == -1)
    {
        return 3
    }
    else if((strength-toughness)>1)
    {
        return 5
    }
    else if((strength-toughness) == 1)
    {
        return 6
    }
};
