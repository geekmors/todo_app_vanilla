((function () {
    const DB_STORENAME = "mytodos"
    class db {
        constructor(store) {
            this.createStoreIfNotExists(store)
        }
        createStoreIfNotExists(store) {
            if (!window.localStorage.getItem(store))
                window.localStorage.setItem(store, JSON.stringify([]))
        }
        static getAllFromStore(store) {
            return JSON.parse(localStorage.getItem(store))
        }
        static saveToStore(store, data) {
            localStorage.setItem(store, JSON.stringify(data))
        }
    }
    function Todo(content) {
        return { content:content, id: Todos.getNewId(), isComplete: false}
    }
    class Todos {
        constructor(storeName) {
            this.storeName = storeName
            this.initStore()
        }
        initStore() {
            new db(this.storeName)
        }
        static getNewId() {
            let data = db.getAllFromStore(DB_STORENAME)
            data = data.length ? data : [{ id: 0 }]
            return Math.max(...data.map(i => i.id)) + 1
        }
        create(content, $component) {
            var data = db.getAllFromStore(this.storeName)
            data.push(Todo(content))
            db.saveToStore(this.storeName, data)
            $component.renderList(data)
        }
        remove(id, $component) {
            var data = db.getAllFromStore(this.storeName)
            data = data.filter(i => i.id != id)
            db.saveToStore(this.storeName, data)
            $component.renderList(data)
        }
        setIsComplete(id, state, $component) {
            var data = this.getAll()
            data = data.map(d => {
                if (d.id == id)
                    d.isComplete = state
                return d
            })
            db.saveToStore(DB_STORENAME, data)
            $component.renderList(data)
        }
        getAll() {
            return db.getAllFromStore(this.storeName)
        }
        getById(id) {
            return db.getAllFromStore(this.storeName).filter(i => i.id == id)[0]
        }
    }
    var getClass = classString => classString.indexOf(" ") != -1 ? classString.split(" ") : classString
    function todoItemTitle(title, _class) {
        console.log(_class, ...getClass(_class))
        var span = document.createElement('span')
        span.innerText = title;
        typeof getClass(_class) == "string"? span.classList.add(getClass(_class)): span.classList.add(...getClass(_class))
        return span
    }
    function todoListItem(_class, data_id, children) {
        var listItem = document.createElement('li')
        listItem.classList.add(_class)
        listItem.setAttribute('data-id', data_id)
        for (var child of children)
            listItem.appendChild(child)
        return listItem
    }
    function ItemControls(buttonList) {
        var itemControlCon = document.createElement('div')
        itemControlCon.classList.add("item-controls")
        for (var btn of buttonList) {
            itemControlCon.appendChild(btn)
        }
        return itemControlCon
    }
    function buttonEl(_class, dataId, label) {
        var btn = document.createElement('button')
        btn.setAttribute('data-id', dataId)
        btn.innerText = label;
        typeof getClass(_class) == "string"? btn.classList.add(getClass(_class)): btn.classList.add(...getClass(_class))
        return btn
    }
    class TodosComponent {
        constructor(formId, listId, inputId) {
            this.todoForm = document.getElementById(formId)
            this.todoList = document.getElementById(listId)
            this.todoInput = document.getElementById(inputId)
            this.todoForm.onsubmit = this.onTodoFormSubmitHandler.bind(this)
            var todos = (new Todos(DB_STORENAME)).getAll()
            this.renderList(todos ? todos : [])
        }
        onTodoFormSubmitHandler(e) {
            e.preventDefault()
            this.NewTodoContent = this.todoInput.value
            this.todoInput.value = ""
            if (this.NewTodoContent.length > 0)
                (new Todos(DB_STORENAME)).create(this.NewTodoContent, this)
        }
        renderList(data) {
            this.todoList.innerHTML = ""
            for (var d of data) {
                var title = todoItemTitle(d.content, `todo-item-title${d.isComplete ? " done" : ""}`)
                var controls = ItemControls([buttonEl("todo-item-remove", d.id, "remove"), buttonEl(`todo-item-completed${d.isComplete ? " true" : ""}`, d.id, "complete")])
                var item = todoListItem("todo-list-item", d.id, [title, controls])
                this.todoList.appendChild(item)
            }
            this.initEventHandlers()
        }
        initEventHandlers() {
            var $this = this
            var removeButtonList = document.getElementsByClassName("todo-item-remove")
            var completeButtonList = document.getElementsByClassName("todo-item-completed")
            for (let i = 0; i < removeButtonList.length; i++) {
                removeButtonList[i].addEventListener("click", function (e) {
                    (new Todos(DB_STORENAME)).remove(parseInt(removeButtonList[i].getAttribute("data-id")), $this)
                })
                completeButtonList[i].addEventListener("click", function (e) {
                    (new Todos(DB_STORENAME)).setIsComplete(parseInt(completeButtonList[i].getAttribute("data-id")), completeButtonList[i].classList.contains("true") ? false : true, $this)
                })
            }
        }
    }
    new TodosComponent("todo-input", "todo-list", "todo_text_input")
})())