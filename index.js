(function($) {
    'use strict';

    var cl_attr_button = $('.btn.waves-effect.darken').closest('div').clone();

    // Detect Mouse Leave
    function addEvent(obj, evt, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(evt, fn, false);
        }
        else if (obj.attachEvent) {
            obj.attachEvent("on" + evt, fn);
        }
    }

    // get all meta
    function am(num){
        var j_k = document.getElementsByTagName("meta");
        var h_s = j_k[num];
        return h_s;
    }

    function initGuide(){
        if(typeof introJs !== "undefined"){
            var introGuide = introJs();
            introGuide.setOptions({
                nextLabel:'Selanjutnya',
                prevLabel:'Kembali',
                doneLabel:'Terimakasih',
                skipLabel:'Abaikan',
            });
            introGuide.oncomplete(function(){
                localStorage.setItem('doneTour', 'finish');
            });
            introGuide.onexit(function(){
                localStorage.setItem('doneTour', 'finish');
            });
            var doneTour = localStorage.getItem('doneTour') === 'finish';
            if (doneTour) return;
            introGuide.start();
        }
    }

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

    var _slicedToArray = function() {
        function t(t, e) {
            var o = [],
                l = !0,
                i = !1,
                r = void 0;
            try {
                for (var a, n = t[Symbol.iterator](); !(l = (a = n.next()).done) && (o.push(a.value), !e || o.length !== e); l = !0);
            } catch (s) {
                i = !0, r = s
            } finally {
                try {
                    !l && n["return"] && n["return"]()
                } finally {
                    if (i) throw r
                }
            }
            return o
        }
        return function(e, o) {
            if (Array.isArray(e)) return e;
            if (Symbol.iterator in Object(e)) return t(e, o);
            throw new TypeError("Invalid attempt to destructure non-iterable instance")
        }
    }();

    function getFigureValueByUrl(t) {
        var e = void 0;
        var c_u = window.location.href;
        if ((e = t.match(/^(https?):\/\/(www\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/i)) || (e = t.match(/^(https?):\/\/(www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/i))) return {
            embed: c_u + "/youtube.html?youtube=" + t
        }
        if (e = t.match(/^data:(image\/gif|image\/jpe?g|image\/png|video\/mp4);base64,(.*)$/)) return "video/" == e[1].substr(0, 6) ? {
            video: t
        } : {
            image: t
        };
        if (e = t.match(/^(https?):\/\/\S+/i)) {
            var o = document.createElement("a");
            if (o.href = t, o.pathname.match(/\.(jpe?g|png|gif|mp4)$/i)) return "mp4" == e[1] ? {
                video: t
            } : {
                image: t
            }
        };
        return !1
    }

    function _sanitize(t, e) {
        var o = document.createElement("a");
        o.href = t;
        var l = o.href.slice(0, o.href.indexOf(":"));
        return e.indexOf(l) > -1
    }

    function _classCallCheck(t, e) {
        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
    }

    function _possibleConstructorReturn(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || "object" != typeof e && "function" != typeof e ? t : e
    }

    function _inherits(t, e) {
        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
        t.prototype = Object.create(e && e.prototype, {
            constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
    }

    function updateEditableText(t, e) {
        "undefined" == typeof e, e ? $(".editable_text:not(:has(.editable_input))", t).map(function() {
            var t = this.innerText,
                e = document.createElement("textarea");
            return e.classList.add("editable_input"), e.setAttribute("tabindex", "-1"), e.setAttribute("rows", "1"), e.value = t, t || this.classList.add("empty"), $(this).empty().append(e), autosize(e), e
        }) : $(".editable_text > .editable_input", t).map(function() {
            var t = this.value,
                e = this.parentNode;
            return $(e).empty().text(t), e
        })
    }

    function _resizeIframe(t, e, o) {
        $("iframe").map(function() {
            var l = null;
            try {
                l = this.contentWindow
            } catch (i) {}
            if (l && l == t) {
                var r = o / e;
                this.setAttribute("width", "640"), this.setAttribute("height", Math.round(640 * r) + ""), this.parentNode && this.parentNode.classList.contains("iframe_helper") && (this.parentNode.style.paddingTop = 100 * r + "%"), window.quill && quill.updateSelection(Quill.sources.USER)
            }
        })
    }

    var _createClass = function() {
        function t(t, e) {
            for (var o = 0; o < e.length; o++) {
                var l = e[o];
                l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), Object.defineProperty(t, l.key, l)
            }
        }
        return function(e, o, l) {
            return o && t(e.prototype, o), l && t(e, l), e
        }
    }(),
    _get = function t(e, o, l) {
        null === e && (e = Function.prototype);
        var i = Object.getOwnPropertyDescriptor(e, o);
        if (void 0 === i) {
            var r = Object.getPrototypeOf(e);
            return null === r ? void 0 : t(r, o, l)
        }
        if ("value" in i) return i.value;
        var a = i.get;
        if (void 0 !== a) return a.call(l)
    };

    // Configure date and time
    // Update date and time using momentjs http://momentjs.com/
    var d_t_id = "";
    if(typeof moment !== "undefined"){
        moment.locale('id');
        d_t_id = moment().format('LLLL');
    } else {
        d_t_id = new Date();
    }
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
            setTimeout(function(){
                if($('.btn.waves-effect.darken').length !== 0){
                    initGuide();
                }
            },2500);
        }
        var guid_get    = guid(),
        Inline          = Quill.import("blots/inline"),
        BlockEmbed      = Quill.import("blots/block/embed"),
        Parchment       = Quill.import("parchment"),
        Delta           = Quill.import("delta"),
        Keyboard        = Quill.import("modules/keyboard");

        var FigureBlot = function(t) {
        function e(t, o) {
                _classCallCheck(this, e);
                var l = _possibleConstructorReturn(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t));
                l.domWrapper = document.createElement("div"),
                l.domWrapper.classList.add("figure_wrapper"),
                l.domNode.appendChild(l.domWrapper),
                setTimeout(function() {
                    updateEditableText(l.domNode)
                }, 1);
                var i = !1;
                return o.embed && l.appendIframeNode(o.embed), o.image ? (l.appendImgNode(o.image), i = l.uploadData(o.image)) : o.video, l
            }
            return _inherits(e, t), _createClass(e, null, [{
                key: "create",
                value: function(t) {
                    var o = _get(e.__proto__ || Object.getPrototypeOf(e), "create", this).call(this, t);
                    return o.setAttribute("contenteditable", "false"), o
                }
            }]), _createClass(e, [{
                key: "appendImgNode",
                value: function(t) {
                    var e = document.createElement("img");
                    return e.setAttribute("src", this.sanitize(t)), this.domWrapper.appendChild(e), e
                }
                },{
                key: "appendIframeNode",
                value: function(t) {
                    var e = document.createElement("div"),
                        o = document.createElement("div"),
                        l = document.createElement("iframe");
                    return e.classList.add("iframe_wrap"), 
                    e.appendChild(o), 
                    o.classList.add("iframe_helper"), 
                    o.classList.add("video-container"),
                    o.style.paddingTop = "0", 
                    o.appendChild(l), 
                    l.setAttribute("src", this.sanitize(t)), 
                    l.setAttribute("width", "558"), 
                    l.setAttribute("height", "498"), 
                    l.setAttribute("frameborder", "0"), 
                    l.setAttribute("allowtransparency", "true"), 
                    l.setAttribute("allowfullscreen", "true"), 
                    l.setAttribute("scrolling", "no"), 
                    this.domWrapper.appendChild(e), 
                    e
                }
            },
            {
                key: "uploadData",
                value: function(t) {
                    var e = null;
                    return !!(e = t.match(/^data:(image\/gif|image\/jpe?g|image\/png|video\/mp4);base64,(.*)$/)) && {
                        type: e[1],
                        base64_data: e[2]
                    }
                }
            }, {
                key: "sanitize",
                value: function(t) {
                    return _sanitize(t, ["http", "https", "data"]) ? t : "//:0"
                }
            }, {
                key: "_index",
                value: function(t, e) {
                    if (t === this.domCaption) return 0;
                    var o = 0;
                    return t.nodeType == t.TEXT_NODE && (o += e >= 0 ? e : t.data.length), t.previousSibling ? o + this._index(t.previousSibling, -1) : t.parentNode ? o + this._index(t.parentNode, -1) : 0
                }
            }, {
                key: "_position",
                value: function(t, e) {
                    if (t.nodeType == t.TEXT_NODE) return e <= t.data.length ? [t, e] : (e -= t.data.length, [null, e]);
                    for (var o = t.firstChild; o;) {
                        var l = null,
                            i = this._position(o, e),
                            r = _slicedToArray(i, 2);
                        if (l = r[0], e = r[1], l) return [l, e];
                        o = o.nextSibling
                    }
                    return [t, e]
                }
            }, {
                key: "index",
                value: function(t, e) {
                    return 0
                }
            }, {
                key: "position",
                value: function(t, e) {
                    return [this.domCursor, 0]
                }
            }], [{
                key: "value",
                value: function o(t) {
                    var o = {},
                    e = t.querySelector("img");
                    e && (o.image = e.src);
                    var l = t.querySelector("video");
                    l && (o.video = l.src);
                    var i = t.querySelector("iframe");
                    i && (o.embed = i.src);
                    return o
                }
            }]), e
        }(BlockEmbed);
    FigureBlot.blotName = "blockFigure", FigureBlot.tagName = "div", Quill.register(FigureBlot);
    var LinkBlot = function(t) {
            function e(t, o) {
                _classCallCheck(this, e);
                var l = _possibleConstructorReturn(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t));
                return $(t).on("mouseover", function() {
                    showLinkTooltip(l, o)
                }), $(t).on("mouseout", function() {
                    hideLinkTooltip()
                }), l
            }
            return _inherits(e, t), _createClass(e, null, [{
                key: "create",
                value: function(t) {
                    var o = _get(e.__proto__ || Object.getPrototypeOf(e), "create", this).call(this, t);
                    t = this.sanitize(t), o.setAttribute("href", t);
                    var l = t.substr(0, 1);
                    return "/" != l && "#" != l && "mailto:" != t.substr(0, 7) && o.setAttribute("target", "_blank"), o
                }
            }, {
                key: "formats",
                value: function(t) {
                    return t.getAttribute("href")
                }
            }, {
                key: "sanitize",
                value: function(t) {
                    return _sanitize(t, ["http", "https", "mailto"]) ? relativeUrl(t) : "about:blank"
                }
            }]), _createClass(e, [{
                key: "detach",
                value: function() {
                    $(this.domNode).off("mouseover mouseout"), _get(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "detach", this).call(this), hideLinkTooltip()
                }
            }, {
                key: "format",
                value: function(t, o) {
                    return t === this.statics.blotName && o ? (o = this.constructor.sanitize(o), this.domNode.setAttribute("href", o), void this.domNode.setAttribute("data-title", o)) : _get(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "format", this).call(this, t, o)
                }
            }]), e
        }(Inline);
        
        var quill = new Quill('#editor', {
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline']
                ],
                clipboard: {
                    matchers: 
                    [
                        ["img", function(t, e) {
                            return t.src && _sanitize(t.src, ["http", "https", "data"]) ? (new Delta).insert({
                                blockFigure: {
                                    image: t.src,
                                }
                            }) : new Delta
                        }],
                        ["video", function(t, e) {
                            return t.src && _sanitize(t.src, ["http", "https", "data"]) ? (new Delta).insert({
                                blockFigure: {
                                    video: t.src
                                }
                            }) : new Delta
                        }],
                        ["br", function(t, e) {
                            return t.classList.contains("inline") ? (new Delta).insert({
                                textBreak: !0
                            }) : e
                        }]
                    ]
                },
                keyboard: {
                    bindings: {
                        "detect embed": {
                            key: Keyboard.keys.ENTER,
                            collapsed: !0,
                            handler: function(t, e) {
                                var o = quill.scroll.line(t.index),
                                l = _slicedToArray(o, 2),
                                i = l[0],
                                r = l[1];
                                if (i) {
                                    var n = i.domNode.innerText,
                                        s = n.substr(0, r),
                                        u = void 0;
                                    if (u = s.match(/(^|\s)(https?:\/\/\S+)$/)) {
                                        var c = u[2];
                                        var d = quill.scroll.descendants(LinkBlot, t.index - c.length, c.length);
                                        if(quill.formatText(t.index - c.length, c.length, "link", c, Quill.sources.USER), !s.substr(0, r - c.length).trim().length && "P" == i.domNode.tagName){
                                            var p = getFigureValueByUrl(c);
                                            if (p) {
                                                var h = i.offset(quill.scroll);
                                                return quill.updateContents((new Delta).retain(h)["delete"](s.length).insert({
                                                    blockFigure: p
                                                }), Quill.sources.USER), !1
                                                
                                            }
                                        }
                                    }
                                }
                                return !0;
                            }
                        },
                    }
                }
            },
            formats: ["bold", "italic", "underline","link","blockFigure"],
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
                        }
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

        function convertToSlug(Text)
        {
            return Text
                .toLowerCase()
                .replace(/[^\w ]+/g,'')
                .replace(/ +/g,'-')
                ;
        }

        // on submit
        $(conv_to_id_btn_sec).click(function() {
            var lengthContentQuill = quill.getLength(),
            lengthofTitle = quill_title.getLength(),
            title_text = quill_title.getText(),
            res = convertToSlug(title_text),
            es = res.replace(/[-\s]*$/, '-'),
            es = es.replace(/-{2,}/g, '-'),
            rs = es+'-'+title_text.hashCode(),
            rs = rs.replace(/-{2,}/g, '-'),
            result = rs;

            if(lengthContentQuill > 4 && lengthofTitle > 4) {
                $('.btn.waves-effect.darken').addClass("disabled");
                $('.btn.waves-effect.darken').removeAttr('id');
                var attr_button = $('.btn.waves-effect.darken').closest('div');
                attr_button.remove();
                $('#on_content_button').hide();

                $.getJSON('//freegeoip.net/json/?callback=?', function(data) {
                    ref.child("iniceritaku").child(result).set({
                        create_date: d_t_id,
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
                                        quill.insertText(0, snapshot.val().create_date+'\n\n', {
                                            'bold': true,
                                            'link' : false,
                                        });
                                        window.history.replaceState(null, null, window.location.pathname + "?ceritaku=" + result);
                                        quill.enable(false);
                                        quill_title.enable(false); 
                                        document.title = title_text+" | Ceritaku";
                                        am(6).content = title_text;
                                        am(8).content = u;
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
                    quill.insertText(0, snapshot.val().create_date+'\n\n', {
                        'bold': true,
                        'link' : false,
                    });
                    quill_title.setContents(snapshot.val().title);
                    quill.enable(false);
                    quill_title.enable(false);
                    document.title = quill_title.getText()+" | Ceritaku";
                    am(6).content = quill_title.getText();
                    am(8).content = window.location.href;
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
            addEvent(document, "mouseout", function(e) {
                e = e ? e : window.event;
                var from = e.relatedTarget || e.toElement;
                if (!from || from.nodeName == "HTML") {
                    // console.log("Mouse Leave");
                }
            });
        }
    });
})(jQuery);