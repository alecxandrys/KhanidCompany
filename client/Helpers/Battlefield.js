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

function preload() {
    game.load.image('Grass', 'BattleResource/Grass.png');
}

Template.Battlefield.onRendered(function(){

});
Template.Battlefield.onCreated(function(){
    game = new Phaser.Game(80, 60, Phaser.AUTO, 'field', { preload: preload, create: create, update: update });
});