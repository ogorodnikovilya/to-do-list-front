let allTasks = [];
const url = 'http://localhost:8080';
const headersOption = {
  'Content-type':'application/json;charset=utf-8',
  'Access-Control-Allow-Origin': '*'
};

window.onload = async() => {
  try {
    const resp = await fetch(`${url}/allTasks`, {
      method: 'GET'
    });
    const result = await resp.json();

    allTasks = result;
    render();
  } catch (error) {
    alert('Ошибка загрузки задач');
  };
};

const addTask = async () => {
  const inputEnterTask = document.querySelector(".todo-list__input-value");
  
  if (inputEnterTask === null || inputEnterTask.value.trim() === '') {
    inputEnterTask.value = "";
    return;
  }

  try {
    const resp = await fetch(`${url}/createTask`, {
      method: 'POST',
      headers: headersOption,
      body: JSON.stringify({
        text: inputEnterTask.value,
        isCheck: false
      })
    });
    const result = await resp.json();
      
    allTasks.push(result);
    inputEnterTask.value = "";
    render();
  } catch (error) {
    alert('Ошибка добавления задачи');
  };
};

const render = () => {
  const list = document.querySelector(".todo__items");

  while (list.firstChild) {
    list.removeChild(list.firstChild);
  };

  const sortAllTasks = [...allTasks]; 

  sortAllTasks
    .sort((a, b) => a.isCheck > b.isCheck ? 1 : a.isCheck < b.isCheck ? -1 : 0)
    .forEach(el => {
      const {text, isCheck, _id} = el;

      const block = document.createElement("div");
      const textInTask = document.createElement("div");
      const buttons = document.createElement("div");
      const check = document.createElement("input");
      const deleteBtn = document.createElement("button");
      const edit = document.createElement("button");
      block.id = `block-${_id}`;
      buttons.id = `buttons-${_id}`;

      buttons.classList.add("todo__buttons");

      check.type = "checkbox";
      check.checked = isCheck;
      check.classList.add("todo__complete");

      edit.classList.add("todo__changed");
      edit.innerText = "Редактировать";

      deleteBtn.classList.add("todo__delete");
      deleteBtn.innerText = "Удалить";

      textInTask.classList.add("todo__text");
      textInTask.innerText = text;

      list.appendChild(block);
      block.appendChild(textInTask);
      block.appendChild(buttons);
      buttons.appendChild(check);
      buttons.appendChild(edit);
      buttons.appendChild(deleteBtn);

      block.className = isCheck ? "todo__item checked" : "todo__item";

      if (isCheck) {
        buttons.removeChild(edit);
      } else {
        buttons.appendChild(check);
        buttons.appendChild(edit);
        buttons.appendChild(deleteBtn);
      };

      edit.onclick = () => {
        onChangeValue(_id, text);
        buttons.removeChild(edit);
      };
      
      /*
      Использую стрелочные функции, они работают в контексте включающей их области видимости, то есть — в контексте функции или другого кода, в котором они объявлены. Говоря лично о моем использовании стрелочных функций, то мне предпочтительнее их использовать не только из-за упрощенного синтаксиса и возможности неявного возвращения из функции, но и из-за того, что контекст стрелочной функции может совпадать с контекстом создавшей ее функции, что дает стрелочной доступ к списку аргументов, переданной этой функции.
      */
      check.onclick = () => {
        onChangeCheckbox(_id, isCheck);
      };

      deleteBtn.onclick = () => {
        onDeleteTask(_id);
      };
    });
};

const onChangeValue = (id, text) => {
  const inputTask = document.createElement("input");
  const doneButton = document.createElement("button");
  const block = document.getElementById(`block-${id}`);
  const buttons = document.getElementById(`buttons-${id}`);

  inputTask.type = "text";
  inputTask.value = text;
  doneButton.innerText = "Ок";
  doneButton.classList.add("todo__buttons");

  block.appendChild(inputTask);
  buttons.appendChild(doneButton);

  doneButton.onclick = () => {
    saveChange(inputTask, id);
  };
};

/*
Использую PATCH, потому что меняю всего лишь одно поле, не затрагивая и не меняя другие
*/
const saveChange = async(inputTask, id) => {
  try {
    const resp = await fetch(`${url}/updateTaskText`, {
      method: 'PATCH',
      headers: headersOption,
      body: JSON.stringify({
        text: inputTask.value,
        _id: id
      })
    });
    const response = await resp.json();

    allTasks.forEach(el => {
      if (response._id === el._id) {
        el.text = response.text;
      };
    });
    render();
  } catch (error) {
    alert('Ошибка изменения задачи');
  };
};

const onChangeCheckbox = async (idItem, isChecked) => {
  try {
    const resp = await fetch(`${url}/updateTaskCheck`, {
      method: 'PATCH',
      headers: headersOption,
      body: JSON.stringify({
        _id: idItem,
        isCheck: !isChecked
      })
    });
    const response = await resp.json();

    allTasks = response;
    render();
  } catch (error) {
    alert('Ошибка изменения задачи');
  };
};

const onDeleteTask = async (id) => { 
  try {
    await fetch(`${url}/deleteTask/?id=${id}`, {
      method: 'DELETE', 
    });

    allTasks = allTasks.filter((item) => id !== item._id);
    render();

  } catch (error) {
    alert('Ошибка удаления задачи');
  };
};

const deleteAllTasks = async () => {
  try {
    await fetch(`${url}/deleteAllTask`, {
      method: 'DELETE',
      headers: headersOption
    });

    allTasks = [];
    render();
  } catch (error) {
    alert('Ошибка удаления всех задач');
  };
};