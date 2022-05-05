
AdminPlus.Sidebar.init()
AdminPlus.Scrollable()
var token_reg = 0;
const api = new Api();

loadGlobal();

api.getname();
api.getsurname();

console.log(global.settings);

var now = new Date().valueOf();

if ((global.settings.token_auth!=0) && ((now - global.settings.token_auth_data) >86400000)){
    api.authoriz_automat();
}
else if(global.settings.token_auth==0){
    location.href = 'auth.html';
}

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    window.pushNotification.registration(
      (token) => {
        console.log(token);
      },
      (error) => {
        console.error(error);
      }
    );
}
screen.orientation.lock('landscape');

function getUrlVar(){
    var urlVar = window.location.search; // получаем параметры из урла
    var arrayVar = []; // массив для хранения переменных
    var valueAndKey = []; // массив для временного хранения значения и имени переменной
    var resultArray = []; // массив для хранения переменных
    arrayVar = (urlVar.substr(1)).split('&'); // разбираем урл на параметры
    if(arrayVar[0]=="") return false; // если нет переменных в урле
    for (i = 0; i < arrayVar.length; i ++) { // перебираем все переменные из урла
        valueAndKey = arrayVar[i].split('='); // пишем в массив имя переменной и ее значение
        resultArray[valueAndKey[0]] = valueAndKey[1]; // пишем в итоговый массив имя переменной и ее значение
    }
    return resultArray; // возвращаем результат
}

let url = window.location.href;

if (url.includes("index")){
    api.accountinfo();
    api.getquests("online", 5,1);
    $("#firstname").text(global.settings.firstname);
    $("#lastname").text(" "+global.settings.lastname);

    document.getElementById("getPosition").addEventListener("click", getPosition);
    document.getElementById("networkInfo").addEventListener("click", networkInfo);
    document.addEventListener("offline", onOffline, false);
    //document.addEventListener("online", onOnline, false);
    document.getElementById("getLanguage").addEventListener("click", getLanguage);
    document.getElementById("getLocaleName").addEventListener("click", getLocaleName);
    document.getElementById("getDate").addEventListener("click", getDate);
    document.getElementById("getCurrency").addEventListener("click", getCurrency);
    document.getElementById("vibration").addEventListener("click", vibration);
    document.getElementById("vibrationPattern").addEventListener("click", vibrationPattern);
}

if (url.includes("kwest")){
    $("#firstname").text(global.settings.firstname);
    $("#lastname").text(" "+global.settings.lastname);
    let result = getUrlVar();
    var kwestId = result['id'];
    api.queststart(kwestId);
    console.log(api.statusqwest);
    api.questpassing(kwestId);
}

$("#exit_auth").click(function(){// Выход
    clearGlobal();
    location.reload();
});

 $(document).on("click", ".like", function(){
     let id = $(this).attr("id");
     let type = "top";

     api.questrating_get(id);
     let obj = api.statusqwestlike;

     if (obj['s'] == 'top'){
         swal({
             title:"Уведомление",
             text: "Вы уже это выбрали !",
             type:"success",
             confirmButtonColor: "#039BE5"
         });
     }

     else if (obj['s'] == 'down'){
         let rdiv = $(this).parents('div.raiting');
         $(this).parents('div.raiting').find('.dislike').removeClass("red");
         kol = obj['d'] - 1;
         $(this).parents('div.raiting').find('.dislike i').text(kol);
         kol = obj['t'] + 1;
          $(this).parents('div.raiting').find('.like i').text(kol);
         $(this).addClass("green");
         api.questrating_chan(id, 'top');
     }
     else{
         kol = obj['t'] + 1;
         $(this).addClass("green");
         $(this).parents('div.raiting').find('.like i').text(kol);
         api.questrating_set(id, type);
     }
 })

 $(document).on("click", ".dislike", function(){
    let id = $(this).attr("id");
    let type = "down";

    api.questrating_get(id)
    let obj = api.statusqwestlike;

    if (obj['s'] == 'top'){
        let rdiv = $(this).parents('div.raiting');
        $(this).parents('div.raiting').find('.like').removeClass("green");
        kol = obj['d'] + 1;
        $(this).parents('div.raiting').find('.dislike i').text(kol);
        kol = obj['t'] - 1;
        $(this).parents('div.raiting').find('.like i').text(kol);
        $(this).addClass("red");
        api.questrating_chan(id, 'down');
    }
    else if (obj['s'] == 'down'){
        swal({
            title:"Уведомление",
            text: "Вы уже это выбрали !",
            type:"success",
            confirmButtonColor: "#039BE5"
        });
    }
    else{
        $(this).addClass("red");
        kol = obj['d'] + 1;
        $(this).parents('div.raiting').find('.dislike i').text(kol);
        api.questrating_set(id, type)
    }
 })

 $(document).on("click", ".startKwest", function(){
    let idKwest = $(this).attr("id");
    location.href = 'kwest.html?id='+idKwest;

 })

 function utf8_to_b64(str) {
 	return window.btoa(unescape(encodeURIComponent(str)));
 }

 function b64_to_utf8(str) {
	return decodeURIComponent(escape(window.atob(str)));
}

 $(document).on("click", ".questbutton", function(){
     if ($(this).attr('data-click')=="answer"){
         let arr = $(this).attr('data-answerval').split('-');
         switch (arr[0]) {
             case 'val':
                api.questotvet(kwestId, $('input[name="'+arr[1]+'"]').val(), $(this).attr('data-answertype'), $(this).attr('data-eltype'), $(this).attr('name'));
             default:
                api.questotvet(kwestId, $(this).attr('data-answerval'), $(this).attr('data-answertype'), $(this).attr('data-eltype'), $(this).attr('name'));
         }

     }
 });

function decodeArrayBuffer(buffer) {
     var mime;
     var a = new Uint8Array(buffer);
     var nb = a.length;
     if (nb < 4)
         return null;
     var b0 = a[0];
     var b1 = a[1];
     var b2 = a[2];
     var b3 = a[3];
     if (b0 == 0x89 && b1 == 0x50 && b2 == 0x4E && b3 == 0x47)
         mime = 'image/png';
     else if (b0 == 0xff && b1 == 0xd8)
         mime = 'image/jpeg';
     else if (b0 == 0x47 && b1 == 0x49 && b2 == 0x46)
         mime = 'image/gif';
     else
         return null;
     var binary = "";
     for (var i = 0; i < nb; i++)
         binary += String.fromCharCode(a[i]);
     var base64 = window.btoa(binary);
     var image = '';
     image = 'data:' + mime + ';base64,' + base64;
     console.log(image);
     return image;
 }
