const nameInput = document.getElementById('name-input');
const idInput = document.getElementById('id-input');
const pwInput = document.getElementById('pw-input');
const pwCheckInput = document.getElementById('pw-check');
const mailInput = document.getElementById('mail-id-input');
const mailDomainSelbox = document.getElementById('selbox');
const mailDomainInput = document.getElementById('selboxDirect');
const joinButton = document.getElementsByClassName('join-btn')[0];


let checkPW = () => {
    let pw = pwInput.value;
    let check = pwCheckInput.value;

    if (pw != check) {
        // TODO: 경고 문구 디자인하기
        alert('비밀번호가 같지 않습니다.');
    } 
};

pwCheckInput.onblur = checkPW;

joinButton.onclick = () => {

    let name = nameInput.value;
    let userid = idInput.value;
    let password = pwInput.value;
    let email = mailInput.value + '@';
    if (mailDomainSelbox.value === 'direct') {
        email += mailDomainInput.value;
    } else email +=  mailDomainSelbox.value + 'com';
    const userData = {
        user_name: name,
        user_id: userid,
        user_pw: password,
        user_email: email
    };

    console.log(userData);

    axios.post(`${BASE_URL}/join`, userData)
    .then(response => {
        console.log('Registration successful:', response.data);
        window.open('/login/', '_top');
    })
    .catch(error => {
        console.error('Registration failed:', error);
    });
};

// 직접 입력
$(function(){
    $("#selboxDirect").hide();
    $("#selbox").change(function() {
        if($("#selbox").val() == "direct") {
    
            $("#selboxDirect").show();
            $("#selbox").hide();
    
        }  else {
    
            $("#selboxDirect").hide();
    
        }
        }) 
    });