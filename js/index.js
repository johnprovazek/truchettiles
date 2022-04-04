function tileSelect(element){
    var tiles = document.getElementsByClassName("tileSelected")
    tiles[0].classList.remove("tileSelected")
    element.classList.add("tileSelected")
}