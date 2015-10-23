/**This is Optimistic UI. This is important
 For more fast call this code will run both side
 task actually appears on the screen before the result comes back from the server
 But all check happen on server
 */
Router.route('/', function () {
  this.render('Main');
});
Router.route('/News', function () {
    this.render('News');
});
Router.route('/personalData', function() {
   this.render('PrivateOffice');
});
Router.route('/card', function() {
    this.render('Card');
});
Router.route('/wait', function() {
   this.render('wait');
});

/**
 * example to link for this route
 * use & to divine query in URL
 *Router.go('battlefield',{},{query:'name1=queryValue&name2=queryValue&battleID=add'});
 */


Router.route('/battle', function () {
    this.render('Battlefield');
}, {
    name: 'battlefield'

});

function notAuth(){

    if (!Meteor.userId()) {

        this.render('Main');
    } else {

        this.next();
    }
}
/**
 *Check for cope-paste join to alien battle
 *
 */
function notComm() {

    var name1 =this.params.query.name1;
    var name2 =this.params.query.name2;
    var battleID=this.params.query.battleID;

    //This can refactor to more usability. Need to check a prof to join
    var checkID=battles.find({battleID:battleID});
    var chk=checkID.count();

    if (Meteor.user().name!==name1 || Meteor.user().name!==name2)
    {
        Meteor.error("You cannot join the battle");
        this.back();
    }
    //some sort of joke, so we save this situation, when someone with correct URL try to join
    else if (chk!==1)
    {
        this.render("Main");
    }
    else
    {
        this.next();
    }
}
/**
 * Check for reconnect to redirect to field instance. Can check in 'battle' collection.
 * Active status-need back to field
 */
function onBattle() {
this.next();
}

Router.onBeforeAction(notAuth, {
     except: ['main','News']
});

Router.onBeforeAction(notComm, {
    only:['battlefield']
});
Router.onBeforeAction(onBattle,{});
