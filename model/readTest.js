var timer = {};
var meanv;
var fileTimer = [];
var max;
var fs = require('fs');
var math = require('mathjs');
exports.setLenght = setLengthFn;
exports.pushTime = pushTimeFn;
function setLengthFn(i)
{
    max = i;

    timer = {
        numberOfFile: max,
        phase1: [],
        phase1Mean:0,
    }

}
function pushTimeFn(time)
{
    timer.phase1.push(time);
    console.log(timer.phase1.length);
    // if(timer.phase1.length >= max)
    // {
        timer.phase1Mean = math.mean(timer.phase1);
        // console.log(timer);
        fs.writeFile("./Files/RisultatiTest/readTest" + max,
            "TEST EFFETTUATO CON " + max+ " FILE\n" +
            JSON.stringify(timer, null, "\t")
            , function (err) {
                if (err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
            });


    // }

}
