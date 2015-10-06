Router.route('/', function () {
  this.render('main');
});
Router.route('/toDoList', function () {
    this.render('toDoList');
});
Router.route('/personalData', function() {
   this.render('PrivateOffice');
});
Router.route('/card', function() {
    this.render('Card');
});
function myHookFunction(){
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
Router.onBeforeAction(myHookFunction, {
    //only: ['admin']
     except: ['main','toDoList']
});