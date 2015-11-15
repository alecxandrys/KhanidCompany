/**
 * Created by Alecxandrys on 10.11.2015.
 * We need phaser.io here!!!
 */
Meteor.subscribe('battles');

var game;
BS={};
var h;
var w;

function update() {

}
/**
 * need to remove hardcode of cell's count here
 * i=y
 * j=x

function create() {

        var i=0;
        var j=0;

        while (i<y)
            {
                while (j<x)
                    {
                        var tmp=BS.map[i][j].ground;

                        if(tmp==1){game.add.sprite(xStep*(j+1),yStep*(i+1),'Grass');}
                        else if(tmp==2){game.add.sprite(xStep*(j+1),yStep*(i+1),'Cover');}
                        else if(tmp==3){game.add.sprite(xStep*(j+1),yStep*(i+1),'Danger');}
                        else if(tmp==4){game.add.sprite(xStep*(j+1),yStep*(i+1),'Diff');}
                        else if(tmp==5){game.add.sprite(xStep*(j+1),yStep*(i+1),'Unreach');}

                        j++;
                    }
                i++;
            }
}
*/

function create()
    {
        var x=20;
        var y=12;

        var xStep=Math.floor(w/x);
        var yStep=Math.floor(h/y);

        field=game.add.group();

        field.create(0,0,'Grass');
        field.create(xStep*(1+1),yStep*(1+1),'Grass');

    }
Template.Battlefield.onRendered(function(){


});
/**
 * A very bad calculate a window param
 * need adaptive rebild
 */


Template.Battlefield.onCreated(function(){


    h=$(window).height()-40;
    w=$(window).width()-40;

    console.log(w+" "+h);

    BS=battles.findOne({}).BS;

    game = new Phaser.Game(w, h, Phaser.AUTO, 'field', { preload: preload, create: create, update: update });

    function preload() {
        game.load.image('Grass', 'BattleResource/Grass.png');
        game.load.image('Cover', 'BattleResource/Cover.png');
        game.load.image('Danger', 'BattleResource/Danger.png');
        game.load.image('Diff', 'BattleResource/Diff.png');
        game.load.image('Unreach', 'BattleResource/Unreach.png');
    }

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