// $(document).ready(function() {
//     $(".group-box:first").addClass("selected-group");

//     $(".group-box").click(function() {
//         // 다른 그룹 박스에서 선택을 해제하고, 클릭한 그룹 박스에 선택을 추가합니다.
//         $(".group-box").removeClass("selected-group");
//         $(this).addClass("selected-group");
//     });
// });

// var $scrItem = $('.group-box');
// var scrIWidth = 0;
// var columnGap = parseInt($('.group-container').css('column-gap'), 10) || 0;

// for (var i = 0; i < $scrItem.length; i++) {
//     scrIWidth += $scrItem.eq(i).outerWidth() + columnGap;
// }

// $('.group-container').css('width', scrIWidth);

// $scrItem.click(function () {
//     var target = $(this);
//     $scrItem.removeClass('on');
//     target.addClass('on');
//     muCenter(target);
// });

// function muCenter(target) {
//     var box = $('.scroll-group-container');
//     var boxItem = box.find('.group-box');
//     var boxHarf = (box.width() + columnGap) / 2;
//     var pos;
//     var listWidth = 0;
//     var targetLeft = 0;

//     boxItem.each(function (index) {
//         listWidth += $(this).outerWidth() + (index < boxItem.length - 1 ? columnGap : 0); // 마지막 요소를 제외한 나머지에 column-gap 추가
//     });

//     for (var i = 0; i < target.index(); i++) targetLeft += boxItem.eq(i).outerWidth() + columnGap; // column-gap 추가

//     var selectTargetPos = targetLeft + target.outerWidth() / 2;

//     if (selectTargetPos <= boxHarf) {
//         pos = 0;
//     } else if (listWidth - selectTargetPos <= boxHarf) {
//         pos = listWidth - box.width();
//     } else {
//         pos = selectTargetPos - boxHarf;
//     }

//     setTimeout(function () {
//         box.animate({ scrollLeft: pos }, 200);
//     }, 1);

//     console.log('boxHarf:', boxHarf);
//     console.log('selectTargetPos:', selectTargetPos);
// }

// $(function(){
//     $(".search-window").hide();

//     $(".search").on("input", function() {
//         if ($(this).val() != "") {
//             $(".search-window").show();
//             $(".plus-icon").hide();
//             $('.input-box').addClass("active");
//         } else {
//             $(".search-window").hide();
//             $('.search').removeClass("active");
//             $(".plus-icon").show();
//         }
//     });
// });

$(document).ready(function() {
    $(".group-container").on('click', '.group-box', function() {
        $(".group-box").removeClass("selected-group");
        $(this).addClass("selected-group");

        muCenter($(this));
    });

    var $scrItem = $('.group-box');
    var scrIWidth = 0;
    var columnGap = parseInt($('.group-container').css('column-gap'), 10) || 0;

    for (var i = 0; i < $scrItem.length; i++) {
        scrIWidth += $scrItem.eq(i).outerWidth() + columnGap;
    }

    $('.group-container').css('width', scrIWidth);

    $scrItem.click(function () {
        var target = $(this);
        $scrItem.removeClass('on');
        target.addClass('on');
        muCenter(target);
    });

    function muCenter(target) {
        var box = $('.scroll-group-container');
        var boxItem = box.find('.group-box');
        var boxHarf = (box.width() + columnGap) / 2;
        var pos;
        var listWidth = 0;
        var targetLeft = 0;

        boxItem.each(function (index) {
            listWidth += $(this).outerWidth() + (index < boxItem.length - 1 ? columnGap : 0); // 마지막 요소를 제외한 나머지에 column-gap 추가
        });

        for (var i = 0; i < target.index(); i++) targetLeft += boxItem.eq(i).outerWidth() + columnGap; // column-gap 추가

        var selectTargetPos = targetLeft + target.outerWidth() / 2;

        if (selectTargetPos <= boxHarf) {
            pos = 0;
        } else if (listWidth - selectTargetPos <= boxHarf) {
            pos = listWidth - box.width();
        } else {
            pos = selectTargetPos - boxHarf;
        }

        setTimeout(function () {
            box.animate({ scrollLeft: pos }, 200);
        }, 1);

        console.log('boxHarf:', boxHarf);
        console.log('selectTargetPos:', selectTargetPos);
    }

    $(".search-window").hide();

    $(".search").on("input", function() {
        if ($(this).val() != "") {
            $(".search-window").show();
            $(".plus-icon").hide();
            $('.input-box').addClass("active");
        } else {
            $(".search-window").hide();
            $('.search').removeClass("active");
            $(".plus-icon").show();
        }
    });
});
