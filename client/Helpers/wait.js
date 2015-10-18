Meteor.subscribe("readyPlayers");
Template.wait.helpers({

players:function() {

    return readyPlayers.find({});
}

});