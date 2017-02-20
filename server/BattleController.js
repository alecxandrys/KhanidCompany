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
        var BS=battles.findOne({}).BS;

        if(player == 1)
        {
            deckName='deck1';
            if (row>1) {return false;}
        }
        else
        {
            deckName='deck2';
            if (row<(BS.xSize-2)) {return false;}
        }

        deck=BS[deckName];
        deck[card].column=column;
        deck[card].row=row;
        deck[card].placed=true;
        if(player == 1)
        {battles.update(id,{$set:{'BS.deck1':deck}});return true;}
        else
        {battles.update(id,{$set:{'BS.deck2':deck}});return true;}
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
        var battle=battles.findOne({});

        if (battle.state1=="ready" && battle.state2=="ready")
        {
            var orderLine=RunCircle(battle.BS.orderLine);
            battles.update(_id,{$set:{'BS.orderLine':orderLine}});
            battles.update(_id,{$set:{state1:"battle"}});
            battles.update(_id,{$set:{state2:"battle"}});
        }

    },
    ClickOnSquad:function()
    {

    },
    MoveTo:function()
    {

    },
    /**
     * @return {boolean}
     */
    PlacedAll:function(id,player)
    {
        var BS=battles.findOne({}).BS;
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
        BS[deckName].every(function (unit){
            if (!unit.placed)
            {
                placed=false;
                return false;
            }
        });
        return placed;
    }
});