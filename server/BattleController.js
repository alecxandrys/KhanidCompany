/**
 * Created by Alecxandrys on 13.11.2015.
 */
/**
 * control the correct and ability for turn
 * must return a boolean, or some result of dice
 */
Meteor.methods({
    /**
     *
     * @param _id is the same in battle and in battles collection
     * @param player 1 or 2 player in battle
     * @param card id of card in player's deck
     * @param column x position
     * @param row y position
     */
    setPosition: function(_id,player, card, column, row)
        {
            new SimpleSchema({
                _id:{type:String},
                player:{type:Number,min:1,max:2},
                card:{type:Number},
                column:{type:Number,min:0,max:19},
                row:{type:Number,min:0,max:11}
            }).validate({_id:_id,player:player,card:card,column:column,row:row});

            var deck;
            var deckName;
            if (player==1)
                {deckName='deck1';}
            else
                {deckName='deck2';}

            deck=battles.findOne({}).BS[deckName];

            deck[card].column=column;
            deck[card].row=row;
            deck[card].placed=true;
             if (player==1)
                 {battles.update(_id,{$set:{'BS.deck1':deck}});}
            else
                 {battles.update(_id,{$set:{'BS.deck2':deck}});}

        },
    Status_ready:function(_id,player)
        {
            new SimpleSchema({
                _id:{type:String},
                player:{type:Number,min:1,max:2}
            }).validate({_id:_id,player:player});

            switch(player)
            {
                case 1:{battles.update(_id,{$set:{state1:"ready"}});break;}
                case 2:{battles.update(_id,{$set:{state2:"ready"}});break;}
                default:{}
            }

        }
});