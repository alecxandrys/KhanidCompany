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
        x=Meteor.users.find({_id: this.userId},{fields: {createdAt:1,rait:1}});
        if (x.rait===undefined) {
            Meteor.users.update({_id: this.userId}, {$set: {rait: 100}});
        }
        return Meteor.users.find({_id: this.userId},{fields: {createdAt:1,rait:1}});
    } else {
        this.ready();
    }
});

