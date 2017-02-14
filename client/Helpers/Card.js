/**
 * Created by Alecxandrys on 29.04.2016.
 */
/**
 * Card template
 */
Meteor.subscribe("userData");
var Deck={
    _unit:[],
    _unitDepend:new Tracker.Dependency(),
    cost:0,
    getUnit:function()
    {
        this._unitDepend.depend();
        return this._unit;
    },
    setUnit:function(Unit)
    {
        this._unit.push(Unit);
        this._unitDepend.changed();
    },
    erase:function()
    {
        this._unit=[];
        this._unitDepend.changed();
    },
    setCost:function(cost)
    {
        this.cost=cost;
    },
    getCost:function()
    {
        this._unitDepend.depend();
        var res=this.getUnit();
        var cost=0;
        for(var card of res)
        {
            cost=cost+card.cost;
            if(card.meleeWeapon)
            {
                cost=cost+card.meleeWeapon.cost;
            }
            if(card.rangeWeapon)
            {
                cost=cost+card.rangeWeapon.cost;
            }
        }
        this.setCost(cost);
        return cost;
    }
};
var Card={
    _card:null,
    _cardDepend:new Tracker.Dependency(),
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
    },
    addMeleeWeapon:function(id)
    {
        if(Card._card.availableWeapon[id].oneHanded == true && (Card._card.rangeWeapon == null || Card._card.rangeWeapon.oneHanded == true))
        {
            Card._card.meleeWeapon=Card._card.availableWeapon[id];
        }
        else if(Card._card.availableWeapon[id].oneHanded == false && Card._card.rangeWeapon == null)
        {
            Card._card.meleeWeapon=Card._card.availableWeapon[id];
        }
        this._cardDepend.changed();
    },
    addRangeWeapon:function(id)
    {
        if(Card._card.availableWeapon[id].oneHanded == true && (Card._card.meleeWeapon == null || Card._card.meleeWeapon.oneHanded == true))
        {
            Card._card.rangeWeapon=Card._card.availableWeapon[id];
        }
        else if(Card._card.availableWeapon[id].oneHanded == false && Card._card.meleeWeapon == null)
        {
            Card._card.rangeWeapon=Card._card.availableWeapon[id];
        }
        this._cardDepend.changed();
    },
    removeMeleeWeapon:function()
    {
        Card._card.meleeWeapon=null
        this._cardDepend.changed();
    },
    removeRangeWeapon:function()
    {
        Card._card.rangeWeapon=null
        this._cardDepend.changed();
    },
    getCost:function()
    {
        this._cardDepend.depend();
        var cost=this._card.cost;
        if(this._card.meleeWeapon)
        {
            cost=cost+this._card.meleeWeapon.cost;
        }
        if(this._card.rangeWeapon)
        {
            cost=cost+this._card.rangeWeapon.cost;
        }
        return cost;
    }
};
Template.Card.helpers({
    cards:function()
    {
        return SpaceMarineForce;
    },
    deck:function()
    {
        return Deck.getUnit();
    },
    card:function()
    {
        return Card.getCard();
    },
    unitCost:function()
    {
        return Card.getCost();
    },
    deckCost:function()
    {
        return Deck.getCost();
    }
});
Template.Card.events({
    "dblclick .meleeWeapon":function(event)
    {
        event.preventDefault();
        Card.removeMeleeWeapon();
    },
    "dblclick .rangeWeapon":function(event)
    {
        event.preventDefault();
        Card.removeRangeWeapon();
    },
    "dblclick .availableWeapon":function(event)
    {
        event.preventDefault();
        var id=parseInt($(event.currentTarget)
            .children('a')
            .text());
        if(this.type == 'Ranged')
        {
            Card.addRangeWeapon(id);
        }
        else
        {
            Card.addMeleeWeapon(id);
        }
    },
    "dblclick .card":function(event)
    {
        event.preventDefault();
        var id=parseInt($(event.currentTarget)
            .children('a')
            .text());
        Card.setCard(SpaceMarineForce[id]);
        //this is id in array of unit, which was dbcliked just right now
    },
    "click #clear":function()
    {
        Deck.erase();
    },
    "click #ready":function()
    {
        if(Deck._unit.length === 0)
        {
            alert("Deck is empty, you cannot join in battle");
        }
        else if(Deck._unit.length>20)
        {
            alert("deck is too large, erase some squad");
        }
        else
        {
            Meteor.call("addPlayerInQueue",Deck._unit);
            Router.go('/wait');
        }
    },
    "click #add":function()
    {
        Deck.setUnit(Card.getCard());
    },
    "click #remove":function()
    {
        Card.erase();
    }
});
