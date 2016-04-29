/**
 * Main for 'main','News','PrivateOffice'
 */
Meteor.user();
Template.Main.helpers({
    /**
     * @return {string}
     */
    Message: function()
        {
            if(!Meteor.userId() && Router.current().route.getName() !== undefined)
                {
                    return "You are not auth to visit this page";
                }
            else
                {
                    return "Welcome to WCG40k Khanid Company";
                }
        }
});
Template.Main.onCreated(function(){
    $('body').addClass('siteBody');
});

