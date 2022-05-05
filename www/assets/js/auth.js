loadGlobal();
console.log(global.settings);

var now = new Date().valueOf();
if ((now - global.settings.token_auth_data) < 86400000){
    location.href = 'index.html';
}

var token_reg = 0;
const api = new Api();
api.onetoken();

if (global.settings.token_auth == 0){

    if (global.settings.user_name!= 0 && global.settings.user_pass!= 0){
        $(".user_auth").css("display","block");
        $(".user_reg").css("display", "none");
        api.authoriz_automat();
    }
    else{
        $(".user_reg").css("display", "block");
        $(".user_auth").css("display","none");
    }
}else{
    $(".user_auth").css("display","block");
    $(".user_reg").css("display", "none");
    api.authoriz_automat();
}
var now = new Date().valueOf();
if ((now - global.settings.token_auth_data) < 86400000){
    location.href = 'index.html';
}
