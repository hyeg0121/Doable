const welcomeComent = document.getElementsByClassName('welcome-comment')[0];
const remainingGoals = document.getElementsByClassName('remaining-goals')[0];
const dateDiv = document.getElementsByClassName('year')[0];
const dayList = document.getElementsByClassName('day');
const todosDiv = document.getElementsByClassName('goals-btn')[0];
const categoriesDiv = document.getElementsByClassName('goals-container')[0];
const completedLabel = document.getElementsByClassName('text2')[0];

let remainingTodoCount = 0;

showUserInfo();
setDate();
showUsersCategories();

function setDate() {
    const now = new Date();
    const today = new Date();
    const currentDay = today.getDay();

    // 현재 날짜에서 일요일까지의 날짜 차이를 계산
    const daysUntilSunday = 1 - currentDay;

    // 현재 날짜에 일요일까지의 날짜 차이를 더하여 일요일의 날짜를 계산
    today.setDate(today.getDate() + daysUntilSunday);
    console.log(today);

    dateDiv.innerHTML = `${today.getFullYear()}년 ${today.getMonth() + 1}월`;
    for (let i in dayList) {
        if (now.getDate() == today.getDate() + parseInt(i)) {
            dayList[i].innerHTML = (today.getDate() + parseInt(i)) + '<div class="point-color"></div>';
            dayList[i].classList.add('point');

            continue;
        }
        dayList[i].innerHTML = today.getDate() + parseInt(i);
    }

    console.log('day', dayList[0].innerHTML)
}

function getLastDayOfMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const lastDay = new Date(year, month, 0);

    return lastDay.getDate();
}

async function showUserInfo() {
    const user = await axios.get(`${BASE_URL}/users/${USER_NO}`)
        .then(response => {
            return response.data;

        }).catch((err) => {
            console.error(err);
        });

    welcomeComent.innerHTML = `안녕하세요, ${user.user_name}님`;
    remainingGoals.innerHTML = `오늘의 목표가 ${remainingTodoCount}개 남았습니다`;
    const nowCompleted = await axios.get(`${BASE_URL}/users/${USER_NO}/todos/completed`)
        .then(response => response.data.length)
        .catch(error => 0);
    const count = nowCompleted - parseInt(user.user_last_completed);

    if (count === 0) {
        completedLabel.innerHTML = `어제와 수행한 목표의 개수가 같아요!`
    } else if (count < 0) {
        completedLabel.innerHTML = `어제보다 ${Math.abs(count)}개의 목표를 덜 수행했어요ㅠㅠ`
    } else {
        completedLabel.innerHTML = `어제보다 ${count}개의 목표를 더 수행했어요!`
    }
}

async function showUsersTodos() {
    todosDiv.innerHTML = '';
    await axios.get(`${BASE_URL}/users/${USER_NO}/todos`)
        .then(response => {
            const dataList = response.data;

            remainingTodoCount = dataList.length;

            for (let data of dataList) {

                const goalBox = document.createElement('div');
                goalBox.className = 'goal-box';

                const keywordBox = document.createElement('div');
                keywordBox.className = 'keyword-box';

                const keywordIcon = document.createElement('div');
                keywordIcon.className = 'keyword-icon';

                const keywordColor = document.createElement('div');
                keywordColor.className = 'keyword-color';
                keywordColor.style.backgroundColor = data.category.category_color;

                const keywordName = document.createElement('p');
                keywordName.className = 'keyword-name';
                keywordName.innerHTML = data.category.category_name;

                const dotIcon = document.createElement('i');
                dotIcon.classList.add('bx', 'bx-dots-vertical-rounded', 'dot-icon');
                const goal = document.createElement('goal');
                goal.className = 'goal';
                goal.innerHTML = data.todo_name;

                const modalContent = document.createElement('div');
                modalContent.className = 'modalContent';

                const deleteDiv = document.createElement('div');
                deleteDiv.className = 'delete';
                deleteDiv.innerHTML = '삭제';

                keywordIcon.appendChild(keywordColor);
                keywordIcon.appendChild(keywordName);
                keywordBox.appendChild(keywordIcon);
                keywordBox.appendChild(dotIcon);
                modalContent.appendChild(deleteDiv);
                goalBox.appendChild(keywordBox);
                goalBox.appendChild(goal);
                goalBox.appendChild(modalContent);
                todosDiv.appendChild(goalBox);

                modalContent.style.display = 'none';

                dotIcon.onclick = () => {
                    [...document.getElementsByClassName('modalContent')].forEach(e => {
                        e.style.display = 'none';
                    })
                    modalContent.style.display = 'flex';
                }

                // 투두 삭제
                deleteDiv.onclick = () => {
                    axios.delete(`${BASE_URL}/todos/${data.todo_no}`)
                        .then(response => {
                            location.reload();
                        })
                        .catch(error => location.reload());
                }


                // 투두 완료
                goal.onclick = () => {
                    modalContent.style.display = 'none';
                    axios.patch(`${BASE_URL}/todos/${data.todo_no}/complete`)
                        .then(response => {
                            location.reload();
                        })
                        .catch(error => console.log(error));
                }

                // 완료된 투두 스타일
                if (data.todo_completed === 1) {
                    dotIcon.style.display = 'none';
                    goalBox.style.opacity = '0.3'
                    goalBox.style.border = '1px solid var(--gray-300)'
                    goal.onclick = () => {
                        axios.patch(`${BASE_URL}/todos/${data.todo_no}/incomplete`)
                            .then(response => window.open('/main/', '_top'))
                            .catch(error => false);
                    };
                    remainingTodoCount--;
                }
            }

            remainingGoals.innerHTML = `오늘의 목표가 ${remainingTodoCount}개 남았습니다.`;
        })
        .catch(err => {
            console.error(err);
        });

    categoriesDiv.appendChild(todosDiv);
}

async function showUsersCategories() {

    const dDay = document.createElement('p');
    dDay.className = 'd-day';
    dDay.innerHTML = 'D-DAY';
    categoriesDiv.innerHTML = '';
    categoriesDiv.appendChild(dDay);

    await axios.get(`${BASE_URL}/users/${USER_NO}/categories`)
        .then(response => {
            const dataList = response.data;


            const keywordContainer = document.createElement('div');
            keywordContainer.className = 'keyword-container';

            for (let data of dataList) {
                const keyword = document.createElement('div');
                keyword.className = 'keyword';

                const keywordColor = document.createElement('div');
                keywordColor.className = 'keyword-color';
                keywordColor.style.backgroundColor = data.category_color;

                const keywordName = document.createElement('p');
                keywordName.className = 'keyword-name';
                keywordName.innerHTML = data.category_name;

                keyword.appendChild(keywordColor);
                keyword.appendChild(keywordName);
                keywordContainer.appendChild(keyword);
                categoriesDiv.appendChild(keywordContainer);

                keyword.onclick = () => {
                    showUsersTodosFiltered(data.category_no);
                    console.log(data.category_no)
                }
            }

        })
        .catch(err => {
            console.error(err);
        });


    showUsersTodos();
}

document.onclick = e => {
    if (e.target.className === 'goals-container') {
        [...document.getElementsByClassName('modalContent')].forEach(e => {
            e.style.display = 'none';
        })
    }

}

async function showUsersTodosFiltered(category_no) {
    todosDiv.innerHTML = '';
    await axios.get(`${BASE_URL}/users/${USER_NO}/todos`)
        .then(response => {
            const dataList = response.data;

            remainingTodoCount = dataList.length;

            for (let data of dataList) {
                if (data.category.category_no != category_no) continue;
                const goalBox = document.createElement('div');
                goalBox.className = 'goal-box';

                const keywordBox = document.createElement('div');
                keywordBox.className = 'keyword-box';

                const keywordIcon = document.createElement('div');
                keywordIcon.className = 'keyword-icon';

                const keywordColor = document.createElement('div');
                keywordColor.className = 'keyword-color';
                keywordColor.style.backgroundColor = data.category.category_color;

                const keywordName = document.createElement('p');
                keywordName.className = 'keyword-name';
                keywordName.innerHTML = data.category.category_name;

                const dotIcon = document.createElement('i');
                dotIcon.classList.add('bx', 'bx-dots-vertical-rounded', 'dot-icon');
                const goal = document.createElement('goal');
                goal.className = 'goal';
                goal.innerHTML = data.todo_name;

                const modalContent = document.createElement('div');
                modalContent.className = 'modalContent';

                const deleteDiv = document.createElement('div');
                deleteDiv.className = 'delete';
                deleteDiv.innerHTML = '삭제';

                keywordIcon.appendChild(keywordColor);
                keywordIcon.appendChild(keywordName);
                keywordBox.appendChild(keywordIcon);
                keywordBox.appendChild(dotIcon);
                modalContent.appendChild(deleteDiv);
                goalBox.appendChild(keywordBox);
                goalBox.appendChild(goal);
                goalBox.appendChild(modalContent);
                todosDiv.appendChild(goalBox);

                modalContent.style.display = 'none';

                dotIcon.onclick = () => {
                    [...document.getElementsByClassName('modalContent')].forEach(e => {
                        e.style.display = 'none';
                    })
                    modalContent.style.display = 'flex';
                }

                // 투두 삭제
                deleteDiv.onclick = () => {
                    axios.delete(`${BASE_URL}/todos/${data.todo_no}`)
                        .then(response => {
                            location.reload();
                        })
                        .catch(error => location.reload());
                }


                // 투두 완료
                goal.onclick = () => {
                    modalContent.style.display = 'none';
                    axios.patch(`${BASE_URL}/todos/${data.todo_no}/complete`)
                        .then(response => {
                            location.reload();
                        })
                        .catch(error => console.log(error));
                }

                // 완료된 투두 스타일
                if (data.todo_completed === 1) {
                    dotIcon.style.display = 'none';
                    goalBox.style.opacity = '0.3'
                    goalBox.style.border = '1px solid var(--gray-300)'
                    goal.onclick = () => {
                        axios.patch(`${BASE_URL}/todos/${data.todo_no}/incomplete`)
                            .then(response => window.open('/main/', '_top'))
                            .catch(error => false);
                    };
                    remainingTodoCount--;
                }
            }

            remainingGoals.innerHTML = `오늘의 목표가 ${remainingTodoCount}개 남았습니다.`;
        })
        .catch(err => {
            console.error(err);
        });

    categoriesDiv.appendChild(todosDiv);
}