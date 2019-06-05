import { parsingLocal } from './content';
import search from './search';

// Присвоение контенту стандартного изображения, если надо
const setDefaultImgByType = type => {
    switch (type) {
        case 'music': return 'content/images/music_default.png';
        case 'game': return 'content/images/game_default.png';
        case 'book': return 'content/images/book_default.png';
        case 'project': return 'content/images/project_default.png';
        case 'video': return 'content/images/video_default.png';
        default: return 'content/images/default.png';
    }
}

// функции для сортировки элементов массива
const compareDates = (a, b) => Date.parse(a.update_time || a.add_time) - Date.parse(b.update_time || b.add_time);
const compareByText = (param) => (a, b) => a[param].toLowerCase() > b[param].toLowerCase() ? 1 : -1;

// создание элементов figure контента
const newContentElement = obj => {
    return $(`<figure class="content_element" id="${obj.id}"></figure>`)
        .append(`<button class="hidden" id="button_edit_${obj.id} name="button_edit"></button><label class="hidden" for="button_edit_${obj.id}" title="edit"><i class="fas fa-pencil-alt"></i></label>
        <button class="hidden" id="button_delete_${obj.id} name="button_delete"></button><label class="hidden" for="button_delete_${obj.id}" title="delete"><i class="far fa-trash-alt"></i></label>`)
        .append(`<img alt="${obj.type} picture" src="${obj.image || setDefaultImgByType(obj.type)}"/>`)
        .append(`<figcaption><span title='${(obj.title.length > 16) ? obj.title : ''}'>${obj.title}</span><span>${obj.creator || 'unknown'}</span></figcaption>`)
}

// Добавление вариантов в сортировку по автору
// Вспомогательная функция отбора уникальных значений массива
const uniqueVal = (value, index, self) => self.indexOf(value) === index;

const addCreatorSortOptions = currentElements => {
    $("#sort_by_creator option:not(:first-child)").remove();
    $("#sort_by_creator option:first-child").prop("select", false);
    let options = (currentElements.map(e => e.creator)).filter(uniqueVal);
    const newOption = e => `<option value="${e}">${e}</option>`;
    for (let i = 0; i < options.length; i++) {
        $("#sort_by_creator").append(newOption(options[i]));
    }
}

// добавление контента на страницу
const addContentOnPage = (contentsInArr = parsingLocal('currentData'), type, condition, direction, creator) => {
    console.log('используем ' + contentsInArr.length, 'localStorage ' + parsingLocal('currentData').length);
    console.log(contentsInArr);
    if ($("input[name='search']").val() && $("input[name='search']").val() !== '') contentsInArr = search($("input[name='search']").val());
    type = type ? type : $(".menu li input:checked").val();
    condition = condition ? condition : $("#sort_by").val();
    direction = direction ? direction : $("input[name='sort_direction']:checked").val();
    creator = creator ? creator : $("#sort_by_creator option:selected").val();
    if (creator != 0 && condition == "creator") direction = 0;
    // убираем что было
    $(".content").html('');
    // фильтр по типу
    if (type != 0 && type) contentsInArr = contentsInArr.filter(e => e.type === type);
    // фильтр по автору
    if (creator && creator != 0) contentsInArr = contentsInArr.filter(e => e.creator === creator);    
    // вид сортировки
    let param;
    switch (condition) {
        case 'date': param = 'add_time';
            contentsInArr.sort(compareDates);
            break;
        case 'title': param = 'title';
            contentsInArr.sort(compareByText(param));
            break;
        case 'creator': param = 'creator';
            contentsInArr.sort(compareByText(param));
            break;
    }
    // направление сортировки
    if (direction == 1) contentsInArr.reverse();
    // Обновить варианты сортировки по автору
    addCreatorSortOptions(contentsInArr);
    if (creator != 0) $(`#sort_by_creator option[value="${creator}"]`).prop('selected', true);
    // если подходящего контента нет
    if (contentsInArr.length == 0) {
        $(".content").append("<p>Ничего нет</p>");
        return;
    }
    // А теперь добавляем
    contentsInArr.forEach(element => {
        $(".content").append(newContentElement(element));
    });
    // выделить соответствующие фрагменты поиска
    if ($("input[name='search']").val() && $("input[name='search']").val() !== '') {
        let targets = $("input[name='search']").val().split(' ');
        let re = new RegExp(targets.join('|'), 'gi');
        $(".content figcaption").html($(".content figcaption").html().replace(re, '<mark class="found">$&</mark>'))
    }
}

// просмотр контента отдельно
const watchingContent = event => {
    if (event.target.nodeName == 'I') return;
    let content = (parsingLocal('currentData')).find(elem => elem.id == event.currentTarget.id);
    $(".menu li input").prop('checked', false);
    $(".menu li").removeClass("active");
    $(".sort").hide();
    $('label[for="button_add"]').hide();
    $("#heading h1").text(`${content.title} - ${content.creator}`)
    // убираем что было
    $(".content").html('');
    $(".content").append(`<p>added ${content.add_time}</p>${content.update_time ? '<p>updated ' + content.update_time + '</p>' : ''}`)
        .append(`<img alt="content_image" src="${content.image || setDefaultImgByType(content.type)}">`)
        .append(`<p>${content.description}</p>`)
        .append(`<a href='${content.link}'>download</a>`);
}

export default addContentOnPage;
export { watchingContent };
