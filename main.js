const $Main = document.querySelector(".main");
const $MenuBtn = document.querySelector(".header__menuBtn");
const $Header = document.querySelector(".header");

const $FoldersList = document.querySelector(".folders__list");
const $FolderForm = document.querySelector(".folders__form");
const $DeleteFolderBtn = document.querySelector(".folders__deleteBtn");
const $todoIcons = document.querySelectorAll(".to-do__icons");

const $TaskTitle = document.querySelector(".main__title");
const $TodoList = document.querySelector(".to-do__list");
const $TaskForm = document.querySelector(".to-do__form");

const $CompletedsList = document.querySelector(".completeds__list");
const $CompletedsForm = document.querySelector(".completeds__form");
const $DeleteCompletedsBtn = document.querySelector(".completeds_deleteBtn");

let URL_Folders = "https://apiserver-todolist.herokuapp.com/api/carpetas";
let URL_Tasks = "https://apiserver-todolist.herokuapp.com/api/tareas";

let AllFolders = [];
let AllTasks = [];

document.addEventListener("DOMContentLoaded", () => {
  loadInit();
});

$MenuBtn.addEventListener("click", () => {
  toggleMenu();
});

$FoldersList.addEventListener("click", (e) => {
  let folderId = "";

  e.target.matches(".folders__button")
    ? (folderId = e.target.dataset.id)
    : (folderId = e.target.parentElement.dataset.id);

  folderId ? (printTasks(folderId), toggleMenu()) : null;
});

$FolderForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let newFolder = document.querySelector(".folders__input").value;
  $FolderForm.reset();
  await createFolder(newFolder);
});

$TaskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let newTask = document.querySelector(".to-do__input").value;
  let folderId = $TaskTitle.firstElementChild.dataset.id;
  $TaskForm.reset();
  await createTask(newTask, folderId);
});

document.addEventListener("click", async (e) => {
  if (e.target.innerText == "highlight_off") {
    let taskId = e.target.parentElement.dataset.id;
    let folderId = $TaskTitle.firstElementChild.dataset.id;

    await deleteTask(taskId);
    loadInit(folderId);
  }

  if (e.target.innerText == "check_circle_outline") {
    let taskId = e.target.parentElement.dataset.id;
    await changeStatus(taskId);
  }

  if (
    e.target.matches(".folders__deleteBtn") ||
    e.target.matches(".folders__deleteBtn *")
  ) {
    await deleteFolder();
  }

  if (
    e.target.matches(".completeds_deleteBtn") ||
    e.target.matches(".completeds_deleteBtn *")
  ) {
    deleteAllCompletedTasks();
  }
});

const toggleMenu = () => {
  $Header.classList.toggle("header--show");
};

const loader = () => {
  let loader = document.querySelector(".loader");
  $Main.classList.toggle("opac");
  $Header.classList.toggle("opac");
  loader.classList.toggle("loader--active");
};

const loadInit = async (folderId = 0) => {
  loader();
  await getAllFolders();
  await getAllTasks();
  printFolders();
  printTasks(folderId);
  loader();
};

const getAllFolders = async () => {
  AllFolders = [];
  await fetch(URL_Folders)
    .then((res) => res.json())
    .then((json) => {
      AllFolders.push(...json);
      printFolders();
    });
};

const printFolders = () => {
  $FoldersList.innerHTML = `
    <div class="btn btn-rounded folders__button" data-id="0" data-name="All">
        <h4 class="folder-title" data-id="0" data-name="All">Show All Tasks</h4>
        <p>19</p>
    </div>
  `;

  AllFolders.forEach((folder) => {
    $FoldersList.innerHTML += `
        <div class="btn folders__button" data-id="${folder._id}" data-name="${folder.name}">
            <h4>${folder.name}</h4>
            <p>${folder.tasks.length}</p>
        </div>
    `;
  });
};

const getAllTasks = async () => {
  AllTasks = [];
  await fetch(URL_Tasks)
    .then((res) => res.json())
    .then((json) => {
      AllTasks.push(...json);
    });
};

const printTasks = (folderId = 0) => {
  let todoTasks = [];
  let completedTasks = [];

  $TodoList.innerHTML = "";
  $CompletedsList.innerHTML = "";

  let r = [...document.querySelectorAll(".folders__button")];
  r.forEach((el) => el.classList.remove("folders__button--active"));
  r.find((el) => el.dataset.id == folderId).classList.add(
    "folders__button--active"
  );

  if (folderId == "0") {
    $TaskTitle.innerHTML = `<h2 data-id="0">All Tasks</h2>`;
    $TaskForm.innerHTML = "";
    AllTasks.forEach((task) => {
      task.status == false ? todoTasks.push(task) : completedTasks.push(task);
    });
  } else {
    let folder = AllFolders.find((el) => el._id === folderId);

    $TaskTitle.innerHTML = `
        <h2 data-id="${folder._id}" >${folder.name}</h2>
        <button class="btn folders__deleteBtn">
            <span class="material-icons-round"> delete_forever </span>
            <p>Delete folder</p>
        </button>`;

    $TaskForm.innerHTML = `
      <button class="btn btn-round to-do__addBtn">
        <span class="material-icons-round"> add </span>
      </button>
      <input
        type="text"
        placeholder="Add a new Task..."
        class="to-do__input"
      />`;

    folder.tasks.forEach((task) => {
      task.status == false ? todoTasks.push(task) : completedTasks.push(task);
    });
  }

  if (todoTasks.length == 0) {
    $TodoList.innerHTML = `<article class="to-do__task">💪 You don't have to-do tasks!!!!</article>`;
  } else {
    todoTasks.forEach((task) => {
      $TodoList.innerHTML += `
      <article class="to-do__task">
          <p>${task.name}</p>
          <div class="to-do__icons" data-id="${task._id}">
              <span class="material-icons-round"> check_circle_outline </span>
              <span class="material-icons-round"> highlight_off </span>
          </div>
      </article>`;
    });
  }

  if (completedTasks.length == 0) {
    $CompletedsList.innerHTML = `<article class="completeds__task">You don't have any completed tasks</article>`;
    $CompletedsForm.innerHTML = "";
  } else {
    $CompletedsForm.innerHTML = `
      <button class="btn completeds_deleteBtn">
        <span class="material-icons-round"> delete_forever </span>
        <p>Delete all completed Tasks</p>
      </button>`;

    completedTasks.forEach((task) => {
      $CompletedsList.innerHTML += `
      <article class="completeds__task">
          <span class="material-icons-round"> done </span>
          <p data-id="${task._id}">${task.name}</p>
      </article>`;
    });
  }
};

const deleteFolder = async () => {
  let folderId = $TaskTitle.firstElementChild.dataset.id;

  await fetch(`${URL_Folders}/${folderId}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((json) => console.log(json))
    .then(() => loadInit());
};

const deleteTask = async (taskId) => {
  await fetch(`${URL_Tasks}/${taskId}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((json) => console.log(json));
};

const createFolder = async (newFolder) => {
  let newFolderBody = {
    name: newFolder,
  };

  await fetch(URL_Folders, {
    method: "POST",
    body: JSON.stringify(newFolderBody),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((json) => console.log(json))
    .then(() => loadInit());
};

const createTask = async (newTask, folderId) => {
  let newTaskBody = {
    name: newTask,
    folder: folderId,
  };

  await fetch(URL_Tasks, {
    method: "POST",
    body: JSON.stringify(newTaskBody),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((json) => console.log(json))
    .then(() => loadInit(folderId));
};

const changeStatus = async (taskId) => {
  let folderId = $TaskTitle.firstElementChild.dataset.id;

  let newState = {
    status: true,
  };

  await fetch(`${URL_Tasks}/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(newState),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((json) => console.log(json))
    .then(() => loadInit(folderId));
};

const deleteAllCompletedTasks = () => {
  let $CompletedTasks = document.querySelectorAll(".completeds__task");
  let folderId = $TaskTitle.firstElementChild.dataset.id;

  $CompletedTasks.forEach(async (el) => {
    let taskId = el.lastElementChild.dataset.id;
    await deleteTask(taskId);
  });

  loadInit(folderId);
};
