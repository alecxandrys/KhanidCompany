/**
 * Created by Alecxandrys on 08.10.2015.
 */
import {Bolter,BoltPistol,HeavyBolter,Shotgun,SniperRifle,Flamer,HeavyFlamer,PlasmaGun,PlasmaPistol,MissileLauncher} from "./WeaponData"
import {CCW,ChainSword,PowerSword} from "./WeaponData"
function Squad(options)
{
    this.name=options.name || 'Unnamed';
    this.description=options.description || "This is one of unidentified warrior";

    this.commander=options.commander || false;
    this.cost=options.cost || 0;
    this.rules=options.rules || null;

    this.weaponSkill=options.weaponSkill || 0;
    this.ballisticSkill=options.ballisticSkill || 0;
    this.strength=options.strength || 0;
    this.toughness=options.toughness || 0;
    this.initiative=options.initiative || 0;
    this.speed=options.speed || 0;
    this.wound=options.wound || 0;
    this.attackCount=options.attackCount || 0;
    this.leadership=options.leadership || 0;
    this.armorSave=options.armorSave || 0;

    this.invulnerable=options.invulnerable|| 7;

    this.availableWeapon=options.availableWeapon || null;

    this.rangeWeapon=null;
    this.meleeWeapon=CCW;//base profile to melee
}
/**
 * all make without command. Lately will added place for indep and base sergeant or base command
 * @type {Squad}
 */
let Marine=new Squad({
    name:'Marine',
    description:'Adeptus Astartes brother, in power armor with bolter, knife and his faint and honor',
    commander:false,
    cost:15,
    rules:[],
    weaponSkill:4,
    ballisticSkill:4,
    strength:4,
    toughness:4,
    initiative:4,
    speed:10,
    wound:1,
    attackCount:1,
    leadership:8,
    armorSave:3,
    availableWeapon:[ChainSword,BoltPistol,Bolter]
});
let Devastator=new Squad({
    name:'Devastator',
    description:'Support unit with heavy weapon. Basically with heavy bolter, but can carry more exotic variant',
    commander:false,
    cost:16,
    rules:[],
    weaponSkill:4,
    ballisticSkill:4,
    strength:4,
    toughness:4,
    initiative:3,
    speed:9,
    wound:1,
    attackCount:1,
    leadership:8,
    armorSave:3,
    availableWeapon:[BoltPistol,Bolter,HeavyBolter]
});
let Scout=new Squad({
    name:'Scout',
    description:'Light and fast infiltrated unit, who only training to become a Space Marine',
    commander:false,
    cost:8,
    rules:[],
    weaponSkill:3,
    ballisticSkill:3,
    strength:3,
    toughness:3,
    initiative:5,
    speed:12,
    wound:1,
    attackCount:1,
    leadership:7,
    armorSave:4,
    availableWeapon:[BoltPistol,Bolter]
});

SpaceMarineForce=[Marine,Devastator,Scout];
