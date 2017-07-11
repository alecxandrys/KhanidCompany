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
 * @param xSize vertical size
 * @param ySize horizontal size
 * @constructor
 * @param deck1
 * @param deck2
 */
import {TurnOrderInit} from "./TurnOrder"
BattleState = function (xSize, ySize, deck1, deck2) {
    this.xSize=xSize;
    this.ySize=ySize;
    this.map = createMap(xSize, ySize);
    this.deck1 = deck1;
    this.deck2 = deck2;
    this.orderLine=TurnOrderInit(deck1,deck2)
};
/**
 *generate a massive (in object) of object, that consist state all of cells
 * 1-Grass
 * 2-Cover
 * 3-Diff
 * 4-Danger
 * 5-Ruin
 * 0-Unreached
 * -1-Offset
 * @param xSize vertical size
 * @param ySize horizontal size
 * @returns {Array}
 */
function createMap(xSize, ySize) {
    let map=[];
    for (let x = (xSize - 1); x >= 0; x--) {
        map[x] = [];
        for (let y = ((ySize + xSize / 2) - 1); y >= 0; y--) {
            let cell={};
            cell.x=x;
            cell.y=y;
            if (OffsetOut(xSize, x, ySize, y)) {
                cell.ground = Math.floor(Math.random() * 6);
            }
            else {
                cell.ground=-1;
            }
            map[x][y] = cell;
        }
    }
    return map;
}
