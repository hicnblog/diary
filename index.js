(function($) {
    'use strict';

    var clone_display_diary = $("#display_diary").clone();
    var clone_content_empty = $('#form-container').clone();

    $('#display_diary').remove();
    // guid
    function guid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    // eof guid

    // GET val
    var getUrlParameter = function getUrlParameter(sParam, url) {
        var sPageURL = decodeURIComponent(url),
            sURLVariables = sPageURL.split('?'),
            sHb = sURLVariables[1].split('&'),
            sParameterName,
            i;

        for (i = 0; i < sHb.length; i++) {
            sParameterName = sHb[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    var getUrlParameterOnUse = function getUrlParameterOnUse(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };
    // eof GET val

    // Configure date and time
    var loc_d = new Date();
    var opt = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var opt_loc = { timeZone: 'Asia/Jakarta', timeZoneName: 'short', hour12: false, hour: '2-digit', minute: '2-digit' };
    opt.timeZone = 'Asia/Jakarta';
    var d_loc = loc_d.toLocaleDateString(['ban', 'id'],opt);
    var t_loc = loc_d.toLocaleTimeString(['ban', 'id'],opt_loc);
    // eof date and time

    function diary_toast_alert(isi,waktu,bentuk){
        Materialize.toast(isi, waktu, bentuk);
    }

    function is_on_ajax(){
        return $.active;
    }

    function init_diary(){
        var guid_get = guid(),
        quill = new Quill('#editor', {
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline'],
                    ['link', 'blockquote', 'code-block', 'image'],
                    [{
                        list: 'ordered'
                    }, {
                        list: 'bullet'
                    }]
                ]
            },
            placeholder: 'Tulis ceritamu disini...',
            theme: 'bubble'
        }),
        config = {
            apiKey: "AIzaSyBAjTnEfCIzhQUVxlm-gnCePCQGrlON6MY",
            authDomain: "hicnstuff.firebaseapp.com",
            databaseURL: "https://hicnstuff.firebaseio.com",
            projectId: "hicnstuff",
            storageBucket: "hicnstuff.appspot.com",
            messagingSenderId: "235934309697"
        };
        firebase.initializeApp(config);

        var ref = firebase.database().ref();

        // on submit
        $('#diary_ku').submit(function(event) {
            var lengthContentQuill = quill.getLength();
            console.log(lengthContentQuill);
            if(lengthContentQuill > 4) {
                $('#on_button_submit').addClass("disabled");
                $.getJSON('//freegeoip.net/json/?callback=?', function(data) {
                    ref.child("diary").child(guid_get).set({
                        local_date: d_loc,
                        local_time: t_loc,
                        date: $.now(),
                        content: quill.getContents(),
                        ip: data.ip,
                        long: data.longitude,
                        lat: data.latitude,
                        kota: data.city
                    });

                });
                localStorage.setItem("guid", guid_get);
                setTimeout(function(){
                    $.ajax({
                        type: 'GET',
                        url: window.location.href,
                        data: {
                            'guid': localStorage.getItem("guid")
                        },
                        success: function(msg) {
                        },
                        complete: function(event, xhr, settings) {
                            var u = this.url;
                            var get_guid = getUrlParameter('guid', u);
                            if (typeof get_guid != 'undefined') {
                                $('#form-container').remove();
                                ref.child("diary").child(get_guid).on('value', function(snapshot) {
                                    if (snapshot.val() !== null) {
                                        $('article#story_editor').append(clone_display_diary);
                                        var quill_display_diary = new Quill('#display_diary', {
                                            modules: {
                                                toolbar: false
                                            },
                                            readOnly: true,
                                            theme: 'bubble'
                                        });
                                        quill_display_diary.updateContents(snapshot.val().content);
                                        quill_display_diary.insertText(0, snapshot.val().local_date+' - '+snapshot.val().local_time+'\n\n', {
                                            'bold': true
                                        });
                                        window.history.replaceState(null, null, window.location.pathname + "?guid=" + get_guid);
                                    } else {}
                                });
                            }
                        }

                    }); // eof ajax

                    if ($.active !== 0) {
                        $('#form-container').hide();
                    }
                },1500); //eof timeout
            }
            if(lengthContentQuill <= 1) {
                diary_toast_alert('Loh kok masih kosongan -_-', 2000, 'rounded');
            }
            if(lengthContentQuill <= 4 && lengthContentQuill >= 2){
                diary_toast_alert('Upss ceritamu terlalu pendek kawan ... ^-^', 2000, 'rounded')
            }
            event.preventDefault();
        })
        // eof on submit

        if(is_on_ajax() === 0){
            $('#form-container').show();
            console.log(is_on_ajax());
        }

        // display from hardcode url
        var get_guid_hard = getUrlParameterOnUse('guid');
        if (typeof get_guid_hard != 'undefined') {
            $('#form-container').remove();
            ref.child("diary").child(get_guid_hard).on('value', function(snapshot) {
                if (snapshot.val() !== null) {
                    $('article#story_editor').append(clone_display_diary);
                    var quill_display_diary = new Quill('#display_diary', {
                        modules: {
                            toolbar: false
                        },
                        readOnly: true,
                        theme: 'bubble'
                    });
                    quill_display_diary.updateContents(snapshot.val().content);
                    quill_display_diary.insertText(0, snapshot.val().local_date+' - '+snapshot.val().local_time+'\n\n', {
                        'bold': true
                    });
                } else {}
            });
        }
        // eof display from hardcode url
    }

    

    $(document).ready(function() {
        Materialize.updateTextFields();
        console.log('ready to use bro');
        var check_diary_on = $('p#diary_on_show').length;
        if(check_diary_on !== 0){
            init_diary();
        }
    });
})(jQuery);