var infoTextI = document.querySelector("#textI"), infoT = document.querySelector("#infoText")

infoTextI.addEventListener("mouseover", function() {
  infoT.style.opacity = 1
})
infoTextI.addEventListener("mouseout", function() {
  infoT.style.opacity = 0
})



var infoReorderI = document.querySelector("#reorderI"), infoR = document.querySelector("#infoReorder")

infoReorderI.addEventListener("mouseover", function() {
	console.log("working")
	infoR.style.opacity = 1
})

infoReorderI.addEventListener("mouseout", function() {
	infoR.style.opacity = 0
})