var aminoacids;
if(localStorage.getItem("aminoacids") !== null) {
    aminoacids = JSON.parse(localStorage.getItem("aminoacids"));
} else {
    aminoacids =[
        { "name": "alanine",         "abbr": "ala",    "letter": "A",   "right": 0, "wrong": 0 },
        { "name": "arginine",        "abbr": "arg",    "letter": "R",   "right": 0, "wrong": 0 },
        { "name": "asparagine",      "abbr": "asn",    "letter": "N",   "right": 0, "wrong": 0 },
        { "name": "aspartic acid",   "abbr": "asp",    "letter": "D",   "right": 0, "wrong": 0 },
        { "name": "cysteine",        "abbr": "cys",    "letter": "C",   "right": 0, "wrong": 0 },
        { "name": "glutamine",       "abbr": "gln",    "letter": "Q",   "right": 0, "wrong": 0 },
        { "name": "glutamic acid",   "abbr": "glu",    "letter": "E",   "right": 0, "wrong": 0 },
        { "name": "glycine",         "abbr": "gly",    "letter": "G",   "right": 0, "wrong": 0 },
        { "name": "histidine",       "abbr": "his",    "letter": "H",   "right": 0, "wrong": 0 },
        { "name": "isoleucine",      "abbr": "ile",    "letter": "I",   "right": 0, "wrong": 0 },
        { "name": "leucine",         "abbr": "leu",    "letter": "L",   "right": 0, "wrong": 0 },
        { "name": "lysine",          "abbr": "lys",    "letter": "K",   "right": 0, "wrong": 0 },
        { "name": "methionine",      "abbr": "met",    "letter": "M",   "right": 0, "wrong": 0 },
        { "name": "phenylalanine",   "abbr": "phe",    "letter": "F",   "right": 0, "wrong": 0 },
        { "name": "proline",         "abbr": "pro",    "letter": "P",   "right": 0, "wrong": 0 },
        { "name": "serine",          "abbr": "ser",    "letter": "S",   "right": 0, "wrong": 0 },
        { "name": "threonine",       "abbr": "thr",    "letter": "T",   "right": 0, "wrong": 0 },
        { "name": "tryptophan",      "abbr": "trp",    "letter": "W",   "right": 0, "wrong": 0 },
        { "name": "tyrosine",        "abbr": "tyr",    "letter": "Y",   "right": 0, "wrong": 0 },
        { "name": "valine",          "abbr": "val",    "letter": "V",   "right": 0, "wrong": 0 }
    ];
}
localStorage.setItem("aminoacids", JSON.stringify(aminoacids));
var loadDeferred = Q.defer(), load = loadDeferred.promise;
$(document).ready(loadDeferred.resolve);

var scores = [];

function now() {
    return new Date().getTime();
}

function log(x) {
    console.log(x);
    return Q(x);
}

load.then(function() {
    return askQuestions(1000);
})

function askQuestions(num) {
    var d = Q.defer();
    var p = d.promise;
    var def = Q();
    for(var i = 0; i < num; i++) {
        def = def.then(doAbbrQuestion);
    }
    def.then(d.resolve);
    return p;
}
function doAbbrQuestion() {
    var d = Q.defer();
    var p = d.promise;
    getRandomAA()
        .then(showAbbrQuestion)
        .then(waitForAbbrInput)
        .then(showRightWrong)
        .then(doScoreStuff)
        .then(log)
        .then(d.resolve)
    return p;
}
function getRandomAA() {
    var num_AAs = aminoacids.length;
    var r = Math.floor(Math.random() * num_AAs);
    return Q(aminoacids[r]);
}
function showAbbrQuestion(aa) {
    var d = Q.defer();
    var p = d.promise;
    var $img = $("<img/>").attr("src", "./Images/" + aa.abbr + ".jpg").on("load", function() {
        $(this).height($("#imageHolder").height());
        if($(this).width() > $("#imageHolder").width()) {
            var ratio = $(this).height() / $(this).width();
            $(this).height($("#imageHolder").width() * ratio);
        }
    });
    $("#instructions").html("Write the one or three-letter abbreviation of the amino acid");
    $("#imageHolder").html($img);
    $("#AAname").val("").focus();
    $("#result").html("");
    $("#correct-answer").html("");
    d.resolve(aa);
    return p;
}
function waitForAbbrInput(aa) {
    var d = Q.defer();
    var p = d.promise;
    var start = now();
    $("#answer").one("click", function() {
        var end = now();
        var timeTaken = end - start;
        var answer = $("#AAname").val();
        d.resolve({aa: aa, timeTaken: timeTaken, answer: answer});
        return false;
    });
    return p;
}
function showRightWrong(result) {
    var d = Q.defer();
    var p = d.promise;
    if( (result.answer.toLowerCase() === result.aa.abbr.toLowerCase()) ||
        (result.answer.toUpperCase() === result.aa.letter.toUpperCase()) ) {
        $("#result").html("Correct!");
        $("#correct-answer").html("");
        d.resolve(true);
    } else {
        $("#result").html("Wrong!");
        $("#correct-answer").html("The correct amino acid is " + result.aa.name + ".");
        d.resolve(false);
    }
    return p;
}
function doScoreStuff(answerWasCorrect) {
    var d = Q.defer();
    var p = d.promise;
    if(answerWasCorrect) { scores.push(1); }
    else                 { scores.push(0); }
    $("#score").html(sum(scores));
    $("#overallaverage").html(Math.floor(sum(scores) / scores.length * 100) + '%');
    var last5  = scores.slice(-5),
        last10 = scores.slice(-10),
        last50 = scores.slice(-50); 
    $("#last5average").html(Math.floor(sum(last5) / last5.length * 100) + '%');
    $("#last10average").html(Math.floor(sum(last10) / last10.length * 100) + '%');
    $("#last50average").html(Math.floor(sum(last50) / last50.length * 100) + '%');
    setTimeout(function() { d.resolve(answerWasCorrect); }, 2000);
    return p;
}
function sum(array) {
    for(var i = 0, s = 0; i < array.length; i++) { s += array[i]; }
    return s;
}
