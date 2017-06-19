export {RollD6,Roll2D6,RollD3}
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
