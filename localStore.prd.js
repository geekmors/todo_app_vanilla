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