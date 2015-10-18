/*This is Optimistic UI
 For more fast call this code will run both side
 task actually appears on the screen before the result comes back from the server
 But all check happen on server
 */


Meteor.methods({
 addPlayerInQueue:function() {
     var x=Meteor.user();
     readyPlayers.insert({userId:Meteor.userId(),username:x.username,rate: x.rateELO, path:0})
    }

});


Meteor.startup(function(){

    //this is correct timer work with guaranteed Interval
    var tickTime=5000;
    var timerId = Meteor.setTimeout(function tick() {
        var x=readyPlayers.find();
        if (x.count()>1) {



        }
        console.log( "Tick is "+tickTime );
        timerId = Meteor.setTimeout(tick, tickTime);
    }, tickTime);

});

