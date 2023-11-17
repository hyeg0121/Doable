const groupContainer = document.getElementsByClassName('group-container')[0];
const goalContainer = document.getElementsByClassName('goal-container')[0];
const todoNameDiv = document.getElementsByClassName('todo-name')[0];
const bestUserNameDiv = document.getElementsByClassName('best-username')[0];
const bestAmountDiv = document.getElementsByClassName('best-amount')[0];
const unitDiv = document.getElementsByClassName('unit')[0];
const updateButton = document.getElementsByClassName('registration-btn')[0];
const checkBox = document.getElementById('check');
const unitBox = document.getElementsByClassName('unit-box')[0];

let selectedGroupNo = 0;

showUsersGroups();

async function showUsersGroups() {
    groupContainer.innerHTML = '';
    const groups = await axios.get(`${BASE_URL}/users/${USER_NO}/groups`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error(error);
            return null;
        });

    showGroupsTodo(groups[0].group_no);

    let k = 0;
    for (let group of groups) {
        const groupBox = $("<div>").addClass("group-box");

        const groupName = $("<p>").addClass("group-name").text(group.group_name);

        const groupMember = $("<div>").addClass("group-member");

        const num = $("<p>").addClass("num");
        const count = await getGroupMemberCount(group.group_no);
        num.text(count + "");

        const userIcon = $("<i>").addClass("bx bx-user");

        groupMember.append(num, userIcon);
        groupBox.append(groupName, groupMember);
        $(".group-container").append(groupBox);

        groupBox.on('click', function() {
            showGroupsTodo(group.group_no);
        });

        if (k === 0)
            groupBox.click();

        k = 1;
    }
}


// 선택된 그룹의 투두 보여주기
async function showGroupsTodo(groupNo) {
    selectedGroupNo = groupNo;

    const group = await axios.get(`${BASE_URL}/groups/${groupNo}`)
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log(err);
            return null;
        });

    todoNameDiv.innerHTML = group.group_todo;
    unitDiv.innerHTML = group.group_unit;
    if (group.bestuser_no === null) {
        bestUserNameDiv.innerHTML = '아직 베스트 ';
        bestAmountDiv.innerHTML = '유저가 존재하지 않습니다.';
        return;
    }
    const bestUserName = await getUserName(group.bestuser_no);
    bestUserNameDiv.innerHTML = bestUserName + '님,';
    bestAmountDiv.innerHTML = group.group_bestamount + group.group_unit;
}

// 그룹에 가입된 멤버 수 구하기
async function getGroupMemberCount(groupNo) {
    const count = await axios.get(`${BASE_URL}/groups/${groupNo}/users`)
        .then(response => {
            return response.data.length;
        })
        .catch(error => {
            console.error(error);
            return 0;
        })

    return count;
}

// 베스트 유저의 이름 가져오기
async function getUserName(userNo) {
    const name = await axios.get(`${BASE_URL}/users/${userNo}`)
        .then(response => response.data.user_name)
        .catch(error => {
            console.error(error);
            return 'name';
        })

    return name;
}

// 그룹 목표 업데이트 하기
updateButton.onclick = () => {
    const value = unitBox.value.trim();
    if (value.length === 0) return;

    const request = {
        user_no: USER_NO,
        amount: value
    };
    
    console.log(request);

    console.log(request);   
    axios.patch(
        `${BASE_URL}/groups/${selectedGroupNo}/todos`, request
    )
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.error(error);
    });

    // location.reload();
}