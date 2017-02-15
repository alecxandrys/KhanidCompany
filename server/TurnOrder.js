/**
 * Created by Пользователь on 30.05.2016.
 * impossible pass function throw MongoDB (and JSON)
 * Have to create orderLine instantly and make some func, which change state
 */
export {TurnOrder}
function TurnOrder(BS)
{
    for(let card in BS.deck1)
    {
        card.startATB=Math.floor(Math.random()*11);
    }
    for(let card in BS.deck2)
    {
        card.startATB=Math.floor(Math.random()*11);
    }

    this.orderLine=BS.deck1+BS.deck2;

    return this;
}

