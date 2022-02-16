/**
 * Componente para mostrar los pasos en un wizard
 * @author Juan Galarraga
 * @created 2022-02-15
 * @param {string|HTMLDivElement} rootElement - ID del elemento en donde insertar el componente o un elemento DIV
 * @param {object} userOptions - Opciones del componente
 *  - steps: cantidad de pasos
 *  - activeColor: color para mostrar los pasos activos
 *  - inactiveColor: color para mostrar los pasos inactivos
 */

function DrawWizardSteps(rootElement, userOptions = null){

    this.root = null;
    this.main = null;
    this.line_active = null;
    this.line_inactive = null;
    this.step_active = null;
    this.style_tag = null;
    
    this.defaultOptions = {
        steps : 0,
        activeColor : '#435ebe',
        inactiveColor : 'rgb(202 202 203)'
    };

    this.options = Object.assign({}, this.defaultOptions, userOptions);

    if(this.options == 0){
        return;
    }

    /**
     * Coloca el elemento principal del componente en el DIV root
     * @returns 
     */
    this.draw_main = () => {
        if(typeof rootElement == "string"){
            this.root = document.getElementById(rootElement);
        } else if (rootElement instanceof HTMLDivElement){
            this.root = rootElement;
        } else {
            return;
        }

        this.main = document.createElement('DIV');
        this.main.classList.add('wizard_steps_js_d_flex', 'wizard_steps_js_flex_row', 'wizard_steps_js_justify_content_between', 'wizard_steps_js_px_4', 'wizard_steps_js');
    }

    /**
     * Crea los números de los pasos
     */

    this.draw_steps = () => {
        for (let i = 1; i <= this.options.steps; i++) {
            let stepNumber = document.createElement('DIV');
            stepNumber.dataset.step = i;
            stepNumber.style.zIndex = 3;
            stepNumber.classList.add('wizard_steps_number_js');

            let span = document.createElement('span');
            span.innerText = i;

            stepNumber.insertAdjacentElement('beforeend', span);

            this.main.insertAdjacentElement('beforeend', stepNumber);
        }
        this.root.insertAdjacentElement('beforeend', this.main);
    }

    /**
     * Crea las líneas para indicar el progreso del wizard
     */

    this.draw_line = () => {
        this.line_active = document.createElement('div');
        this.line_inactive = document.createElement('div');

        this.line_active.style.height = '5px';
        this.line_active.style.width = '0%';
        this.line_active.style.backgroundColor = this.options.activeColor;
        this.line_active.style.position = 'relative';
        this.line_active.style.top = '29px';
        this.line_active.style.zIndex = '1';

        this.line_inactive.style.height = '5px';
        this.line_inactive.style.width = '100%';
        this.line_inactive.style.backgroundColor = this.options.inactiveColor;
        this.line_inactive.style.position = 'relative';
        this.line_inactive.style.top = '24px';
        this.line_inactive.style.zIndex = '0';

        this.root.insertAdjacentElement('beforeend', this.line_active);
        this.root.insertAdjacentElement('beforeend', this.line_inactive);
    }

    /**
     * Método público para indicar al componente el número del paso actual
     * @param {int} step_number
     */

    this.active_step = (step_number) => {
        this.step_active = document.querySelector(`[data-step="${step_number}"]`);

        let width_line = step_number == this.options.steps ? '100%' : (parseInt(this.step_active.offsetLeft, 10) + 10) + 'px';

        this.line_active.animate([
            {
                width: this.line_active.style.width
            },
            {
                width: width_line
            }
        ], 500);

        this.line_active.style.width = width_line;

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
        steps.removeClassList('actual');

        if(!unpaint){
            steps.addClassList('active');
        } else {
            steps.removeClassList('active');
        }
    }
    
    /**
     * Estilos propios del componente
     */
    this.appendStyle = () => {
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
            background-color: ${this.options.activeColor} !important;
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

    this.appendStyle();
    this.draw_main();
    this.draw_line();
    this.draw_steps();
}

//Helpers

if(typeof NodeList.prototype.removeClassList !== "function"){
    NodeList.prototype.removeClassList = function(...classListNames){
        if(classListNames.length == 0){ return; }
        if(this.length == 0){ return; }
    
        this.forEach(node => {
            classListNames.map(className => {
                node.classList.remove(className);
            });
        });
    }
}

if(typeof NodeList.prototype.addClassList !== "function"){
    NodeList.prototype.addClassList = function(...classListNames){
        if(classListNames.length == 0){ return; }
        if(this.length == 0){ return; }
    
        this.forEach(node => {
            classListNames.map(className => {
                node.classList.add(className);
            });
        });
    }
}