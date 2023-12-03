
// $(document).ready(function () {
//     let longClickTimer;
//     const myGroup = $('.my-group');
//     const modal = $('.modal');

//     myGroup.on('mousedown touchstart', handleMouseDown);
//     myGroup.on('mouseup touchend', handleMouseUp);

//     function handleMouseDown() {
//         longClickTimer = setTimeout(showModal, 1000); // 1 second
//     }

//     function handleMouseUp() {
//         clearTimeout(longClickTimer);
//     }

//     function showModal() {
//         modal.css('display', 'flex');
//     }

//     function closeModal() {
//         modal.css('display', 'none');
//     }    
// });
// $(function () {
//     let clickTimer;
//     const myGroup = $('.my-group');
//     const modal = $('.modal');

//     myGroup.on('mousedown touchstart', handleMouseDown);
//     myGroup.on('mouseup touchend', handleMouseUp);

//     function handleMouseDown() {
//         var myGroupContainer = $(this).closest('.my-group-container');
//         clickTimer = setTimeout(function () {
//             myGroupContainer.find(".modal").show();
//             myGroupContainer.find(".modal").css('display', 'flex');
//         }, 1000); // 1 second
//     }

//     function handleMouseUp() {
//         clearTimeout(clickTimer);
//     }

//     $('.no').click(function(){
//         $(".modal").hide();
//     });

//     $(document).click(function () {
//         $(".modal").hide();
//     });

//     $(".modal").click(function (event) {
//         event.stopPropagation();
//     });

//     $(".modal-content").click(function (event) {
//         event.stopPropagation();
//     });
// });

$(function () {
    let clickTimer;
    const groupManagementContainer = $('.group-management-container');

    // 이벤트 위임
    groupManagementContainer.on('mousedown touchstart', '.my-group', handleMouseDown);
    groupManagementContainer.on('mouseup touchend', '.my-group', handleMouseUp);

    function handleMouseDown() {
        var myGroupContainer = $(this).closest('.my-group-container');

        myGroupContainer.find(".modal").show();
        myGroupContainer.find(".modal").css('display', 'flex');
    }

    function handleMouseUp() {
        clearTimeout(clickTimer);
    }

    groupManagementContainer.on('click', '.no', function(){
        $(".modal").hide();
    });

    // $(document).on('click', function () {
    //     $(".modal").hide();
    // });

    groupManagementContainer.on('click', ".modal", function (event) {
        event.stopPropagation();
    });

    groupManagementContainer.on('click', ".modal-content", function (event) {
        event.stopPropagation();
    });
});