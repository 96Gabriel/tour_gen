function HTMLtoPDF() {
    var doc = new jsPDF();

    doc.fromHTML(document.getElementById("title"));

    var disputeMethod = document.getElementById("dispute_method").textContent;

    create_table(doc, disputeMethod);

    doc.save("test.pdf");
}

function create_table(doc, dispute_method){
    var y = 20;

    var num_of_participants;

    var method;

    switch(dispute_method){
        case "Knock-out_round_of_16":
            num_of_participants = 16;
            method = "Round of 16";
            doc.text("Round of 16", 5, y);
            break;
        case "Knock-out_quarter":
            num_of_participants = 8;
            method = "Quarter-Final";
            doc.text("Quarter-Finals", 5, y);
            break;
        case "Knock-out_semi":
            num_of_participants = 4;
            method = "Semi-Final";
            doc.text("Semi-Finals", 5, y);
            break;
    }
    y += 10;

    for (var i = 0; i < num_of_participants/2; i++) {
        var table_num = "#table" + (i + 1);

        doc.text(method + " " + (i + 1), 5, y);

        doc.autoTable({
            html: table_num,
            theme: "grid",
            columnStyles: {
                0: { cellWidth: 50 },
                1: { cellWidth: 5 }
            },
            startY: (y + 5)
        });
        y += 30;
    }

    switch(method){
        case "Round of 16":
            doc.addPage();
            quarter_rows(doc, 10);
            break;
        case "Quarter-Final":
            semi_rows(doc, y);
            break;
        case "Semi-Final":
            final_rows(doc, y);
            break;
    }

}

function quarter_rows(doc, y) {

    var body1 = [
        ["Round of 16 1 Winner", ""],
        ["Round of 16 2 Winner", ""]
    ];

    var body2 = [
        ["Round of 16 3 Winner", ""],
        ["Round of 16 4 Winner", ""]
    ];

    var body3 = [
        ["Round of 16 5 Winner", ""],
        ["Round of 16 6 Winner", ""]
    ];

    var body4 = [
        ["Round of 16 7 Winner", ""],
        ["Round of 16 8 Winner", ""]
    ];

    var body_quarter = [body1, body2, body3, body4];

    doc.text("Quarter-Finals", 5, y);

    y += 10;

    for (var j = 0; j < 4; j++) {
        doc.text("Quarter-Final " + (j + 1), 5, y);
        doc.autoTable({
            theme: "grid",
            columnStyles: {
                0: { cellWidth: 50 },
                1: { cellWidth: 5 }
            },
            body: body_quarter[j],
            startY: (y + 5)
        });
        y += 30;
    }

    y += 10;

    final_rows(doc, y);
}

function semi_rows(doc, y) {
    var body1 = [
        ["Quarter-Final 1 Winner", ""],
        ["Quarter-Final 2 Winner", ""]
    ];

    var body2 = [
        ["Quarter-Final 3 Winner", ""],
        ["Quarter-Final 4 Winner", ""]
    ];

    var body_semi = [body1, body2];

    doc.text("Semi-Finals", 5, y);

    y += 10;

    for (var j = 0; j < 2; j++) {
        doc.text("Semi-Final " + (j + 1), 5, y);
        doc.autoTable({
            theme: "grid",
            columnStyles: {
                0: { cellWidth: 50 },
                1: { cellWidth: 5 }
            },
            body: body_semi[j],
            startY: (y + 5)
        });
        y += 30;
    }

    y += 10;

    final_rows(doc, y);

}

function final_rows(doc, y) {
    var body = [
        ["Semi-Final 1 Winner", ""],
        ["Semi-Final 2 Winner", ""]
    ];

    doc.text("Final", 5, y);
    doc.autoTable({
        theme: "grid",
        columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 5 }
        },
        body: body,
        startY: (y + 5)
    });
}