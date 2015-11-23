/**
 * Created by Alecxandrys on 10.11.2015.
 * We need phaser.io here!!!
 */
Meteor.subscribe('battles');
var game;
BS = {};
var h;
var w;

/**
 * Basic image height=80
 * Basic image width=60
 */

function preload() {
    game.load.image('Grass', 'BattleResource/Grass.svg');
    game.load.image('Cover', 'BattleResource/Cover.svg');
    game.load.image('Danger', 'BattleResource/Danger.svg');
    game.load.image('Diff', 'BattleResource/Diff.svg');
    game.load.image('Unreach', 'BattleResource/Unreach.svg');
}



/**
 * Scale cell here
 * it's a multiple point, can be float.
 * Ideal width is 60*20.5=1230;
 * Ideal height is 80*12=960;
 * h/1230=x scale factor;
 * w/960=y scale factor;
 */
function create()
    {
        var x = 20;
        var y = 12;
        var xStep = Math.floor(w / (x + 0.5));
        var yStep = Math.floor(h / (y + 0.5));
        var tiles = game.add.group();
        var xScale = w / 1230;
        var yScale = h / 960;
        for(var i = 0; i < y; i++)
            {
                var shift = i % 2;
                for(var j = 0; j < x; j++)
                    {
                        var tmp = BS.map[i][j].ground;
                        var cell;
                        if(tmp == 1)
                            {
                                cell = tiles.create(Math.floor(xStep * (j + 0.5 * shift)), yStep * (i), 'Grass');
                            }
                        else if(tmp == 2)
                            {
                                cell = tiles.create(Math.floor(xStep * (j + 0.5 * shift)), yStep * (i), 'Cover');
                            }
                        else if(tmp == 3)
                            {
                                cell = tiles.create(Math.floor(xStep * (j + 0.5 * shift)), yStep * (i), 'Danger');
                            }
                        else if(tmp == 4)
                            {
                                cell = tiles.create(Math.floor(xStep * (j + 0.5 * shift)), yStep * (i), 'Diff');
                            }
                        else if(tmp == 0)
                            {
                                cell = tiles.create(Math.floor(xStep * (j + 0.5 * shift)), yStep * (i), 'Unreached');
                            }
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
    game = new Phaser.Game(w, h, Phaser.AUTO, 'field', {preload: preload, create: create, update: update});
});
/**
 * A very bad calculate a window param
 * need adaptive rebuild
 */
Template.Battlefield.onCreated(function()
{
    h = $(window).height() - 40;
    w = $(window).width() - 40;
    BS = battles.findOne({}).BS;
});
Template.Battlefield.helpers({
    name1: function()
        {
            return battles.findOne().name1;
        },
    name2: function()
        {
            return battles.findOne().name2;
        }
});