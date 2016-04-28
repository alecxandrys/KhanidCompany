/**
 * Created by Alecxandrys on 10.11.2015.
 */
Meteor.subscribe('battles');
var game;
var BS = {};
/**
 * Basic image height=80
 * Basic image width=60
 */

var bootState = function (t) {

};
bootState.prototype = {
    preload:function() {

    },
    /**
     * Scale cell here
     */
    create:function () {
        var field=$('field');
        this.scale.maxWidth = field.width;
        this.scale.maxHeight = field.height;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.state.start ('preload');
    }
};

var preloadState =function (t) {

};
preloadState.prototype = {

    preload:function ()
    {
        this.text = this.add.text(this.game.width / 2, this.game.height / 2, 'загрузка', {fill: '#ffffff'});
        this.text.anchor.set(0.5, 0.5);
        this.load.onFileComplete.add(this.fileComplete, this);

        this.load.image('Grass', 'BattleResource/Grass.svg');
        this.load.image('Cover', 'BattleResource/Cover.svg');
        this.load.image('Danger', 'BattleResource/Danger.svg');
        this.load.image('Diff', 'BattleResource/Diff.svg');
        this.load.image('Unreached', 'BattleResource/Unreached.svg');
    },

    create:function ()
    {
        this.state.start ('main');
    },

    fileComplete: function(progress) {
        this.text.text='Loading '+ progress + '%';
    }
};

var mainState =function (t) {
};
mainState.prototype = {
    preload:function() {
    },
    create:function () {
        var tiles = this.add.group();
        for(var i = 0; i < 12; i++)
            {
                for(var j = 0; j < 20; j++)
                    {
                        var cell;
                        var tmp = BS.map[i][j].ground;
                        var xCoordinate=60*j+(i%2)*30;//and a half shifting in each second row
                        var yCoordinate=60*i;//60 is R(vertical side) + vertical shift ((80-R)/2)
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
                    }
            }
    }
};

var finalState =function (t) {
};
finalState.prototype = {
    preload:function() {
    },
    create:function () {
    }
};

Template.Battlefield.onRendered(function()
{

    game = new Phaser.Game( 1230 , 740 , Phaser.AUTO, 'field');//1280(60*20.5)*740(80*9.25) basic
    game.global = {},
        game.state.add('boot',bootState),
        game.state.add('preload',preloadState),
        game.state.add('main',mainState),
        game.state.add('final',finalState);
    game.state.start('boot')
});

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
 * Must rerun every time,when BS update. This variant unable
 */
