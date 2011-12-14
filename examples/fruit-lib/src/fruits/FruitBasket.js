use fruits.apples;
use fruits.berries;
use fruits.berries.moreberries;

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
}