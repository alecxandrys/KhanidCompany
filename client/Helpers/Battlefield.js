/**
 * Created by Alecxandrys on 10.11.2015.
 * Remember, that game and BS in debug mod only without var
 */
game={};//this is local variable, which consist graphic (like sprite) and other param
battle={};//this is variable which rewrite always when change BattleState

var log='';

var _logDep=new Deps.Dependency();
var _stateDep=new Deps.Dependency();
var _turnDep=new Deps.Dependency();
var _posDep=new Deps.Dependency();
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

        this.load.image('Grass','BattleResource/Terrain/Grass.svg');
        this.load.image('Cover','BattleResource/Terrain/Cover.svg');
        this.load.image('Danger','BattleResource/Terrain/Danger.svg');
        this.load.image('Diff','BattleResource/Terrain/Diff.svg');
        this.load.image('Unreached','BattleResource/Terrain/Unreached.svg');
        this.load.image('Offset','BattleResource/Terrain/Offset.svg');
        this.load.image('Ruin','BattleResource/Terrain/Ruin.svg');
        game.xLineSize=80;
        game.yLineSize=60;
        this.load.image('Devastator','BattleResource/Models/Devastator.svg');
        this.load.image('Scout','BattleResource/Models/Scout.svg');
        this.load.image('Marine','BattleResource/Models/Marine.svg');
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
/**
 * squad-consist all sprite of unit to bring them to top
 */
reconnaissanceState.prototype={
    preload:function()
    {
    },
    create:function()
    {
        game.curState='reconnaissance';
        game.squads=game.add.group();
        game.tiles=game.add.group();
        RenderField(this.AddPart,1);
    },
    update:function()
    {
        battle.BS.deck1.forEach(function(squad,index)
        {
            if(squad.placed)
            {
                if(game.deck1[index] === null)
                {
                    game.deck1[index]=game.add.sprite(game.map[squad.row][squad.column].xCoordinate,game.map[squad.row][squad.column].yCoordinate,squad.name);
                    game.deck1[index].index=index;
                    game.squads.add(game.deck1[index]);
                }
                else if(game.deck1[index].position.x != battle.BS.map[squad.row][squad.column].xCoordinate || game.deck1[index].position.y != battle.BS.map[squad.row][squad.column].yCoordinate)
                {
                    game.deck1[index].position.x=game.map[squad.row][squad.column].xCoordinate;
                    game.deck1[index].position.y=game.map[squad.row][squad.column].yCoordinate;
                }
            }
        });
        battle.BS.deck2.forEach(function(squad,index)
        {
            if(squad.placed)
            {
                if(game.deck2[index] === null)
                {
                    game.deck2[index]=game.add.sprite(game.map[squad.row][squad.column].xCoordinate,game.map[squad.row][squad.column].yCoordinate,squad.name);
                    game.deck2[index].index=index;
                    game.squads.add(game.deck2[index]);
                }
                else if(game.deck2[index].position.x != battle.BS.map[squad.row][squad.column].xCoordinate || game.deck2[index].position.y != battle.BS.map[squad.row][squad.column].yCoordinate)
                {
                    game.deck2[index].position.x=game.map[squad.row][squad.column].xCoordinate;
                    game.deck2[index].position.y=game.map[squad.row][squad.column].yCoordinate;
                }
            }
        });
        game.world.bringToTop(game.squads);
    },
    /**
     * Render ground, may be refactor because use twice in next state?
     * context was binded from RenderField so this work fine
     * @constructor
     */
    AddPart:function()
    {
        game.map[this.x][this.y].xCoordinate=this.xCoordinate;
        game.map[this.x][this.y].yCoordinate=this.yCoordinate;

        this.cell.row=this.x;
        this.cell.collomn=this.y;

        this.cell.inputEnabled=true;
        this.cell.events.onInputDown.add(reconnaissanceState.prototype.addSquad,this)
    },
    /**
     * This work
     * @param cell current cell with saved param, like index and coordinate.
     */
    addSquad:function(cell)
    {
        game.chosenCell=cell;
        _posDep.changed();
        if (game.chosenCardId != undefined || game.chosenCardId != null)
        {
            if(game.curState == 'reconnaissance')
            {
                Meteor.call('setPosition',battle._id,game.side,game.chosenCardId,cell.collomn,cell.row,function(error,result)
                {
                    if(!error)
                    {
                        if(result)
                        {
                            log='Unit placed';
                        }
                        else
                        {
                            log='Unit can\'t be placed';
                        }
                    }
                    else
                    {
                        log="Server error";
                    }
                    _logDep.changed();
                });
            }
            else
            {
                log=" You cannot placed unit anymore";
            }
            game.chosenCardId=null;
        }
        else
        {
            log=" Please select unit to placement";
        }
        _logDep.changed();
    }
};

var battleState=function(t)
{
};
battleState.prototype={
    preload:function()
    {
    },
    create:function()
    {
        RenderField(this.AddPart,2);//render start disposition
        this.RenderSquad();
    },
    /**
     * uses with context from RenderField
     * @constructor
     */
    AddPart:function()
    {
        this.cell.events.onInputDown.add(battleState.prototype.selectCell,this);
    },
    RenderSquad:function()
    {
        battle.BS.deck1.forEach(function(squad,index)
        {
            if(squad.placed)
            {
                game.deck1[index]=game.add.sprite(game.map[squad.row][squad.column].xCoordinate,game.map[squad.row][squad.column].yCoordinate,squad.name);
                game.deck1[index].events.onInputDown.add(this.selectSquad,this);
                game.squads.add(game.deck1[index]);
            }
        });
        battle.BS.deck2.forEach(function(squad,index)
        {
            if(squad.placed)
            {
                game.deck2[index]=game.add.sprite(game.map[squad.row][squad.column].xCoordinate,game.map[squad.row][squad.column].yCoordinate,squad.name);
                game.deck2[index].events.onInputDown.add(this.selectSquad,this);
                game.squads.add(game.deck2[index]);
            }
        });
        game.world.bringToTop(game.squads);
    },
    selectSquad:function(model)
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
    },
    selectCell:function(cell)
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
    },
    create:function()
    {
    }
};
/**
 * Template always after all other code
 */
Template.Battlefield.onCreated(function()
{
    game=new Phaser.Game(1200,740,Phaser.AUTO,'field');//1280(60*20.5)*740(80*9.25) basic
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
        for(var j=0; j<(battle.BS.ySize+battle.BS.xSize/2); j++)
        {
            game.map[i][j]={};
        }
    }
    game.deck1=[];
    for(i=0; i<battle.BS.deck1.length; i++)
    {
        game.deck1[i]=null;
    }
    game.deck2=[];
    for(i=0; i<battle.BS.deck2.length; i++)
    {
        game.deck2[i]=null;
    }
});

Template.Battlefield.helpers({
    name1:function()
    {
        return battle.name1;
    },
    name2:function()
    {
        return battle.name2;
    },
    cards:function()
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
    },
    /**
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
    },
    position:function()
    {
        _posDep.depend();
        if(game.chosenCell)
        {
            return game.chosenCell.row+' '+game.chosenCell.collomn;
        }
    },
    log:function()
    {
        _logDep.depend();
        return log;
    }
});

Template.Battlefield.events({
    "click .card":function(event)
    {
        event.preventDefault();
        game.chosenCardId=parseInt($(event.currentTarget)
            .children('a')
            .text());
    },
    "click .ready":function()
    {
        //go to next state, let's war begin
        if(game.curState != 'ready')
        {

            game.curState='ready';
            Meteor.call('Status_ready',battle._id,game.side);
        }
        else
        {
            log="Your are alredy waiting opponent";
            _logDep.changed();
        }
    }
});

function RenderField(addPart,point)
{
    var context={};
    for(var x=(battle.BS.xSize-1); x>=0; x--)
    {
        for(var y=((battle.BS.ySize+battle.BS.xSize/2)-1); y>=0; y--)
        {
            if(OffsetOut(battle.BS.xSize,x,battle.BS.ySize,y))
            {

                var xCoordinate;
                var yCoordinate;
                var cell;
                var tmp=battle.BS.map[x][y].ground;

                //for changeable field and different first shift
                //this part from lab, where A* pathfinder was realised
                //only removed horisontal offset (now idea why) and add vertical shift
                if(battle.BS.xSize%2 == 1)
                {
                    xCoordinate=game.yLineSize*(y-(battle.BS.xSize-1-x)/2);
                    yCoordinate=game.xLineSize*x*0.75;
                }
                else
                {
                    xCoordinate=game.yLineSize*(y-(battle.BS.xSize-1-x)/2);
                    yCoordinate=game.xLineSize*x*0.75;
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
                    case 5:
                        cell=game.tiles.create(xCoordinate,yCoordinate,'Ruin');
                        break;
                    case 0:
                        cell=game.tiles.create(xCoordinate,yCoordinate,'Unreached');
                        break;
                    default:
                        cell=game.tiles.create(xCoordinate,yCoordinate,'Offset');
                        break;
                }
                context.xCoordinate=xCoordinate;
                context.yCoordinate=yCoordinate;
                context.cell=cell;
                context.x=x;
                context.y=y;
                if((point == 1) || (point == 2))
                {
                    var f=addPart.bind(context);
                    f();
                }

            }
        }
    }
}
/**
 * Template always after all other code
 */
Deps.autorun(function()
{
    Meteor.subscribe('battles');
    battle=battles.findOne({});

    //In first time battle is undefined
    if(battle)
    {
        switch(game.side)
        {
            case 1:
                game.curState=battle.state1;
                break;
            case 2:
                game.curState=battle.state2;
                break;
        }
        if(battle.state1 == "ready" && battle.state2 == "ready")
        {
            //after it all dead, so we need fully render again
            game.state.start('battle');
            game.curState='battle';
        }
    }
    _turnDep.changed();
});