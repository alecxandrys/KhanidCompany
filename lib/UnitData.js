/**
 * Created by Alecxandrys on 08.10.2015.
 */
function Unit(name,description,moveDistance)
{
    this.name=name;
    this.description=description;
    this.positionX=0;
    this.positionY=0;
    this.canMove=true;
    this.moveDistance=moveDistance;

}
Unit.prototype.move=function(x,y)
{
//check
//canMove(x,y)
    this.x=x;
    this.y=y;

};
Unit.prototype.setup=function(x,y)
{
    this.x=x;
    this.y=y;
};


Marine=new Unit('Marine','Standard Adeptus Astartes unit, in power armor and with bolter',1);
Devastor=new Unit('Devastor','Support unit with heavy weapon. Basically with heavy bolter, but can carry more exotic variant',1);
Scout=new Unit('Scout','Light and fast infiltrated unit, who only training to become a Space Marine',2);

SpaceMarineForce=[Marine,Devastor,Scout];