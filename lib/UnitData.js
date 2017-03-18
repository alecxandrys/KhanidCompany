/**
 * Created by Alecxandrys on 08.10.2015.
 */
function Weapon(option)
{
    this.name=option.name || 'Unnamed';
    this.description=option.description || 'This one of unidentified weapon';
    this.cost=option.cost||0;
    this.range=option.range || 0;
    this.strength=option.strength || 0;
    this.AP=option.AP || 0;
    this.attackCount=option.attackCount || 0;
    this.oneHanded=option.oneHanded || false;
    this.type=option.type || 'None';
    this.quality=option.quality || 'Usual';
    this.fraction=option.fraction || 'Thrash';
    this.rules=option.rules || null;
}

var BoltPistol=new Weapon({
    name:'Bolt pistol',
    description:'Light one-handed weapon, usual for spacemarine',
    cost:2,
    range:2,
    strength:3,
    AP:5,
    attackCount:1,
    oneHanded:true,
    type:'Ranged',
    quality:'Usual',
    fraction:'SpaceMarine'
});

var Bolter=new Weapon({
    name:'Bolter',
    description:'Standard two-handed spacemarine weapon, useful and power',
    cost:5,
    range:4,
    strength:4,
    AP:4,
    attackCount:2,
    oneHanded:false,
    type:'Ranged',
    quality:'Usual',
    source:'SpaceMarine'
});
var HeavyBolter=new Weapon({
   name:'Heavy Bolter',
    description:'Two handed machine gun with detonating heavy bolt, which  supplied by tape from backpack',
    cost:8,
    range:5,
    strength:5,
    AP:4,
    attackCount:4,
    oneHanded:false,
    type:'Ranged',
    quality:'Usual',
    source:'SpaceMarine',
    rules:['Heavy']
});
var CCW=new Weapon({
    name:'Close combat weapon (battle knife)',
    description:'Standard one-handed melee weapon, which have every unit',
    cost:2,
    range:0,
    strength:0,
    AP:5,
    attackCount:0,
    oneHanded:true,
    type:'Melee',
    quality:'Usual',
    source:'SpaceMarine'
});
var ChainSword=new Weapon({
    name:'Chain sword',
    description:'One-handed melee weapon, which cuts the enemy in small pieces',
    cost:5,
    range:0,
    strength:0,
    AP:5,
    attackCount:0,
    oneHanded:true,
    type:'Melee',
    quality:'Usual',
    source:'SpaceMarine'
});

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
var Marine=new Squad({
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
var Devastator=new Squad({
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
var Scout=new Squad({
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
