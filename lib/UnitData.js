/**
 * Created by Alecxandrys on 08.10.2015.
 * TODO:Commander, condition, price, rules
 */
function Squad(name, description,baseCount,maxCount,maxAdded,weaponSkill,ballisticSkill,straight,taffnes,wound,initiative,attackCount,leadership,armorSave)
    {
        this.name = name;
        this.description = description;

        this.baseCount=baseCount;
        this.maxCount=maxCount;

        this.commander=null;

        this.added=null;
        this.maxAdded=maxAdded;

        this.rules=null;

        this.weaponSkill=weaponSkill;
        this.ballisticSkill=ballisticSkill;
        this.streight=straight;
        this.taffnes=taffnes;
        this.iniative=initiative;
        this.wound=wound;
        this.attackCount=attackCount;
        this.leadership=leadership;
        this.armorSave=armorSave
    }
/**
 * all make without command. Lately will added place for indep and base sergeant or base command
 * @type {Squad}
 */

var Marine = new Squad('Marine', 'Standard Adeptus Astartes unit, in power armor and with bolter',5,10,2,4,4,4,4,1,4,1,8,3);
var Devastator = new Squad('Devastor', 'Support unit with heavy weapon. Basically with heavy bolter, but can carry more exotic variant',5,10,2,4,4,4,4,1,4,1,8,3);
var Scout = new Squad('Scout', 'Light and fast infiltrated unit, who only training to become a Space Marine',5,10,2,4,4,4,4,1,4,1,8,4);

SpaceMarineForce = [Marine, Devastator, Scout];