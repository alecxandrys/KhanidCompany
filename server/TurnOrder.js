/**
 * Created by Пользователь on 30.05.2016.
 * impossible pass function throw MongoDB (and JSON)
 * Have to create orderLine instantly and make some func, which change state
 */
export {TurnOrderInit,RunCircle}
/**
 * init turnorder array
 * @elem {deck-which deck (and player), index-place in deck, speed-unit current speed, curATB-current position in line}
 * @param deck1
 * @param deck2
 * @returns {Array}
 * @constructor
 */
function TurnOrderInit(deck1,deck2)
{
    var orderLine=[];
    deck1.forEach(function(item,index)
    {
        var elem=new Element({
            deck:'deck1',
            index:index,
            speed:item.speed,
            canMove:true,
            canRun:true,
            canCharge:true,
            curATB:Math.floor(Math.random()*11)//start position in line
        });
        orderLine.push(elem)
    });
    deck2.forEach(function(item,index)
    {
        var elem=new Element({
            deck:'deck2',
            index:index,
            speed:item.speed,
            canMove:true,
            canRun:true,
            canCharge:true,
            curATB:Math.floor(Math.random()*11)
        });
        orderLine.push(elem)
    });
    return orderLine;
}
/**
 *
 * @param orderLine
 * @returns {*}
 * @constructor
 */
function RunCircle(orderLine)
{

    while(true)
    {
        //if at least one reach end of circle
        if(orderLine[0].curATB>=100)
        {
            orderLine[0]=ResetState(orderLine[0]);
            orderLine[0].walkDistance=6;
            orderLine[0].runDistance=Math.floor(Math.random() * 5)+1;
            break;
        }
        orderLine.forEach(function(item)
        {
            item.curATB=item.curATB+item.speed;
        });

        orderLine.sort(function(a,b)
        {
            if(a.curATB>=b.curATB)
            {
                return -1;
            }
            else
            {
                return 1;
            }
        });
    }
    return orderLine;
}
function Element(options)
{
    this.deck=options.deck || 'deck0';
    this.index=options.index || -1;// if default was -1 or less make -1 for each zero index. Also make -1 as default destroy all orderLine
    this.speed=options.speed || 0;
    this.curATB=options.curATB || 0;
    this.canMove=options.canMove || false;//
    this.move=false;
    this.canRun=options.canRun || false;
    this.snapshot=false;
    this.canShoot=options.canShoot || false;
    this.shoot=false;
    this.canCharge=options.canCharge || false;
    this.charge=false;
    this.rules=options.rules||null;
}
function ResetState(order)
{
    if(order.canMove)
    {
        order.move=true;
    }
    if(order.canShoot)
    {
        order.shoot=true;
    }
    if(order.canCharge)
    {
        order.charge=true;
    }
    return order;
}