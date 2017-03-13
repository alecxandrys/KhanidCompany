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
    /**
     * @return {string}
     */
    ActionOn:function(who,whom,type,overwatch)
    {
        //Array.isArray(obj)-is this object array or mot
        var userID=Meteor.userId();//use id from caller, so used to understand who
        var battle=battles.findOne({$or:[{ID1:userID},{ID2:userID}]});
        var id=battle._id;
        var BS=battle.BS;//check battle
        if(BS != null || BS != undefined)
        {
            var order=BS.orderLine[0];//possibility
            if(order.deck == who.deck && order.index == who.index || overwatch)//check order line
            {
                var model=BS[who.deck][who.index];
                var target=BS[whom.deck][whom.index];
                switch(type)
                {
                    case 'range':
                    {
                        if(who.deck != whom.deck)
                        {
                            if(order.shoot)//can shot now?
                            {
                                if(model.rangeWeapon)//have weapon?
                                {
                                    var resultLOS=PathFinder.LOS(model.row,model.column,target.row,target.column,battle.BS);//check LOS
                                    if(resultLOS.message != 'Success')
                                    {
                                        return "LOS isn't exist, you can't fire";
                                    }
                                    else
                                    {
                                        if(model.rangeWeapon>=(resultLOS.route-1))//check distance (-1 for start point in route). Last check for possibility
                                        {
                                            let rules=[];

                                            if((target.toughness-model.rangeWeapon.strength)>3)//weak check
                                            {
                                                return "You weapon too weak to wounded target"
                                            }

                                            let result=attackSignature(model,target,order,'range');
                                            /**
                                             * this is right all this transfer to attackSignature
                                             */
                                            order.move=false;
                                            order.curATB=0;
                                            BS.orderLine[0]=order;
                                            BS.orderLine=RunCircle(BS.orderLine);
                                            if(result.sucesses == false)
                                            {
                                                return "Shooting did not bring results"
                                            }
                                            else
                                            {
                                                BS[who.deck][who.index]=model;
                                                BS[whom.deck][whom.index]=target;
                                                battles.update(id,{$set:{'BS':BS}});
                                                //check the end of battle
                                                return "Success"
                                            }
                                        }
                                        else
                                        {
                                            return "Target too far for you weapon";
                                        }
                                    }

                                }
                                else
                                {
                                    return "You don't have ranged weapon";
                                }
                            }
                            else
                            {
                                return "You can't shoot now";
                            }
                        }
                        else
                        {
                            return 'You can\'t shoot in your model';
                        }
                        break;
                    }
                    case 'charge':
                    {
                        if(order.charge)//can charge now? All model can fight in melee combat, if they don't have ccw, use basic profile(S:user; AP:-)
                        {
                            if(who.deck != whom.deck)
                            {
                                let chargeDistance=Math.floor(Math.random()*(6-1+1))+1;//2D6 on charge by default, by my rules only 1D6
                                let resultPF=PathFinder.FindPath(model.row,model.column,target.row,target.column,battle.BS);
                                let moveTo;
                                //Overwatch?
                                moveTo=Meteor.call("MoveTo",model,resultPF.route[WalkDistance(order,model)]);
                                let overwatch=Meteor.call('ActionOn',target,model,'range',true);
                                model=BS[who.deck][who.index];//update data
                                target=BS[whom.deck][whom.index];
                                if (model.isPlaced)
                                {
                                    if(WalkDistance(order,model)+chargeDistance>=resultPF.route.length-1)//usually successful charge
                                    {
                                        moveTo=Meteor.call("MoveTo",model,resultPF.route[resultPF.route.length-2]);//move to cell before last (target whither stay target

                                        let rules=[];

                                        if((target.toughness-(model.meleeWeapon.strength+model.strength)>3))//weak check
                                        {
                                            return "You weapon too weak to wounded target"
                                        }

                                        let result=attackSignature(model,target,order,'melee');//only one side
                                        /**
                                         * this is right all this transfer to attackSignature
                                         */
                                        order.move=false;
                                        order.curATB=0;
                                        BS.orderLine[0]=order;
                                        BS.orderLine=RunCircle(BS.orderLine);
                                        if(result.sucesses == false)
                                        {
                                            return "Charge did not bring results"
                                        }
                                        else
                                        {
                                            BS[who.deck][who.index]=model;
                                            BS[whom.deck][whom.index]=target;
                                            battles.update(id,{$set:{'BS':BS}});
                                            //check the end of battle
                                            return "Success"
                                        }

                                    }
                                    else
                                    {
                                        //move to last point of walk
                                        if(moveTo)
                                        {
                                            order.curATB=0;//new curATB
                                            BS.orderLine[0]=order;
                                            BS.orderLine=RunCircle(BS.orderLine);
                                            BS[who.deck][who.index]=model;
                                            battles.update(id,{$set:{'BS':BS}});
                                        }
                                        return "You unsuccessfully try to charge on "+(WalkDistance(order,model)+chargeDistance)+", but distance is "+(resultPF.route.length-1);
                                    }
                                }
                                else
                                {
                                    //check the end of battle
                                    return 'You model was killed by overwatch'
                                }

                            }
                            else
                            {
                                return 'You can\'t charge your model';
                            }

                        }
                        else
                        {
                            return "You can't charge now";
                        }
                        break;
                    }
                    default:
                    {throw new Meteor.Error('type_unidentified','type of activity isn\'t implemented');}
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
     * @return {string}
     */
    MoveTo:function(who,whither)
    {
        var userID=Meteor.userId();//use id from caller, so used to understand who
        var battle=battles.findOne({$or:[{ID1:userID},{ID2:userID}]});
        var id=battle._id;
        var BS=battle.BS;//check battle
        if(BS != null || BS != undefined)
        {
            var order=BS.orderLine[0];//possibility
            if(order.deck == who.deck && order.index == who.index)//check order line
            {
                if(!order.canMove)//stationary
                {
                    throw new Meteor.Error('immovable','This model can\'t move');
                }
                var model=BS[who.deck][who.index];
                var resultPF=PathFinder.FindPath(model.row,model.column,whither.row,whither.column,BS);//work fine, can see PathFinder in lib
                if(resultPF.success)//unreachable
                {
                    if(resultPF.route.length == 1)
                    {
                        return "You already in final point";
                    }
                    else if(resultPF.route.length<=WalkDistance(order,model))//walk/run distance check
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
    return 6*order.move+1;//1 by start point in path
}
/**
 * very hard realisation
 * @return {number}
 */
function RunDistance(order,model)
{
    return 6*order.move+6*order.canRun+1;//1 by start point in path
}
/**
 * Because need in MoveTo and ActionOn this is outside function to reuse code
 * @param order
 * @returns {*}
 * @constructor
 */
