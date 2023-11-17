$(document).ready(function(){
    $(".add-list-btn").addClass("active");
    $(".add-list").show();
    $(".delete-list").hide();
    $(".correction-list").hide();

    $(".add-list-btn").click(function(){
        $(".delete-list-btn").removeClass("active");
        $(".correction-list-btn").removeClass("active");
        $(this).addClass("active");
        
        $(".delete-list").hide();
        $(".correction-list").hide();
        $(".add-list").show();
    });

    $(".delete-list-btn").click(function(){
        $(".add-list-btn").removeClass("active");
        $(".correction-list-btn").removeClass("active");
        $(this).addClass("active");
        
        $(".add-list").hide();
        $(".correction-list").hide();
        $(".delete-list").show();
    });

    $(".correction-list-btn").click(function(){
        $(".add-list-btn").removeClass("active");
        $(".delete-list-btn").removeClass("active");
        $(this).addClass("active");
        
        $(".add-list").hide();
        $(".delete-list").hide();
        $(".correction-list").show();
    });
});

// 직접 입력
$(function() {
    $(".selboxDirect").hide();
    
    $(".category").change(function() {
        var parentCategoryBox = $(this).closest('.category-box');

        if ($(this).val() == "direct") {
            $(".selboxDirect", parentCategoryBox).show();
            $(this).hide();
        } else {
            $(".selboxDirect", parentCategoryBox).hide();
        }
    });
});

$(function(){
    $(".modalWrap").hide();

    $(".category-color").click(function(event){
        event.stopPropagation();
        $(".modalWrap").show();
    });

    $(".modalWrap").click(function(event){
        event.stopPropagation();
    });

    $(document).click(function(){
        $(".modalWrap").hide();
    });
});

$(document).ready(function(){
    $(".color").click(function(){
        var color = $(this).css("background-color");

        var currentColor = $(".category-color").css("background-color");

        if (color != currentColor) {
            $(".category-color").css("background-color", color);
        }
    });
});