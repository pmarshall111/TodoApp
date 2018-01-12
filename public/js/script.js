var ul = document.querySelector("ul")
var highestOrderVal;
//making get request to our database so we can create a list of our current todos
axios.get('/api/todos')
  .then(function (response) {
    createItemElements(response.data.sort((a,b) => a.order-b.order));
    highestOrderVal = response.data[response.data.length-1].order
    console.log(response.data)
  })
  .catch((error) => console.log(error));



//lis array will store all created lis and will have a realtime order of the order of lis. We then use the order of this array to set list positioning and order data to send to the server
var lis = []

//global variable here to stop event propagation when moving list items. I can't get the event to stop travelling down, despite previously putting event.stopPropagation in bullet point listeners
var reordering = false

function createItemElements(items) {
  items.forEach(function(item, i) {
    let li = document.createElement("li");
    let div = document.createElement("div");
    let img = document.createElement("img");
    //parent div for the bullet point so we can have a bigger area that the user can move the list
    //SHOULD HAVE DONE THIS BY JUST MAKING THE BULLET POINT BIGGER, THEN INCLUDING AN INSET TRANSPARENT BORDER
    //OR JUST ADDING A TRANSPARENT BORDER ON THE OUTSIDE
    let reorder = document.createElement("div");
    let bulletPoint = document.createElement("div")

    if (item.completed) li.style.textDecoration = "line-through";
    li.textContent = item.name;
    li.index = i;
    li.id = item._id
    ul.appendChild(li);

    bulletPoint.className = "bullet"
    reorder.appendChild(bulletPoint)
    reorder.className = "reorder"
    li.appendChild(reorder)

    div.className = "binPos"
    //NOTE: we get the bin div as li child 1 in slidingList
    li.appendChild(div);

    img.src = "https://cdn3.iconfinder.com/data/icons/cleaning-icons/512/Trash_Can-512.png";
    img.className = "bin";
    div.appendChild(img);

    lis.push(li)
    slidingList()
    
    if (lis.length>6) changeBackgroundSize();


    //adding strikethrough
    li.addEventListener("click", function() {
      if (!reordering) {
      if (item.completed === false) {
        axios.put("/api/todos/"+li.id, {completed: true})
        .then(function(response) {
          console.log(response)
        })
        .catch(error =>console.log(error))

        item.completed = true;
        li.style.textDecoration = "line-through"
      }
      else {
        axios.put("/api/todos/"+li.id, {completed:false})
        .then(function(response) {
          console.log(response)
        })
        .catch(error => console.log(error))

        item.completed = false;
        li.style.textDecoration = ""
      }
    }
    })




    //adding delete
    div.addEventListener("mouseover", function() {
      div.classList.add("binWiggle")
      setTimeout(function() {
        div.classList.remove("binWiggle");
      },1000)
    })

    img.addEventListener("click", function(event) {
      event.stopPropagation()
      axios.delete("/api/todos/"+li.id)
      .then(function(response) {
        console.log(response)
      })
      .catch(error => console.log(error));
      li.classList.add("sweepOut")
      setTimeout(function() {
        ul.removeChild(li);
        var index = lis.map(x=>x.textContent).findIndex(y => y===li.textContent)
        lis.splice(index, 1);
        //only changing position of lis below the one removed
        lis.filter((li, i) => i>=index).forEach((li,i) => positionItem(li, i+index));
      }, 400)
    })
  })
}




function slidingList() {
  var lastArray = lis.slice();
  lis.forEach(function(li, i) {
    positionItem(li, i)
    let bulletPoint = li.childNodes[1]
    var interval;

    bulletPoint.addEventListener("mousedown", function(e){
      //avoiding clicks from propagating
      reordering = true
      //calling external function so the event listener can be removed
      document.addEventListener("mousemove", move);
      //using setInterval to check if list order has changed. gets removed once user stops rearranging
      if (interval === undefined) {
        interval = setInterval(function() {
          if (!sameOrder(lis, lastArray)) {
            lis.forEach((li, idx) => {if (idx !== i) positionItem(li, idx)})
            lastArray = lis.slice()
          }
        }, 10)
      }
    })
    function move(e) {
      let ulRect = ul.getBoundingClientRect();
      // li.style.left = event.pageX-ulRect.x + "px";
      li.style.top = Math.max(event.clientY-ulRect.y-20, -70) + "px";
      li.style.transition = "0s";
    
      //resetting i so that if item has been moved previously, we know it's correct position. using lis array as realtime representation of positions
      i = lis.map(x=>x.textContent).findIndex(y => y===li.textContent)
      for (var j = i+1; j<lis.length; j++) {
        let clickedTop = parseInt(li.style.top), toMoveTop = parseInt(lis[j].style.top)
        if (toMoveTop < clickedTop) {
          //swapping lis array positions with destructuring
          [lis[i],lis[j]] = [lis[j],lis[i]];
          i=j
        }
      }
      for (var k = i-1; k>=0; k--) {
        let clickedTop = parseInt(li.style.top), toMoveTop = parseInt(lis[k].style.top)
        if (toMoveTop > clickedTop) {
          [lis[k],lis[i]] = [lis[i],lis[k]];
          i=k
        }
      }

      document.addEventListener("mouseup", function(e) {
        document.removeEventListener("mousemove", move)
        clearInterval(interval);
        interval = undefined;
        lis.forEach((li,i) => {
          positionItem(li, i)
          runOnce()
        })
        // li.style.left = "";
        li.style.transition = "0.3s";
        setTimeout(() => reordering = false, 10)
      })
    }
    bulletPoint.addEventListener("click", event => event.stopPropagation())
  })
}

function positionItem(elem, idx) {
  let amount = idx*71
  elem.style.top = amount + "px"
}

function sameOrder(arr1, arr2) {
  for (var i = 0; i<arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false
  }
  return true
};

//created with closure as the mouseup event fires multiple times and we really don't want to be sending off multiple AJAX requests for each li
let runOnce = (function() {
  let count = 0;
  return function() {
    if (!count) {
      lis.forEach(function(li, i) {
        axios.put("/api/todos/"+li.id, {order: performance.now()})
        .then(function(response) {
          console.log(response)
        })
        .catch(error => console.log(error))
      })
      count++;
      setTimeout(() => count = 0, 100)
    }
  }
})();


var textArea = document.querySelector("textarea")

let added = 1;
textArea.addEventListener("keypress", function(event) {
  if (event.which === 13) {
    event.preventDefault();
    axios.post("/api/todos", {name: textArea.value, order: highestOrderVal+added})
    .then(function(response) {
      console.log(response);
      createItemElements([response.data])
      positionItem(lis[lis.length-1], lis.length-1)
    })
    .catch(error => console.log(error))
    textArea.value = "";
    added++
  }
})


document.addEventListener("scroll", function() {
  if (document.documentElement.scrollTop < 200) changeBackgroundSize()
})


function changeBackgroundSize() {
  ul.style.height = lis.length*71 + 250 + "px"
}