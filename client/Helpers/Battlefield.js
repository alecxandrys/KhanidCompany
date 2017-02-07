/**
 * Created by Alecxandrys on 10.11.2015.
 * Remember, that game and BS in debug mod only without var
 */
game={};//this is local variable, which consist graphic (like sprite) and other param
battle={};//this is variable which rewrite always when change BattleState
var _stateDep=new Deps.Dependency();
var _turnDep=new Deps.Dependency();
/**
 * Basic image height=80
 * Basic image width=60
 */

var bootState=function(t)
{

};
bootState.prototype={
    preload:function()
    {

    },/**
     * Scale field here
     */
    create:function()
    {
        var field=$('field');
        this.scale.maxWidth=field.width;
        this.scale.maxHeight=field.height;
        this.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally=true;
        this.state.start('preload');
    }
};

var preloadState=function(t)
{

};
preloadState.prototype={

    preload:function()
    {
        this.text=this.add.text(this.game.width/2,this.game.height/2,'загрузка',{fill:'#ffffff'});
        this.text.anchor.set(0.5,0.5);
        this.load.onFileComplete.add(this.fileComplete,this);

        this.load.image('Grass','BattleResource/Grass.svg');
        this.load.image('Cover','BattleResource/Cover.svg');
        this.load.image('Danger','BattleResource/Danger.svg');
        this.load.image('Diff','BattleResource/Diff.svg');
        this.load.image('Unreached','BattleResource/Unreached.svg');
        this.load.image('Devastator','BattleResource/Devastator.svg');
        this.load.image('Scout','BattleResource/Scout.svg');
        this.load.image('Marine','BattleResource/Marine.svg');
        game.xLineSize=80;
        game.yLineSize=60;
    },

    create:function()
    {
        this.state.start('reconnaissance');
    },

    fileComplete:function(progress)
    {
      this.text.text='Loading '+progress+'%';
    }
};

var reconnaissanceState=function(t)
{
};
reconnaissanceState.prototype={
    preload:function()
    {
    },create:function()
    {
        game.curState='reconnaissance';
        game.squads=game.add.group();
        game.tiles=game.add.group();
        this.RenderField();


    },update:function()
    {
        battle.BS.deck1.forEach(function(squad,index)
        {
            if(squad.placed)
            {
                if(game.deck1_Model[index] === null)
                {
                    game.deck1_Model[index]=game.add.sprite(game.map[squad.row][squad.column].xCoordinate,game.map[squad.row][squad.column].yCoordinate,squad.name);
                    game.squads.add(game.deck1_Model[index]);
                }
                else if(game.deck1_Model[index].position.x != battle.BS.map[squad.row][squad.column].xCoordinate || game.deck1_Model[index].position.y != battle.BS.map[squad.row][squad.column].yCoordinate)
                {
                    game.deck1_Model[index].position.x=game.map[squad.row][squad.column].xCoordinate;
                    game.deck1_Model[index].position.y=game.map[squad.row][squad.column].yCoordinate;
                }
            }
        });
        battle.BS.deck2.forEach(function(squad,index)
        {
            if(squad.placed)
            {
                if(game.deck2_Model[index] === null)
                {
                    game.deck2_Model[index]=game.add.sprite(game.map[squad.row][squad.column].xCoordinate,game.map[squad.row][squad.column].yCoordinate,squad.name);
                    game.squads.add(game.deck2_Model[index]);
                }
                else if(game.deck2_Model[index].position.x != battle.BS.map[squad.row][squad.column].xCoordinate || game.deck2_Model[index].position.y != battle.BS.map[squad.row][squad.column].yCoordinate)
                {
                    game.deck2_Model[index].position.x=game.map[squad.row][squad.column].xCoordinate;
                    game.deck2_Model[index].position.y=game.map[squad.row][squad.column].yCoordinate;
                }
            }
        });
        game.world.bringToTop(game.squads);
    },/**
     * Render ground, may be refactor because use twice in next state?
     * @constructor
     */
    RenderField:function()
    {
        //game.tiles = game.add.group();
        for(var x=(battle.BS.xSize-1); x>=0; x--)
        {
            for(var y=((battle.BS.ySize+battle.BS.xSize/2)-1); y>=0; y--)
            {
                if(OffsetOut(battle.BS.xSize,x,battle.BS.ySize,y))
                {

                    var cell;
                    var tmp=battle.BS.map[x][y].ground;

                    var xCoordinate;
                    var yCoordinate;

                    //for changeable field and different first shift
                    //this part from lab, where A* pathfinder was realised
                    if(battle.BS.xSize%2 == 1)
                    {
                        xCoordinate=game.yLineSize*(y-(battle.BS.xSize-1-x)/2)+(game.yLineSize/2)*(Math.abs(x%2-1));
                        yCoordinate=game.xLineSize*x;
                    }
                    else
                    {
                        xCoordinate=game.yLineSize*(y-(battle.BS.xSize-1-x)/2)+(game.yLineSize/2)*(x%2);
                        yCoordinate=game.xLineSize*x;
                    }
                    switch(tmp)
                    {
                        case 1:
                            cell=game.tiles.create(xCoordinate,yCoordinate,'Grass');
                            break;
                        case 2:
                            cell=game.tiles.create(xCoordinate,yCoordinate,'Cover');
                            break;
                        case 3:
                            cell=game.tiles.create(xCoordinate,yCoordinate,'Danger');
                            break;
                        case 4:
                            cell=game.tiles.create(xCoordinate,yCoordinate,'Diff');
                            break;
                        case 0:
                            cell=game.tiles.create(xCoordinate,yCoordinate,'Unreached');
                            break;
                        default:
                    }

                    //Save coordinate.Maybe it's unnecessary?
                    game.map[x][y].xCoordinate=xCoordinate;
                    game.map[x][y].yCoordinate=yCoordinate;

                    //Remember the coordinate to cell
                    //cell.xCoordinate=xCoordinate;
                    //cell.yCoordinate=yCoordinate;

                    //remember index of cell
                    cell.row=x;
                    cell.collomn=y;

                    cell.inputEnabled=true;
                    cell.events.onInputDown.add(this.addSquad,this)
                }
            }
        }
    },/**
     * This work
     * @param cell current cell with saved param, like index and coordinate.
     */
    addSquad:function(cell)
    {
        if(game.chosenCardId != undefined || game.chosenCardId != null && game.curState == 'reconnaissance')
        {
            //TODO make a error callback
            Meteor.call('setPosition',battle._id,game.side,game.chosenCardId,cell.collomn,cell.row);
        }
    }
};

var battleState=function(t)
{
};
battleState.prototype={
    preload:function()
    {
    },create:function()
    {
        this.RenderField();//render start disposition

    },/**
     * this part maybe reused from prev state
     * @constructor
     */
    RenderField:function()
    {
        for(var x=(battle.BS.xSize-1); x>=12; x--)
        {
            for(var y=((battle.BS.ySize+battle.BS.xSize/2)-1); y>=0; y--)
            {
                if(OffsetOut(battle.BS.xSize,x,battle.BS.ySize,y))
                {

                    var cell;
                    var tmp=battle.BS.map[x][y].ground;

                    var xCoordinate;
                    var yCoordinate;

                    //for changeable field and different first shift
                    //this part from lab, where A* pathfinder was realised
                    if(battle.BS.xSize%2 == 1)
                    {
                        xCoordinate=game.yLineSize*(y-(battle.BS.xSize-1-x)/2)+(game.yLineSize/2)*(Math.abs(x%2-1));
                        yCoordinate=game.xLineSize*x;
                    }
                    else
                    {
                        xCoordinate=game.yLineSize*(y-(battle.BS.xSize-1-x)/2)+(game.yLineSize/2)*(x%2);
                        yCoordinate=game.xLineSize*x;
                    }
                    switch(tmp)
                    {
                        case 1:
                            cell=game.tiles.create(xCoordinate,yCoordinate,'Grass');
                            break;
                        case 2:
                            cell=game.tiles.create(xCoordinate,yCoordinate,'Cover');
                            break;
                        case 3:
                            cell=game.tiles.create(xCoordinate,yCoordinate,'Danger');
                            break;
                        case 4:
                            cell=game.tiles.create(xCoordinate,yCoordinate,'Diff');
                            break;
                        case 0:
                            cell=game.tiles.create(xCoordinate,yCoordinate,'Unreached');
                            break;
                        default:
                    }

                    cell.events.onInputDown.add(this.selectCell,this);
                }
            }
        }
        battle.BS.deck1.forEach(function(squad,index)
        {
            if(squad.placed)
            {
                game.deck1_Model[index]=game.add.sprite(game.map[squad.row][squad.column].xCoordinate,game.map[squad.row][squad.column].yCoordinate,squad.name);
                game.deck1_Model[index].events.onInputDown.add(this.selectSquad,this);
                game.deck1_Model[index].index=index;
                game.deck1_Model[index].side=1;
                game.squads.add(game.deck1_Model[index]);
            }
        });
        battle.BS.deck2.forEach(function(squad,index)
        {
            if(squad.placed)
            {
                game.deck2_Model[index]=game.add.sprite(game.map[squad.row][squad.column].xCoordinate,game.map[squad.row][squad.column].yCoordinate,squad.name);
                game.deck2_Model[index].events.onInputDown.add(this.selectSquad,this);
                game.deck2_Model[index].index=index;
                game.deck2_Model[index].side=2;
                game.squads.add(game.deck2_Model[index]);
            }
        });
        game.world.bringToTop(game.squads);
    },selectSquad:function(model)
    {
        //TODO:: make a check for turn (and add the initiative table)
        if(game.chosenCardId != undefined || game.chosenCardId != null)
        {
            game.chosenCardId=model;
        }
        else
        {
            Meteor.call('clickOnSquad');
            game.chosenCardId=null;
        }
    },selectCell:function(cell)
    {
        if(game.chosenCardId != undefined || game.chosenCardId != null)
        {
            Meteor.call('moveTo');
            game.chosenCardId=null;
        }

    }
};

var finalState=function(t)
{
};
finalState.prototype={
    preload:function()
    {
    },create:function()
    {
    }
};
/**
 * Template always after all other code
 */
Template.Battlefield.onCreated(function()
{
    game=new Phaser.Game(1230,740,Phaser.AUTO,'field');//1280(60*20.5)*740(80*9.25) basic
    game.global={}, game.state.add('boot',bootState), game.state.add('preload',preloadState), game.state.add('reconnaissance',reconnaissanceState), game.state.add('battle',battleState);
    game.state.add('final',finalState);
    game.state.start('boot');

    if(Meteor.user().username == battle.name1)
    {
        game.side=1;
    }
    else if(Meteor.user().username == battle.name2)
    {
        game.side=2;
    }
    else
    {
        alert("You name doesn't consist in battlestate");
    }

    game.map=[];
    for(var i=0; i<battle.BS.xSize; i++)
    {
        game.map[i]=[];
        for(var j=0; j<(battle.BS.ySize + battle.BS.xSize / 2); j++)
        {
            game.map[i][j]={};
        }
    }
    game.deck1_Model=[];
    for(i=0; i<battle.BS.deck1.length; i++)
    {
        game.deck1_Model[i]=null;
    }
    game.deck2_Model=[];
    for(i=0; i<battle.BS.deck2.length; i++)
    {
        game.deck2_Model[i]=null;
    }
});

Template.Battlefield.helpers({
    name1:function()
    {
        return battle.name1;
    },name2:function()
    {
        return battle.name2;
    },cards:function()
    {
        _turnDep.depend();
        if(game.side == 1)
        {
            return battle.BS.deck1;
        }
        else
        {
            return battle.BS.deck2;
        }

    },/**
     *Deps.Dependency was added, work correctly
     */
    reconnaissance:function()
    {
        _stateDep.depend();
        var isTrue;
        isTrue=game.state.current == '' || game.state.current == "reconnaissance";
        return {
            state:isTrue
        }
    }
});

Template.Battlefield.events({
    "click .card":function(event)
    {
        event.preventDefault();
        game.chosenCardId=parseInt($(event.currentTarget)
            .children('a')
            .text());
    },"dbclick .card":function(event)
    {
        event.preventDefault();
        var id=parseInt($(event.currentTarget)
            .children('a')
            .text());
    },"click .ready":function()
    {

        //go to next state, let's war begin
        //TODO Check work and changes
        game.curState='wait';
        Meteor.call('Status_ready',battle._id,game.side);

    }

});

Deps.autorun(function()
{
    Meteor.subscribe('battles');
    battle=battles.findOne({});


    //In first time battle is undefined
    if(battle)
    {
        if(battle.state1 == "ready" && battle.state2 == "ready")
        {
            //after it all dead, so we need fully render again
            game.state.start('battle');
            game.curState='turn';
        }
    }

    _turnDep.changed();
});