


class Api {

    reiting="";
    statusquest="";
    constructor() {
        this.url_serv = "https://31.44.6.156/api/v1/";
        this.reiting="345";
        this.statusquest="345";
    }

/////////////////////--!-- Авторизация и аккаунт --!--////////////////////////////////////////////////
    onetoken() { //Получение токена на 10 минут
        $.ajax({
            type: "GET",
            url: this.url_serv +"token/one-time",
            dataType: 'json',
            success: function (result, status, xhr) {
                if  ("token" in result){
                    token_reg = result['token'];
                    global.settings.token_one = token_reg;
                    saveGlobal();
                    console.log("10 мин токен -> "+token_reg);
                }
            },
            error: function (xhr, status, error) {
                swal({
                    title: "Ошибка",
                    text: "Ошибка получения одноразового токена токена",
                    type: "error",
                    confirmButtonColor: "#039BE5"
                })
            }
        })
    }

    authoriz_automat() {// Автоматическая авторизация, если извстно логин и пароль

        var data_auth = {
            "id":   global.settings.user_name,
            "pass": global.settings.user_pass
        };

        $.ajax({
            type: "POST",
            url: this.url_serv +"token/auth",
            data:JSON.stringify(data_auth),
            dataType: 'json',
            headers: {
                Authorization: 'Bearer ' +  global.settings.token_one
            },

            success: function (result, status, xhr) {
                if  ("token" in result){
                    global.settings.token_auth = result["token"];
                    global.settings.prov_auth = 1;
                    var now = new Date().valueOf();
                    global.settings.token_auth_data = now;
                    saveGlobal();
                    let url = window.location.href;
                    if (url.includes("auth")){
                        location.href = 'index.html';
                    }
                }
            },
            error: function (xhr, status, error) {
                let err = eval("(" + xhr.responseText + ")");
                swal({
                    title: "Ошибка",
                    text: err,
                    type: "error",
                    confirmButtonColor: "#039BE5"
                })
                console.log(err);
                alert("ошибка автоматичесой авторизации");
                location.href = 'auth.html';
            }
        });
    }

    authoriz() {// Авторизация по кнопке

        var data_auth = {
            "id":   $("#auth_login").val(),
            "pass": $("#auth_passwd").val()
        };

        $.ajax({
            type: "POST",
            url: this.url_serv +"token/auth",
            data:JSON.stringify(data_auth),
            dataType: 'json',
            headers: {
                Authorization: 'Bearer ' + token_reg
            },

            success: function (result, status, xhr) {
                if  ("msg_e" in result){
                    swal({
                        title: "Ошибка",
                        text: result['msg_e'],
                        type: "error",
                        confirmButtonColor: "#039BE5"
                    })
                }
                else if  ("token" in result){
                    global.settings.user_name = $("#auth_login").val();
                    global.settings.user_pass = $("#auth_passwd").val();
                    global.settings.token_auth = result["token"];
                    var now = new Date().valueOf();
                    global.settings.token_auth_data = now;
                    saveGlobal();
                    location.href = '/index.html';
                }
            },
            error: function (xhr, status, error) {
                    global.settings.user_name = 0;
                    global.settings.user_pass = 0;
                    global.settings.token_auth = 0;
                    global.settings.token_auth_data = 0
                    global.settings.firstname = ""
                    global.settings.lastname = ""
                    global.settings.prov_auth = 0
                    saveGlobal();

                    let err = eval("(" + xhr.responseText + ")");
                    swal({
                        title: "Ошибка",
                        text: err,
                        type: "error",
                        confirmButtonColor: "#039BE5"
                    })
                    console.log(err);
            }
        });
    }

    registration() { //Регистрация по кнопке

        var data_reg = {
            "login":$("#reg_login").val(),
            "mail":$("#reg_email").val(),
            "pass":$("#reg_passw").val(),
            "phone":$("#reg_phone").val()
        };

        $.ajax({
            type: "POST",
            url: this.url_serv + "account/registration",
            data:JSON.stringify(data_reg),
            dataType: 'json',
            headers: {
                Authorization: 'Bearer ' + token_reg
            },

            success: function (result, status, xhr) {
                    global.settings.user_name = $("#reg_login").val();
                    global.settings.user_pass = $("#reg_passw").val();
                    saveGlobal();
                    swal({
                        title:"Уведомление",
                        text: result['msg_s'],
                        type:"success",
                        confirmButtonColor: "#039BE5"
                    });
                    api.authoriz_automat();
            },
            error: function (xhr, status, error) {
                let err = eval("(" + xhr.responseText + ")");
                swal({
                    title: "Ошибка",
                    text: err.msg_e,
                    type: "error",
                    confirmButtonColor: "#039BE5"
                })
                console.log(err);
            }
        });
    }

    getname() {// Получение Имени
        $.ajax({
            type: "GET",
            url: this.url_serv +"account/name",
            async: false,
            dataType: 'json',
            headers: {
                Authorization: 'Bearer ' + global.settings.token_auth
            },

            success: function (result, status, xhr) {
                if ("name" in result){
                    global.settings.prov_auth = 1;
                    global.settings.firstname = result['name'];
                    saveGlobal();
                }
            },
            error: function (xhr, status, error) {
                api.onetoken();
                api.authoriz_automat();
            }
        })
    }

    setname(nameuser) {//Изменение имени

        var data_auth = {
            "value":nameuser
        };

        $.ajax({
            type: "PUT",
            url: this.url_serv +"account/name",
            dataType: 'json',
            data:JSON.stringify(data_auth),
            headers: {
                Authorization: 'Bearer ' + global.settings.token_auth
            },

            success: function (result, status, xhr) {
                    swal({
                        title:"Уведомление!",
                        text:"Вы изменили имя!",
                        type:"success",
                        confirmButtonColor: "#039BE5"
                    });
                    global.settings.firstname = nameuser;
                    saveGlobal();
            },
            error: function (xhr, status, error) {
                 console.log(xhr);
            }
        });
    }

    getsurname() {//Получение Фамилии
        $.ajax({
            type: "GET",
            url: this.url_serv +"account/surname",
            async: false,
            dataType: 'json',
            headers: {
                Authorization: 'Bearer ' + global.settings.token_auth
            },

            success: function (result, status, xhr) {

                if ("surname" in result){
                    global.settings.lastname = result['surname'];
                    saveGlobal();
                }

            },
            error: function (xhr, status, error) {
                 console.log(error);
            }
        });
    }

    setsurname(surname) {//Изменение фамилии
        var data_auth = {
            "value":surname
        };

        $.ajax({
            type: "PUT",
            url: this.url_serv +"account/surname",
            data:JSON.stringify(data_auth),
            dataType: 'json',
            headers: {
                Authorization: 'Bearer ' + global.settings.token_auth
            },

            success: function (result, status, xhr) {
                    swal({
                        title:"Ура!",
                        text:"Вы изменили фамилию!",
                        type:"success",
                        confirmButtonColor: "#039BE5"
                    });
                    global.settings.lastname = surname;
                    saveGlobal();
            },
            error: function (xhr, status, error) {
                 console.log(xhr);
            }
        });

    }

    accountinfo() {//Изменение фамилии

        $.ajax({
            type: "GET",
            url: this.url_serv +"account/info",
            dataType: 'json',
            headers: {
                Authorization: 'Bearer ' + global.settings.token_auth
            },

            success: function (result, status, xhr) {
                console.log(result);
            },
            error: function (xhr, status, error) {
                 console.log(xhr);
            }
        });

    }
/////////////////////--!-- КОНЕЦ --!--////////////////////////////////////////////////

/////////////////////--!-- КВЕСТЫ --!--////////////////////////////////////////////////

    get statusqwestlike(){
        return this.reiting;
    }
    set statusqwestlike(s){
        this.reiting = s;
    }

    get statusqwest(){
        return this.statusquest;
    }
    set statusqwest(s){
        this.statusquest = s;
    }

    getquests(type, r, p) {//Получение списка квестов

        if (type == "online"){

            $.ajax({
                type: "GET",
                url: this.url_serv +"quest/show?type="+type,
                dataType: 'json',
                headers: {
                    Authorization: 'Bearer ' + global.settings.token_auth
                },
                success: function (result, status, xhr) {
                    console.log(result);
                    $.each(result['d'],function(index,value){
                        let text = '';
                        text = '<div class="card">';

                        text = text+ '<br>';
                        text = text+ '<div class="container"> <div class="row">';
                        text = text+ '<div class="col-12"><h5 class="card-title text-center">'+value['n']+'</h5></div>';
                        text = text+ '</div></div>';

                        text = text+ '<img src="https://via.placeholder.com/800x500" class="card-img-top" alt="..." style="max-width:100%">';
                        text = text+ '<div class="card-body">';

                        if (value['r']['s'] == "top"){
                            text = text+ '<div class="row raiting">';
                            text = text+ '<div class="col-6"><span class="like green" id="'+value['i']+'"><i class="fa fa-thumbs-up fa-lg" aria-hidden="true">'+value['r']['t']+'</i></span></div>';
                            text = text+ '<div class="col-6"><span class="dislike" id="'+value['i']+'"><i class="fa fa-thumbs-down fa-lg" aria-hidden="true">'+value['r']['d']+'</i></span></div>';
                            text = text+ '</div>';
                        }
                        else if (value['r']['s'] == "down"){
                            text = text+ '<div class="row raiting">';
                            text = text+ '<div class="col-6"><span class="like" id="'+value['i']+'"><i class="fa fa-thumbs-up fa-lg" aria-hidden="true">'+value['r']['t']+'</i></span></div>';
                            text = text+ '<div class="col-6"><span class="dislike red" id="'+value['i']+'"><i class="fa fa-thumbs-down fa-lg" aria-hidden="true">'+value['r']['d']+'</i></span></div>';
                            text = text+ '</div>';
                        }
                        else{
                            text = text+ '<div class="row raiting">';
                            text = text+ '<div class="col-6"><span class="like" id="'+value['i']+'"><i class="fa fa-thumbs-up fa-lg" aria-hidden="true">'+value['r']['t']+'</i></span></div>';
                            text = text+ '<div class="col-6"><span class="dislike " id="'+value['i']+'"><i class="fa fa-thumbs-down fa-lg" aria-hidden="true">'+value['r']['d']+'</i></span></div>';
                            text = text+ '</div>';
                        }
                        text = text+ '<hr>';




                        text = text+ '<p class="card-text">'+value['d']+'</p><hr>';

                        text = text+ '<div class="container"> <div class="row">';
                        text = text+ '<div class="col-6"><p class="card-text">Уровень: '+value['l']+'</p></div>';
                        text = text+ '<div class="col-6"><p class="card-text">Прошло: '+value['c']+'</p></div>';
                        text = text+ '</div></div><hr>';

                        text = text+ '<p class="card-text">Ср. время прохождения: '+value['t']+'</p><hr>';
                        text = text+ '<p class="card-text">Статус: '+value['s']['msg']+'</p>';

                        text = text+ '<button type="button" class="btn btn-primary btn-lg startKwest" id="'+value['i']+'">Пройти</button>';

                        text = text+ '</div></div>';
                        $("#spisokkwestov").append(text);
                    });
                },
                error: function (xhr, status, error) {
                     console.log(xhr);
                }
            });

        }

    }

    queststate(id) {//Получение статуса квеста
            $.ajax({
                type: "GET",
                url: this.url_serv +"quest/state?id="+id,
                dataType: 'json',
                headers: {
                    Authorization: 'Bearer ' + global.settings.token_auth
                },
                success: function (result, status, xhr) {
                    if ("state" in result){
                        console.log(result['state']);
                        console.log(result['msg']);
                    }
                },
                error: function (xhr, status, error) {
                     console.log(xhr);
                }
            });



    }

    queststart(id) {//Старт квеста

            $.ajax({
                type: "POST",
                url: this.url_serv +"quest/start/"+id,
                async: false,
                dataType: 'json',
                headers: {
                    Authorization: 'Bearer ' + global.settings.token_auth
                },
                success: function (result, status, xhr) {
                    let otvet = "";
                    if ("msg_e" in result){otvet=result['msg_e']}
                    if ("msg_w" in result){otvet=result['msg_w']}
                    if ("msg_s" in result){otvet=result['msg_s']}
                    api.statusqwest = result['state'];
                    swal({
                        title:"Уведомление!",
                        text:otvet,
                        type:"success",
                        confirmButtonColor: "#039BE5"
                    });
                    console.log(result);
                },
                error: function (xhr, status, error) {
                    console.log(xhr);
                }
            });

    }

    questrestart(id) {//Повтор квеста
            $.ajax({
                type: "PUT",
                url: this.url_serv +"quest/start/"+id,
                dataType: 'json',
                headers: {
                    Authorization: 'Bearer ' + global.settings.token_auth
                },
                success: function (result, status, xhr) {
                    console.log(result);
                },
                error: function (xhr, status, error) {
                     console.log(xhr);
                }
            });
    }

    questpassing(id) {// Получение задания квеста
            $.ajax({
                type: "GET",
                url: this.url_serv +"quest/passing/"+id,
                dataType: 'json',
                headers: {
                    Authorization: 'Bearer ' + global.settings.token_auth
                },
                success: function (result, status, xhr) {

                    let title = b64_to_utf8(result['title']);
                    var desc = b64_to_utf8(result['description']);

                    desc = desc.replace('_UserName', global.settings.firstname);
                    desc = desc.replace('_PrjName', "ПРОЕКТА :)");

                    $.each(result['data']['vars'],function(index,value){

                            if (value['type'] == "img"){
                                 desc = desc.replace(index, '<br><img src="'+decodeArrayBuffer(value['data'])+'" alt="">');
                            }
                            else if (value['type'] == "text"){
                                 desc = desc.replace(index, value['val']);
                            }

                    });

                    $('#titlequest').text(title);
                    $('#bodyquest').html(desc);

                    var text = "";
                    $.each(result['data']['elms'],function(index,value){
                            if(value['type'] == 'textbox'){
                                $('#bodyquest').append('<br><input type="text" name="'+value['name']+'" value="">');
                            }
                            else if (value['type'] == 'button'){
                                 text = text + ('<br><button class="btn btn-warning questbutton" \
                                 data-answertype="'+result['answer-type']+'" \
                                 data-answerval="'+value['answer-val']+'" \
                                 data-eltype="'+value['type']+'" \
                                 data-click="'+value['click']+'" \
                                 type="button" \
                                 name="'+value['name']+'">'+value['text']+'</button>');
                            }


                    });
                    $('#bodyquest').append(text);

                    console.log(result);
                },
                error: function (xhr, status, error) {
                     console.log(xhr);
                }
            });
    }

    questotvet(id, val, type, eltype, elname) {//Передвча ответа квеста

        if (type=="text"){
            var data_auth = {
                "el_type":eltype,
                "el_name":elname,
                "val":val
            };
        }
            $.ajax({
                type: "POST",
                url: this.url_serv +"quest/passing/"+id,
                data:JSON.stringify(data_auth),
                dataType: 'json',
                headers: {
                    Authorization: 'Bearer ' + global.settings.token_auth
                },
                success: function (result, status, xhr) {

                    let otvet ="";
                    if(result["state"]=="approved") {otvet="Правильно!";api.questpassing(id)};
                    if(result["state"]=="repeat")   {otvet="Ответ не верный!"};
                    if(result["state"]=="endgame")  {otvet="Конец игры!"};


                    swal({
                        title:"Уведомление!",
                        text: otvet,
                        type:"success",
                        confirmButtonColor: "#039BE5"
                    });


                },
                error: function (xhr, status, error) {
                    console.log(xhr);
                }
            });
    }

    /////////////////////--!-- Рейтинг --!--////////////////////////////////////////////////
    questrating_get(id) {//Получение рэйтинг квеста
        $.ajax({
            type: "GET",
            url: this.url_serv +"quest/rating/"+id,
            dataType: 'json',
            async: false,
            headers: {
                Authorization: 'Bearer ' + global.settings.token_auth
            },
            success: function (result, status, xhr) {
                api.statusqwestlike = result;
                //console.log(result);

            },
            error: function (xhr, status, error) {
                console.log(xhr);
            }
        });
    }

    questrating_set(id, type) {//Поставить Рэйтинг квеста
            var data_auth = {
                "val":type
            };
            $.ajax({
                type: "POST",
                url: this.url_serv +"quest/rating/"+id,
                data:JSON.stringify(data_auth),
                dataType: 'json',
                headers: {
                    Authorization: 'Bearer ' + global.settings.token_auth
                },
                success: function (result, status, xhr) {
                    console.log(result);
                },
                error: function (xhr, status, error) {
                     console.log(xhr);
                }
            });
    }

    questrating_chan(id,type) {//Изменить Рэйтинг квеста

            var data_auth = {
                "val":type
            };
            $.ajax({
                type: "PUT",
                url: this.url_serv +"quest/rating/"+id,
                data:JSON.stringify(data_auth),
                dataType: 'json',
                headers: {
                    Authorization: 'Bearer ' + global.settings.token_auth
                },
                success: function (result, status, xhr) {
                    console.log(result);
                },
                error: function (xhr, status, error) {
                     console.log(xhr);
                }
            });
    }
    /////////////////////--!-- КОНЕЦ --!--////////////////////////////////////////////////

/////////////////////--!-- КОНЕЦ --!--////////////////////////////////////////////////
}
