function saveTodayDate() {
    // 현재 날짜
    const today = new Date();
    const dateString = today.toISOString().slice(0, 10); // YYYY-MM-DD 형식으로 변환

    // 저장된 날짜
    const savedDate = localStorage.getItem('savedDate');

    // 다른 경우에만 저장
    if (!savedDate || savedDate !== dateString) {
        localStorage.setItem('savedDate', dateString);
        console.log('오늘 날짜를 저장했습니다.');
        initUsersTodos();
        initUsersCompleted();
    } else {
        console.log('이미 오늘 날짜가 저장되어 있습니다.');
    }

}

// 함수 호출
saveTodayDate();

async function initUsersCompleted() {
    const user = await axios.get(`${BASE_URL}/users/${USER_NO}`)
        .then(response => response.data)
        .catch(error => null);

    if (user === null) return;

    const completedCount = await axios.get(`${BASE_URL}/users/${USER_NO}/todos/completed`)
        .then(response => response.data.length)
        .catch(error => 0);

    const request = {
        user_last_completed: user.user_now_completed,
        user_now_completed: completedCount
    };
    
    await axios.patch(`${BASE_URL}/users/${USER_NO}/completed`, request)
        .then(response => console.log(response.data))
        .catch(error => console.error(error));

}

async function initUsersTodos() {

    const todos = await axios(`${BASE_URL}/users/${USER_NO}/todos`)
        .then(response => response.data)
        .catch(error => []);

    console.log('todos:', todos);

    for (let todo of todos) {

        const daily = await isDailyTodo(todo.todo_no);

        // 데일리 투두면
        if (daily.length !== 0) {

            // 이미 지난 todo면
            if (isPastDate(daily.todo_enddate)) {
                // 삭제
                await axios.delete(`${BASE_URL}/todos/${daily.todo_no}`)
                    .then(response => {
                        location.reload();
                    })
                    .catch(error => location.reload());
                continue;
            }

            // 아직 기간이 안끝난 todo면
            await axios.patch(`${BASE_URL}/todos/${daily.todo_no}/incomplete`)
                .then(response => true)
                .catch(error => false);
            continue;
        }

        // 성장 투두 
        const grow = await isGrowTodo(todo.todo_no);

        // 성장 투두면
        if (grow.length !== 0) {
            // 이미 지난 todo면
            if (isPastDate(grow.todo_enddate)) {
                // 삭제
                await axios.delete(`${BASE_URL}/todos/${grow.todo_no}`)
                    .then(response => {
                        location.reload();
                    })
                    .catch(error => location.reload());
                continue;
            }

            // 아직 기간이 안끝난 todo면
            await axios.patch(`${BASE_URL}/todos/${grow.todo_no}/incomplete`)
                .then(response => true)
                .catch(error => false);
            continue;
        }

        // 일반 투두면 삭제
        await axios.delete(`${BASE_URL}/todos/${todo.todo_no}`)
            .then(response => true)
            .catch(error => false);
        continue;
    }
}

async function isDailyTodo(todoNo) {
    return await axios.get(`${BASE_URL}/todos/${todoNo}/daily`)
        .then(response => response.data)
        .catch(error => {
            return false;
        })
}

async function isGrowTodo(todoNo) {
    return await axios.get(`${BASE_URL}/todos/${todoNo}/increase`)
        .then(response => response.data)
        .catch(error => {
            return false;
        })
}

function isPastDate(date) {
    // 현재 날짜 가져오기
    var currentDate = new Date();

    // 비교할 날짜와 현재 날짜를 밀리초 단위로 변환
    var dateA = new Date(date).getTime();
    var currentDateMillis = currentDate.getTime();

    // a가 현재 날짜보다 이전인지 확인
    return dateA < currentDateMillis;
}
