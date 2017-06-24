/**
 * Created by Пользователь on 21/06/2017.
 */
export {Bolter,BoltPistol,HeavyBolter,Boltgun,Shotgun,SniperRifle,Flamer,HeavyFlamer,PlasmaGun,PlasmaPistol,MissileLauncher};
export {CCW,ChainSword,PowerSword};
function Weapon(option)
{
    this.name=option.name || 'Unnamed';
    this.description=option.description || 'This one of unidentified weapon';
    this.cost=option.cost || 0;
    this.range=option.range || 0;
    this.strength=option.strength || 0;
    this.rending=option.rending || 0;
    this.attackCount=option.attackCount || 0;
    this.oneHanded=option.oneHanded || false;
    this.type=option.type || 'None';
    this.quality=option.quality || 'Usual';
    this.fraction=option.fraction || 'Thrash';
    this.rules=option.rules || null;
}

let BoltPistol=new Weapon({
    name:'Bolt pistol',
    description:'Light one-handed weapon, usual for spacemarine',
    cost:2,
    range:2,
    strength:3,
    rending:5,
    attackCount:1,
    oneHanded:true,
    type:'Ranged',
    quality:'Usual',
    fraction:'SpaceMarine'
});

let Bolter=new Weapon({
    name:'Bolter',
    description:'Standard two-handed spacemarine weapon, useful and power',
    cost:5,
    range:4,
    strength:4,
    rending:4,
    attackCount:2,
    oneHanded:false,
    type:'Ranged',
    quality:'Usual',
    source:'SpaceMarine'
});
let HeavyBolter=new Weapon({
    name:'Heavy bolter',
    description:'Two handed machine gun with detonating heavy bolt, which  supplied by tape from backpack',
    cost:8,
    range:5,
    strength:5,
    rending:4,
    attackCount:4,
    oneHanded:false,
    type:'Ranged',
    quality:'Usual',
    source:'SpaceMarine',
    rules:['Heavy']
});
let Boltgun=new Weapon({
    name:'Boltgun',
    description:'Light version of main spacemarine forces without auto-fire possibilities',
    cost:5,
    range:4,
    strength:4,
    rending:4,
    attackCount:1,
    oneHanded:false,
    type:'Ranged',
    quality:'Usual',
    source:'SpaceMarine'
});
let Shotgun=new Weapon({
    name:'Shotgun',
    description:'Short-ranged template weapon for close contact',
    cost:6,
    range:2,
    strength:5,
    rending:4,
    attackCount:2,
    oneHanded:false,
    type:'Ranged',
    quality:'Usual',
    source:'SpaceMarine',
    rules:['Vector template']
});
let SniperRifle=new Weapon({
    name:'Sniper Rifle',
    description:'Long-range powerful weapon to eliminate single target',
    cost:10,
    range:10,
    strength:6,
    rending:2,
    attackCount:1,
    oneHanded:false,
    type:'Ranged',
    quality:'Usual',
    source:'SpaceMarine',
    rules:['Precision shot']
});
let Flamer=new Weapon({
    name:'Flamer',
    description:'Template close weapon to assault operation',
    cost:8,
    range:2,
    strength:6,
    rending:1,
    attackCount:1,
    oneHanded:false,
    type:'Ranged',
    quality:'Usual',
    source:'SpaceMarine',
    rules:['Vector template','Ignore cover','Auto hit']
});
let HeavyFlamer=new Weapon({
    name:'Heavy Flamer',
    description:'Template close weapon to assault operation',
    cost:16,
    range:3,
    strength:6,
    rending:1,
    attackCount:2,
    oneHanded:false,
    type:'Ranged',
    quality:'Usual',
    source:'SpaceMarine',
    rules:['Vector template','Ignore cover','Auto hit']
});
let PlasmaPistol=new Weapon({
    name:'Plasma pistol',
    description:'One handed plasma weapon, seldom and powerful',
    cost:15,
    range:3,
    strength:6,
    rending:2,
    attackCount:1,
    oneHanded:true,
    type:'Ranged',
    quality:'Unusual',
    source:'SpaceMarine',
    rules:['Plasma']
});
let PlasmaGun=new Weapon({
    name:'Plasma gun',
    description:'This gun send a ball of high energy plasma to target and eliminate them',
    cost:20,
    range:6,
    strength:7,
    rending:2,
    attackCount:2,
    oneHanded:false,
    type:'Ranged',
    quality:'Unusual',
    source:'SpaceMarine',
    rules:['Plasma','Heavy']
});
let MissileLauncher=new Weapon({
    name:'Missile Launcher',
    description:'Launcher, which can find missile for every type of target',
    cost:18,
    range:7,
    strength:7,
    rending:2,
    attackCount:1,
    oneHanded:false,
    type:'Ranged',
    quality:'Unusual',
    source:'SpaceMarine',
    rules:['Different charges','Heavy']
});
/**
 * Melee weapon
 * @type {Weapon}
 */
let CCW=new Weapon({
    name:'Close combat weapon',
    description:'Standard weapon like battle knife,fist, etc. Every model have it',
    cost:2,
    range:0,
    strength:0,
    rending:0,
    attackCount:0,
    oneHanded:true,
    type:'Melee',
    quality:'Usual',
    source:'SpaceMarine'
});
let ChainSword=new Weapon({
    name:'Chain sword',
    description:'One-handed melee weapon, which cuts the enemy in small pieces',
    cost:5,
    range:0,
    strength:0,
    rending:5,
    attackCount:1,
    oneHanded:true,
    type:'Melee',
    quality:'Usual',
    source:'SpaceMarine'
});
let PowerSword=new Weapon({
    name:'Power sword',
    description:'One-handed melee energy blade',
    cost:10,
    range:0,
    strength:1,
    rending:2,
    attackCount:0,
    oneHanded:true,
    type:'Melee',
    quality:'Usual',
    source:'SpaceMarine'
});
