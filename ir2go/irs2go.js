window.onscroll = function() { updateProgressBar() };

function updateProgressBar() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    
    // Create the bar if it doesn't exist
    let bar = document.getElementById("myBar");
    if (!bar) {
        let container = document.createElement("div");
        container.style.cssText = "position:fixed;top:0;z-index:100;width:100%;height:4px;background:#ccc;";
        bar = document.createElement("div");
        bar.id = "myBar";
        bar.style.cssText = "height:4px;background:#ff5e00;width:0%;";
        container.appendChild(bar);
        document.body.appendChild(container);
    }
    bar.style.width = scrolled + "%";
}