/**
 * Created by Alecxandrys on 13.11.2015.
 */
/**
 * control the correct and ability for turn
 * must return a boolean, or some result of dice
 */
import {RunCircle} from "./TurnOrder"

Meteor.methods({
    /**
     *
     * @param id is the same in battle and in battles collection
     * @param player 1 or 2 player in battle
     * @param card id of card in player's deck
     * @param column x position
     * @param row y position
     * @return {boolean}
     */
    SetPosition:function(id,player,card,column,row)
    {
        new SimpleSchema({
            _id:{type:String},
            player:{type:Number,min:1,max:2},
            card:{type:Number},
            column:{type:Number,min:0},
            row:{type:Number,min:0}
        }).validate({_id:id,player:player,card:card,column:column,row:row});

        var deck;
        var deckName;
        var BS=battles.findOne({_id:id}).BS;

        if(player == 1)
        {
            deckName='deck1';
            if(row>1)
            {return false;}
        }
        else
        {
            deckName='deck2';
            if(row<(BS.xSize-2))
            {return false;}
        }

        deck=BS[deckName];
        deck[card].column=column;
        deck[card].row=row;
        deck[card].placed=true;
        if(player == 1)
        {
            battles.update(id,{$set:{'BS.deck1':deck}});
            return true;
        }
        else
        {
            battles.update(id,{$set:{'BS.deck2':deck}});
            return true;
        }
    },
    Status_ready:function(_id,player)
    {
        new SimpleSchema({
            _id:{type:String},
            player:{type:Number,min:1,max:2}
        }).validate({_id:_id,player:player});

        switch(player)
        {
            case 1:
            {
                battles.update(_id,{$set:{state1:"ready"}});
                break;
            }
            case 2:
            {
                battles.update(_id,{$set:{state2:"ready"}});
                break;
            }
        }
        var battle=battles.findOne({_id:_id});

        if(battle.state1 == "ready" && battle.state2 == "ready")
        {
            var orderLine=RunCircle(battle.BS.orderLine);//start ATB-circle
            battles.update(_id,{$set:{'BS.orderLine':orderLine}});
            battles.update(_id,{$set:{state1:"battle"}});
            battles.update(_id,{$set:{state2:"battle"}});
        }

    },
    ActionOn:function(who,target)
    {

    },
    /**
     * @return {string}
     */
    MoveTo:function(who,whither)
    {
        var userID=Meteor.userId();//use id from caller, so used to understand who
        var BS=battles.findOne({$or:[{ID1:userID},{ID2:userID}]}).BS;//check battle
        if(BS == null || BS == undefined)
        {
            var order=BS.orderLine[0];//possibility
            if(order.deck == who.deck && order.index == who.index)//check order line
            {
                if(!order.canMove)//stationary
                {
                    throw new Meteor.Error('immovable','This model can\'t move');
                }
                var model=BS[who.deck][who.index];
                var resultPF=PathFinder.FindPath(model.row,model.column,whither.row,whither.column,BS);
                if(resultPF.success)//unreachable
                {
                    if(resultPF.route.length<=WalkDistance(order,model))//walk/run distance check
                    {
                        order.snapshoot=false;
                    }
                    else if(resultPF.route.length<=RunDistance(order,model))
                    {
                        order.snapshoot=true;
                        order.charge=false;
                    }
                    else
                    {
                        return "Distance too long";
                    }
                    //Save new position in battle
                    model.row=whither.row;
                    model.column=whither.column;
                    order.move=false;
                    order.curATB=order.curATB-resultPF.cost;//new curATB
                    BS.orderLine[0]=order;
                    BS.orderLine=RunCircle(BS.orderLine);
                    BS[who.deck][who.index]=model;
                    battles.update(id,{$set:{'BS':BS}});
                    return "Successes"
                }
                else
                {
                    return "Target unreachable";
                }
            }
            else
            {
                throw new Meteor.Error('order_error','Another model turning now');
            }

        }
        else
        {
            throw new Meteor.Error("battle_exist_error","Battle with you userID don't exist");
        }
    },
    /**
     * @return {boolean}
     */
    PlacedAll:function(id,player)
    {
        var BS=battles.findOne({_id:id}).BS;
        var deckName;
        if(player == 1)
        {
            deckName='deck1';
        }
        else
        {
            deckName='deck2';
        }
        var placed=true;
        BS[deckName].every(function(unit)
        {
            if(!unit.placed)
            {
                placed=false;
                return false;
            }
        });
        return placed;
    },
    /**
     * player with this ID lose battle
     * @return {boolean}
     */
    LeaveBattle:function(id,playerID)
    {
        var battle=battles.findOne({_id:id});
        if(!battle)
        {return false;}
        //increment count of battle
        Meteor.users.update(battle.ID1,{$inc:{gameCount:1}});
        Meteor.users.update(battle.ID2,{$inc:{gameCount:1}});
        //change ELO
        var rateELO1=Meteor.users.findOne(battle.ID1).rateELO;
        var rateELO2=Meteor.users.findOne(battle.ID2).rateELO;
        var K=20;//special rate, see ELO formula for detail
        var E=1/(1+Math.pow(10,Math.abs((rateELO1-rateELO2)/400)));
        var newRate;
        //increment for winner count of wins and set new rateELO
        switch(playerID)
        {
            case battle.ID2:
            {
                newRate=rateELO1+K*(1-E);
                if(newRate<0)
                {newRate=0;}
                Meteor.users.update(battle.ID1,{$inc:{gameWinCount:1},$set:{rateELO:newRate}});
                newRate=rateELO2+K*(0-E);
                Meteor.users.update(battle.ID2,{$set:{rateELO:newRate}});
                break;
            }
            case battle.ID1:
            {
                newRate=rateELO2+K*(1-E);
                if(newRate<0)
                {newRate=0;}
                Meteor.users.update(battle.ID2,{$inc:{gameWinCount:1},$set:{rateELO:newRate}});
                newRate=rateELO1+K*(0-E);
                Meteor.users.update(battle.ID1,{$set:{rateELO:newRate}});
                break;
            }
            default:
            {return false;}
        }
        //end this battle
        battles.remove({_id:id});
        return true;
    }
});
/**
 * very hard realisation
 * @return {number}
 */
function WalkDistance(order,model)
{
    return 6*order.move;
}
/**
 * very hard realisation
 * @return {number}
 */
function RunDistance(order,model)
{
    return 6*order.move+6*order.canRun;
}
/**
 * Because need in MoveTo and ActionOn this is outside function to reuse code
 * @param order
 * @returns {*}
 * @constructor
 */
