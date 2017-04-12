(function($) {
    'use strict';

    var cl_attr_button = $('.btn.waves-effect.darken').closest('div').clone();

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

    // HASH
    String.prototype.hashCode = function() {
        var hash = 0, i, chr;
        if (this.length === 0) return hash;
        for (i = 0; i < this.length; i++) {
            chr   = this.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };
    // eof HASH

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
        if(is_on_ajax() === 0){
            $('#form-container').show();
        }
        var guid_get = guid(),
        Keyboard = Quill.import("modules/keyboard"),
        quill = new Quill('#editor', {
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline'],
                    ['image']
                ]
            },
            placeholder: 'Tulis ceritamu disini...',
            theme: 'bubble'
        }),
        quill_title = new Quill('#editor_title', {
            modules: {
                toolbar : false,
                keyboard: {
                    bindings: {
                        tab: false,
                        handleEnter: {
                            key: 13,
                            handler: function() {}
                        },
                        "required enter": {
                            key: Keyboard.keys.ENTER,
                            collapsed: !0,
                            shiftKey: null,
                            suffix: /^$/,
                            handler: function(t, e) {
                            }
                        },
                    }
                }
            },
            placeholder: 'Tulis judul ceritamu disini...',
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

        var ref = firebase.database().ref(),
        btn_sec = 'on_button_submit_'+guid_get,
        conv_to_id_btn_sec = '#'+btn_sec;
        $('.btn.waves-effect.darken').attr('id', btn_sec);

        // on submit
        $(conv_to_id_btn_sec).click(function() {
            var lengthContentQuill = quill.getLength(),
            lengthofTitle = quill_title.getLength(),
            title_text = quill_title.getText(),
            hash_title = title_text.hashCode(),
            result = title_text.replace(/[^a-z0-9+]+/gi, '-'),
            result = result+''+title_text.hashCode(),
            result = result.toLowerCase();

            if(lengthContentQuill > 4 && lengthofTitle > 4) {
                $('.btn.waves-effect.darken').addClass("disabled");
                $('.btn.waves-effect.darken').removeAttr('id');
                var attr_button = $('.btn.waves-effect.darken').closest('div');
                attr_button.remove();
                $('#on_content_button').hide();

                $.getJSON('//freegeoip.net/json/?callback=?', function(data) {
                    ref.child("iniceritaku").child(result).set({
                        local_date: d_loc,
                        local_time: t_loc,
                        date: $.now(),
                        content: quill.getContents(),
                        title: quill_title.getContents(),
                        permalink: result,
                        ip: data.ip,
                        long: data.longitude,
                        lat: data.latitude,
                        kota: data.city
                    });

                });
                localStorage.setItem("permalink", result);
                setTimeout(function(){
                    $.ajax({
                        type: 'GET',
                        url: window.location.href,
                        data: {
                            'ceritaku': localStorage.getItem("permalink")
                        },
                        success: function(msg) {
                        },
                        complete: function(event, xhr, settings) {
                            var u = this.url,
                            get_permalink = getUrlParameter('ceritaku', u);
                            if (typeof get_permalink != 'undefined') {
                                ref.child("iniceritaku").child(get_permalink).on('value', function(snapshot) {
                                    if (snapshot.val() !== null) {
                                        quill.insertText(0, snapshot.val().local_date+' - '+snapshot.val().local_time+'\n\n', {
                                        'bold': true
                                        });
                                        window.history.replaceState(null, null, window.location.pathname + "?ceritaku=" + result);
                                        quill.enable(false);
                                        quill_title.enable(false); 
                                        $('#form-container').show();
                                    } else {
                                        $('#form-container').hide();
                                    }
                                });
                            }
                            
                        }

                    }); // eof ajax

                },1500); //eof timeout
            }
            if(lengthContentQuill <= 1 && lengthofTitle <= 1) {
                diary_toast_alert('Loh kok masih kosongan semua -_-', 1500, 'rounded');
            }
            if((lengthContentQuill <= 4 && lengthContentQuill >= 2) && (lengthofTitle <= 4 && lengthofTitle >= 2) ){
                diary_toast_alert('Upss terlalu pendek kawan ^-^', 1500, 'rounded');
            }
            if(lengthContentQuill <= 1 && lengthofTitle > 4) {
                diary_toast_alert('Ceritanya kok masih kosong', 1500, 'rounded');
            }
            if((lengthContentQuill <= 4 && lengthContentQuill >= 2) && lengthofTitle > 4){
                diary_toast_alert('Ceritamu terlalu pendek kawan', 1500, 'rounded');
            }
            if(lengthContentQuill > 4 && lengthofTitle <= 1) {
                diary_toast_alert('Judulnya kok belum ada', 1500, 'rounded');
            }
            if((lengthofTitle <= 4 && lengthofTitle >= 2) && lengthContentQuill > 4){
                diary_toast_alert('Judulnya terlalu pendek', 1500, 'rounded');
            }
            if((lengthofTitle <= 4 && lengthofTitle >= 2) && lengthContentQuill <= 1){
                diary_toast_alert('Judul kependekan dan cerita masih kosong', 1500, 'rounded');
            }
            if((lengthContentQuill <= 4 && lengthContentQuill >= 2) && lengthofTitle <= 1){
                diary_toast_alert('Cerita kependekan dan judul masih kosong', 1500, 'rounded');
            }
        })
        // eof on submit

        // display from hardcode url
        var get_permalink_hard = getUrlParameterOnUse('ceritaku');
        if (typeof get_permalink_hard != 'undefined') {
            $('#form-container').hide();
            ref.child("iniceritaku").child(get_permalink_hard).on('value', function(snapshot) {
                if (snapshot.val() !== null) {
                    $('.btn.waves-effect.darken').addClass("disabled");
                    $('.btn.waves-effect.darken').removeAttr('id');
                    var attr_button = $('.btn.waves-effect.darken').closest('div');
                    attr_button.remove();
                    $('#on_content_button').hide();
                    quill.setContents(snapshot.val().content);
                    quill.insertText(0, snapshot.val().local_date+' - '+snapshot.val().local_time+'\n\n', {
                        'bold': true
                    });
                    quill_title.setContents(snapshot.val().title);
                    quill.enable(false);
                    quill_title.enable(false);
                    $('#form-container').show();
                } else {
                    $('#form-container').hide();
                }
            });
        }
        // eof display from hardcode url
    }

    $(document).ready(function() {
        Materialize.updateTextFields();
        var check_diary_on = $('p#diary_on_show').length;
        if(check_diary_on !== 0){
            init_diary();
        }
    });
})(jQuery);