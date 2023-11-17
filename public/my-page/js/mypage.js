const profileImageTag = document.getElementsByClassName('profile-image')[0];
const userNameTag = document.getElementsByClassName('user-name')[0];
const userIdTag = document.getElementsByClassName('user-id')[0];
const nameEditField = document.getElementById('name-correction');

// 이름 수정하기
nameEditField.onkeydown = e => {
    // 엔터 누르면
    if (e.keyCode === 13) {
        const name = nameEditField.value.trim();
        if (name.length === 0) return;

        const request = {
            user_name: name
        };  

        axios.patch(`${BASE_URL}/users/${USER_NO}`, request)
            .then(response => {
                nameEditField.style.display = 'none';
                window.open('/my-page/', '_top');    
            })
            .catch(error => console.log(error));
        
            
    }
}

showUserInfo();
async function showUserInfo() {
    const data = await axios.get(`${BASE_URL}/users/${USER_NO}`)
        .then(response => response.data)
        .catch(error => console.error(error))

    userNameTag.innerHTML = data.user_name;
    userIdTag.innerHTML = data.user_id;
}

$(document).ready(function () {
    $('.name-correction').hide();
    $('.pencil-icon').click(function () {
        $('.user-name').hide();
        $('.name-correction').css('display', 'flex');
    });

    $(document).on('click', function (event) {
        if (!$(event.target).closest('.name-correction, .pencil-icon').length) {
            
            $('.user-name').show();
            $('.name-correction').hide();
        }
    });
});