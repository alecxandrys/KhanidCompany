/**
 * Created by Пользователь on 04/03/2017.
 */
SimulationRun=function (orderLine)
{
    let simulationLine=[];
    //simulationLine.push(orderLine[0]);
    orderLine.shift();
    while(orderLine.length>0)
    {
        if(orderLine[0].curCard>=100)
        {
            simulationLine.push(orderLine[0]);
            orderLine.shift();
        }
        orderLine.forEach(function(item)
        {
            item.curCard=item.curCard+item.speed;
        });
        orderLine.sort(function(a,b)
        {
            if(a.curCard>=b.curCard)
            {
                return -1;
            }
            else
            {
                return 1;
            }
        });
    }
    return simulationLine;
};