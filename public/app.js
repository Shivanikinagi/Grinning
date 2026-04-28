// Global state
let currentUser = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTeamMembers();
    updateCurrentDate();
});

// Load team members from API
async function loadTeamMembers() {
    try {
        const response = await fetch('/api/team-members');
        const data = await response.json();
        
        const container = document.getElementById('teamSelection');
        container.innerHTML = '';
        
        if (data.teamMembers && data.teamMembers.length > 0) {
            data.teamMembers.forEach(member => {
                const btn = document.createElement('button');
                btn.className = 'team-member-btn';
                btn.textContent = member;
                btn.onclick = () => selectTeamMember(member);
                container.appendChild(btn);
            });
        } else {
            container.innerHTML = '<div class="empty-state">No team members found</div>';
        }
    } catch (error) {
        console.error('Error loading team members:', error);
        showToast('Failed to load team members', 'error');
    }
}

// Select team member and load their tasks
function selectTeamMember(member) {
    currentUser = member;
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('dashboardScreen').classList.remove('hidden');
    document.getElementById('userName').textContent = `Hi, ${member}! 👋`;
    loadTasks();
}

// Load tasks for current user
async function loadTasks() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`/api/tasks/${encodeURIComponent(currentUser)}`);
        const data = await response.json();
        
        // Update stats
        document.getElementById('pendingCount').textContent = data.totalPending;
        document.getElementById('completedCount').textContent = data.totalCompleted;
        
        // Update AI insights
        document.getElementById('insightsText').textContent = data.insights;
        
        // Render recurring tasks
        renderTasks(data.recurringTasks, 'recurringTasks');
        
        // Render one-time tasks
        renderTasks(data.oneTimeTasks, 'oneTimeTasks');
        
    } catch (error) {
        console.error('Error loading tasks:', error);
        showToast('Failed to load tasks', 'error');
    }
}

// Render tasks to the UI
function renderTasks(tasks, containerId) {
    const container = document.getElementById(containerId);
    
    if (!tasks || tasks.length === 0) {
        container.innerHTML = '<div class="empty-state">No tasks for today</div>';
        return;
    }
    
    container.innerHTML = tasks.map(task => createTaskCard(task)).join('');
}

// Create task card HTML
function createTaskCard(task) {
    const isCompleted = task.status === 'Done';
    const typeClass = task.taskType.toLowerCase().replace('-', '');
    
    return `
        <div class="task-card ${isCompleted ? 'completed' : ''}">
            <div class="task-header">
                <div class="task-name">${task.taskName}</div>
                <span class="task-type ${typeClass}">${task.taskType}</span>
            </div>
            <div class="task-info">
                <span>📅 ${task.plannedDate}</span>
                ${isCompleted ? `<span>✅ ${task.actualCompletionDate}</span>` : ''}
            </div>
            ${isCompleted 
                ? '<div class="status-badge">✓ Completed</div>'
                : `<button class="btn-complete" onclick="markAsComplete(${task.rowIndex})">
                     Mark as Done
                   </button>`
            }
        </div>
    `;
}

// Mark task as complete
async function markAsComplete(rowIndex) {
    try {
        const response = await fetch('/api/tasks/complete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                rowIndex,
                teamMember: currentUser,
            }),
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('✅ Task completed!', 'success');
            // Reload tasks to reflect changes
            setTimeout(() => loadTasks(), 500);
        } else {
            showToast('Failed to update task', 'error');
        }
    } catch (error) {
        console.error('Error marking task complete:', error);
        showToast('Failed to update task', 'error');
    }
}

// Refresh tasks
function refreshTasks() {
    const icon = document.getElementById('refreshIcon');
    icon.classList.add('spinning');
    
    loadTasks().then(() => {
        setTimeout(() => {
            icon.classList.remove('spinning');
            showToast('Tasks refreshed!', 'success');
        }, 500);
    });
}

// Logout
function logout() {
    currentUser = null;
    document.getElementById('dashboardScreen').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
}

// Update current date display
function updateCurrentDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = new Date().toLocaleDateString('en-US', options);
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        dateElement.textContent = dateStr;
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Prevent pull-to-refresh on mobile
document.body.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });
