let allTasks = [];
let input = null;
let inputValue = "";
const link = 'http://localhost:8080'

const getTasks = async() => {
  const resp = await fetch(`${link}/allTasks`, {
      method: 'GET'
    });
    const result = await resp.json();
    allTasks = result.data;
    render();
}

window.onload = function () {
  getTasks()
};

const onClickButton = async () => {
  input = document.querySelector(".todo-list__input-value");
  inputValue = input.value;

  if (inputValue.length > 0) {
    const resp = await fetch(`${link}/createTask`, {
      method: 'POST',
      headers: {
        'Content-type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        text: inputValue,
        isCheck: false
      }),
    })

    await resp.json().then((resp) => {
      allTasks.push(resp);
      render();

      inputValue = "";
      input.value = "";
    })
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
    {if(a.isCheck === b.isCheck) return 0;
      return (a.isCheck > b.isCheck ? 1: -1)
      })
    .map((el, index) => {
      const block = document.createElement("div");
      const text = document.createElement("div");
      const buttons = document.createElement("div");
      const check = document.createElement("input");
      const del = document.createElement("button");
      const edit = document.createElement("button");

      buttons.classList.add("todo__buttons");

      check.type = "checkbox";
      check.checked = el.isCheck;
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

      block.className = el.isCheck ? "todo__item checked" : "todo__item";

      if (el.isCheck) {
        buttons.removeChild(edit);
      } else {
        buttons.appendChild(check);
        buttons.appendChild(edit);
        buttons.appendChild(del);
      }

      edit.onclick = () => {
        onChangeValue(el._id, block, buttons, el);
        buttons.removeChild(edit);
      };

      check.onclick = () => {
        onChangeCheckbox(el._id, el.isCheck);
      };

      del.onclick = () => {
        onDeleteTask(el._id);
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

  block.appendChild(inputTask);
  buttons.appendChild(doneButton);


  inputTask.onchange = async(event) => {
    const resp = await fetch(`${link}/updateTask`, {
      method: 'PATCH',
      headers: {
        'Content-type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        text: inputTask.value,
        _id: index
      })
    });

    if(resp){
      console.log(resp.json());
      allTasks = allTasks.map((item) => {
        const newTask = {...item};
        if(item._id === index){
          newTask.text = event.target.value;
        }
        return newTask;
        
      })
      getTasks()
    }
  };
};


const onChangeCheckbox = async (idItem, isChecked) => {
 
  const resp = await fetch(`${link}/UpdateTask`, {
    method: 'PATCH',
    headers: {
      'Content-type':'application/json;charset=utf-8',
      'Access-Control-Allow-Origin' :'*'
    },
    body: JSON.stringify( {
    _id: idItem,
    isCheck: !isChecked
    })
  });

  if(resp){
     allTasks = allTasks.map((item) => {
        const newTask = {...item}
      if(item._id === idItem){
        newTask.isCheck = !isChecked;
      }
      return newTask;
      
    })
    render()  
  }
}

const onDeleteTask = async (deleteID) => {
  
  await fetch(`${link}/deleteTask?id=${deleteID}`, {
      method: 'DELETE',
      headers: {
        'Content-type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin' :'*'
      }}).then(() => getTasks())
    }

const delAllTasks = async () => {
  await fetch(`${link}/deleteAllTask`, {
    method: 'DELETE',
    headers: {
      'Content-type':'application/json;charset=utf-8',
      'Access-Control-Allow-Origin' :'*'
    }}).then(() => getTasks())
};