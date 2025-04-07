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

let projects = [];

function createNewProject(title) {
  let newProject = new Project(title);
  projects.push(newProject);
}

function createToDo(title, description, priority, dueDate, notes, checklist) {
  let todo = new ToDo(title, description, priority, dueDate, notes, checklist);
  return todo;
}

function addToDoToProject(project, todo) {
  for(let i=0; i<projects.length; i++) {
    if(projects[i].title === project) {
      projects[i].todos.push(todo);
    }
  }
}


function createToDoDOMElement(todo) {
  let todoBox = document.createElement("div");
  
  let todoTitle = document.createElement("h4");
  todoTitle.textContent = todo.title;

  let todoDesc = document.createElement("p");
  todoDesc.textContent = todo.description;

  todoBox.appendChild(todoTitle);
  todoBox.appendChild(todoDesc);

  return todoBox;
}

function displayProjects(projects) {
  let projectDisplay = document.querySelector("#project-lists");

  for(let i=0; i<projects.length; i++) {
    let projectCol = document.createElement("div");
    let projectTitle = document.createElement("h3");
    projectTitle.textContent = projects[i].title;
    projectCol.appendChild(projectTitle);
    projectCol.classList.add("project-col");
    
    for(let j=0; j<projects[i].todos.length; j++) {
      let todo = createToDoDOMElement(projects[i].todos[j]);
      todo.classList.add("todo-box");
      projectCol.appendChild(todo);
    }
    projectDisplay.appendChild(projectCol);
  }
}

//test

createNewProject("test list");

let todo1 = createToDo("title", "description", "priority", "dueDate", "notes", "checklist");
addToDoToProject("test list", todo1);

createNewProject("test list 2");

let todo2 = createToDo("title", "description", "priority", "dueDate", "notes", "checklist");
addToDoToProject("test list 2", todo2);

displayProjects(projects);