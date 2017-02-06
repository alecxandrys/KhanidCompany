/**
 * Created by Пользователь on 06/02/2017.
 */
function OffsetOut(xSize,x,ySize,y)
{
    return ((xSize - x-1) / 2) <= y && y <= (ySize - 1 + (xSize - x-1) / 2);
}