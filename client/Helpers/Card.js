/**
 * Created by Alecxandrys on 29.04.2016.
 */
/**
 * Card template
 */
Meteor.subscribe("userData");
Deck={
    _deck:[],
    _deckDepend:new Tracker.Dependency(),
    cost:0,
    getUnit:function()
    {
        this._deckDepend.depend();
        return this._deck;
    },
    setUnit:function(Unit)
    {
        this._deck.push(Unit);
        this._deckDepend.changed();
    },
    erase:function()
    {
        this._deck=[];
        this._deckDepend.changed();
    },
    setCost:function(cost)
    {
        this.cost=cost;
    },
    getCost:function()
    {
        this._deckDepend.depend();
        let res=this.getUnit();
        let cost=0;
        for(let card of res)
        {
            cost=cost+card.cost;
            for(let i=card.weaponCount; i>=1; i--)
            {
                if (card['weapon'+i]===null || !card['weapon'+i]) continue;
                cost=cost+card['weapon'+i].cost;
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
    addWeapon:function(arrayId,weaponId)
    {
        arrayId=this._card.weaponCount-arrayId;////magic for correct order of weaponGroup on page and @index
        let alreadyTwoHanded=false;
        for(let i=this._card.weaponCount; i>=1; i--)
        {
            if (this._card['weapon'+i]===null || !this._card['weapon'+i]) continue;
            if (this._card['weapon'+i].oneHanded!==true)
            {
                alreadyTwoHanded=true;
            }
        }
        if (!alreadyTwoHanded)
        {
            this._card['weapon'+arrayId]=this._card['availableWeapon'+arrayId][weaponId];
        }
        this._cardDepend.changed();
    },
    removeWeapon:function(arrayId)
    {
        arrayId=this._card.weaponCount-arrayId;//magic for correct order of weaponGroup on page and @index
        this._card['weapon'+arrayId]=this._card['defaultWeapon'+arrayId];//return CCW
        this._cardDepend.changed();
    },
    getCost:function()
    {
        this._cardDepend.depend();
        let cost=this._card.cost;
        for(let i=this._card.weaponCount; i>=1; i--)
        {
            if (this._card['weapon'+i]===null || !this._card['weapon'+i]) continue;
            cost=cost+this._card['weapon'+i].cost;
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
    },
    availableWeapons:function()
    {
        let availableWeapons=[];
        for(let i=Card._card.weaponCount; i>=1; i--)
        {
            availableWeapons.push(Card._card['availableWeapon'+i]);
        }
        return availableWeapons;
    }
});
Template.Card.events({
    "dblclick .availableWeapon":function(event)
    {
        event.preventDefault();
        let weaponId=parseInt($(event.currentTarget)
            .children('a')
            .text());
        let arrayId=parseInt($(event.currentTarget)
            .parent('.availableList')
            .children('a')
            .text());
        console.log(arrayId,weaponId);
        Card.addWeapon(arrayId,weaponId);
    },
    "dblclick #equipped-weapon":function(event)
    {
        let arrayId=parseInt($(event.currentTarget)
            .children('a')
            .text());
        console.log(arrayId);
        Card.removeWeapon(arrayId);
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
        if(Deck._deck.length === 0)
        {
            alert("Deck is empty, you cannot join in battle");
        }
        else if(Deck._deck.length>20)
        {
            alert("deck is too large, erase some squad");
        }
        else
        {
            Meteor.call("addPlayerInQueue",Deck._deck);
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
