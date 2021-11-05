// URLs API
let URL_Folders = "https://apiserver-todolist.herokuapp.com/api/carpetas";
let URL_Tasks = "https://apiserver-todolist.herokuapp.com/api/tareas";

// ARRAYS
let AllFolders = [];
let AllTasks = [];


// FUNCTIONS
export const loadInit = async (folderId = 0) => {
    loader();
    await getAllFolders();
    await getAllTasks();
    printFolders();
    printTasks(folderId);
    loader();
  };
  
const loader = () => {
  let $Loader = document.querySelector(".loader");
  let $Main = document.querySelector(".main");
  let $Header = document.querySelector(".header");

  $Main.classList.toggle("opac");
  $Header.classList.toggle("opac");
  $Loader.classList.toggle("loader--active");
};

const getAllFolders = async () => {
  AllFolders = [];
  await fetch(URL_Folders)
    .then((res) => res.json())
    .then((json) => {
      AllFolders.push(...json);
      printFolders();
    })
    .catch(error => {
      alert(error.text || "Something goes wrong. Folders can't be loaded")
      loadInit()
    })
};

const printFolders = () => {
  let $FoldersList = document.querySelector(".folders__list");

  $FoldersList.innerHTML = `
      <div class="btn btn-rounded folders__button" data-id="0" data-name="All">
          <h4 class="folder-title" data-id="0" data-name="All">Show All Tasks</h4>
          <p>${AllTasks.length}</p>
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
    })
    .catch(error => {
      alert(error.text || "Something goes wrong. Tasks can't be loaded")
      loadInit()
    })
};

export const printTasks = (folderId = 0) => {
  let $TodoList = document.querySelector(".to-do__list");
  let $CompletedsList = document.querySelector(".completeds__list");
  let $TaskTitle = document.querySelector(".main__title");
  let $TaskForm = document.querySelector(".to-do__form");
  let $CompletedsForm = document.querySelector(".completeds__form");

  let todoTasks = [];
  let completedTasks = [];

  $TodoList.innerHTML = "";
  $CompletedsList.innerHTML = "";

  //   CLASE ACTIVE PARA EL BOTÓN DEL MENÚ
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
