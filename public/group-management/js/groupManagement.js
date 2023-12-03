const groupManagementContainer = document.getElementsByClassName('group-management-container')[0];

getMyGroups();

async function getMyGroups() {
    const results = await axios.get(
        `${BASE_URL}/users/${USER_NO}/groups`)
        .then(response => {
            console.log(response.data);
            return response.data;
        })
        .catch(error => {
            console.error(error);
            return null;
        });

    groupManagementContainer.innerHTML = '';
    for (let result of results) {
        const myGroupContainer = document.createElement('div');
        myGroupContainer.className = 'my-group-container';

        const myGroup = document.createElement('div');
        myGroup.className = 'my-group';

        const myGroupGoalContainer = document.createElement('div');
        myGroupGoalContainer.className = 'my-group-goal-container';

        const myGroupName = document.createElement('div');
        myGroupName.className = 'my-group-name';
        myGroupName.innerHTML = result.group_name;

        const myGroupGoal = document.createElement('div');
        myGroupGoal.className = 'my-group-goal';
        myGroupGoal.innerHTML = result.group_todo;

        myGroupGoalContainer.appendChild(myGroupName);
        myGroupGoalContainer.appendChild(myGroupGoal);
        myGroup.appendChild(myGroupGoalContainer);

        const groupMember = document.createElement('div');
        groupMember.className = 'group-member';

        const num = document.createElement('p');
        num.className = 'num';
        const count = await getGroupMemberCount(result.group_no);
        num.innerHTML = count + "";

        const userIcon = document.createElement('i');
        userIcon.classList.add('bx', 'bx-user');

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'modal';

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        const deleteQ = document.createElement('div');
        deleteQ.innerHTML = `${result.group_name} 그룹을 탈퇴하시겠습니까?`;
        deleteQ.className = 'delete-question';

        const hr_ = document.createElement('hr');
        hr_.className = 'row'

        const deleteContainter = document.createElement('div');
        deleteContainter.className = 'delete-container';

        const yesDiv = document.createElement('div');
        yesDiv.className = 'yes';
        yesDiv.innerHTML = '탈퇴';

        const hr2 = document.createElement('hr');
        hr2.className = 'column';

        const noDiv = document.createElement('div');
        noDiv.innerHTML = '취소';
        noDiv.className = 'no';

        deleteContainter.appendChild(yesDiv);
        deleteContainter.appendChild(hr2);
        deleteContainter.appendChild(noDiv);

        modalContent.appendChild(deleteQ);
        modalContent.appendChild(hr_);
        modalContent.appendChild(deleteContainter);
        modal.appendChild(modalContent);

        groupMember.appendChild(num);
        groupMember.appendChild(userIcon);
        myGroup.appendChild(groupMember);

        myGroupContainer.appendChild(myGroup);
        myGroupContainer.appendChild(modal);

        console.log(myGroupContainer)
        groupManagementContainer.appendChild(myGroupContainer);

        noDiv.onclick = () => window.open('/group-management/', '_top');
        yesDiv.onclick = () => {
            axios.delete(`${BASE_URL}/groups/${result.group_no}/users/${USER_NO}`)
                .then(respones => respones)
                .catch(error => error);
            window.open('/group-management/', '_top');
        }
    };

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