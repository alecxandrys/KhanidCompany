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
    let orderLine=[];
    deck1.forEach(function(item,index)
    {
        let elem=new Element({
            deck:'deck1',
            index:index,
            speed:item.speed,
            canMove:true,
            canRun:true,
            canShoot:true,
            canCharge:true,
            curATB:Math.floor(Math.random()*11)//start position in line
        });
        orderLine.push(elem)
    });
    deck2.forEach(function(item,index)
    {
        let elem=new Element({
            deck:'deck2',
            index:index,
            speed:item.speed,
            canMove:true,
            canRun:true,
            canShoot:true,
            canCharge:true,
            curATB:Math.floor(Math.random()*11)
        });
        orderLine.push(elem)
    });
    return orderLine;
}
/**
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
            if(!orderLine[0].twiceTurnFlag)
            {
                orderLine[0]=ResetState(orderLine[0]);
                orderLine.forEach(function(item)//very dirty
                {
                    item.twiceTurnFlag=false;
                });
                orderLine[0].twiceTurnFlag=true;
                break;
            }
            else
            {
                orderLine[0].curATB=orderLine[0].curATB-orderLine[0].speed;//stand and wait another model
            }
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
    this.index=options.index === null ? -1 : options.index;// if default was -1 or less make -1 for each zero index because 0==false
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
    this.rules=options.rules || null;
    this.lockInCombat=[];
    this.twiceTurnFlag=false;
    this.prevMove=false;
    this.prevRun=false;
}
function ResetState(order)
{
    if(order.prevRun)
    {
        order.snapshot=true;
        order.prevRun=false;
    }
    if(!order.prevMove)
    {
        order.snapshot=false;
    }
    order.prevMove=false;
    order.prevMove=false;
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
    if(order.lockInCombat.length !== 0)//check XtX combat for current unit
    {
        order.move=false;
        order.shoot=false;
        order.charge=false;
    }
    order.walkDistance=6;
    order.runDistance=Math.floor(Math.random()*5)+1;
    return order;
}