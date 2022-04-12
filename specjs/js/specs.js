/**
 * Specs JS
 * @author Juan Galarraga
 * @created 2022-04-12
 */

class Specs {

    root = null;
    default_options = {
        silent : false,
        title: 'Características Técnicas'
    };
    output = '';

    constructor(root_element, options = {}){
        this.default_options = Object.assign({}, this.default_options, options);
        root = this.GetRootElement(root_element);
    }

    ShowDebug(msg){
        if(!this.default_options.silent){
            return console.log(msg);
        }
    }

    GetRootElement(element){
        let result = null;

        if(typeof element === "String"){
            result = document.getElementById(element);
        } else if (element instanceof HTMLDivElement) {
            result = element;
        } else {
            this.ShowDebug("Root element debe ser un selector o un objeto DIV.");
        }

        if( !result ){
            this.ShowDebug(`No se halló un elemento ${element}.`);
        }

        return null;
    }
    
    DrawTable(){
        let table = document.createElement('table');

    }

    DrawTableHeader(){
        let tHeader = document.createElement('theader');
        
    }

}