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

  let todoDesc = document.createElement("p");
  todoDesc.textContent = todo.description;
  todoDesc.classList.add("todo-wide");

  let todoNotes = document.createElement("p");
  todoNotes.textContent = todo.notes;
  todoNotes.classList.add("todo-wide");

  let todoChecklist = document.createElement("p");
  todoChecklist.textContent = todo.checklist;
  todoChecklist.classList.add("todo-wide");

  let todoNav = document.createElement("div");
  let todoDelete = document.createElement("button");
  todoDelete.textContent = "x";
  let todoUp = document.createElement("button");
  todoUp.textContent = "^";
  let todoDown = document.createElement("button");
  todoDown.textContent = "v";
  let todoComplete = document.createElement("button");
  todoComplete.textContent = "o";
  todoComplete.classList.add("todo-complete");
  todoNav.appendChild(todoDelete);
  todoNav.appendChild(todoUp);
  todoNav.appendChild(todoDown);
  todoNav.appendChild(todoComplete);
  todoNav.classList.add("todo-nav");

  todoBox.appendChild(todoTitle);
  todoBox.appendChild(todoDueDate);
  todoBox.appendChild(todoDesc);
  todoBox.appendChild(todoNotes);
  todoBox.appendChild(todoChecklist);
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
    
    for(let j=0; j<allProjects[i].todos.length; j++) {
      let todo = createToDoDOMElement(allProjects[i].todos[j]);
      todo.classList.add("todo-box");
      projectCol.appendChild(todo);
    }
    projectDisplay.appendChild(projectCol);
  }
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