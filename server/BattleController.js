/**
 * Created by Alecxandrys on 13.11.2015.
 */
/**
 * control the correct and ability for turn
 * must return a boolean, or some result of dice
 * ALL TWICE CALLING MAY BE FIXED BY METEOR.APPLY
 * SPLICE return
 * when server work over 30s by default client just call method second time, but you can stay in debug
 */
import {RunCircle} from "./TurnOrder"

function MoveToPosition(model,whither,BS,who,id)
{
    model.row=whither.row;
    model.column=whither.column;
    BS[who.deck][who.index]=model;
    battles.update(id,{$set:{'BS':BS}});
}
function CheckCircle(battle)
{
    let test=battle.BS.deck1.some(function(elem)
    {
        return elem.placed == true
    });
    if(test)//in first deck all dead
    {
        Meteor.call("LeaveBattle",battle._id,battle.ID1);
    }
    test=battle.BS.deck2.some(function(elem)
    {
        return elem.placed == true
    });
    if(test)//in first deck all dead
    {
        Meteor.call("LeaveBattle",battle._id,battle.ID2);
    }
    if(battle.BS.orderLine[0].lockInCombat.length != 0)//check XtX combat for next unit
    {
        battle.BS.orderLine[0].move=false;
        battle.BS.orderLine[0].shoot=false;
        battle.BS.orderLine[0].charge=false;
        battles.update(battle._id,{$set:{'BS':battle.BS}});//set update
    }
}
/**
 * TODO save result, check if section
 * @return {string}
 */
function CalculateResult(who,model,whom,target,order,BS)
{
    let result=attackSignature(model,target,order,'melee');//only one side
    order.move=false;
    order.curATB=0;
    if(result.sucesses == false)//no result
    {
        order.lockInCombat.push(whom);//model lock in combat with target now
        BS.orderLine[BS.orderLine.find((elem,index) =>
        {
            if(elem.deck == whom.deck && elem.index == whom.index)
            {return index}
        })].lockInCombat.push(who);//target lock in combat with model now

        BS.orderLine[0]=order;
        BS.orderLine=RunCircle(BS.orderLine);
        return "Charge did not bring results"
    }
    else if(target.placed)//survive
    {
        order.lockInCombat.push(whom);//model lock in combat with target now
        BS.orderLine[BS.orderLine.find((elem,index) =>
        {
            if(elem.deck == whom.deck && elem.index == whom.index)
            {return index}
        })].lockInCombat.push(who);//target lock in combat with model now
        BS.orderLine[0]=order;
    }
    else//target killed
    {
        BS.orderLine.splice(BS.orderLine.find((elem,index) =>
        {
            if(elem.deck == whom.deck && elem.index == whom.index)
            {return index}
        }),1);//remove target
        BS.orderLine.forEach((elem,index,array) =>
        {
            elem.find((elem,ind) =>
            {
                if(elem.deck == whom.deck && elem.index == whom.index)
                {array[index].splice(ind,1)}
            });
        })
    }
    BS.orderLine=RunCircle(BS.orderLine);
    BS[who.deck][who.index]=model;
    BS[whom.deck][whom.index]=target;
    battles.update(id,{$set:{'BS':BS}});
    CheckCircle(battle);
    return "Success"
}
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

        let deck;
        let deckName;
        let BS=battles.findOne({_id:id}).BS;

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
        let battle=battles.findOne({_id:_id});

        if(battle.state1 == "ready" && battle.state2 == "ready")
        {
            let orderLine=RunCircle(battle.BS.orderLine);//start ATB-circle
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
        //Array.isArray(obj)-is this object array or not for multiple target
        let userID=Meteor.userId();//use id from caller, so used to understand who
        let battle=battles.findOne({$or:[{ID1:userID},{ID2:userID}]});
        let id=battle._id;
        let BS=battle.BS;//check battle
        if(BS != null || BS != undefined)
        {
            let order=BS.orderLine[0];//possibility
            if(order.deck == who.deck && order.index == who.index || overwatch)//check order line
            {
                let model=BS[who.deck][who.index];
                let target=BS[whom.deck][whom.index];
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
                                    let resultLOS=PathFinder.LOS(model.row,model.column,target.row,target.column,battle.BS);//check LOS
                                    if(resultLOS.message != 'Success')
                                    {
                                        return resultLOS.message;
                                    }
                                    else
                                    {
                                        if(model.rangeWeapon.range>=(resultLOS.route.length-1))//check distance (-1 for start point in route). Last check for possibility
                                        {
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
                                            BS[who.deck][who.index]=model;
                                            BS[whom.deck][whom.index]=target;
                                            battles.update(id,{$set:{'BS':BS}});
                                            if(result.sucesses == false)
                                            {
                                                return "Shooting did not bring results"
                                            }
                                            else if(target.placed)//survive
                                            {
                                                CheckCircle(battle);
                                                return "Success"
                                            }
                                            else//killed
                                            {
                                                BS.orderLine.splice(BS.orderLine.find((elem,index) =>
                                                {
                                                    if(elem.deck == whom.deck && elem.index == whom.index)
                                                    {return index}
                                                }),1);//remove target
                                                CheckCircle(battle);
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
                                let resultLOS=PathFinder.LOS(model.row,model.column,target.row,target.column,battle.BS);
                                if(resultLOS.route.length-1>12)
                                {
                                    throw new Meteor.Error("Charge_too_far",'');
                                }
                                //Overwatch?
                                //impossible to make it (BS was changed and saved in MoveTo)
                                //let overwatch=this.ActionOn(target,model,'range',true);//Guide said that that correct for server side. Meteor.call used only for client side
                                model=BS[who.deck][who.index];//update data
                                target=BS[whom.deck][whom.index];
                                if(model.placed)
                                {
                                    if(order.walkDistance+chargeDistance>=resultLOS.route.length-1)//usually successful charge
                                    {
                                        MoveToPosition(model,{
                                            row:resultLOS.route[resultLOS.route.length-2].x,
                                            column:resultLOS.route[resultLOS.route.length-2].y
                                        },BS,who,id);//move to cell before last (target whither stay target)

                                        if((target.toughness-(model.meleeWeapon.strength+model.strength)>3))//weak check
                                        {
                                            return "You weapon too weak to wounded target"
                                        }
                                        /**
                                         * check initiative
                                         * check raise up model and data update from method
                                         */
                                        let res=CalculateResult(who,model,whom,target,order,BS);
                                        return res;
                                    }
                                    else
                                    {
                                        MoveToPosition(model,{
                                            row:resultLOS.route[order.walkDistance].x,
                                            column:resultLOS.route[order.walkDistance].y
                                        },BS,who,id);//move to cell before last (target whither stay target
                                        order.curATB=0;//new curATB
                                        BS.orderLine[0]=order;
                                        BS.orderLine=RunCircle(BS.orderLine);
                                        BS[who.deck][who.index]=model;
                                        battles.update(id,{$set:{'BS':BS}});
                                        return "You unsuccessfully try to charge on "+(order.walkDistance+chargeDistance)+", but distance is "+(resultLOS.route.length-1);
                                    }
                                }
                                else
                                {
                                    BS.orderLine.shift();//remove model from orderLine
                                    battles.update(id,{$set:{'BS':BS}});
                                    CheckCircle(battle);
                                    return 'You model was killed by overwatch'
                                }
                            }
                            else
                            {
                                return 'You can\'t charge your model';
                            }
                        }
                        else if(order.lockInCombat != 0)//another round of XtX combat
                        {
                            let enemyIndex=order.lockInCombat.find((elem,index) =>
                            {
                                if(elem.deck == whom.deck && elem.index == whom.index)
                                {return index}
                            });
                            if(enemyIndex != undefined)//model continue the fight with target already locked in this combat
                            {
                                let res=CalculateResult(who,model,whom,target,order,BS);
                                return res;
                            }
                            else
                            {
                                return "You already in close combat and can't charge another target";
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
     * LOS-check distance
     * @return {string}
     */
    MoveTo:function(who,whither)
    {
        let userID=Meteor.userId();//use id from caller, so used to understand who
        let battle=battles.findOne({$or:[{ID1:userID},{ID2:userID}]});
        let id=battle._id;
        let BS=battle.BS;//check battle
        if(BS != null || BS != undefined)
        {
            let order=BS.orderLine[0];//possibility
            if(order.deck == who.deck && order.index == who.index)//check order line
            {
                if(!order.canMove)//stationary
                {
                    throw new Meteor.Error('immovable','This model can\'t move');
                }
                let model=BS[who.deck][who.index];
                let resultPF=PathFinder.FindPath(model.row,model.column,whither.row,whither.column,BS);//work fine, can see PathFinder in lib
                let resultLOS=PathFinder.LOS(model.row,model.column,whither.row,whither.column,BS);//to check shortest way
                if(resultPF.success)//unreachable
                {
                    if(resultLOS.route.length == 1)
                    {
                        return "You already in final point";
                    }
                    else if(resultLOS.route.length<=(order.walkDistance+1))//walk/run distance check
                    {
                        order.snapshoot=false;
                        if(resultPF.route.length>(order.walkDistance+1))
                        {
                            order.curATB=order.curATB-resultLOS.cost;//new curATB
                        }
                        else
                        {
                            order.curATB=order.curATB-resultPF.cost;
                        }
                    }
                    else if(resultLOS.route.length<=(order.walkDistance+order.runDistance+1))
                    {
                        order.snapshoot=true;
                        order.charge=false;
                        if(resultPF.route.length>(order.walkDistance+order.runDistance+1))
                        {
                            order.curATB=order.curATB-resultLOS.cost;//new curATB
                        }
                        else
                        {
                            order.curATB=order.curATB-resultPF.cost;
                        }
                    }
                    else
                    {
                        return "Distance too long";
                    }

                    order.move=false;
                    BS.orderLine[0]=order;
                    BS.orderLine=RunCircle(BS.orderLine);
                    //Save new position in battle
                    MoveToPosition(model,whither,BS,who,id);
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
        let BS=battles.findOne({_id:id}).BS;
        let deckName;
        if(player == 1)
        {
            deckName='deck1';
        }
        else
        {
            deckName='deck2';
        }
        let placed=true;
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
        let battle=battles.findOne({_id:id});
        if(!battle)
        {return false;}
        //increment count of battle
        Meteor.users.update(battle.ID1,{$inc:{gameCount:1}});
        Meteor.users.update(battle.ID2,{$inc:{gameCount:1}});
        //change ELO
        let rateELO1=Meteor.users.findOne(battle.ID1).rateELO;
        let rateELO2=Meteor.users.findOne(battle.ID2).rateELO;
        let K=20;//special rate, see ELO formula for detail
        let E=1/(1+Math.pow(10,Math.abs((rateELO1-rateELO2)/400)));
        let newRate;
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
