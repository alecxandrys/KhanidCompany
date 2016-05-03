/**
 * Created by Alecxandrys on 10.11.2015.
 * Remember, that game and BS in debug mod only without var
 */
game = {};
battle = {};
var _stateDep=new Deps.Dependency();
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
        this.state.start ('reconnaissance');
    },

    fileComplete: function(progress) {
        this.text.text='Loading '+ progress + '%';
    }
};

var reconnaissanceState =function (t) {
};
reconnaissanceState.prototype = {
    preload:function() {
    },
    create:function () {
        this.RenderField();


    },
    RenderField:function() {
        var tiles = game.add.group();
        for(var i = 0; i < 12; i++)
            {
                for(var j = 0; j < 20; j++)
                    {
                        var cell;
                        var tmp = battle.BS.map[i][j].ground;
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
                        //Save coordinate.Maybe it's unnecessary?
                        battle.BS.map[i][j].xCoordinate = xCoordinate;
                        battle.BS.map[i][j].yCoordinate = yCoordinate;

                        //Remember the coordinate to cell
                        cell.xCoordinate=xCoordinate;
                        cell.yCoordinate=yCoordinate;

                        //remember index of cell
                        cell.row=i;
                        cell.collomn=j;

                        cell.inputEnabled=true;
                        cell.events.onInputDown.add(this.addSquad,this)
                    }
            }
    },
    /**
     * This wor
     * @param cell current cell with saved param< like index and coordinate.
     */
    addSquad:function(cell)
        {
            //console.log("cell event"+cell.xCoordinate+" "+cell.yCoordinate);
            _stateDep.changed();
        }
};

var battleState =function (t) {
};
battleState.prototype = {
    preload:function() {
    },
    create:function () {
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
/**
 * Template always after all other code
 */
Template.Battlefield.onCreated(function()
{
    game = new Phaser.Game( 1230 , 740 , Phaser.AUTO, 'field');//1280(60*20.5)*740(80*9.25) basic
    game.global = {},
        game.state.add('boot',bootState),
        game.state.add('preload',preloadState),
        game.state.add('reconnaissance',reconnaissanceState),
        game.state.add('battle',battleState);
    game.state.add('final',finalState);
    game.state.start('boot');

});
/**
 * This isn't final
 * TODO:save who you are in session o local var, or triple request to mongo
 */
Template.Battlefield.helpers({
    name1       : function()
        {
            return battle.name1;
        },
    name2       : function()
        {
            return battle.name2;
        },
    cards:function()
        {
            if (Meteor.user().username==battle.name1)
                {
                    return battle.BS.deck1;
                }
            else if (Meteor.user().username==battle.name2)
            {
                return battle.BS.deck2;
            }
            else {
                    alert ("You name doesn't consist in battlestate");
                }

        },
    /**
     *Deps.Dependency was added, work correctly
     */
    reconnaissance:function()
        {
            _stateDep.depend();
            var isTrue;
            isTrue = game.state.current == '' || game.state.current=="reconnaissance";
            return {
                state:isTrue
            }
        }
});
Deps.autorun(function() {
    Meteor.subscribe('battles');
    battle=battles.findOne({});
});