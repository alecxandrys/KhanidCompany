/**
 * Main for 'main','Card','News','PrivateOffice'
 */

Meteor.subscribe("userData");
Meteor.user();
var Deck = {
    _unit      : [],
    _unitDepend: new Tracker.Dependency(),
    getUnit: function()
        {
            this._unitDepend.depend();
            return this._unit;
        },
    setUnit: function(Unit)
        {
            this._unit.push(Unit);
            this._unitDepend.changed();
        },
    erase  : function()
        {
            this._unit = [];
            this._unitDepend.changed();
        }
};
Template.Main.helpers({
    /**
     * @return {string}
     */
    Message: function()
        {
            if(!Meteor.userId() && Router.current().route.getName() !== undefined)
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
    cards: function()
        {
            return SpaceMarineForce;
        },
    deck : function()
        {
            return Deck.getUnit();
        }
});
Template.Card.events({
    "click .card"   : function(event)
        {
            event.preventDefault();
            var id = parseInt($(event.currentTarget).children('a').text());
            //this is id in array of unit, which was cliked just right now
        },
    "dblclick .card": function(event)
        {
            event.preventDefault();
            var id = parseInt($(event.currentTarget).children('a').text());
            Deck.setUnit(SpaceMarineForce[id]);
            //this is id in array of unit, which was dbcliked just right now
        },
    "click .clear"  : function()
        {
            Deck.erase();
        },
    "click .ready"  : function()
        {
            if(Deck._unit.length === 0)
                {
                    alert("Deck is empty, you cannot join in battle");
                }
            else
                {
                    Meteor.call("addPlayerInQueue");
                    Router.go('/wait');
                }
        }
});
