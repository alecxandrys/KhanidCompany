/**
 * Created by Alecxandrys on 13.11.2015.
 */
/**
 * Create a Object, which consist a data to display to player
 * Style of declare is package-scope, so without var.
 * See Main&Card to make reactive;
 * @param ID
 * @param sizeX
 * @param sizeY
 * @constructor
 */
BattleState=function (ID,sizeX,sizeY)
    {
        var mapHash=setMapHash(sizeX,sizeY);
        this.map=createMap(mapHash,sizeX,sizeY);
    };

/**
 *generate a massive (in object) of object, that consist state all of cells
 * @param mapHash
 * @param sizeX
 * @param sizeY
 * @returns {{}}
 */
function createMap(mapHash,sizeX,sizeY)
{
    var map={};
    for (var i=0;i<sizeX;i++)
    {
        map[i]={};
        for(var j=0;j<sizeY;j++)
        {
            var cell={};
            cell.ground=mapHash.charAt(i*sizeX+j);
            map[i][j]=cell;
        }
    }
    return map;
}

/**
 * map generator, need seriously fix, path check and more other stuff
 * @param x
 * @param y
 * @returns {string}
 */
function setMapHash(x,y)
{
    var str="";
    while (str.length<(x*y))
    {
        str=str+Math.floor(Math.random() * 5) + 1;
    }
    return str;
}