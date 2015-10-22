Router.route('/', function () {
  this.render('main');
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
    this.render('battlefield');
}, {
    name: 'battlefield'

});

function notAuth(){

    if (!Meteor.userId()) {

        this.render('main');
    } else {

        this.next();
    }
}
/**
 Check for cope-paste join to alien battle
 */
function notComm() {

    var name1 =this.params.query.name1;
    var name2 =this.params.query.name2;
    var battleID=this.params.query.battleID;

    if (Meteor.user().name!==name1 || Meteor.user().name!==name2)
    {
        Meteor.error("You cannot join the battle");
        this.back();
    }
    else {
        this.next();
    }
}
/**
 * Check for reconnect to redirect to field immideatly
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
