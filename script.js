const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const counter = document.getElementById("counter");
const clearBtn = document.getElementById("clear-done");
const filterButtons = document.querySelectorAll(".filter");

let tasks = [];
let currentFilter = "all";

try {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
} catch (e) {
  tasks = [];
}

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function render() {
  list.innerHTML = "";

  const visible = tasks.filter(function (task) {
    if (currentFilter === "active") return !task.done;
    if (currentFilter === "done") return task.done;
    return true;
  });

  if (visible.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "No tasks here";
    list.appendChild(empty);
  }

  visible.forEach(function (task) {
    const li = document.createElement("li");
    if (task.done) li.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", function () {
      task.done = checkbox.checked;
      save();
      render();
    });

    const text = document.createElement("span");
    text.textContent = task.text;

    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "\u00d7";
    del.addEventListener("click", function () {
      tasks = tasks.filter(function (t) {
        return t.id !== task.id;
      });
      save();
      render();
    });

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(del);
    list.appendChild(li);
  });

  const left = tasks.filter(function (t) {
    return !t.done;
  }).length;
  counter.textContent = left + (left === 1 ? " task left" : " tasks left");
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const value = input.value.trim();
  if (value === "") return;
  tasks.push({ id: Date.now(), text: value, done: false });
  input.value = "";
  save();
  render();
});

clearBtn.addEventListener("click", function () {
  tasks = tasks.filter(function (t) {
    return !t.done;
  });
  save();
  render();
});

filterButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    currentFilter = btn.dataset.filter;
    filterButtons.forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    render();
  });
});

render();