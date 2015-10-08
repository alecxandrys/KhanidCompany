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
        var x=event.currentTarget;
        alert("i can catch");
    }
});