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


//Router.go('battlefield',{},{query:'name1=queryValue&name2=queryValue&battleID=add'});
Router.route('/battle', function () {
    this.render('battlefield');
}, {
    name: 'battlefield'

});

function notAuth(){
    // all properties available in the route function
    // are also available here such as this.params

    if (!Meteor.userId()) {
        // if the user is not logged in, render the Login template
        this.render('main');
    } else {
        // otherwise don't hold up the rest of hooks or our route/action function
        // from running
        this.next();
    }
}

function notComm() {

    var name1 =this.params.query.name1;
    var name2 =this.params.query.name2;
    var battleID=this.params.query.battleID;

    this.next();
}

Router.onBeforeAction(notAuth, {
    //only: ['admin']
     except: ['main','News']
});

Router.onBeforeAction(notComm, {
    only:['battlefield']
});