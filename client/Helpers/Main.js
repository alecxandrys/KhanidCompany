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
                    return "Вы не можете посетить данную страницу. Зарегестрируйтесь пожалуйста";
                }
            else
                {
                    return "Добро пожаловать в WCG40k-Khanid Company";
                }
        }
});
Template.Main.onCreated(function(){
    $('body').addClass('siteBody');
});

