/**
 * Created by Пользователь on 06/02/2017.
 * @return {boolean}
 */
OffsetOut=function(xSize,x,ySize,y)
{
    return ((xSize-x-1)/2)<=y && y<=(ySize-1+(xSize-x-1)/2);
};
SimulationRun=function (orderLine)
{
    var simulationLine=[];
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
    return simulationLine;
};