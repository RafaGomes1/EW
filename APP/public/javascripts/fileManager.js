$(document).ready(function() {
    $("#consultar-button").click(function() {
        var filePath = $(this).data("filepath");
        showImage(filePath);
    });
});

function showImage(nameFile) {

    var fname = nameFile.split('.')[0];
    var ftype = nameFile.split('.')[1];

    $("#display").empty();

    if (ftype === 'jpeg' || ftype === 'png') {
        var ficheiro = $('<img>', {
            src: '/fileStore/' + nameFile,
            width: '80%'
        });
        var download = $('<div>').append($('<a>', {
            href: '/download/' + nameFile,
            text: 'Download'
        }));
        $("#display").append(ficheiro, download);
        $("#display").modal();
    } else if (ftype === 'json') {
        $.get('/fileContents/' + nameFile, function(response) {
            var content = $('<pre>').text(response);
            var download = $('<div>').append($('<a>', {
                href: '/download/' + nameFile,
                text: 'Download'
            }));
            $("#display").append(content, download);
            $("#display").modal();
        }).fail(function(err) {
            console.log(ftype);
            console.log(nameFile);
        });
    } else if (ftype === 'pdf') {
        $.get('/recurso/fileContents/' + nameFile, (response) => {
            var content = $('<iframe src="/fileStore/' + nameFile + '"width=900 height=500></iframe>')
            var download = $('<div><a href="/recurso/download/' + nameFile + '">Download</a></div>')
            $("#display").append(content, download)
            // var modalContentHeight = content.contents().find('body').height();
            // var modalContentWidth = content.contents().find('body').width();
            var modalContentHeight = '600px';
            var modalContentWidth = '950px';
            $("#display").css({ 'max-height': modalContentHeight, 'max-width': modalContentWidth });
            $("#display").modal()
        })
        .fail((err) => {
            console.log('Error loading PDF file:', err);
        })
    } else if (ftype === 'html') {
        $.get('/fileContents/' + nameFile, function(response) {
            var content = $(response);
            var download = $('<div>').append($('<a>', {
                href: '/download/' + nameFile,
                text: 'Download'
            }));
            $("#display").append(content, download);
            $("#display").modal();
        }).fail(function(err) {
            console.log(ftype);
            console.log(nameFile);
        });
        $("#display").modal();
    } else {
        var ficheiro = $('<p>').text(nameFile);
        var download = $('<div>').append($('<a>', {
            href: '/download/' + nameFile,
            text: 'Download'
        }));
        $("#display").append(ficheiro, download);
        $("#display").modal();
    }
}
