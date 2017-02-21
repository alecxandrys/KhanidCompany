/**
 * Created by Alecxandrys on 10.11.2015.
 */
Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
});
/**
 *Logout us:
 *Meteor.logout(); Client only
 *
 *Logout other, who login with our data:
 *Meteor.logoutOtherClients(); Client only
 *
 * Callback every time on login:
 * onLogin, anywhere, when success
 * onLoginFailure, anywhere, when fail
 *
 *Logout other, who use this login/pass
 */
Accounts.onLogin(function()
{
    Meteor.logoutOtherClients();
});
Template.PrivateOffice.helpers({
    winPercent:function()
    {
        var data=Meteor.user();
        if (data.gameCount!=0)
        {
            return (data.gameWinCount/data.gameCount)*100;
        }
        else {
            return 0;
        }
    }
});
