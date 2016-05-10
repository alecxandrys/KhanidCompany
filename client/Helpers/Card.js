/**
 * Created by Alecxandrys on 29.04.2016.
 */
/**
 * Card template
 */
Meteor.subscribe("userData");
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
            Meteor.call('call test');
            //Deck.erase();
        },
    //TODO:finish work, add price of squad
    "click .ready"  : function()
        {
            Meteor.call('call test2');
           /* if(Deck._unit.length === 0)
                {
                    alert("Deck is empty, you cannot join in battle");
                }
            else if (Deck._unit.length>20)
                {
                    alert("deck is too large, erase some squad");
                }
            else
                {
                    Meteor.call("addPlayerInQueue",Deck._unit);
                    Router.go('/wait');
                }
                */
        }
});
