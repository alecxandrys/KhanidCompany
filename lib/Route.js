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

Router.route('/battle/:_id', function () {
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
    var id = this.params._id;//5
    var query = this.params.query;//query.q='s'
    var name1=query.n1;
    var name2=query.n2;

    this.next();
}

Router.onBeforeAction(notAuth, {
    //only: ['admin']
     except: ['main','News']
});

Router.onBeforeAction(notComm, {
    only:['battlefield']
});