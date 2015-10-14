/**
 * Created by Alecxandrys on 08.10.2015.
 */
function Unit(name,description)
{
    this.name=name;
    this.description=description;
    this.positionX=0;
    this.positionY=0;
    this.canMove=true;
    this.moveDistance=1;

}
Unit.prototype.move=function()
{


};
Unit.prototype.setup=function(x,y)
{
    this.x=x;
    this.y=y;
};


Marine=new Unit('Marine','Standard Adeptus Astartes unit, in power armor and with bolter');
Devastor=new Unit('Devastor','Support unit with heavy weapon. Basically with heavy bolter, but can carry more exotic variant');
Scout=new Unit('Scout','Light and fast infiltrated unit, who only training to become a Space Marine');

SpaceMarineForce=[Marine,Devastor,Scout];