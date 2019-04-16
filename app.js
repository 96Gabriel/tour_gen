var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    pdfMake = require("pdfmake");

var app = express();

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/tournaments_db", { useNewUrlParser: true });

var tournamentSchema = new mongoose.Schema({
    title: String,
    num_participants: Number,
    dispute_method: String,
    participants: [{
        name_participant: String
    }]
});

var Tournament = mongoose.model("Tournaments", tournamentSchema);

var newTournament;

var tournament_id;

//Functions
function number_of_participants(method_of_dispute){
    var num = 0;
    switch(method_of_dispute){
        case "Knock-out_round_of_16":
            num = 16;
            break;
        case "Knock-out_quarter":
            num = 8;
            break;
        case "Knock-out_semi":
            num = 4;
            break;
    }

    return num;
}

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
    res.render("main");
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.get("/create", function (req, res) {
    res.render("create");
});

app.post("/create", function (req, res) {
    newTournament = req.body.tournament;
    newTournament.num_participants = number_of_participants(newTournament.dispute_method);
    res.redirect("/fill_in");
});

app.get("/fill_in", function (req, res) {
    var p = newTournament.num_participants;
    res.render("fill_in", { limit: p });
});

app.post("/fill_in", function (req, res) {
    var max = newTournament.num_participants;
    newTournament.participants = [];
    for (var i = 0; i < max; i++) {
        var name = req.body.participant[i];
        newTournament.participants.push({ name_participant: name });
    }
    Tournament.create(newTournament, function (err, newTour) {
        if (err) {
            console.log("An error has occured");
        } else {
            tournament_id = newTour._id;
            res.redirect("/confirmation/" + tournament_id);
        }
    });
});

app.get("/confirmation/:id", function (req, res) {
    var id = req.param.id
    Tournament.findById(tournament_id, function (err, newTour) {
        if (err) {
            res.redirect("/");
        } else {
            res.render("confirmation", { tournament: newTour });
        }
    });
});

app.get("/download/:id", function (req, res) {
    var id = req.params.id;
    Tournament.findById(id, function (err, newTour) {
        if (err) {
            res.redirect("/");
        } else {
            res.render("download", { tournament: newTour});
        }
    });
});

app.post("/delete/:id", function(req, res){
    var id = req.params.id;
    Tournament.findByIdAndDelete(id, function(err, newTour){
        if(err){
            res.redirect("/");
        }else{
            res.render("delete");
        }
    })
});


app.listen(8080, "localhost", function () {
    console.log("Server has started");
});