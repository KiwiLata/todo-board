import "./styles.css"

class Project {
  constructor(title) {
    this.title = title;
    this.todos = [];
  }
};

class ToDo {
  constructor(title, description, priority, dueDate, notes, checklist) {
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.dueDate = dueDate;
    this.notes = notes;
    this.checklist = checklist;
  }
};

let allProjects = [];

if(localStorage.getItem("localProjects")) {
  allProjects = JSON.parse(localStorage.getItem("localProjects"));
  displayProjects(allProjects);
}
else {
  localStorage.setItem("localProjects", JSON.stringify(allProjects));
}

function countDueTodos(allProjects) {
  let due_today_count = 0;
  let due_this_week_count = 0;
  let overdue_count = 0;

  let due_today = document.querySelector("#due-today");
  let due_this_week = document.querySelector("#due-this-week");
  let overdue = document.querySelector("#overdue");

  let today = new Date().toJSON().slice(0, 10);
  let temp = new Date();
  let this_week = new Date(temp.setDate(temp.getDate() + 7)).toJSON().slice(0, 10);

  for(let i=0; i<allProjects.length; i++) {
    for(let j=0; j<allProjects[i].todos.length; j++) {
      let due_date = allProjects[i].todos[j].dueDate;
      if(due_date == today) {
        due_today_count += 1;
      }
      else if(due_date > today && due_date <= this_week) {
        due_this_week_count += 1;
      }
      else if(due_date < today) {
        overdue_count += 1;
      }
    }
  }
  due_today.textContent = due_today_count;
  due_this_week.textContent = due_this_week_count;
  overdue.textContent = overdue_count;
}

function createNewProject(title) {
  let newProject = new Project(title);
  allProjects.push(newProject);
  localStorage.setItem("localProjects", JSON.stringify(allProjects));
}

function createToDo(title, description, priority, dueDate, notes, checklist) {
  let todo = new ToDo(title, description, priority, dueDate, notes, checklist);
  return todo;
}

function addToDoToProject(project, todo) {
  for(let i=0; i<allProjects.length; i++) {
    if(allProjects[i].title === project) {
      allProjects[i].todos.push(todo);
    }
  }
  localStorage.setItem("localProjects", JSON.stringify(allProjects));
}


function createToDoDOMElement(todo) {
  let todoBox = document.createElement("div");
  
  let todoTitle = document.createElement("h4");
  todoTitle.textContent = todo.title;

  let todoDueDate = document.createElement("p");
  todoDueDate.textContent = todo.dueDate;
  todoDueDate.classList.add("todo-date");
  let currentDate = new Date().toJSON().slice(0, 10);
  if(todo.dueDate < currentDate) {
    todoDueDate.classList.add("overdue");
  }

  let todoCollapsible = document.createElement("div");
  todoCollapsible.classList.add("todo-wide", "collapsible");

  let todoCollapsibleTitle = document.createElement("h5");
  todoCollapsibleTitle.textContent = "Details";
  todoCollapsibleTitle.classList.add("todo-wide", "collapsible-title");
  todoCollapsibleTitle.addEventListener("click", handleCollapsible);

  let todoDesc = document.createElement("p");
  todoDesc.textContent = todo.description;
  todoDesc.classList.add("todo-wide");

  let todoNotes = document.createElement("p");
  todoNotes.textContent = todo.notes;
  todoNotes.classList.add("todo-wide");

  let todoChecklist = document.createElement("p");
  todoChecklist.textContent = todo.checklist;
  todoChecklist.classList.add("todo-wide");

  todoCollapsible.appendChild(todoDesc);
  todoCollapsible.appendChild(todoNotes);
  todoCollapsible.appendChild(todoChecklist);

  let todoNav = document.createElement("div");
  let todoDelete = document.createElement("button");
  todoDelete.textContent = "x";
  todoDelete.classList.add("todo-delete")
  todoDelete.addEventListener("click", handleTodoDelete);

  let todoUp = document.createElement("button");
  todoUp.textContent = "^";
  todoUp.addEventListener("click", handleTodoUpPriority);

  let todoDown = document.createElement("button");
  todoDown.textContent = "v";
  todoDown.addEventListener("click", handleTodoDownPriority);

  let todoComplete = document.createElement("button");
  todoComplete.textContent = "o";
  todoComplete.addEventListener("click", handleTodoDelete);

  todoComplete.classList.add("todo-complete");
  todoNav.appendChild(todoDelete);
  todoNav.appendChild(todoUp);
  todoNav.appendChild(todoDown);
  todoNav.appendChild(todoComplete);
  todoNav.classList.add("todo-nav");

  todoBox.appendChild(todoTitle);
  todoBox.appendChild(todoDueDate);
  todoBox.appendChild(todoCollapsibleTitle);
  todoBox.appendChild(todoCollapsible);
  todoBox.appendChild(todoNav);

  return todoBox;
}

function displayProjects(allProjects) {
  let projectDisplay = document.querySelector("#project-lists");
  projectDisplay.innerHTML = "";


  for(let i=0; i<allProjects.length; i++) {
    let projectCol = document.createElement("div");
    let projectTitle = document.createElement("h3");
    projectTitle.textContent = allProjects[i].title;
    projectCol.appendChild(projectTitle);
    projectCol.classList.add("project-col");
    
    
    allProjects[i].todos.sort((a, b) => b.priority - a.priority);
    localStorage.setItem("localProjects", JSON.stringify(allProjects))

    for(let j=0; j<allProjects[i].todos.length; j++) {
      let todo = createToDoDOMElement(allProjects[i].todos[j]);
      todo.classList.add("todo-box");
      projectCol.appendChild(todo);
    }

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete list";
    deleteButton.classList.add("default-button");
    deleteButton.addEventListener("click", handleListDelete);
    projectCol.appendChild(deleteButton);

    projectDisplay.appendChild(projectCol);
  }
  countDueTodos(allProjects)
}

// task buttons

function handleTodoDelete(ev) {
    let todoBox = ev.target.parentNode.parentNode;
    let title = todoBox.parentNode.firstChild.textContent;
    let todoName = todoBox.firstChild.textContent;

    let todoList = [];
    let listIndex = undefined;
    let todoIndex = undefined;
    for(let i=0; i<allProjects.length; i++) {
      if(allProjects[i].title === title) {
        todoList = allProjects[i].todos;
        listIndex = i;
      }
    }
    for(let i=0; i<todoList.length; i++) {
      if(todoList[i].title === todoName) {
        todoIndex = i;
      }
    }

    allProjects[listIndex].todos.splice(todoIndex, 1);
    localStorage.setItem("localProjects", JSON.stringify(allProjects))
    displayProjects(allProjects);
}

function handleTodoUpPriority(ev) {
    let todoBox = ev.target.parentNode.parentNode;
    let title = todoBox.parentNode.firstChild.textContent;
    let todoName = todoBox.firstChild.textContent;

    let todoList = [];
    let listIndex = undefined;
    let todoIndex = undefined;
    for(let i=0; i<allProjects.length; i++) {
      if(allProjects[i].title === title) {
        todoList = allProjects[i].todos;
        listIndex = i;
      }
    }
    for(let i=0; i<todoList.length; i++) {
      if(todoList[i].title === todoName) {
        todoIndex = i;
      }
    }
    console.log("before " + allProjects[listIndex].todos[todoIndex].priority);
    if(allProjects[listIndex].todos[todoIndex].priority) {
      allProjects[listIndex].todos[todoIndex].priority = parseInt(allProjects[listIndex].todos[todoIndex].priority) + 1;
    }
    else {
      allProjects[listIndex].todos[todoIndex].priority = 1;
    }
    console.log("after " + allProjects[listIndex].todos[todoIndex].priority);
    
    localStorage.setItem("localProjects", JSON.stringify(allProjects))
    displayProjects(allProjects);
}

function handleTodoDownPriority(ev) {
    let todoBox = ev.target.parentNode.parentNode;
    let title = todoBox.parentNode.firstChild.textContent;
    let todoName = todoBox.firstChild.textContent;

    let todoList = [];
    let listIndex = undefined;
    let todoIndex = undefined;
    for(let i=0; i<allProjects.length; i++) {
      if(allProjects[i].title === title) {
        todoList = allProjects[i].todos;
        listIndex = i;
      }
    }
    for(let i=0; i<todoList.length; i++) {
      if(todoList[i].title === todoName) {
        todoIndex = i;
      }
    }
    console.log("before " + allProjects[listIndex].todos[todoIndex].priority);
    if(allProjects[listIndex].todos[todoIndex].priority) {
      allProjects[listIndex].todos[todoIndex].priority = parseInt(allProjects[listIndex].todos[todoIndex].priority) - 1;
    }
    else {
      allProjects[listIndex].todos[todoIndex].priority = 0;
    }
    console.log("after " + allProjects[listIndex].todos[todoIndex].priority);
    localStorage.setItem("localProjects", JSON.stringify(allProjects))
    displayProjects(allProjects);
}

function handleListDelete(ev) {
    let list = ev.target.parentNode.parentNode;
    let title = list.parentNode.firstChild.textContent;

    let listIndex = undefined;
    for(let i=0; i<allProjects.length; i++) {
      if(allProjects[i].title === title) {
        listIndex = i;
      }
    }

    allProjects.splice(listIndex, 1);
    localStorage.setItem("localProjects", JSON.stringify(allProjects))
    displayProjects(allProjects);
}

function handleCollapsible(ev) {
    let detailsTitle = ev.target;
    let details = ev.target.nextElementSibling;
    detailsTitle.classList.toggle("active-title");
    details.classList.toggle("active");
}

// buttons and dialog

const newListDialog = document.querySelector("#new-list-dialog");
const newTaskDialog = document.querySelector("#new-task-dialog");

let newListButton = document.querySelector("#new-list-button");
newListButton.addEventListener("click", () => {
  newListDialog.show();
});

let newListForm = document.querySelector("#new-list-form");
newListForm.addEventListener("submit", (submitForm) => {
    submitForm.preventDefault();
    let listData = new FormData(newListForm);
    let args = [];
    for (let keyValue of listData.values()) {
      args.push(keyValue);
    }

    createNewProject(...args);
    displayProjects(allProjects);
    newListDialog.close();
  });

let newTaskButton = document.querySelector("#new-task-button");
newTaskButton.addEventListener("click", () => {
  let taskList = document.querySelector("#task-list");
  for(let i=0; i<allProjects.length; i++) {
    let option = document.createElement("option");
    option.setAttribute("value", allProjects[i].title);
    option.textContent = allProjects[i].title;
    taskList.appendChild(option);
  }

  newTaskDialog.show();
});

let createToDoArgs = [];
let listName;

let newTaskForm = document.querySelector("#new-task-form");
newTaskForm.addEventListener("submit", (submitForm) => {
    submitForm.preventDefault();
    let taskData = new FormData(newTaskForm);
    let args = [];
    for (let keyValue of taskData.values()) {
      args.push(keyValue);
    }
    listName = args.shift();
    createToDoArgs = args;

    let todo = createToDo(...createToDoArgs);
    addToDoToProject(listName, todo);
    displayProjects(allProjects);
    newListDialog.close();
});
  

let closeButton = document.querySelectorAll(".closeDialog").forEach((item) => {
  item.addEventListener("click", () => {
  if(newListDialog.hasAttribute("open")) {
    newListDialog.close();
  }
  if(newTaskDialog.hasAttribute("open")) {
    newTaskDialog.close();
  }
  });
});


//test

/* createNewProject("test list");

let todo1 = createToDo("title", "description", "priority", "dueDate", "notes", "checklist");
addToDoToProject("test list", todo1);

createNewProject("test list 2");

let todo2 = createToDo("title", "description", "priority", "dueDate", "notes", "checklist");
addToDoToProject("test list 2", todo2);

displayProjects(allProjects); */

// overview

let currentDate = new Date().toJSON().slice(0, 10);
let displayedDate = document.querySelector("#current-date");
displayedDate.textContent = currentDate;
