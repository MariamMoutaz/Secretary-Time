const taskInput = document.getElementById('task');
const alarmInput = document.getElementById('alarm');
const addBtn = document.getElementById('add-btn');
const listContainer = document.getElementById('list-container');
const timerDisplay = document.getElementById('timer');

// 1. نظام الـ Pomodoro
let timeLeft = 25 * 60;
let timerId = null;

document.getElementById('start-pomo').addEventListener('click', function() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
        this.innerText = "Start";
    } else {
        timerId = setInterval(() => {
            timeLeft--;
            let mins = Math.floor(timeLeft / 60);
            let secs = timeLeft % 60;
            timerDisplay.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
            if (timeLeft === 0) { 
                clearInterval(timerId); 
                alert("Focus session complete! Take a break."); 
            }
        }, 1000);
        this.innerText = "Pause";
    }
});

document.getElementById('reset-pomo').addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    timeLeft = 25 * 60;
    timerDisplay.innerText = "25:00";
    document.getElementById('start-pomo').innerText = "Start";
});

// 2. إدارة البيانات (Local Storage)
function saveData() {
    localStorage.setItem("secretaryTasks", listContainer.innerHTML);
}

function loadData() {
    listContainer.innerHTML = localStorage.getItem("secretaryTasks") || "";
    attachEventsToButtons();
}

function attachEventsToButtons() {
    document.querySelectorAll('#list-container li').forEach(li => {
        li.querySelector('.status-done').onclick = () => {
            li.classList.toggle('completed');
            li.setAttribute('data-status', li.classList.contains('completed') ? 'complete' : 'uncomplete');
            saveData();
        };
        li.querySelector('.status-later').onclick = () => {
            li.classList.toggle('later-task');
            li.setAttribute('data-status', li.classList.contains('later-task') ? 'later' : 'uncomplete');
            saveData();
        };
        li.querySelector('.delete-btn').onclick = () => {
            li.remove();
            saveData();
        };
    });
}

// 3. إضافة مهمة جديدة
addBtn.addEventListener('click', () => {
    const text = taskInput.value;
    const time = alarmInput.value;
    if (!text) return;

    const li = document.createElement('li');
    li.setAttribute('data-status', 'uncomplete');
    li.innerHTML = `
        <div>
            <strong>${text}</strong> <br>
            <small style="color: #ffccff; font-size: 12px;">⏰ ${time || 'No time'}</small>
        </div>
        <div style="display:flex; gap:12px;">
            <button class="status-done" title="Done" style="background:none; border:none; cursor:pointer; font-size:18px;">✔</button>
            <button class="status-later" title="Later" style="background:none; border:none; cursor:pointer; font-size:18px;">⏳</button>
            <button class="delete-btn" title="Delete" style="background:none; border:none; cursor:pointer; font-size:18px;">❌</button>
        </div>
    `;

    listContainer.appendChild(li);
    attachEventsToButtons();
    saveData();
    
    taskInput.value = ''; 
    alarmInput.value = '';
});

// 4. نظام الفلاتر
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        
        document.querySelectorAll('#list-container li').forEach(li => {
            const status = li.getAttribute('data-status');
            li.style.display = (filter === 'all' || status === filter) ? 'flex' : 'none';
        });
    };
});

// تحميل البيانات عند البداية
loadData();