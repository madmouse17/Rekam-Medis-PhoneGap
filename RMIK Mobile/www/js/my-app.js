// Initialize app
var myApp = new Framework7();

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView(".view-main", {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true,
});

// Handle Cordova Device Ready Event
$$(document).on("deviceready", function() {
    console.log("Device is ready!");
});

// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit("about", function(page) {
    // Do something here for "about" page
});

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on("pageInit", function(e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === "about") {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert("Here comes About page");
    }
});

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on("pageInit", '.page[data-page="about"]', function(e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert("Here comes About page");
});
// KODE UNTUK HALAMAN HISTORY
$$(document).on("pageInit", '.page[data-page="history"]', function(e) {
    $$.get("http://localhost:3000/pendaftaran", {}, function(data, status, xhr) {
        var json = JSON.parse(data);
        var pasien = json.data;
        $$.each(pasien, function(index, item) {
            var konten = Object.keys(item)
                .map((key) => `${key}=${item[key]}`)
                .join("&");
            $$(".list-history").append(
                "<li>" +
                '<a href="daftar-detail.html?' +
                konten +
                '" class="item-link item-content">' +
                '<div class="item-inner">' +
                '<div class="item-title-row">' +
                '<div class="item-title">' +
                item.nama +
                "</div>" +
                '<div class="item-after">' +
                item.norm +
                "</div>" +
                "</div>" +
                '<div class="item-subtitle">' +
                item.poli +
                "</div>" +
                '<div class="item-text">' +
                item.createdAt +
                "</div>" +
                "</div>" +
                "</a>" +
                "</li>"
            );
        });
    });
});
//KODE UNTUK HALAMAN DAFTAR
$$(document).on("pageInit", '.page[data-page="daftar"]', function(e) {
    //KODE UNTUK AMBIL DATA POLI
    $$.get("http://localhost:3000/poli", {}, function(data, status, xhr) {
        var json = JSON.parse(data);
        var pasien = json.data;
        $$.each(pasien, function(index, item) {
            $$(".poli").append(
                '<option value="' + item.id_poli + '">' + item.nama_poli + "</option>"
            );
        });
    });
    //KODE TOMBOL DAFTAR
    $$(".tombolDaftar").on("click", function() {
        var formData = myApp.formToJSON(".formDaftar");
        $$.post("http://localhost:3000/pendaftaran", formData, function(
            data,
            status,
            xhr
        ) {
            var json = JSON.parse(data);
            if (json.status) {
                myApp.addNotification({
                    message: json.pesan,
                    hold: 2000,
                });
                $$(".formDaftar")[0].reset();
            } else {
                myApp.alert(json.pesan);
            }
        });
    });
});
//KODE UNTUK HALAMAN DAFTAR DETAIL
$$(document).on("pageInit", '.page[data-page="daftar-detail"]', function(e) {
    //KODE UNTUK AMBIL DATA POLI
	var formData=e.detail.page.query;
	myApp.formFromJSON('.formDaftarDetail',formData);
	
    $$.get("http://localhost:3000/poli", {}, function(data, status, xhr) {
        var json = JSON.parse(data);
        var pasien = json.data;
        $$.each(pasien, function(index, item) {
            $$(".poli").append(
                '<option value="' + item.id_poli + '">' + item.nama_poli + "</option>"
            );
        });
    });
    //KODE TOMBOL UBAH
    $$(".tombolUbah").on("click", function() {
        var formData = myApp.formToJSON(".formDaftarDetail");
        $$.post("http://localhost:3000/pendaftaran/ubah", formData, function(
            data,
            status,
            xhr
        ) {
            var json = JSON.parse(data);
            if (json.status) {
                myApp.addNotification({
                    message: json.pesan,
                    hold: 2000,
                });
                mainView.router.loadPage("history.html");
            } else {
                myApp.alert(json.pesan);
            }
        });
    });
    //KODE TOMBOL HAPUS
    $$(".tombolHapus").on("click", function() {
        var formData = myApp.formToJSON(".formDaftarDetail");
        $$.post("http://localhost:3000/pendaftaran/hapus", formData, function(
            data,
            status,
            xhr
        ) {
            var json = JSON.parse(data);
            if (json.status) {
                myApp.addNotification({
                    message: json.pesan,
                    hold: 2000,
                });
                mainView.router.loadPage("history.html");
            } else {
                myApp.alert(json.pesan);
            }
        });
    });
});