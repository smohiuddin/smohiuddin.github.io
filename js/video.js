( function( $ ) {
    "use strict";
    
    var $playerObject = $('.player');

    $playerObject.mb_YTPlayer();

    // Video Controls (Play/Pause - Sound On/Off)
    $('#video-controls a').click(function(){

        var icon = $(this).find('i');

        if ( $(this).attr('id') == 'on-off-sound' ) {

            if ( icon.hasClass('fa-volume-off') ) {
                icon.removeClass('fa fa-volume-off').addClass('fa fa-volume-up');
            } else {
                icon.removeClass('fa fa-volume-up').addClass('fa fa-volume-off');
            }
            $playerObject.toggleVolume();

        } else {

            if ( icon.hasClass('fa-play') ) {
                icon.removeClass('fa fa-play').addClass('fa fa-pause');
                $('.player').playYTP();
            } else {
                icon.removeClass('fa fa-pause').addClass('fa fa-play');
                $playerObject.pauseYTP();
            }

        } 
        return false;
    });

} )( jQuery );