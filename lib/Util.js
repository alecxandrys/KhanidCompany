/**
 * Created by Пользователь on 06/02/2017.
 * @return {boolean}
 */
OffsetOut=function(xSize,x,ySize,y)
{
    return ((xSize-x-1)/2)<=y && y<=(ySize-1+(xSize-x-1)/2);
};
TwinLinked=function(weapon)
{
    weapon.name='Twin-Linked'+weapon.name;
    weapon.attack=weapon.attack*2;
    return weapon;
};
