/**
 * Created by Alecxandrys on 18.10.2015.
 */

Meteor.subscribe("readyPlayers");
Template.wait.helpers({

players:function() {

    return readyPlayers;
}

});