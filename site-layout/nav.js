document.querySelector(".hamburg").onclick = function () {
  this.classList.toggle("checked");
  document.querySelector("#menuContainer").classList.toggle("mobileCollapsed");
}