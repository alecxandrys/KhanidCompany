/**
 * Created by Alecxandrys on 10.11.2015.
 * We need phaser.io here!!!
 */

var game;

function update() {

}

function create() {
    game.add.sprite(0,0,'Grass');
}



Template.Battlefield.onRendered(function(){

});
Template.Battlefield.onCreated(function(){
    game = new Phaser.Game(800, 600, Phaser.AUTO, 'field', { preload: preload, create: create, update: update });
    function preload() {
        game.load.image('Grass', 'BattleResource/Grass.png');
        game.load.image('Cover', 'BattleResource/Cover.png');
        game.load.image('Danger', 'BattleResource/Danger.png');
        game.load.image('Diff', 'BattleResource/Diff.png');
        game.load.image('Unreach', 'BattleResource/Unreach.png');
    }
});