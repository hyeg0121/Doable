const idInput = document.getElementById('id-input');
const pwInput = document.getElementById('pw-input');
const loginButton = document.getElementsByClassName('login-btn')[0];

loginButton.onclick = () => {
    let userid = idInput.value;
    let password = pwInput.value;

    let loginRequest = {
        user_id: userid,
        user_pw: password
    };

    axios.post(`${BASE_URL}/login`, loginRequest)
    .then(response => {
        console.log(response);
        const userNo = response.data.result;
        setCookie('login', userNo);
        console.log('Registration successful:', response.data);
        window.open('../main/', '_top');

    })
    .catch(error => {
        console.error('Registration failed:', error);
    });
};

