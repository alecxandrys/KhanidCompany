/**
 * Created by Alecxandrys on 08.10.2015.
 * TODO:Commander, condition, price, rules
 */
function Squad(options)
{
    this.name=options.name || 'Unnamed';
    this.description=options.description || "This is one of undefined warrior";

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

    this.rangeWeapon=options.rangeWeapon || null;
    this.meleeWeapon=options.meleeWeapon || null;

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
    speed:4,
    wound:1,
    attackCount:1,
    leadership:8,
    armorSave:3
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
    speed:3,
    wound:1,
    attackCount:1,
    leadership:8,
    armorSave:3
});
var Scout=new Squad({
    name:'Scout',
    description:'Light and fast infiltrated unit, who only training to become a Space Marine',
    commander:false,
    cost:8,
    rules:[],
    weaponSkill:3,
    ballisticSkill:4,
    strength:3,
    toughness:3,
    initiative:5,
    speed:5,
    wound:1,
    attackCount:1,
    leadership:7,
    armorSave:4
});

SpaceMarineForce=[Marine,Devastator,Scout];