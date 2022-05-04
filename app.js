let allTasks = JSON.parse(localStorage.getItem("todo")) || [];
let input = null;
let inputValue = "";

window.onload = function () {
  render();

  localStorage.setItem("todo", JSON.stringify(allTasks));
};

const onClickButton = () => {
  input = document.querySelector(".todo-list__input-value");
  inputValue = input.value;

  if (inputValue.length > 0) {
    allTasks.push({
      text: inputValue,
      isChecked: false,
    });

    localStorage.setItem("todo", JSON.stringify(allTasks));

    render();

    inputValue = "";
    input.value = "";
  } else {
    alert("Вы ввели пустую задачу");
  }
};

const render = () => {
  const list = document.querySelector(".todo__items");

  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  allTasks
    .sort((a, b) =>
      a.isChecked > b.isChecked ? 1 : a.isChecked < b.isChecked ? -1 : 0
    )
    .map((el, index) => {
      const block = document.createElement("div");
      const text = document.createElement("div");
      const buttons = document.createElement("div");
      const check = document.createElement("input");
      const del = document.createElement("button");
      const edit = document.createElement("button");

      buttons.classList.add("todo__buttons");

      check.type = "checkbox";
      check.checked = el.isChecked;
      check.classList.add("todo__complete");

      edit.classList.add("todo__changed");
      edit.innerText = "Редактировать";

      del.classList.add("todo__delete");
      del.innerText = "Удалить";

      text.classList.add("todo__text");
      text.innerText = el.text;

      list.appendChild(block);
      block.appendChild(text);
      block.appendChild(buttons);
      buttons.appendChild(check);
      buttons.appendChild(edit);
      buttons.appendChild(del);

      block.className = el.isChecked ? "todo__item checked" : "todo__item";

      if (el.isChecked) {
        buttons.removeChild(edit);
      } else {
        buttons.appendChild(check);
        buttons.appendChild(edit);
        buttons.appendChild(del);
      }

      edit.onclick = () => {
        onChangeValue(index, block, buttons, el);
        buttons.removeChild(edit);
      };

      check.onclick = () => {
        onChangeCheckbox(index);
      };

      del.onclick = () => {
        onDeleteTask(index);
      };
    });
};

const onChangeValue = (index, block, buttons, el) => {
  const inputTask = document.createElement("input");
  const doneButton = document.createElement("button");

  inputTask.type = "text";
  inputTask.value = el.text;
  doneButton.innerText = "Ок";
  doneButton.classList.add("todo__buttons");

  inputTask.onchange = (event) => {
    allTasks[index].text = event.target.value;
    localStorage.setItem("todo", JSON.stringify(allTasks));

    render();
  };

  block.appendChild(inputTask);
  buttons.appendChild(doneButton);
  buttons.appendChild(cancelButton);
};

const onChangeCheckbox = (index) => {
  allTasks[index].isChecked = !allTasks[index].isChecked;
  localStorage.setItem("todo", JSON.stringify(allTasks));

  render();
};

const onDeleteTask = (index) => {
  allTasks.splice(index, 1);
  localStorage.setItem("todo", JSON.stringify(allTasks));

  render();
};

const delAllTasks = () => {
  allTasks = [];
  localStorage.setItem("todo", JSON.stringify(allTasks));
  localStorage.clear();

  render();
};
