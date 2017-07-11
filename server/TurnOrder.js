export {TurnOrderInit,RunCircle}
/**
 * init turnorder array
 * @elem {deck-which deck (and player), index-place in deck, initiative-unit current initiative, curCard-current position in line}
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
            initiative:item.initiative,
            move:true,
            run:true,
            attack:true,
            advice:true,
            curATB:Math.floor(Math.random()*11)//start position in line
        });
        orderLine.push(elem)
    });
    deck2.forEach(function(item,index)
    {
        let elem=new Element({
            deck:'deck2',
            index:index,
            initiative:item.initiative,
            move:true,
            run:true,
            attack:true,
            charge:true,
            advice:true,
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
                orderLine[0].curATB=orderLine[0].curATB-orderLine[0].initiative;//stand and wait another model
            }
        }
        orderLine.forEach(function(item)
        {
            item.curATB=item.curATB+item.initiative;
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
    this.initiative=options.initiative || 0;
    this.curATB=options.curATB || 0;
    this.moveDistance=options.moveDistance;
    this.run=options.run;
    this.attack=options.attack;
    this.charge=options.charge;
    this.advice=options.advice;
    this.rules=options.rules || null;
    this.lockInCombat=[];
    this.twiceTurnFlag=false;
}
function ResetState(order)
{
    order.move=true;
    order.run=true;
    order.attack=true;
    order.charge=true;
    order.advice=true;
    order.runDistance=Math.floor(Math.random()*5)+1;//standard distance of run
    return order;
}