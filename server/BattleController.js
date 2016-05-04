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
                column:{type:Number,min:0,max:20},
                row:{type:Number,min:0,max:12}
            }).validate({_id:_id,player:player,card:card,column:column,row:row});

            var deck;
            if (player==1)
                {
                   // console.log('update done player1'+card);
                    deck=battles.findOne({}).BS.deck1;
                    deck[card].column=column;
                    deck[card].row=row;
                    deck[card].placed=true;
                    battles.update(_id,{$set:{'BS.deck1':deck}});
                }
            if (player==2)
                {
                    //console.log('update done player2'+card);
                    deck=battles.findOne({}).BS.deck2;
                    deck[card].column=column;
                    deck[card].row=row;
                    deck[card].placed=true;
                    battles.update(_id,{$set:{'BS.deck2':deck}});
                }
        }
});