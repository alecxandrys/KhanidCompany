/**
 * Created by Alecxandrys on 13.11.2015.
 */
/**
 * Create a Object, which consist a data to display to player
 * Style of declare is package-scope
 * @param ID
 * @param sizeX
 * @param sizeY
 * @constructor
 */
BattleState=function (ID,sizeX,sizeY)
    {
        this.ID=ID;
        this.map=mapGenerate(sizeX,sizeY);

    }
/**
 * Terrible, must be rebuild with path check
 * @param sizeX
 * @param sizeY
 */
function mapGenerate(sizeX,sizeY)
    {
        var map=[];
        for (var i=0;i<sizeX;i++)
            {
                map[i]=[];
                for(var j=0;j<sizeY;j++)
                    {
                        map[i][j]=Math.floor(Math.random() * 5) + 1;
                    }
            }
    }