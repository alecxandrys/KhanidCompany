Meteor.methods({
    addPlayerInQueue: function(Deck)
        {
            var x = Meteor.user();
            readyPlayers.insert({userId: x._id, username: x.username, rate: x.rateELO, deck:Deck});
        }
});
/**
 * Start balance worker after start a server
 * a very specific magic:
 * 1)save each first user
 * 2)generate unic ID for each second user
 * 3)push both to battles.
 * 4)after each remove they from cursor
 */
Meteor.startup(function()
{

    //this is correct timer work with guaranteed Interval
    var tickTime = 3000;
    var timerId = Meteor.setTimeout(function tick()
    {
        var x = readyPlayers.find({}, {sort: {rate: 1}});
        if(x.count() > 1)
            {
                //balancer itself
                var prevuser;
                console.log("Enter the block " + x.count());
                x.forEach(function(user, index)
                {
                    if(index % 2 === 1)
                        {
                            var path = Random.id();
                            //need to translate object
                            //need async call for this shit
                            //Will keep in waitingCollection
                            var BS = new BattleState(path, 12, 20,prevuser.deck,user.deck);
                            console.log(path + " " + " ===1 " + " " + index);
                            battles.insert({
                                ID1     : prevuser.userId,
                                name1   : prevuser.username,
                                state1  :"reconnaissance",
                                ID2     : user.userId,
                                name2   : user.username,
                                state2  :"reconnaissance",
                                BS      : BS,
                                battleID: path
                            });
                            readyPlayers.remove({userId: user.userId});
                            readyPlayers.remove({userId: prevuser.userId});
                        }
                    else
                        {
                            prevuser = user;
                        }
                })
            }
        timerId = Meteor.setTimeout(tick, tickTime);
    }, tickTime);
});

