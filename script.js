let allTasks = [];
let inputEnterTask = null;
let textTask = "";
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
    allTasks = result.data;
    render();
  } catch (error) {
    alert(error.message)
  }
};

const addTask = async () => {
  inputEnterTask = document.querySelector(".todo-list__input-value");
  textTask = inputEnterTask.value;

  if (textTask.trim() === '') {
    inputEnterTask.value = "";
    return alert("Вы ввели пустую задачу");
  }
  try {
      const resp = await fetch(`${url}/createTask`, {
        method: 'POST',
        headers: headersOption,
        body: JSON.stringify({
          text: textTask,
          isCheck: false
        })
      });
  
      await resp.json().then(resp => {
        allTasks.push(resp);
        render();
  
        textTask = "";
        inputEnterTask.value = "";
      })
    
  } catch (error) {
    alert(error.message);
  }
};

const render = () => {
  const list = document.querySelector(".todo__items");

  while (list.firstChild) {
    list.removeChild(list.firstChild);
  };

  const sortAllTasks = allTasks.sort((a, b) => a.isCheck > b.isCheck ? 1 : a.isCheck < b.isCheck ? -1 : 0);

  sortAllTasks
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
      }

      edit.onclick = () => {
        onChangeValue(_id, text);
        buttons.removeChild(edit);
      };
      
      /*
        Стрелочные функции лучше всего показывают себя там, где нужно привязать this к контексту, а не к самой функции.
        Если говорить простыми словами, то, помимо упрощенного синтаксиса и возможности неявного возращения со стороны стрелочной функции, 
        в классическом выражении функции, ключевое слово this привязывается к различным значениям, в зависимости от контекста, в котором оно вызвано. 
        В стрелочных функциях, ключ this – лексически привязан. Другими словами, this используется из той части кода, в которой содержится стрелочная функция.
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
    saveChange(inputTask, id)
  };

};

/*Используются PATCH-запросы потому, что PATCH-запросы позволяют изменять отдельные поля в объекте, не меняя те поля, которые мы не передаем, в случае же
PUT-запроса, если мы не передаем какое-то из полей в очередном запросе, то это поле будет удалено из БД
*/
const saveChange = async(inputTask, id) => {
  try {
    const resp = await fetch(`${url}/updateTask`, {
      method: 'PATCH',
      headers: headersOption,
      body: JSON.stringify({
        text: inputTask.value,
        _id: id
      })
    });
  
    const response = await resp.json();
    allTasks = response;
    render();
  } catch (error) {
    alert(error.message);
  }
}

const onChangeCheckbox = async (idItem, isChecked) => {
  try {
    const resp = await fetch(`${url}/updateTask`, {
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
    alert(error.message);
  }
};

const onDeleteTask = async (id) => { 
  try {
    const resp = await fetch(`${url}/deleteTask/?id=${id}`, {
      method: 'DELETE', 
    });   
    const response = await resp.json();
    allTasks = response;
    render();
  } catch (error) {
   alert(error.message);
  }
};

const deleteAllTasks = async () => {
  try {
    const resp = await fetch(`${url}/deleteAllTask`, {
      method: 'DELETE',
      headers: headersOption
    });
    
    if(resp){
      allTasks = [];
    };
    render();
  } catch (error) {
    alert(error.message);
  }
};