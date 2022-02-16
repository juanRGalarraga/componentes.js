/**
 * Componente para mostrar los pasos en un wizard
 * @author Juan Galarraga
 * @created 2022-02-15
 * @param {string|HTMLDivElement} root_div - ID del elemento en donde insertar el componente o un elemento DIV
 * @param {object} user_options - Opciones del componente
 *  - steps: cantidad de pasos
 *  - active_color: color para mostrar los pasos activos
 *  - inactive_color: color para mostrar los pasos inactivos
 */

function DrawWizardSteps(root_div, user_options = null){

    this.root = null;
    this.main = null;
    this.progress_line_active = null;
    this.progress_line_inactive = null;
    this.step_active = null;
    this.style_tag = null;
    
    this.default_options = {
        steps : 0,
        active_color : '#435ebe',
        inactive_color : 'rgb(202 202 203)'
    };

    this.options = Object.assign({}, this.default_options, user_options);

    if(this.options == 0){
        return;
    }

    /**
     * Coloca el elemento principal del componente en el DIV root
     * @returns 
     */
    this.insert_main_div = () => {
        if(typeof root_div == "string"){
            this.root = document.getElementById(root_div);
        } else if (root_div instanceof HTMLDivElement){
            this.root = root_div;
        } else {
            return;
        }

        this.main = document.createElement('DIV');

        this.main.classList.add (
            'wizard_steps_js_d_flex', 
            'wizard_steps_js_flex_row', 
            'wizard_steps_js_justify_content_between', 
            'wizard_steps_js_px_4', 
            'wizard_steps_js'
        );
    }

    /**
     * Crea los números de los pasos
     */

    this.insert_steps = () => {
        for (let i = 1; i <= this.options.steps; i++) {
            let step_number = document.createElement('DIV');
            step_number.dataset.step = i;
            step_number.style.zIndex = 3;
            step_number.classList.add('wizard_steps_number_js');

            let span = document.createElement('span');
            span.innerText = i;

            step_number.insertAdjacentElement('beforeend', span);

            this.main.insertAdjacentElement('beforeend', step_number);
        }
        this.root.insertAdjacentElement('beforeend', this.main);
    }

    /**
     * Crea las líneas para indicar el progreso del wizard
     */

    this.insert_progress_line = () => {
        this.progress_line_active = document.createElement('div');
        this.progress_line_inactive = document.createElement('div');

        this.progress_line_active.style.height = '5px';
        this.progress_line_active.style.width = '0%';
        this.progress_line_active.style.backgroundColor = this.options.active_color;
        this.progress_line_active.style.position = 'relative';
        this.progress_line_active.style.top = '29px';
        this.progress_line_active.style.zIndex = '1';

        this.progress_line_inactive.style.height = '5px';
        this.progress_line_inactive.style.width = '100%';
        this.progress_line_inactive.style.backgroundColor = this.options.inactive_color;
        this.progress_line_inactive.style.position = 'relative';
        this.progress_line_inactive.style.top = '24px';
        this.progress_line_inactive.style.zIndex = '0';

        this.root.insertAdjacentElement('beforeend', this.progress_line_active);
        this.root.insertAdjacentElement('beforeend', this.progress_line_inactive);
    }

    /**
     * Método público para indicar al componente el número del paso actual
     * @param {int} step_number
     */

    this.active_step = (step_number) => {
        this.step_active = document.querySelector(`[data-step="${step_number}"]`);

        let progress_line_width = (step_number == this.options.steps) 
        ? '100%' 
        : (parseInt(this.step_active.offsetLeft, 10) + 10) + 'px';

        this.progress_line_active.animate([
            {
                width: this.progress_line_active.style.width
            },
            {
                width: progress_line_width
            }
        ], 500);

        this.progress_line_active.style.width = progress_line_width;

        if(this.options.steps > 1 && step_number > 1){
            //Pintar
            this.paint(1, step_number);    
        }
        //Despintar
        this.paint(step_number, this.options.steps, true);

        this.step_active.classList.add('active', 'actual');
    }

    /**
     * Pinta/despinta los pasos según el número que se setea
     * @param {int} start - Desde dónde se comienza a pintar/despintar
     * @param {int} finish - Hasta dónde se pinta/despinta
     * @param {bool} unpaint - Indica si tiene que pintar o despintar
     */

    this.paint = (start, finish, unpaint = false) => {
        let steps_range = "";
        let steps = null;

        //Obtengo los selectores de los pasos
        for (let index = start; index <= finish; index++) {
            steps_range += 'div[data-step="' + index + '"] ,';
        }

        //Elimino última coma
        steps_range = steps_range.substring(0, steps_range.lastIndexOf(','));

        //Obtengo los elementos (pasos)
        steps = document.querySelectorAll(steps_range);
        
        //Actual -> indica el paso en el que está parado actualmente el usuario
        steps.remove_class('actual');

        if(!unpaint){
            steps.add_class('active');
        } else {
            steps.remove_class('active');
        }
    }
    
    /**
     * Estilos propios del componente
     */
    this.append_style = () => {
        this.style_tag = document.createElement('style');
        this.style_tag.setAttribute('media','screen');
        this.style_tag.setAttribute('type','text/css');
        this.style_tag.setAttribute('id','wizardStepsJs');
        this.style_tag.appendChild(document.createTextNode(""));
        
        this.style_tag.innerHTML = `
        div.wizard_steps_js > div.wizard_steps_number_js{
            background-color: #c1c3cb;
            color: white;
            width: fit-content;
            padding: 12px 20px;
            border-radius: 43px;
            z-index: 3;
        }
        div.wizard_steps_js > div.wizard_steps_number_js.active{
            background-color: ${this.options.active_color} !important;
        }
        
        div.wizard_steps_js > div.wizard_line {
            background: linear-gradient(90deg, #435ebe, #c1c3cb);
            height: 7px;
            width: 100%;
            z-index: 0;
        }
        .wizard_steps_js_px_4 {
            padding-left: 1.5rem!important;
            padding-right: 1.5rem!important;
        }
        
        .wizard_steps_js_justify_content_between {
            justify-content: space-between!important;
        }
        .wizard_steps_js_d_flex {
            display: flex!important;
        }
        .wizard_steps_js_flex_row {
            flex-direction: row!important;
        }`;
            
        document.head.appendChild(this.style_tag); 
    }

    this.append_style();
    this.insert_main_div();
    this.insert_progress_line();
    this.insert_steps();
}

//Helpers

if(typeof NodeList.prototype.remove_class !== "function"){
    NodeList.prototype.remove_class = function(...class_list){
        if(class_list.length == 0){ return; }
        if(this.length == 0){ return; }
    
        this.forEach(node => {
            class_list.map(class_name => {
                node.classList.remove(class_name);
            });
        });
    }
}

if(typeof NodeList.prototype.add_class !== "function"){
    NodeList.prototype.add_class = function(...class_list){
        if(class_list.length == 0){ return; }
        if(this.length == 0){ return; }
    
        this.forEach(node => {
            class_list.map(class_name => {
                node.classList.add(class_name);
            });
        });
    }
}