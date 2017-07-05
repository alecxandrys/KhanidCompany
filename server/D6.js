export {RollD6,Roll2D6,RollD3,Roll2D6DoubleCheck}
/**
 * @return {number}
 * function make normal value from 1 to 6
 */
function RollD6()
{
    return Math.floor(Math.random()*(6)+1);
}
/**
 * @return {number}
 */
function Roll2D6()
{
    return Math.floor(Math.random()*(12)+2);
}
/**
 * @return {number}
 */
function RollD3()
{
    return Math.floor(Math.random()*(3)+1);
}
function Roll2D6DoubleCheck()
{
    let a={
        result1:Math.floor(Math.random()*(6)+1),
        result2:Math.floor(Math.random()*(6)+1)
    };
    if (a.result1===a.result2)
    {
        a.double=true;
        a.value=a.result1;
    }
    else
    {
        a.double=false;
        a.value=0;
    }
    return a;

}
