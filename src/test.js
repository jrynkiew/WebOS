
function test (text) {
    
    console.log(text);
}

document.addEventListener("paste", function(e) {
    e.preventDefault();
    var text = (e.originalEvent || e).clipboardData.getData('text/plain');
    document.getElementById("pasteTarget2").value = text;
    test(text);
});
