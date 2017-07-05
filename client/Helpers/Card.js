/**
 * Created by Alecxandrys on 29.04.2016.
 */
/**
 * Card template
 */
Meteor.subscribe("userData");
Deck={
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
        let res=this.getUnit();
        let cost=0;
        for(let card of res)
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
Card={
    _card:null,
    _cardDepend:new Tracker.Dependency(),
    getCard:function()
    {
        this._cardDepend.depend();
        return this._card
    },
    setCard:function(Unit)
    {
        this._card=JSON.parse(JSON.stringify(Unit));//full copy from force's array
        for(let i=this._card.weaponCount; i>=1; i--)
        {
            this._card['weapon'+i]=this._card['defaultWeapon'+i];
        }
        this._cardDepend.changed();
    },
    erase:function()
    {
        this._card=null;
        this._cardDepend.changed();
    },
    addWeapon:function(id)
    {
        if(Card._card.availableWeapon[id].oneHanded === true && (Card._card.rangeWeapon === null || Card._card.rangeWeapon.oneHanded === true))
        {
            Card._card.meleeWeapon=Card._card.availableWeapon[id];
        }
        else if(Card._card.availableWeapon[id].oneHanded === false && Card._card.rangeWeapon === null)
        {
            Card._card.meleeWeapon=Card._card.availableWeapon[id];
        }
        this._cardDepend.changed();
    },
    removeWeapon:function()
    {
        Card._card.meleeWeapon=this._card.defaultMeleeWeapon;//return CCW
        this._cardDepend.changed();
    },
    getCost:function()
    {
        this._cardDepend.depend();
        let cost=this._card.cost;
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
    },
    weapons:function()
    {
        let weapon=[];
        for(let i=Card._card.weaponCount; i>=1; i--)
        {
            weapon=weapon.concat(Card._card['weapon'+i]);
        }
        return weapon;
    }
});
Template.Card.events({
    "dblclick .availableWeapon":function(event)
    {
        event.preventDefault();
        let id=parseInt($(event.currentTarget)
            .children('a')
            .text());
        if(this.type === 'Ranged')
        {
            Card.addRangeWeapon(id);
        }
        else
        {
            Card.addWeapon(id);
        }
    },
    "dblclick .card":function(event)
    {
        event.preventDefault();
        let id=parseInt($(event.currentTarget)
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
