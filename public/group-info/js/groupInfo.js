const ID = new URL(location.href).searchParams.get('id');

const groupNameDiv = document.getElementById('group-name');
const groupDescDiv = document.getElementById('group-desc');
const groupTodoDiv = document.getElementById('group-todo');
const groupMemberCountDiv = document.getElementById('group-member-count');
const joinButton = document.getElementsByClassName('join-btn')[0];

showGroupInfo();

// 그룹 정보 조회 함수
async function showGroupInfo() {
    const group = await axios.get(`${BASE_URL}/groups/${ID}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error(error);
            return null;
        });

    if (!group) return;

    console.log(group);
    groupNameDiv.innerHTML = group.group_name;
    groupDescDiv.innerHTML = group.group_desc;
    groupTodoDiv.innerHTML = group.group_todo;

    const count = await getGroupMemberCount(group.group_no);
    console.log(count);
    groupMemberCountDiv.innerHTML = count + "";


    const isMember = await isGroupMember(group.group_no);
    if (isMember) {
        joinButton.innerHTML = '이미 가입된 그룹입니다.';
        joinButton.disabled = true;
        joinButton.style.backgroundColor = 'lightgray';
    }

}

// 그룹 가입 여부 확인하는 함수
async function isGroupMember(groupNo) {
    const isMember = await axios.get(`${BASE_URL}/groups/${groupNo}/membership/${USER_NO}`)
        .then(response => {
            console.log(response);
            return response.data.result;
        })
        .catch(error => {
            console.error(error);
            return false;
        });

    return isMember;
}

async function getGroupMemberCount(groupNo) {
    const count = await axios.get(`${BASE_URL}/groups/${groupNo}/users`)
        .then(response => {
            return response.data.length;
        })
        .catch(error => {
            console.error(error);
            return [];
        })

    return count;
}

// 그룹 가입하기
joinButton.onclick = () => {
    const request = {
        user_no: USER_NO,
        group_no: ID
    };

    axios.post(`${BASE_URL}/groups/${ID}/users/${USER_NO}`, request)
        .then(response => console.log(response))
        .catch(error => console.log(error));

    window.open('/group/', '_top');
}