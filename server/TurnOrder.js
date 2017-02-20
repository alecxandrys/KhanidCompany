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
        var elem={
            deck:'deck1',
            index:index,
            speed:item.speed,
            curATB:Math.floor(Math.random()*11)//start position in line
        };
        orderLine.push(elem)
    });
    deck2.forEach(function(item,index)
    {
        var elem={
            deck:'deck2',
            index:index,
            speed:item.speed,
            curATB:Math.floor(Math.random()*11)
        };
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
    if(orderLine[0].curATB>=100)
    {
        return orderLine;
    }
    while(true)
    {
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

        //if at least one reach end of circle
        if(orderLine[0].curATB>=100)
        {
            break;
        }
    }
    return orderLine;
}
