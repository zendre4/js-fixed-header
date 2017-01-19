var tableExample1=document.getElementById("example1");
var fixedHeaderExample1=null;

function onExample1Create() {
    if(fixedHeaderExample1 == null) {
        fixedHeaderExample1 = new JSFixedHeader(tableExample1);
    }
}

function onExample1Destroy() {
    if(fixedHeaderExample1 != null) {
        fixedHeaderExample1.destroy();
        fixedHeaderExample1=null;
    }
}