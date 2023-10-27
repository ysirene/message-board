function ajax(src, options){
    return new Promise(function(resolve, reject){
        fetch(src, options).then((response) => {
            return response.json();
        }).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

// TODO: function clearFormData(){

function newMessage(event){
    event.preventDefault();
    let newMessageFormData = new FormData(document.querySelector('#newMessage'));
    let src = '/api/message';
    let options = {
        method: 'POST',
        body: newMessageFormData
    };
    ajax(src, options).then((data) => {
        console.log(data);
    });
};