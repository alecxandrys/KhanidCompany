/**
 * Created by Alecxandrys on 23.10.2015.
 */

Meteor.subscribe("readyPlayers");
Template.wait.helpers({
    players: function()
        {
            return readyPlayers.find({});
        }
});
/**
 * redirection
 * be careful!
 * very dangerous paramstring
 * it's only success way to take param.
 * @returns {string}
 */

Tracker.autorun(function()
{
    Meteor.subscribe("battles");
    var x = battles.find({});
    var y = battles.findOne({});
    if(x.count() === 1)
        {
            var paramstring = "name1=" + y.name1 + "&name2=" + y.name2 + "&battleID=" + y._id;
            Router.go('battlefield', {}, {query: paramstring});
        }
    else if(x.count() > 1)
        {
            console.log('Error:Balancer twice push player. Please, wait');
            return ("Waiting " + x.count() + " " + readyPlayers.find().count());
        }
});


