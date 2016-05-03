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
     * @param xCoordinate
     * @param yCoordinate
     */
    setPosition: function(_id,player, card, xCoordinate, yCoordinate)
        {
            new SimpleSchema({
                _id:{type:String},
                player:{type:Number,max:2,min:2},
                card:{type:Number},
                xCoordinate:{type:Number,min:0,max:20},
                yCoordinate:{type:Number,min:0,max:12}
            }).validate(_id,player,card,xCoordinate,yCoordinate);

            if (player==1)
                {
                    battles.update(_id,{});
                }
            if (player==2)
                {
                    battles.update(_id,{});
                }
        }
});