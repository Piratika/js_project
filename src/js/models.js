const parsingLocal = str => JSON.parse(localStorage.getItem(str));

class ContentManager {
    constructor() {
        // Счетчик, который хранит id, который будет присвоен новому контенту
        this._nextContentId = 20;
    }

    createContent(title, type, link, creator, image, description) {
        // Создаем контент
        let content = new Content(this._nextContentId++, type, title, link, creator, image, description);
        return content;
    }

    updateContent(id, title, type, link, creator, image, description, add_time) {
        // Изменяем контент
        let update_time = new Date();
        let content = new Content(id, type, title, link, creator, image, description, add_time, update_time);
        return content;
    }

    // Контент по id
    getContentById(id) {
        let currentData = parsingLocal("currentData");
        return currentData.find(e => id == e.id);
    }
}

class Content {
    constructor(id, type, title, link, creator, image, description, add_time, update_time) {
        this.id = id;
        this.add_time = add_time || new Date();
        this.type = type;
        this.title = title;
        this.link = link;
        this.creator = creator || 'unknown';
        this.image = image;
        this.description = description;
        this.update_time = update_time;
    }
    toJson() {
        // Приведем объект к тому JSON-представлению, которое отдается клиенту
        return {
            id: this.id,
            type: this.type,
            title: this.title,
            link: this.link,
            creator: this.creator,
            image: this.image,
            description: this.description
        };
    }
}

export { ContentManager, Content };
