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
      projects[i].push(todo);
    }
  }
}