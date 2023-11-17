const searchField = document.getElementsByClassName('search')[0];
const searchContainer = document.getElementsByClassName('search-container')[0];

searchField.onkeydown = e => {
    const q = searchField.value.trim();
    if (q === '') return;
    getSearchResult(q);

}

async function getSearchResult(q) {
    const results = await axios.get(
        `${BASE_URL}/groups/group/search?q=${q}`)
        .then(response => {
            console.log(response.data);
            return response.data;
        })
        .catch(error => {
            console.error(error);
            return null;
        });

    searchContainer.innerHTML = '';
    for (let result of results) {
        const searchResult = document.createElement('div');
        searchResult.className = 'search-result';

        const resultGroupGoalContainer = document.createElement('div');
        resultGroupGoalContainer.className = 'result-group-goal-container';

        const resultGroupName = document.createElement('div');
        resultGroupName.className = 'result-group-name';
        resultGroupName.innerHTML = result.group_name;

        const resultGroupGoal = document.createElement('div');
        resultGroupGoal.className = 'result-group-goal';
        resultGroupGoal.innerHTML = result.group_todo;

        resultGroupGoalContainer.appendChild(resultGroupName);
        resultGroupGoalContainer.appendChild(resultGroupGoal);
        searchResult.appendChild(resultGroupGoalContainer);

        const groupMember = document.createElement('div');
        groupMember.className = 'group-member';

        const num = document.createElement('p');
        num.className = 'num';
        const count = await getGroupMemberCount(result.group_no);
        num.innerHTML = count + "";

        const userIcon = document.createElement('i');
        userIcon.classList.add('bx', 'bx-user');

        groupMember.appendChild(num);
        groupMember.appendChild(userIcon);
        searchResult.appendChild(groupMember);

        searchContainer.appendChild(searchResult);

        searchResult.onclick = () => {
            window.open(`/group-info/?id=${result.group_no}`, '_top');
        }
    };

}