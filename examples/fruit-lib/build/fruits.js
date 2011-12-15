(function(){try{fruits.x;}catch(e){fruits={};}try{fruits.apples.x;}catch(e){fruits.apples={};}try{fruits.berries.x;}catch(e){fruits.berries={};}try{fruits.berries.moreberries.x;}catch(e){fruits.berries.moreberries={};}with(fruits)with(fruits.apples)with(fruits.berries)with(fruits.berries.moreberries){fruits.FruitBasket=(function(){

function out(){
    var fruits = [
        new SpecialApple(),
        new StrawBerry(),
        new RaspBerry()
    ];
    
    this.printContents = function(){
        for(var i = 0; i < fruits.length; i++){
            console.log(fruits[i]);
        }
    }
};return out;})();}with(fruits){fruits.Fruit=(function(){function out(type,name){
    this.type = type;
    this.name = name;
};return out;})();}with(fruits.apples)with(fruits){fruits.apples.Apple=(function(){
function out(name){
    return new Fruit("apple",name);
};return out;})();}with(fruits.apples){fruits.apples.SpecialApple=(function(){function out(){
    return new Apple("Special Apple");
};return out;})();}with(fruits.berries)with(fruits){fruits.berries.Berry=(function(){

function out(name){
    return new Fruit("berry",name);
};return out;})();}with(fruits.berries){fruits.berries.StrawBerry=(function(){function out(){
    return new Berry("Strawberry");
};return out;})();}with(fruits.berries.moreberries)with(fruits.berries){fruits.berries.moreberries.RaspBerry=(function(){

function out(){
    return new Berry("RaspBerry");
};return out;})();}})();