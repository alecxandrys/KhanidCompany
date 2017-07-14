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
        if(orderLine[0].curATB>=100)
        {
            simulationLine.push(orderLine[0]);
            orderLine.shift();
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
    return simulationLine;
};