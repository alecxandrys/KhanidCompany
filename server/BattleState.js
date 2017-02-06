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
        this.ID=ID;
        this.map = createMap(sizeX, sizeY);
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
 * @param sizeX
 * @param sizeY
 * @returns {Array}
 */
function createMap(sizeX, sizeY)
    {
        var map = [];
        for(var i = 0; i < sizeY; i++)
            {
                map[i] = [];
                for(var j = 0; j < sizeX; j++)
                    {
                        var cell = {};
                        cell.ground = Math.floor(Math.random() * 5) + 1;
                        map[i][j] = cell;
                    }
            }
        return map;
    }
