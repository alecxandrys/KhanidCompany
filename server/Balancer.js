/*This is Optimistic UI
 For more fast call this code will run both side
 task actually appears on the screen before the result comes back from the server
 But all check happen on server
 */

readyPlayers=new Mongo.Collection('readyPlayers');


Meteor.methods({
 addPlayerInQueue:function() {
     var x=Meteor.user();
     readyPlayers.insert({userId:Meteor.userId(),username:x.username,rate: x.rateELO, path:'wait'})
    },
 checkQueue:function() {

 }

});


Meteor.startup(function(){
    Meteor.setInterval(function(){
if (readyPlayers.length>1) {

}



    },3000);

});


