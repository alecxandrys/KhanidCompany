/**
 * Created by Alecxandrys on 10.11.2015.
 * We need phaser.io here!!!
 */
Meteor.subscribe('battles');
var game;
//local scope for work
//var BS={};
//global scope for debug
var BS = {};
var h;
var w;
/**
 * Basic image height=80
 * Basic image width=60
 */

function preload()
    {
        game.load.image('Grass', 'BattleResource/Grass.svg');
        game.load.image('Cover', 'BattleResource/Cover.svg');
        game.load.image('Danger', 'BattleResource/Danger.svg');
        game.load.image('Diff', 'BattleResource/Diff.svg');
        game.load.image('Unreached', 'BattleResource/Unreached.svg');
    }
/**
 * Scale cell here
 * it's a multiple point, can be float.
 * Ideal width is 60*20.5=1230;
 *
 * Epic bug: 9R-height;
 * Not 12, because we need vertical xShift;
 * D=2R
 *Ideal height is 80*9D=720;
 *
 * h/1230=x scale factor;
 * w/1440=y scale factor;
 */
function create()
    {
        var x = 20;
        var y = 12;
        var xStep = Math.floor(w / (x + 0.5));//add step for xShift
        var yStep = Math.floor(h / (y*2));
        var tiles = game.add.group();
        var xScale = w / 1230;
        var yScale = h / 720;
        //hardcode 12, because y now consist a R-size
        for(var i = 0; i < y; i++)
            {
                var xShift = i % 2;
                for(var j = 0; j < x; j++)
                    {
                        var cell;
                        var tmp = BS.map[i][j].ground;
                        //2-margin from left
                        var xCoordinate = xStep * (j + 0.5 * xShift) + 2;
                        var yCoordinate = yStep * (i * 2);
                        if(tmp == 1)
                            {
                                cell = tiles.create(xCoordinate, yCoordinate, 'Grass');
                            }
                        else if(tmp == 2)
                            {
                                cell = tiles.create(xCoordinate, yCoordinate, 'Cover');
                            }
                        else if(tmp == 3)
                            {
                                cell = tiles.create(xCoordinate, yCoordinate, 'Danger');
                            }
                        else if(tmp == 4)
                            {
                                cell = tiles.create(xCoordinate, yCoordinate, 'Diff');
                            }
                        else if(tmp == 0)
                            {
                                cell = tiles.create(xCoordinate, yCoordinate, 'Unreached');
                            }
                        //Save coordinate
                        BS.map[i][j].x = xCoordinate;
                        BS.map[i][j].y = yCoordinate;
                        //scale itself
                        cell.scale.setTo(xScale, yScale);
                    }
            }
    }
function update()
    {
    }
Template.Battlefield.onRendered(function()
{
    var field = $("#field");
    h = field.height();
    w = field.width();
    //this 8 fix a round error, so they need;
    game = new Phaser.Game(w, h + 8, Phaser.AUTO, 'field', {preload: preload, create: create, update: update});
});
/**
 * A very bad calculate a window param
 * need adaptive rebuild
 */
Template.Battlefield.onCreated(function()
{
    BS = battles.findOne({}).BS;
});
Template.Battlefield.helpers({
    name1       : function()
        {
            return battles.findOne().name1;
        },
    name2       : function()
        {
            return battles.findOne().name2;
        }
});
/**
 * Must rerun every time,when BS update
 */
Template.Battlefield.autorun(function(){
    BS = battles.findOne({}).BS;

});




