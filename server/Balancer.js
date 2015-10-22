/*This is Optimistic UI
 For more fast call this code will run both side
 task actually appears on the screen before the result comes back from the server
 But all check happen on server
 */
Meteor.methods({
 addPlayerInQueue:function() {
     var x=Meteor.user();
     readyPlayers.insert({userId: x.userId,username:x.username,rate: x.rateELO, path:0,enemyName:""})
    }

});

/**
 * Start balance worker after start a server
 * a very specific magic:
 * 1)save each first user
 * 2)generate unic ID for each second user
 * 3)push both to battles.
 * 4) after each remove they from cursor
 */
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

                    user.path=path;
                    user.enemyName=prevuser.username;

                    prevuser.path=path;
                    prevuser.enemyName=user.username;

                    battles.insert({ID1:prevuser.userId,name1:prevuser.username,ID2:user.userId,name2:user.username,battleID:path});
                }
                else
                {
                    prevuser=user;
                }
                user.remove();
            })


        }
        timerId = Meteor.setTimeout(tick, tickTime);
    }, tickTime);

});

