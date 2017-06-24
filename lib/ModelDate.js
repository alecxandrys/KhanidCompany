/**
 * Created by Alecxandrys on 08.10.2015.
 */
import {Bolter,BoltPistol,HeavyBolter,Boltgun,Shotgun,SniperRifle,Flamer,HeavyFlamer,PlasmaGun,PlasmaPistol,MissileLauncher} from "./WeaponData"
import {CCW,ChainSword,PowerSword} from "./WeaponData"
function Model(options)
{
    this.type=options.type || [];

    this.name=options.name || 'Unnamed';
    this.description=options.description || "This is one of unidentified warrior";

    this.commander=options.commander || false;
    this.cost=options.cost || 0;
    this.rules=options.rules || null;

    this.move=options.move || 0;
    this.weaponSkill=options.weaponSkill || 0;
    this.ballisticSkill=options.ballisticSkill || 0;
    this.strength=options.strength || 0;
    //this.toughness=options.toughness || 0;
    this.initiative=options.initiative || 0;
    this.wound=options.wound || 0;
    this.attack=options.attack || 0;
    this.leadership=options.leadership || 0;

    this.armorSave=options.armorSave || 0;
    this.invulnerable=options.invulnerable|| 7;

    this.availableWeapon=options.availableWeapon || null;
    this.rangeWeapon=null;
    this.meleeWeapon=CCW;//base profile to melee

    if (options.type.indexOf('Vehicle')>=0)
    {
        this.toughnessFront=options.toughnessFront || 0;
        this.toughnessSide=options.toughnessSide || 0;
        this.toughnessRear=options.toughnessRear || 0;
    }
    else
    {
        this.toughness=options.toughness || 0;
    }
    if (options.type.indexOf('Transport')>=0)
    {
        this.transportCapacity=options.transportCapacity || 0;
    }
}
/**
 * all make without command. Lately will added place for indep and base sergeant or base command
 * @type {Model}
 */
let Marine=new Model({
    type:['Infantry'],
    name:'Marine',
    description:'Adeptus Astartes brother, in power armor with bolter, knife and his faint and honor',
    commander:false,
    cost:15,
    move:6,
    rules:[],
    weaponSkill:4,
    ballisticSkill:4,
    strength:4,
    toughness:4,
    initiative:4,
    wound:1,
    attackCount:1,
    leadership:8,
    armorSave:3,
    availableWeapon:[ChainSword,BoltPistol,Bolter,Boltgun,Flamer,PlasmaGun]
});
let Devastator=new Model({
    type:['Infantry'],
    name:'Devastator',
    description:'Support unit with heavy weapon. Basically with heavy bolter, but can carry more exotic variant',
    commander:false,
    cost:16,
    rules:['Heavy Weapon'],
    move:6,
    weaponSkill:4,
    ballisticSkill:4,
    strength:4,
    toughness:4,
    initiative:3,
    wound:1,
    attackCount:1,
    leadership:8,
    armorSave:3,
    availableWeapon:[Bolter,HeavyBolter,Flamer,HeavyFlamer,PlasmaGun,MissileLauncher]
});
let Scout=new Model({
    type:['Infantry'],
    name:'Scout',
    description:'Light and fast infiltrated unit, who only training to become a Space Marine',
    commander:false,
    cost:8,
    rules:[],
    move:6,
    weaponSkill:3,
    ballisticSkill:3,
    strength:3,
    toughness:3,
    initiative:5,
    wound:1,
    attackCount:1,
    leadership:7,
    armorSave:4,
    availableWeapon:[ChainSword,BoltPistol,Boltgun,SniperRifle,Shotgun]
});
let Assault=new Model({
    type:['Infantry'],
    name:'Assault',
    description:'Light and fast infiltrated unit, who only training to become a Space Marine',
    commander:false,
    cost:10,
    rules:['JetPack'],
    move:6,
    weaponSkill:3,
    ballisticSkill:3,
    strength:3,
    toughness:3,
    initiative:5,
    wound:1,
    attackCount:1,
    leadership:7,
    armorSave:4,
    availableWeapon:[ChainSword,PowerSword,BoltPistol,PlasmaPistol]
});
let Rhino=new Model({
    type:['Vehicle','Transport'],
    name:'Rhino',
    description:'Main transport of space marine forces. Also used to create a lot of support machine',
    commander:false,
    cost:25,
    rules:[],
    move:12,
    weaponSkill:3,
    ballisticSkill:3,
    strength:3,
    initiative:5,
    wound:1,
    attackCount:1,
    leadership:7,
    armorSave:4,
    availableWeapon:[],

    toughnessFront:5,
    toughnessSide:4,
    toughnessRear:3,

    transportCapacity:10
});
SpaceMarineForce=[Marine,Devastator,Scout,Assault,Rhino];
