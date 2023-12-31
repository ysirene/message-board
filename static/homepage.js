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

function cleanInput(){
    let uploadValue = document.querySelector('#newMessage');
    uploadValue.reset();
};

function addMessage(event){
    event.preventDefault();
    let newMessageFormData = new FormData(document.querySelector('#newMessage'));
    let src = '/api/message';
    let options = {
        method: 'POST',
        body: newMessageFormData
    };
    ajax(src, options).then((data) => {
        if(data.ok){
            cleanInput();
            let messageBoardElem = document.querySelector('#message_board');
            let sectionTag = document.createElement('section');
            let messageDiv = document.createElement('div');
            let img = document.createElement('img');
            let divider = document.createElement('hr');
            messageDiv.textContent = data['comment'];
            img.setAttribute('src', 'https://d2te9nmcgn9qhu.cloudfront.net/' + data['imageName']);
            sectionTag.appendChild(messageDiv);
            sectionTag.appendChild(img);
            messageBoardElem.insertBefore(sectionTag, messageBoardElem.firstChild);
            messageBoardElem.insertBefore(divider, messageBoardElem.firstChild);
        }else{
            console.log(data)
        };
    });
};

(function renderMessage(){
    let src = '/api/message';
    let options = {
        method: 'GET',
    };
    ajax(src, options).then((data) => {
        console.log(data)
        let messageBoardElem = document.querySelector('#message_board');
        for(let i=0; i<data.length; i++){
            let sectionTag = document.createElement('section');
            let messageDiv = document.createElement('div');
            let img = document.createElement('img');
            let divider = document.createElement('hr');
            messageDiv.textContent = data[i]['comment'];
            img.setAttribute('src', 'https://d2te9nmcgn9qhu.cloudfront.net/' + data[i]['image_name']);
            sectionTag.appendChild(messageDiv);
            sectionTag.appendChild(img);
            messageBoardElem.appendChild(divider);
            messageBoardElem.appendChild(sectionTag);
        };
    });
})();