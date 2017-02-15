/**
 * Created by Alecxandrys on 23.10.2015.
 */

// Only publish tasks that are public or belong to the current user
Meteor.publish("userData",function()
{
    if(this.userId)
    {
        return Meteor.users.find({_id:this.userId},{
            fields:{
                createdAt:1,rateELO:1,rateCombine:1,battleCount:1,winPercent:1
            }
        });
    }
    else
    {
        this.ready();
    }
});
Meteor.publish('readyPlayers',function()
{
    if(this.userId)
    {
        return readyPlayers.find({},{fields:{username:1,rate:1}});
    }
});
/**
 * Check name1 equal or name2 equal to update date and check ready status of field and battle controller
 * Just need to use x.username, not a x
 */
Meteor.publish('battles',function()
{
    if(this.userId)
    {
        var x=Meteor.users.findOne({});
        return battles.find({$or:[{name1:x.username},{name2:x.username}]},{
            fields:{
                name1:1,state1:1,name2:1,state2:1,battleID:1,BS:1,TurnOrder:1
            }
        });
    }
});
Accounts.onCreateUser(function(options,user)
{
    if(!options || !user)
    {
        console.log('error creating user');
        return;
    }
    else
    {
        if(options.profile)
        {
            user.profile=options.profile;
        }
        user.rateELO=100;
        user.rateCombine=1;
        user.battleCount=0;
        user.winPercent=0.00;
    }
    return user;
});
