/**
 * Crea un componente para mostrar una imagen al usuario a partir de un base64
 * @version 1.0v
 * @author Juan Galarraga
 * @created 2022-05-2
 * @note Requiere bootstrap 5.1 y modalBs5Creator
 */

'use strict';

var ImageCard  = function(params){
    
    if(typeof getElement !== 'function'){ var getElem = function (selector) { if (typeof selector != 'string') return null; if (document.getElementById(selector)) { return document.getElementById(selector); } return null; } }

    this.defaultOptions = {
        root: null,
        base64: '',
        select: {
            options: []
        },
        modal: {
            archivo: null,
            content: null,
            size: 'lg'
        },
        config: {
            debug: true
        }
    };

    this.options = Object.assign({}, this.defaultOptions, params);

    if(typeof this.options.root == "string"){ 
        this.options.root = getElem(this.options.root);
    } else if (this.options.root instanceof HTMLDivElement){
        this.options.root = this.options.root;
    }

    if(typeof this.options.root == "undefined"){ return this.showLog('No se halló elemento root.'); }

    this.theId = ('file-'+RandStr(6,1)).toLowerCase();
    this.modalFullScreen = null;

    this.col = createEle('div');

    this.parentDropdown = createEle('div');
    this.buttonDropdown = createEle('button');
    this.iconButtonDropdown = createEle('i');
    this.ulDropdown = createEle('ul');
    this.liDropdown = createEle('li');
    this.button_fullscreen = createEle('button');
    this.icon_button_fullscreen = createEle('i');
    this.button_delete = createEle('button');

    this.card = createEle('div');
    this.card_header = createEle('div');
    this.card_body = createEle('div');
    this.card_footer = createEle('div');

    //SELECT OPTIONS
    this.select = createEle('select');
    
    this.img = createEle('img');
    this.data_image = createEle('input');

    this.create = function(){
        this.col.id = `col-${this.theId}`;
        this.col.classList.add('col-sm-10', 'col-md-4', 'col-lg-3', 'mb-2');

        this.card.insertAdjacentElement('beforeend', this.card_body);
        this.card.insertAdjacentElement('beforeend', this.card_footer);
        this.card_body.insertAdjacentElement('beforeend', this.data_image);
        this.card_body.insertAdjacentElement('afterbegin', this.img);
        this.card_footer.insertAdjacentElement('beforeend', this.select);
        this.options.root.insertAdjacentElement('afterbegin', this.col);
    }

    this.createCardHeader = function(){
        this.button_fullscreen.setAttribute('type', 'button');
        this.button_fullscreen.setAttribute('title', 'Expandir imagen');
        this.button_fullscreen.classList.add('btn', 'btn-primary', 'btn-sm');
        this.icon_button_fullscreen.classList.add('far', 'fa-expand-arrows', 'text-white');
        this.createCardHeaderDropdown();
    }

    this.createCardHeaderDropdown = function(){
        this.parentDropdown.classList.add('dropdown');
        this.buttonDropdown.classList.add('btn', 'dropdown-toggle', 'btn-sm');
        this.buttonDropdown.setAttribute('type', 'button');
        this.buttonDropdown.setAttribute('title', 'Opciones');
        this.buttonDropdown.setAttribute('data-bs-toggle', 'dropdown');
        this.iconButtonDropdown.classList.add('far', 'fa-ellipsis-h');
        this.ulDropdown.classList.add('dropdown-menu');

        this.button_delete.classList.add('dropdown-item');
        this.button_delete.setAttribute('type', 'button');
        this.button_delete.setAttribute('title', 'Eliminar imagen');
        this.button_delete.innerText = "Eliminar";

        this.parentDropdown.insertAdjacentElement('beforeend', this.buttonDropdown);
        this.parentDropdown.insertAdjacentElement('beforeend', this.ulDropdown);
        this.buttonDropdown.insertAdjacentElement('beforeend', this.iconButtonDropdown);
        this.ulDropdown.insertAdjacentElement('beforeend', this.liDropdown);
        this.liDropdown.insertAdjacentElement('beforeend', this.button_delete);
        this.button_fullscreen.insertAdjacentElement('beforeend', this.icon_button_fullscreen);
    }

    this.createCardElement = function(){
        this.card.classList.add('card');
        this.card_header.classList.add('card-header', 'd-flex', 'justify-content-between');
        this.card_body.classList.add('card-body', 'text-center');
        this.card_footer.classList.add('card-footer');

        this.card.insertAdjacentElement('beforeend', this.card_header);

        if(this.isDefinedModalArchivo()){
            this.card_header.insertAdjacentElement('beforeend', this.button_fullscreen);
        }

        this.card_header.insertAdjacentElement('beforeend', this.parentDropdown);
        this.col.insertAdjacentElement('beforeend', this.card);
    }

    this.createSelect = function(){
        let options = this.options.select.options;
        if(options.length == 0){ return this.showLog('Sin opciones para seleccionar.'); }

        this.select.classList.add('form-select');
        options.forEach((option, index) => {
            let newOption = createEle('option');
            newOption.text = option.text ?? '';
            newOption.value = option.value ?? '';
            newOption.select = newOption.select ? true : false; 
            this.select.add(newOption);
        });
    }

    this.createImage = function(){
        if(this.options.base64.length == 0){ this.showLog('Falta indicar el base64.'); }

        this.data_image.setAttribute('type', 'text');
        this.data_image.value = this.options.base64;
        this.data_image.name = 'files[frente]';
        this.data_image.setAttribute('hidden', "true");
    
        this.img.classList.add('img-fluid', 'img-file');
        this.img.setAttribute('name', `img-${this.theId}`);
        this.img.setAttribute('id', `img-${this.theId}`);
        this.img.src = this.options.base64;
    }

    this.addEventsListeners = function(){

        this.select.addEventListener('change', event => {
            this.data_image.name = `files[${event.target.value}]`;
        });
    
        this.button_delete.addEventListener('click', event => {
            this.col.remove();
        });
    
        this.button_fullscreen.addEventListener('click', event => {
            this.openModalFullScreen(this.options.base64);
        });
    }

    this.showLog = function(message){
        if(this.options.config.debug){
            return console.log(message);
        }
    }

    this.isDefinedModalArchivo = function(){
        return this.options.modal.archivo ?? false;
    }

    this.isDefinedModalContent = function(){
        return this.options.modal.content ?? null;
    }

    this.loadModalFullScreen = function(){
        if(this.isDefinedModalArchivo()){
            let content = this.isDefinedModalContent();
            this.modalFullScreen = new modalBs5Creator({
                archivo: this.options.modal.archivo,
                content: content,
                size: this.options.modal.size,
            });
        }
    }

    this.openModalFullScreen = function(theImageSource){
        this.modalFullScreen.Show({
            theImageSource: encodeURIComponent(theImageSource)
        });
    }

    // this.create();
    this.loadModalFullScreen();
    this.createCardHeader();
    this.createCardElement();
    this.createSelect();
    this.createImage();
    this.addEventsListeners();
    
    return this;
}