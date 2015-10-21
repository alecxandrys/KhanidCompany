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
        var x=readyPlayers.find({},{sort:{rate:1}});
        if (x.count()>1) {
            //balancer itself
            var count=0;
            var path;
            var prevuser;
            x.forEach(function(user) {
                if (count%2===1)
                {
                    path=Random.id();




                }

            })


        }
        timerId = Meteor.setTimeout(tick, tickTime);
    }, tickTime);

});

