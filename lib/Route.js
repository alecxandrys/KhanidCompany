/**This is Optimistic UI. This is important
 For more fast call this code will run both side
 task actually appears on the screen before the result comes back from the server
 But all check happen on server
 */

Router.route('/',function()
{
    this.render('Main');
});
Router.route('/News',function()
{
    this.render('News');
});
Router.route('/personalData',function()
{
    this.render('PrivateOffice');
});
Router.route('/card',function()
{
    this.render('Card');
});
Router.route('/wait',function()
{
    this.render('wait');
});
/**
 * example to link for this route
 * use & to divine query in URL
 *Router.go('battlefield',{},{query:'name1=queryValue&name2=queryValue&battleID=add'});
 */
Router.route('/battle',function()
{
    this.render('Battlefield');
},{
    name:'battlefield'
});
function notAuth()
{
    if(!Meteor.userId())
    {
        this.render('Main');
    }
    else
    {
        this.next();
    }
}
/**
 * See doc to implement error
 * Very dangerous, can break multiple is statement
 */
function notComm()
{
    let name1=this.params.query.name1;
    let name2=this.params.query.name2;
    let battleID=this.params.query.battleID;
    //This can refactor to more usability. Need to check a prof to join
    let checkID=battles.find({_id:battleID});
    let chk=checkID.count();
    let name=Meteor.user().username;
    if(chk === 1)
    {
        switch(name)
        {
            case name1:
                this.next();
                break;
            case name2:
                this.next();
                break;
            default :
                this.render('Main');
        }
        //This error must be implemented in server code. See meteor doc
        //Meteor.error("You cannot join the battle");
    }
    else
    {
        this.render('Main');
    }
}
/**
 * Check for reconnect to redirect to field instance. Can check in 'battle' collection.
 * Active status-need back to field
 */
function onWaiting()//if in queue
{
    let a=readyPlayers.findOne({userId:Meteor.userId()});
    if (!a)
    {
        this.next();
    }
    else
    {
        this.render('wait');
    }
}
function siteBodyAdd()
{
    $('body')
        .addClass('siteBody');
    this.next();
}

function battleBodyAdd()
{
    let body=$('body');
    body.removeClass('siteBody');
    body.addClass('battleBody');
    this.next();
}
function battleBodyRemove()
{
    $('body')
        .removeClass('battleBody');
}
Router.onBeforeAction(notAuth,{
    except:['main','News']
});
Router.onBeforeAction(notComm,{
    only:['battlefield']
});
Router.onBeforeAction(onWaiting,{});

Router.onBeforeAction(siteBodyAdd,{
    except:['battlefield']
});

Router.onBeforeAction(battleBodyAdd,{
    only:['battlefield']
});
Router.onStop(battleBodyRemove,{
    only:['battlefield']
});
