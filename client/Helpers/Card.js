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
var Card={
    _card:null,
    _cardDepend: new Tracker.Dependency(),
    getCard:function()
    {
        this._cardDepend.depend();
        return this._card
    },
    setCard:function(Unit)
    {
        this._card=Unit;
        this._cardDepend.changed();
    },
    erase:function()
    {
        this._card=null;
        this._cardDepend.changed();
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
        },
    card: function()
    {
        return Card.getCard();
    },
    availableWeapon:function()
    {
        return Card.getCard().availableWeapon;
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
            Card.setCard(SpaceMarineForce[id]);
            //Deck.setUnit(SpaceMarineForce[id]);
            //this is id in array of unit, which was dbcliked just right now
        },
    "click #clear"  : function()
        {
            Deck.erase();
        },
    //TODO:finish work, add price of squad
    "click #ready"  : function()
        {
            if(Deck._unit.length === 0)
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
        },
    "click #add"  : function()
    {
        Deck.setUnit(Card.getCard());
    },
    "click #remove"  : function()
    {
        Card.erase();
    }
});
