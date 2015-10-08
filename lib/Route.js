Router.route('/', function () {
  this.render('main');
});
Router.route('/toDoList', function () {
    this.render('toDoList');
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
function notAdmin() {
    if (Meteor.user().admin)
    {
        this.render('main');
    }
    else
    {
        this.next();
    }
}

Router.onBeforeAction(notAuth, {
    //only: ['admin']
     except: ['main','News']
});
Router.onBeforeAction(notAdmin,{
    only:['toDoList']
});