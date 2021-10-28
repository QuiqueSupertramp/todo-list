const $Main = document.querySelector(".main");
const $MenuBtn = document.querySelector(".header__menuBtn");
const $Header = document.querySelector(".header");
const $FoldersList = document.querySelector(".folders__list");
// const $
const $TodoList = document.querySelector(".to-do__list");
const $CompletedsList = document.querySelector(".completeds__list");
const $DeleteFolderBtn = document.querySelector(".folders__deleteBtn");
const $TaskTitle = document.querySelector(".main__title");

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

document.addEventListener("click", async (e) => {
  if (
    e.target.matches(".folders__deleteBtn") ||
    e.target.matches(".folders__deleteBtn *")
  ) {
    await deleteFolder();
    loadInit()
  }
});

const toggleMenu = () => {
  $Header.classList.toggle("header--show");
};

const loadInit = async () => {
  await getAllFolders();
  await getAllTasks();
  printFolders();
  printTasks();
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

const printFolders = (folderId = "0") => {
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
      //   console.log(AllTasks);
    });
};

const printTasks = (folderId = 0) => {
  let todoTasks = [];
  let completedTasks = [];

  $TodoList.innerHTML = "";
  $CompletedsList.innerHTML = "";

  if (folderId == "0") {
    $TaskTitle.innerHTML = `<h2>All Tasks</h2>`;
    AllTasks.forEach((task) => {
      task.status == false ? todoTasks.push(task) : completedTasks.push(task);
    });
  } else {
    let folder = AllFolders.find((el) => el._id === folderId);

    $TaskTitle.innerHTML = `
        <h2 data-id="${folderId}" >${folder.name}</h2>
        <button class="btn folders__deleteBtn">
            <span class="material-icons-round"> delete_forever </span>
            Delete folder
        </button>`;

    folder.tasks.forEach((task) => {
      task.status == false ? todoTasks.push(task) : completedTasks.push(task);
    });
  }

  todoTasks.forEach((task) => {
    $TodoList.innerHTML += `
      <article class="to-do__task">
          <p>${task.name}</p>
          <div class="to-do__icons">
              <span class="material-icons-round"> check_circle_outline </span>
              <span class="material-icons-round"> highlight_off </span>
          </div>
      </article>
    `;
  });
  completedTasks.forEach((task) => {
    $CompletedsList.innerHTML += `
      <article class="completeds__task">
          <span class="material-icons-round"> done </span>
          <p>${task.name}</p>
      </article>
    `;
  });

  let r = [...document.querySelectorAll(".folders__button")];
  r.forEach((el) => el.classList.remove("folders__button--active"));
  r.find((el) => el.dataset.id == folderId).classList.add(
    "folders__button--active"
  );
};

const deleteFolder = async () => {
  let folderId = $TaskTitle.firstElementChild.dataset.id;

  await fetch(
    `https://apiserver-todolist.herokuapp.com/api/carpetas/${folderId}`,
    {
      method: "DELETE",
    }
  )
    .then((res) => res.json())
    .then((json) => console.log(json));
};
