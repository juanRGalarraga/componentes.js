document.addEventListener("DOMContentLoaded", event => {
    ZoomerJS();
});

function ZoomerJS(){
    //Imagen a la cual se le hará zoom
    let original = document.querySelector('.zoomerJS');
        original.style.cursor = "crosshair";
        original.style.zIndex = "0";

    //Constantes
    const originalWidth = original.height;
    const originalHeight = original.width;

    //Div que contiene el zoomer
    let zoomer = document.createElement("div");
        zoomer.setAttribute("style", 
           `display: none;
            position: absolute;
            left: `+ (original.width + 15) +`px;
            background: url('` + original.src + `');
            background-size: 600px;
            background-repeat: no-repeat;
            background-origin: inherit;
            height: `+ originalWidth +`px;
            width: `+ originalHeight +`px;
            border: 1px solid #c7c7c7;`);
    
    let zoomerWrapper = document.createElement("div");
        zoomerWrapper.style.display = "flex";
    
    let magnifier              =  document.createElement("div");
        magnifier.style.height = (originalWidth / 2) + "px";
        magnifier.style.width  = (originalHeight  / 2) + "px";
        magnifier.style.border = "1px solid black";
        magnifier.style.position = "absolute";
        magnifier.style.zIndex = "3";
    
    original.parentNode.insertBefore(zoomerWrapper, original);
    zoomerWrapper.appendChild(original);
    zoomerWrapper.appendChild(zoomer);
    document.body.appendChild(magnifier);
    
    original.addEventListener("mousemove", event => {

        let xperc = ((event.pageX - original.offsetLeft) / originalWidth  ) * 100,
            yperc = ((event.pageY - original.offsetTop)  / originalHeight ) * 100;

        zoomer.style.display = "block";
        zoomer.style.backgroundPosition = (xperc+9) + '% ' + (yperc+9) + '%';
        // magnifier.style.left = xperc + "%";
        // magnifier.style.top = yperc + "%";
    });    

    original.addEventListener("mouseleave", event => {
        // zoomer.style.display = "none";
    });
}