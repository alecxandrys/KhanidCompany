/**
 * Created by Alecxandrys on 07.10.2015.
 */
Meteor.subscribe("userData");
Template.main.helpers({
    /**
     * @return {string}
     */
    Message:function()
{
    if (!Meteor.userId() && Router.current().route.getName()!==undefined)
    {
        return "You are not auth to visit this page";

    }
    else
    {
        return "Welcome to WCG40k Khanid Company";
    }
}
});
Template.Card.helpers({
    cards:function(){
        return SpaceMarineForce;
    }
});
Template.Card.events({
    "click .card":function(event) {
       var id=parseInt($(event.currentTarget).children('a').text());
        //this is id in array of unit, which was cliked just right now
    },
    "dbclick .card":function(event) {
        var id=parseInt($(event.currentTarget).children('a').text());
        //this is id in array of unit, which was cliked just right now
    }

});
Accounts.ui.config({

    passwordSignupFields:  'USERNAME_ONLY'
});