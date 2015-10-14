// Only publish tasks that are public or belong to the current user
Meteor.publish("tasks", function () {
    return Tasks.find({
        $or: [
            { private: {$ne: true} },
            { owner: this.userId }
        ]
    });
});
Meteor.publish("userData", function () {
    if (this.userId) {
        return Meteor.users.find({_id: this.userId},{fields: {createdAt:1,raitELO:1,raitCombine:1}});
    } else {
        this.ready();
    }
});

 Accounts.onCreateUser(function(options, user) {
 if(!options || !user) {
     console.log('error creating user');
     return;
 } else {
     if(options.profile) {user.profile = options.profile;}
     user.rateELO=100;
     user.rateCombine=1;
 }
 return user;
 });


//to check possible double in
Accounts.onLogin(function() {
console.log('this is me');
});

