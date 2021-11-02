const $MenuBtn = document.querySelector(".header__menuBtn");
const $Header = document.querySelector(".header");

const $FoldersList = document.querySelector(".folders__list");
const $FolderForm = document.querySelector(".folders__form");

const $TaskTitle = document.querySelector(".main__title");
const $TaskForm = document.querySelector(".to-do__form");


// LISTENERS
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
  await createTask(newTask, folderId);
  $TaskForm.reset();
});

document.addEventListener("click", async (e) => {
  let folderId = $TaskTitle.firstElementChild.dataset.id;

  if (e.target.innerText == "highlight_off") {
    let taskId = e.target.parentElement.dataset.id;

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
    loadInit(folderId);
  }
});


// TOGGLE MENU RESPONISVE
const toggleMenu = () => {
  $Header.classList.toggle("header--show");
};


// IMPORTS
import { loadInit, printTasks } from "./js/loadInit.js";
import { deleteFolder, deleteTask, deleteAllCompletedTasks, createFolder, createTask, changeStatus } from "./js/crud.js"


