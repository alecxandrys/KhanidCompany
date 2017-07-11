/**
 * Created by Alecxandrys on 08.10.2015.
 */
import {
    Bolter,
    BoltPistol,
    HeavyBolter,
    Boltgun,
    Shotgun,
    SniperRifle,
    Flamer,
    HeavyFlamer,
    PlasmaGun,
    PlasmaPistol,
    MissileLauncher
} from "./WeaponData"
import {ChainSword,PowerSword} from "./WeaponData"
import {Infantry,Vehicle} from "./ModelType"
import {TwinLinked,OnVehicle} from "./WeaponData"

/**
 * all make without command. Lately will added place for indep and base sergeant or base command
 * @type {Model}
 */
let Marine=new Infantry({
    type:'Infantry',
    name:'Marine',
    description:'Adeptus Astartes brother, in power armor with bolter, knife and his faint and honor',
    commander:false,
    cost:15,
    moveDistance:6,
    rules:[],
    weaponSkill:4,
    ballisticSkill:4,
    strength:4,
    toughness:4,
    initiative:4,
    wound:1,
    attack:1,
    leadership:8,
    armorSave:3,
    weaponCount:2,
    availableWeapon1:[ChainSword],
    availableWeapon2:[Bolter,Boltgun,Flamer,PlasmaGun,BoltPistol]
});
let Devastator=new Infantry({
    type:'Infantry',
    name:'Devastator',
    description:'Support unit with heavy weapon. Basically with heavy bolter, but can carry more exotic variant',
    commander:false,
    cost:16,
    rules:['Heavy Weapon'],
    moveDistance:6,
    weaponSkill:4,
    ballisticSkill:4,
    strength:4,
    toughness:4,
    initiative:3,
    wound:1,
    attack:1,
    leadership:8,
    armorSave:3,
    weaponCount:2,
    availableWeapon2:[Bolter,HeavyBolter,Flamer,HeavyFlamer,PlasmaGun,MissileLauncher]
});
let Scout=new Infantry({
    type:'Infantry',
    name:'Scout',
    description:'Light and fast infiltrated unit, who only training to become a Space Marine',
    commander:false,
    cost:8,
    rules:[],
    moveDistance:6,
    weaponSkill:3,
    ballisticSkill:3,
    strength:3,
    toughness:3,
    initiative:5,
    wound:1,
    attack:1,
    leadership:7,
    armorSave:4,
    weaponCount:2,
    availableWeapon1:[ChainSword],
    availableWeapon2:[BoltPistol,Boltgun,SniperRifle,Shotgun]
});
let Assault=new Infantry({
    type:'Infantry',
    name:'Assault',
    description:'Light and fast infiltrated unit, who only training to become a Space Marine',
    commander:false,
    cost:10,
    rules:['JetPack'],
    moveDistance:8,
    weaponSkill:3,
    ballisticSkill:3,
    strength:3,
    toughness:3,
    initiative:5,
    wound:1,
    attack:1,
    leadership:7,
    armorSave:4,
    weaponCount:2,
    defaultWeapon1:ChainSword,
    defaultWeapon2:BoltPistol,
    availableWeapon1:[PowerSword],
    availableWeapon2:[BoltPistol,PlasmaPistol]
});
let Rhino=new Vehicle({
    type:'Vehicle',
    name:'Rhino',
    description:'Main transport of space marine forces. Also used to create a lot of support machine',
    commander:false,
    cost:25,
    rules:['Transport'],
    moveDistance:12,
    weaponSkill:3,
    ballisticSkill:3,
    strength:3,
    initiative:5,
    wound:1,
    attack:1,
    leadership:7,
    armorSave:4,
    weaponCount:2,
    defaultWeapon2:OnVehicle(TwinLinked(HeavyBolter)),

    toughnessFront:5,
    toughnessSide:4,
    toughnessRear:3,

    transportCapacity:10
});
SpaceMarineForce=[Marine,Devastator,Scout,Assault,Rhino];