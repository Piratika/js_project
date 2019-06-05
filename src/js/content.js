// Массив из/в localstorage
const parsingLocal = str => JSON.parse(localStorage.getItem(str));
const postData = data => localStorage.setItem('currentData', JSON.stringify(data));

// Получение контента из файла
const getContent = func => $.ajax({
  type: "get",
  url: "/content/content.json",
  dataType: "json",
  success: data => {
    postData(data);
    (func.bind(null, data))();
  },
  error: function (jqXHR, textStatus, errorThrown) {
    console.log(textStatus, errorThrown);
  }
}).responseJSON;

function postContent(content) {
  let currentData = parsingLocal("currentData");
  if (currentData.findIndex(e => e.id == content.id) != -1) {
    currentData.splice(currentData.findIndex(e => content.id == e.id), 1);
  }
  currentData.push(content);
  postData(currentData);
  /*
  $.ajax({
    type: "post",
    url: "/content/content.json",
    contentType: "application/json",
    //dataType: "json",
    data: content,
    success: function (newContent) {
      data.push(newContent)
      postData(parsingLocal('currentData').push(newContent));
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    }
  });
  */
}

export { parsingLocal, postData, getContent, postContent };
