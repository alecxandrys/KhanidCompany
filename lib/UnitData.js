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


Marine=new Unit('Marine','Standart space marine unit');
Devastor=new Unit('Devastor','Support unit with heavy weapon');
Scout=new Unit('Scout','Light and fast infiltrated unit');

SpaceMarineForce=[Marine,Devastor,Scout];