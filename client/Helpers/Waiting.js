/**
 * Created by Alecxandrys on 23.10.2015.
 */

Meteor.subscribe("readyPlayers");
Meteor.subscribe("battles");
Template.wait.helpers({

    players:function() {
        return readyPlayers.find({});
    },

    battleID:function() {
        var x = battles.find();
        if (x.count() === 1) {
            var paramstring= "name1="+x.name1+"&name2="+ x.name2+"&battleID="+ x.battleID;
            Router.go('battlefield', {}, {query: paramstring});
        }
        else if (x.count() >= 1) {
            console.log('Error:Balancer twice push player. Please, wait');
        }
    }
});
