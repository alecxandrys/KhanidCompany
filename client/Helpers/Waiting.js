/**
 * Created by Alecxandrys on 23.10.2015.
 */

Meteor.subscribe("readyPlayers");
Meteor.subscribe("battles");
Template.wait.helpers({

    players:function() {
        return readyPlayers.find({});
    },

    /**
     * redirection
     * be careful!
     * very dangerous paramstring
     * it's only success way to take param.
     * @returns {string}
     */
    battleID:function() {
        var x = battles.find({});
        var y = battles.findOne({});
        if (x.count() === 1) {
            var paramstring= "name1="+y.name1+"&name2="+ y.name2+"&battleID="+y.battleID;
            Router.go('battlefield', {}, {query: paramstring});
        }
        else if (x.count() !== 1) {
            console.log('Error:Balancer twice push player. Please, wait');
            return ("Waiting "+ x.count());
        }
    }
});
