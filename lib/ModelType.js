export {Infantry,Vehicle}
import {CCW,Track} from "./WeaponData"
/**
 * 1 point-mandatory melee always
 * type show size
 *  infantry-1 hex (R=1)
 *  vehicle,monster-7 hex (R=2)
 *  Super heavy-19 hex (R=3)
 */
class Model {
    constructor(options)
    {
        this.type=options.type || '';

        this.name=options.name || 'Unnamed';
        this.description=options.description || "This is one of unidentified warrior";

        this.commander=options.commander || false;
        this.cost=options.cost || 0;
        this.rules=options.rules || null;

        this.move=options.move || 0;
        this.weaponSkill=options.weaponSkill || 0;
        this.ballisticSkill=options.ballisticSkill || 0;
        this.strength=options.strength || 0;

        this.initiative=options.initiative || 0;
        this.wound=options.wound || 0;
        this.attack=options.attack || 0;
        this.leadership=options.leadership || 0;

        this.armorSave=options.armorSave || 0;
        this.invulnerable=options.invulnerable || 7;

        this.weaponCount=options.weaponCount || 2;
        for(let i=1; i++; i<=this.weaponCount)
        {
            this['weapon'+i]=options['weapon'+i] || null;
            this['defaultWeapon'+i]=options['defaultWeapon'+i] || null;
            this['availableWeapon'+i]=options['availableWeapon'+i] || null;
        }
    }
}
class Infantry extends Model {
    constructor(options)
    {
        super(options);
        this.toughness=options.toughness || 0;

        if (this.defaultWeapon1===null)
        {
            this.defaultWeapon1=CCW;
        }
    }
}
class Vehicle extends Model {
    constructor(options)
    {
        super(options);
        this.toughnessFront=options.toughnessFront || 0;
        this.toughnessSide=options.toughnessSide || 0;
        this.toughnessRear=options.toughnessRear || 0;

        if(options.rules.indexOf('Transport')>=0)
        {
            this.transportCapacity=options.transportCapacity || 0;
            this.cargo=null;
        }

        if (this.defaultWeapon1===null)
        {
            this.defaultWeapon1=Track;
        }
    }
}