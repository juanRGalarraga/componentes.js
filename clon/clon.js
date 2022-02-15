/**
 * Script para generar clones a partir de un input o un grupo de inputs
 * @author Juan Galarraga
 * @created 2021-12-21
 */

 class Clon {

    //Acá se almacenaran todos los inputs clonados
    clonesList = [];

    //EL elemento original mediante el cual se generan los clones
    _cloneElement = null;
    _cloneId = "";

    //Índice para contar los grupos de clones
    _i = 0;

    //CSS interno
    _css = `
        .clone_jrg_input_group { align-items: stretch; display: flex; flex-wrap: wrap; position: relative; width: 100%; margin-bottom: 5px} 

        .clone_jrg_input-padding{ padding-left: 31px !important; } 

        .clone_jrg_form-control:focus { background-color: #fff; border-color: #a1afdf; box-shadow: 0 0 0 .25rem rgba(67,94,190,.25); color: #607080; outline: 0; } 

        .clone_jrg_form-control { -webkit-appearance: none; -moz-appearance: none; appearance: none; background-clip: padding-box; background-color: #fff; border: 1px solid #dce7f1; border-radius: .25rem; color: #607080; display: block; font-size: 1rem; font-weight: 400; line-height: 1.5; padding: .375rem .75rem; transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out; width: 100%; }

        .clone_jrg_button_delete{ margin-bottom: 5px; height: fit-content; z-index: 100; }
        
        .clone_jrg_button_float{ position: absolute; float: left; margin-bottom: 0 !important; }

        .clone_jrg_button_style{ border: 0; border-radius: 12px; padding: 2px 5px 2px 5px; margin-left: 5px; margin-top: 3px; background-color: red; color: white; cursor: pointer; }

        .clone_jrg_input_group > .clone_jrg_form-control{ flex: 1 1 auto; min-width: 0; position: relative; width: 1%; border-bottom-right-radius: 0; border-top-right-radius: 0; }
        
        .clone_jrg_input_group_text { align-items: center; background-color: #e6eef5; border: 1px solid #dce7f1; border-top-right-radius: 10px; border-bottom-right-radius: 10px; color: #526e8a; display: flex; font-size: 1rem; font-weight: 400; line-height: 1.5; padding: .375rem .75rem; text-align: center; white-space: nowrap; border-top-left-radius: 0.25rem; }

        .clone_jrg_multiple_wrapper_header{ display: flex; justify-content: space-between; }
    `;

    _options = {
        //ID del input a clonar. También acepta un elemento DIV que contiene varios inputs para clonar en grupo
        clonId: null,

        //Si se desea aplicar un type para todos los inputs
        clonesType: false,

        //Clase para cada input clonado
        clonesClassList: 'clone_jrg_form-control',

        //Zona en donde se clonaran los inputs
        clonZone: 'clonZone',

        //Clase css para la zona de clones
        wrapperCloneClass: 'clone_jrg_input_group',

        //Habilitar el radio button para seleccionar un clon por defecto
        enableRadioButton: false,
        
        //Nombre bajo el cual se agruparán los radio. Por defecto toma el ID de la zona de los clones
        nameRadioButton: false,

        //Texto del raddio button
        radioButtonInnerText: 'Default',

        //Activar el botón para eliminare el clon (o grupo de clones)
        enableButtonDelete: true,

        //Clase personalizada para el botón eliminar
        buttonDeleteClass: 'clone_jrg_button_style',

        //Lo que contiene el button
        buttonDeleteInner: 'X',

        //Añadir un button o selector a un button para activar el evento que clona los inputs
        buttonOnClick: false,

        //Habilitar el evento keydown para clonar aprentando la tecla Enter
        enableKeyDownEnter: true,

        //Habilitar duplicados
        enableDuplicates: false
    }



    constructor(userOptions){

        if(!userOptions.clonId){
            return console.error('Faltó indicar ID del input original a clonar.');
        }
        
        this._options = Object.assign({}, this._options, userOptions);
        this._cloneId = this._options.clonId;
        this._cloneElement = this.$(`#${this._cloneId}`);
        this.set_stylesheet();

        if(this._options.enableKeyDownEnter || this._options.buttonOnClick){
            this._addKeyDownEnter();
        }

        if(this._options.buttonOnClick){
            this._addButtonListener();
        }
    }

    /**
     * Función para crear elementos con sus atributos
     * @param {string} type  - Nodename del elemento a crear
     * @param {object} attributes Atributos del elemento
     * @returns {object} El elemento creado
     */
    create_element(type, attributes){
        let newClone = document.createElement(type);
        let specialPropertys = ['classList'];
        for (const key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                if(specialPropertys.indexOf(attributes[key]) !== -1){
                    newClone[key].value = attributes[key];
                } else {
                    newClone[key] = attributes[key];
                }
            }
        }
        return newClone;
    }

    /**
     * Establece la zona en donde se generaran los clones.
     * Si el usuario no especifica el Id de la zona, esta se creará por debajo del input que se intenta clonar.
     * @returns {object} La zona de clones.
     */

    set_container_zone(){
        let containerClones = null;
        if(!this.$(`#${this._options.clonZone}`)){
            containerClones = this.create_element("div", {
                id: this._options.clonZone
            });
            this._cloneElement.insertAdjacentElement("afterend", containerClones);
        } else {
            containerClones = this.$(`#${this._options.clonZone}`);
        }
        return containerClones;
    }

    /**
     * Establece el CSS para el plugin y lo coloca en el documento HTML
     */

    set_stylesheet(){
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        head.appendChild(style);
        style.type = 'text/css';
        if (style.styleSheet){
            style.styleSheet.cssText = this._css;
        } else {
            style.appendChild(document.createTextNode(this._css));
        }
    }

    /**
     * Clona un input en particular
     * @param {object} attributesInit Crear inputs con attributos de inicialización.
     * Este parámetro está pensado para setear valores de entrada.
     */

    clone(attributesInit = {}){
        let input = document.querySelector(`#${this._cloneId}`),
            containerClones = this.set_container_zone();

        if(!attributesInit.value){
            if(input.value.length == 0){
                console.warn('Input vacío');
                return;
            }
        }

        let attributes = {
            type: input.type,
            value: input.value,
        };

        if(attributesInit.value){
            attributes['type'] = attributesInit.type ?? attributes['type'];
            attributes['value'] = attributesInit.value;
        }

        if(this._options.clonesType){
            attributes['type'] = this._options.clonesType;
        }

        //El elemento clonado
        let newClone = document.createElement('input');
        newClone.type = attributes.type;
        newClone.value = attributes.value;
        newClone.classList.add(this._options.clonesClassList, 'clone_jrg_newclones');
        newClone.dataset.order = this._i;
        
        if(!this._options.enableDuplicates){
            let inputsValues = document.querySelectorAll(`#${this._options.clonZone} div input.clone_jrg_newclones`),
                duplicate = false;

            inputsValues.forEach(inpt => {
                if(inpt.value == attributes['value']){
                    duplicate = true;
                }
            });

            if(duplicate){
                input.value = '';
                console.warn('Input duplicado');
                return;
            }
        }

        //El div que contendrá al elemento
        let wrapperClone = this.create_element('div', {
            classList: this._options.wrapperCloneClass
        });

        let content = {
            value: newClone.value
        };
    
        this.clonesList[newClone.dataset.order] = content;

        //El botón para eliminar el clone
        if(this._options.enableButtonDelete){
            let button = this.create_element('button', {
                classList: `clone_jrg_button_delete clone_jrg_button_float ${this._options.buttonDeleteClass}`,
                type: 'button'
            });
            button.innerHTML = this._options.buttonDeleteInner;
            button.addEventListener('click', ev => {
                wrapperClone.remove();
                this.clonesList.splice(newClone.dataset.order, 1);
            });
            newClone.classList.add('clone_jrg_input-padding');
            wrapperClone.appendChild(button);
        }
        
        wrapperClone.appendChild(newClone);

        let inputGroupText = null,
            radioInput = null;
        //Radio button para checkear el clon por defecto
        if(this._options.enableRadioButton){
            inputGroupText = document.createElement('SPAN');
            inputGroupText.classList.add('clone_jrg_input_group_text', 'the_group_input_wrapper_radio');
            radioInput = document.createElement('INPUT');
            radioInput.type = 'radio';

            radioInput.name = 'default_' + this._options.clonZone;
            if(this._options.nameRadioButton){
                radioInput.name = this._options.nameRadioButton;
            }

            radioInput.value = 'true';
            radioInput.classList.add('clone_jrg_radios_default');

            inputGroupText.appendChild(radioInput);
            wrapperClone.insertAdjacentElement('beforeend', inputGroupText);
        }

        if(this._options.enableRadioButton) {
            radioInput.addEventListener('change', event => {
                if(radioInput.checked){
                    this.clonesList.map(value => delete value['default']);
                    this.clonesList[newClone.dataset.order].default = radioInput.value;
                }
            });

            if(typeof attributesInit.default !== "undefined" && (attributesInit.default == 1 || attributesInit.default == true)){
                radioInput.checked = true;
                this.clonesList[newClone.dataset.order].default = radioInput.value;
            } else {
                let inputsRadios = document.querySelectorAll(`div#${this._options.clonZone} input.clone_jrg_radios_default`);
                if(inputsRadios.length == 0){
                    radioInput.checked = true;
                    this.clonesList[newClone.dataset.order].default = radioInput.value;
                }
            }
        }

        containerClones.appendChild(wrapperClone);

        //Vacío el input original
        input.value = '';

        this._i++;
    }

    /**
     * Obtiene el listado de todos los inputs clonados hasta el momento
     * @returns {array} - El listado
     */

    get_clones(){
        return JSON.stringify(this.clonesList);
    }

    /**
     * Setea una lista de clones 
     * @param {array} data - Arreglo con los valores.
     *  [
            {
                value: 'pruebaSet',
                type: 'text', //Opcional
                default: 'true'
            },
        ]
     */

    set_clones(data){
        if(data.length > 0){
            data.map( attributes => this.clone(attributes) );
        }
    }

    /**
     * Elimina todos los clones
     */

    clear_clones(){
        let cloneZoneDiv = document.querySelectorAll(`#${this._options.clonZone} > div`);
        if(cloneZoneDiv){
            Array.from(cloneZoneDiv).map( clone => clone.remove() );
            this.clonesList = [];
        }
    }
    
    /**
     * Añade un botón con el evento para clonar
     */
    _addButtonListener(){
        let typeSelector = this.$(`#${this._cloneId}`).nodeName;
        let button = null;
        if(this._options.buttonOnClick instanceof HTMLButtonElement){
            button = this._options.buttonOnClick;
        } else if (typeof this._options.buttonOnClick == 'string'){
            button = document.querySelector(`#${this._options.buttonOnClick}`);
        }

        if(!button || !(button instanceof HTMLButtonElement)){
            return;
        }
        if(typeSelector == "INPUT"){
            button.addEventListener('click', e => {
                this.clone();
            });
        } else if (typeSelector == "DIV"){
            button.addEventListener('click', e => {
                this.clone_multiple();
            });
        }
    }

    /**
     * Añade el evento para clonar con la tecla Enter
     */

    _addKeyDownEnter(){
        let typeSelector = this.$(`#${this._cloneId}`).nodeName;
        this._cloneElement.addEventListener("keydown", event => {
            if(event instanceof KeyboardEvent){
                if(event.key == "Enter"){
                    if(typeSelector == "INPUT"){
                        this.clone();
                    } else if (typeSelector == "DIV"){
                        this.clone_multiple();
                    }
                }
            }
        });
    }

    /**
     * Alias para querySelector
     * @param {string} selector 
     * @returns {object} El elemento encontrado o undefined
     */

    $(selector){
        let element = undefined;
        if(selector.slice(0, 1) === '#') {
            element = document.querySelector(`${selector}`);
        } 
        return element;
    }

    /**
     * Clona un grupo de inputs. Los grupos de inputs están envueltos por un elemento padre DIV
     */
     clone_multiple(){
        // let inputs = document.querySelectorAll(`#${this._cloneId} input`),
        //     inputsArray = Array.from(inputs),
        //     containerClones = this.set_container_zone(),
        //     arrayValues = [];

        // let wrapperClones = this.create_element('DIV');
        // let wrapperHeader = document.createElement('DIV');

        // wrapperHeader.classList.add('clone_jrg_multiple_wrapper_header');
    
        // inputsArray.forEach(input => {

        //     let newClone = this.create_element('input', {
        //         // id: 'input' + this._i,
        //         type: input.type,
        //         value: input.value,
        //         classList: this._options.clonesClassList
        //     });

        //     let wrapperClone = this.create_element('div', {
        //         classList: this._options.wrapperCloneClass
        //     });

        //     wrapperClone.appendChild(newClone);
        //     wrapperClones.appendChild(wrapperClone);
        //     containerClones.appendChild(wrapperClones);

        //     arrayValues.push({
        //         value: newClone.value
        //     });
        // });

        // this.clonesList[this._i] = arrayValues;


        // if(this._options.enableButtonDelete){
        //     let button = this.create_element('button', {
        //         classList: 'clone_jrg_button_delete ',
        //         type: 'button'
        //     });
        //     button.innerHTML = this._options.buttonDeleteInner;
        //     button.addEventListener('click', ev => {
        //         wrapperClones.remove();
        //     });
        //     wrapperHeader.appendChild(button);
        // }

        // //Radio button para checkear el clon por defecto
        // if(this._options.enableRadioButton){
        //     let inputGroupText = document.createElement('SPAN'),
        //         radioWrapper = document.createElement('DIV'),
        //         radioInput = document.createElement('INPUT');

        //     inputGroupText.classList.add('clone_jrg_input_group_text', 'the_group_input_wrapper_radio');
        //     radioInput.type = 'radio';
        //     radioInput.name = 'default';
        //     radioInput.value = 'true';
        //     radioInput.dataset.order = this._i;
        //     radioInput.addEventListener('change', event => {
        //         if(radioInput.checked){
        //             this.clonesList.map(value => delete value['default']);
        //             this.clonesList[radioInput.dataset.order].default = radioInput.value;
        //         }
        //     });
            

        //     radioWrapper.insertAdjacentText('afterbegin', this._options.radioButtonInnerText);
        //     radioWrapper.appendChild(radioInput);
        //     wrapperHeader.appendChild(radioWrapper);
        // }

        // wrapperClones.insertAdjacentElement('afterbegin', wrapperHeader);

        // arrayValues = [];

        // this._i++;
    }

}