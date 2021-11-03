import { loadInit } from "./loadInit.js";

// URLs API
let URL_Folders = "https://apiserver-todolist.herokuapp.com/api/carpetas";
let URL_Tasks = "https://apiserver-todolist.herokuapp.com/api/tareas";


// FUNCTIONS
export const deleteFolder = async () => {
  let $TaskTitle = document.querySelector(".main__title");
  let folderId = $TaskTitle.firstElementChild.dataset.id;

  await fetch(`${URL_Folders}/${folderId}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then(() => loadInit())
    .catch((error) => {
      alert(error.text || "Something goes wrong. Folder can't be deleted");
      loadInit(folderId);
    });
};

export const deleteTask = async (taskId) => {
  let $TaskTitle = document.querySelector(".main__title");
  let folderId = $TaskTitle.firstElementChild.dataset.id;

  await fetch(`${URL_Tasks}/${taskId}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .catch((error) => {
      alert(error.text || "Something goes wrong. Task can't be deleted");
      loadInit(folderId);
    });
};

export const createFolder = async (newFolder) => {
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
    .then((json) => loadInit(json.data._id))
    .catch((error) => {
      alert(error.text || "Something goes wrong. Folder can't be created");
      loadInit();
    });
};

export const createTask = async (newTask, folderId) => {
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
    .then(() => loadInit(folderId))
    .catch((error) => {
      alert(error.text || "Something goes wrong. Task can't be created");
      loadInit(folderId);
    });
};

export const changeStatus = async (taskId) => {
  let $TaskTitle = document.querySelector(".main__title");
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
    .then(() => loadInit(folderId))
    .catch((error) => {
      alert(error.text || "Something goes wrong. Status can't be changed");
      loadInit(folderId);
    });
};

export const deleteAllCompletedTasks = () => {
  let $CompletedTasks = document.querySelectorAll(".completeds__task");

  $CompletedTasks.forEach(async (el) => {
    let taskId = el.lastElementChild.dataset.id;
    await deleteTask(taskId);
  });
};
