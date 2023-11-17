// const BASE_URL = "http://ec2-15-164-2-91.ap-northeast-2.compute.amazonaws.com:3000";
const BASE_URL = "http://localhost:3000";
const USER_NO = getCookie('login');

function setCookie(name, value, unixTime) {
    var date = new Date();
    date.setTime(date.getTime() + unixTime);
    document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';expires=' + date.toUTCString() + ';path=/';
}

function getCookie(name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null;
}