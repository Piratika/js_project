import '../sass/main.scss';
import { ContentManager } from './models';
import addContentOnPage, { watchingContent } from './dom';
import { parsingLocal, postData, getContent, postContent } from './content';
import search from './search';

jQuery(document).ready(function () {
  let manager = new ContentManager();

  // Добавление контента
  function handler(e) {
    e.preventDefault();
    let newContent = manager.createContent(
      $("#new_content_title").val(),
      $("#new_content_type").val(),
      $("#new_content_link").val(),
      $("#new_content_creator").val(),
      $("#new_content_image").val(),
      $("#new_content_description").val()
    );
    postContent(newContent);
    addContentOnPage();
    closeAddContentWindow();
  }

  $("#add_content_form").submit(handler);

  // удаление контента
  $(document).on('click', "label[title='delete']", e => {
    deleteContentById(e.target.parentElement.parentElement.id)
  });

  const deleteContentById = id => {
    let currentData = parsingLocal("currentData");
    currentData.splice(currentData.findIndex(e => e.id == id), 1);
    postData(currentData);
    addContentOnPage();
  }

  // редактирование контента
  $(document).on('click', "label[title='edit']", event => {
    event.preventDefault();
    openAddContentWindow();
    let content = manager.getContentById(event.target.parentElement.parentElement.id);
    $("#edit_content_form").attr('name', `${event.target.parentElement.parentElement.id}`);
    editContent.call(content);
  });

  function editContent() {
    // заполнение формы редактирования
    $("#update_content_title").val(this.title);
    $("#update_content_type").val(this.type);
    $("#update_content_link").val(this.link);
    $("#update_content_creator").val(this.creator);
    $("#update_content_image").val(this.image);
    $("#update_content_description").val(this.description);
    $("#edit_content_form").submit(e => {
      e.preventDefault();
      let content = manager.getContentById(e.target.name);
      let updatingContent = manager.updateContent(
        content.id,
        $("#update_content_title").val(),
        $("#update_content_type").val(),
        $("#update_content_link").val(),
        $("#update_content_creator").val(),
        $("#update_content_image").val(),
        $("#update_content_description").val(),
        content.add_time
      );
      postContent(updatingContent);
      addContentOnPage();
      closeAddContentWindow();
    });
  }

  // Реагирование на нажатие на элемент меню
  $(".menu li input:checked").parent().addClass("active");
  $(".menu li input").change(e => {
    $("input[name='search']").val('');
    $("#heading h1").text(`${$(".menu li input:checked + label").text()}`)
    $(".menu li").removeClass("active");
    $(".menu li input:checked").parent().addClass("active");
    // Показать опции сортировки
    $(".sort:not(input[type='radio'])").show();
    $('label[for="button_add"]').show();
    // Обнулить выбор по автору
    $("#sort_by_creator option:first-child").prop("selected", true);
    addContentOnPage();
  })

  // Просмотреть контент
  $(document).on('click', 'figure', (e => watchingContent(e)))

  // Сортировка
  // $("#sort_by, #sort_by_creator, input[name='sort_direction']").change(() => addContentOnPage());
  $(document).on('change', "#sort_by, input[name='sort_direction']", (() => addContentOnPage()));
  $(document).on('change', "#sort_by_creator", (() => addContentOnPage()));

  // окно добавления/редактирования контента
  // убрать окно добавления/редактирования контента
  const closeAddContentWindow = () => {
    $("#add_content, #edit_content").hide();
    $('label[for="button_add"]').removeClass("active");
    document.body.style.overflow = 'auto';
    $("#add_content input:not([type='submit']), #add_content textarea").val('');
    $("#add_content select").val('game')
  }

  $(document).on('click', '#add_content:not(form), #edit_content:not(form), label[for="button_add"].active', (e => {
    if (e.target.id === "add_content" || e.target.id === "edit_content" || e.target.htmlFor === "button_add") closeAddContentWindow();
  }));

  // показать окно добавления/редактирования контента
  const openAddContentWindow = e => {
    e ? $("#add_content").show() : $("#edit_content").show();
    $('label[for="button_add"]').addClass("active");
    $("body,html").animate({
      scrollTop: 0
    });
    document.body.style.overflow = 'hidden';
    // $("input:not([type='submit']), textarea").val('');
  }

  $(document).on('click', 'label[for="button_add"]:not(.active)', (openAddContentWindow));

  // запуск поиска
  $(document).on('propertychange input', 'input[name="search"]', (e => {
    e.preventDefault();
    addContentOnPage(search($("input[name='search']").val()));
  }));

  $(document).on('keydown', 'input[name="search"]', (e => {
    if (e.key === "Enter") return false;
  }));

parsingLocal("currentData") ? addContentOnPage() : getContent(addContentOnPage);
});
