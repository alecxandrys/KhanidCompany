import {RollD6,Roll2D6,RollD3} from "./D6.js"
/**
 * Created by Alecxandrys on 08.05.2016.
 */
/**
 * always have CCW for melee in profile
 * @return {{}}
 */
attackSignature=function(model,target,order,type)
{
    let result={toHit:[],toWound:[],armorSave:[],unresolvedWound:0,afterEffect:[]};
    let options={};
    let instanceDeath;

    if(type === 'range' && model.rangeWeapon)//check when overwatch
    {

        options.attackCount=model.rangeWeapon.attackCount;
        if(order.snapshot)
        {
            options.skill=1;
        }
        else
        {
            options.skill=model.ballisticSkill;
        }
        options.enemySkill=null;
        options.strength=model.rangeWeapon.strength;
        if(model.rangeWeapon.AP>=target.armorSave)
        {
            options.armorSave=target.armorSave;
        }
        else
        {
            options.armorSave=model.invulnerable;
        }
        instanceDeath=options.strength>=(target.toughness*2);
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
        if(model.meleeWeapon.AP>=target.armorSave)
        {
            options.armorSave=target.armorSave;
        }
        else
        {
            options.armorSave=model.invulnerable;
        }
        instanceDeath=options.strength>=(target.toughness*2);
    }
    //FNP,protocol and other, which add save or work after unsaved wound
    options.afterEffect=7;//not implemented yet
    for(let i=0; i<options.attackCount; i++)
    {
        let x=RollD6();
        result.toHit.push(x);
        if(x>=toHit(options.skill,options.enemySkill))//ToHit Roll
        {
            x=RollD6();
            result.toWound.push(x);
            if(x>=toWound(options.strength,target.toughness))//ToWound Roll
            {
                x=RollD6();
                result.armorSave.push(x);
                if(x<options.armorSave || options.armorSave === 7)//Save Roll
                {
                    x=RollD6();
                    result.afterEffect.push(x);
                    result.unresolvedWound++;
                }

            }
        }
    }
    result.sucesses=false;
    if(result.unresolvedWound !== 0)
    {
        if(instanceDeath)
        {
            result.unresolvedWound--;
            target.placed=false;//target destroyed instantly
        }
        else
        {
            if(target.wound<=result.unresolvedWound)
            {
                target.placed=false;
                result.unresolvedWound=result.unresolvedWound-target.wound;
                target.wound=0;
            }
            else
            {
                target.wound-=result.unresolvedWound
            }
        }
        result.sucesses=true;
    }
    return result;
};
let toHit=(skill,enemySkill) =>
{
    if(enemySkill === null)//range attack
    {
        return 7-skill
    }
    else //melee attack
    {
        if(skill === enemySkill || skill === (enemySkill+1))
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
    if(strength === toughness)
    {
        return 4;
    }
    else if((strength-toughness)< -1)
    {
        return 6
    }
    else if((strength-toughness) === -1)
    {
        return 5
    }
    else if((strength-toughness)>1)
    {
        return 2
    }
    else if((strength-toughness) === 1)
    {
        return 3
    }
};
