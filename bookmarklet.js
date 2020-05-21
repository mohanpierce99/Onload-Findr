(function() {

    var chatternet_unique_page_id = window.location.href;
    console.log(chatternet_unique_page_id);
    chatternet_jquery_loading_script = document.createElement('script')
    chatternet_jquery_loading_script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js";
    
    
    chatternet_jquery_loading_script.onload = function() {
    
        var frame = $("<iframe/>");
        frame.attr("src", "https://onload2.surge.sh?roomid=" + chatternet_unique_page_id);
        frame.attr("sandbox","allow-forms allow-modals allow-scripts allow-same-origin allow-top-navigation allow-top-navigation-by-user-activation");
        frame.attr("allow","camera;microphone");
    
        var frameWidth = "400px";
    
        frame.css({
            margin: "0px",
            padding: "0px",
            position: "fixed",
            top: 0,
            bottom: 0,
            right: 0,
            resize: "none",
            zIndex: 2147483647,
            width: frameWidth,
            height: "100%"
        });
        $("html").css({
            paddingRight: frameWidth,
            overflow: "scroll"
        });
        $("body").css("overflow", "scroll").after(frame);
    
     
    };
    document.head.appendChild(chatternet_jquery_loading_script);
    })();