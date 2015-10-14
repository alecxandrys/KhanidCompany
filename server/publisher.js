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
        var x=Meteor.users.find({_id: this.userId},{fields: {createdAt:1,rait:1}});
        if (x.rait===undefined) {
            Meteor.users.update({_id: this.userId}, {$set: {rate: 100}});
        }
        return Meteor.users.find({_id: this.userId},{fields: {createdAt:1,rait:1}});
    } else {
        this.ready();
    }
});

/*
Accounts.onCreateUser(function() {

console.log('and this is new');
});
*/


//to check possible double in
Accounts.onLogin(function() {
console.log('this is me');
});

