 document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const todoInput = document.getElementById('todoInput');
            const todoDate = document.getElementById('todoDate');
            const addBtn = document.getElementById('addBtn');
            const todoList = document.getElementById('todoList');
            const emptyState = document.getElementById('emptyState');
            const filterBtns = document.querySelectorAll('.filter-btn');
            const deleteAllBtn = document.getElementById('deleteAllBtn');
            const taskCount = document.getElementById('taskCount');
            
            // State
            let todos = JSON.parse(localStorage.getItem('todos')) || [];
            let currentFilter = 'all';
            
            // Initialize
            renderTodos();
            updateStats();
            
            // Event Listeners
            addBtn.addEventListener('click', addTodo);
            todoInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') addTodo();
            });
            
            deleteAllBtn.addEventListener('click', deleteAllTodos);
            
            filterBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    // Update active filter button
                    filterBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Set current filter and re-render
                    currentFilter = this.getAttribute('data-filter');
                    renderTodos();
                });
            });
            
            // Functions
            function addTodo() {
                const title = todoInput.value.trim();
                const date = todoDate.value.trim();
                
                if (!title) {
                    alert('Please enter a task');
                    return;
                }
                
                // Validate date format (simple check)
                if (date && !/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
                    alert('Please use mm/dd/yyyy format for the date');
                    return;
                }
                
                const newTodo = {
                    id: Date.now(),
                    title,
                    date: date || 'No date',
                    completed: false
                };
                
                todos.push(newTodo);
                saveTodos();
                renderTodos();
                updateStats();
                
                // Clear inputs
                todoInput.value = '';
                todoDate.value = '';
                todoInput.focus();
            }
            
            function renderTodos() {
                // Filter todos based on current filter
                let filteredTodos = todos;
                if (currentFilter === 'pending') {
                    filteredTodos = todos.filter(todo => !todo.completed);
                } else if (currentFilter === 'completed') {
                    filteredTodos = todos.filter(todo => todo.completed);
                }
                
                // Show/hide empty state
                if (filteredTodos.length === 0) {
                    emptyState.style.display = 'block';
                    todoList.innerHTML = '';
                    todoList.appendChild(emptyState);
                } else {
                    emptyState.style.display = 'none';
                    
                    // Render todos
                    todoList.innerHTML = '';
                    filteredTodos.forEach(todo => {
                        const todoElement = createTodoElement(todo);
                        todoList.appendChild(todoElement);
                    });
                }
            }
            
            function createTodoElement(todo) {
                const todoElement = document.createElement('div');
                todoElement.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                todoElement.innerHTML = `
                    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                    <div class="todo-content">
                        <div class="todo-title">${todo.title}</div>
                        <div class="todo-date">${todo.date}</div>
                    </div>
                    <div class="todo-actions">
                        <button class="action-btn delete">Delete</button>
                    </div>
                `;
                
                // Add event listeners to the todo element
                const checkbox = todoElement.querySelector('.todo-checkbox');
                const deleteBtn = todoElement.querySelector('.action-btn');
                
                checkbox.addEventListener('change', function() {
                    toggleTodoComplete(todo.id);
                });
                
                deleteBtn.addEventListener('click', function() {
                    deleteTodo(todo.id);
                });
                
                return todoElement;
            }
            
            function toggleTodoComplete(id) {
                todos = todos.map(todo => {
                    if (todo.id === id) {
                        return { ...todo, completed: !todo.completed };
                    }
                    return todo;
                });
                
                saveTodos();
                renderTodos();
                updateStats();
            }
            
            function deleteTodo(id) {
                if (confirm('Are you sure you want to delete this task?')) {
                    todos = todos.filter(todo => todo.id !== id);
                    saveTodos();
                    renderTodos();
                    updateStats();
                }
            }
            
            function deleteAllTodos() {
                if (todos.length === 0) {
                    alert('No tasks to delete');
                    return;
                }
                
                if (confirm('Are you sure you want to delete all tasks?')) {
                    todos = [];
                    saveTodos();
                    renderTodos();
                    updateStats();
                }
            }
            
            function updateStats() {
                const totalTasks = todos.length;
                const completedTasks = todos.filter(todo => todo.completed).length;
                
                taskCount.textContent = `${totalTasks} task${totalTasks !== 1 ? 's' : ''} (${completedTasks} completed)`;
            }
            
            function saveTodos() {
                localStorage.setItem('todos', JSON.stringify(todos));
            }
        });