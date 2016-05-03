/**
 * Created by Alecxandrys on 13.11.2015.
 */
/**
 * Create a Object, which consist a data to display to player
 * Style of declare is package-scope, so without var.
 * See Main&Card to make reactive;
 *
 * Status:
 * 0-allocation;
 * 1-active game;
 * @param ID
 * @param sizeX
 * @param sizeY
 * @constructor
 * @param deck1
 * @param deck2
 */
BattleState = function(ID, sizeX, sizeY, deck1, deck2)
    {
        var mapHash = setMapHash(sizeX, sizeY);
        this.map = createMap(mapHash, sizeX, sizeY);
        this.deck1 = deck1;
        this.deck2 = deck2;
    };
/**
 *generate a massive (in object) of object, that consist state all of cells
 * 1-Grass
 * 2-Cover
 * 3-Diff
 * 4-Danger
 * 0-Unreached
 * @param mapHash
 * @param sizeX
 * @param sizeY
 * @returns {{}}
 */
function createMap(mapHash, sizeX, sizeY)
    {
        var map = {};
        for(var i = 0; i < sizeY; i++)
            {
                map[i] = {};
                for(var j = 0; j < sizeX; j++)
                    {
                        var cell = {};
                        cell.ground = mapHash.charAt(i * sizeX + j);
                        map[i][j] = cell;
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
function setMapHash(x, y)
    {
        var str = "";
        while(str.length < (x * y))
            {
                str = str + Math.floor(Math.random() * 5) + 1;
            }
        return str;
    }