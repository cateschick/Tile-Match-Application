/*
Cate Schick
Application name: Tile-Match

Welcome to Tile-match! I created this tile-matching application
to better my understanding of Javascript, HTML, and CSS (and also
to make a fun game to show friends). This simple application recognizes 
pairs of 3, 4, and 5 matching tiles. The current level provides you with
30 moves, and you can win by getting a score higher than 100. I hope you enjoy playing!
*/

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  const scoreDisplay = document.getElementById('score')
  const intro = document.querySelector('.intro')
  const width = 8
  const squares = []
  let score = 0

  const possibleFriends = [
    'url(images/Cate.png)',
    'url(images/Cole.png)',
    'url(images/Kat.png)'
    // 'url(images/Camden.png)'
    // 'url(images/Cam.png)'
    // 'url(images/Neil.png)'
    // 'url(images/Brennan.png)'
    // 'url(images/Lily)'
    // 'url(images/Allison)'
    // 'url(images/Cass)'
    // 'url(images/Sam)'
    // 'url(images/Mason)'
  ]

// picks six random friends from my array of possible friends
// I wanted to make sure everyone felt included in this :)
function pickFriends() {
    var selected = []
    // iterate 6 times, for 6 friends
    for (var i = 0; i < 6; i++) {
      var selectedFriend = possibleFriends[Math.floor(Math.random() * possibleFriends.length)];
        // make sure this friend isn't already selected
        if (!selected.includes(selectedFriend)) {
            selected.push(selectedFriend)
        }
    }

    return selected

    // pick a random person
    // let selectedFriend = possibleFriends[Math.floor(Math.random() * possibleFriends.length)];

}

const candyColors = [
    'url(images/blue-candy.png)',
    'url(images/yellow-candy.png)',
    'url(images/red-candy.png)',
    'url(images/purple-candy.png)',
    'url(images/green-candy.png)',
    'url(images/orange-candy.png)'
]

    // Start

    window.setInterval(function() {
        checkRowForFour()
        checkColumnForFour()
        checkRowForThree()
        checkColumnForThree()
        moveIntoSquareBelow()
    }, 100);

    // Create board
    function createBoard() {
        for (let i=0; i < width*width; i++) {
            // create squares
            const square = document.createElement('div')

            // make square draggable, and give it a unique ID
            square.setAttribute('draggable', true)
            square.setAttribute('id', i)

            // set a random color for each new square on the grid
            let randomColor = Math.floor(Math.random() * candyColors.length)
            square.style.backgroundImage = candyColors[randomColor]

            grid.appendChild(square)
            squares.push(square)
        }
    }

    createBoard()

let colorBeingDragged
let colorBeingReplaced
let squareIdBeingDragged
let squareIdBeingReplaced

    // Drag each candy
    squares.forEach(square => square.addEventListener('dragstart', dragStart))
    squares.forEach(square => square.addEventListener('dragend', dragEnd))
    squares.forEach(square => square.addEventListener('dragover', dragOver))
    squares.forEach(square => square.addEventListener('dragenter', dragEnter))
    squares.forEach(square => square.addEventListener('dragleave', dragLeave))
    squares.forEach(square => square.addEventListener('drop', dragDrop))

    // Start drag and save that color
    function dragStart() {
        colorBeingDragged = this.style.backgroundImage;
        squareIdBeingDragged = parseInt(this.id)
    }

    // pass event into function
    function dragOver(e) {
        e.preventDefault()

    }

    function dragEnter(e) {
        e.preventDefault()
    }

    function dragLeave() {
        this.style.backgroundImage = ''
    }

    // Swaps the colors of squares where the user wants to swap candies
    function dragDrop() {
        colorBeingReplaced = this.style.backgroundImage
        squareIdBeingReplaced = parseInt(this.id)
        this.style.backgroundImage = colorBeingDragged
        // Update background color
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced
    }

    // Determine what is a valid move?
    function dragEnd() {
        // Valid moves are tiles above, below, and next to on the left and right
        let validMoves = [
            squareIdBeingDragged -1, 
            squareIdBeingDragged - width,
            squareIdBeingDragged +1, 
            squareIdBeingDragged + width,
        ]
        let validMove = validMoves.includes(squareIdBeingReplaced)

        // make sure squares stay in grid
        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null
        }
        // invalid move; return square back to where it was
        else if (squareIdBeingReplaced && !validMove) {
            squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged
        }
        else squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged
    }
    // dropping candies when matches clear
    function moveIntoSquareBelow() {
        for (i = 0; i < 55; i ++) {
            if(squares[i + width].style.backgroundImage === '') {
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage
                squares[i].style.backgroundImage = ''

                const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
                const isFirstRow = firstRow.includes(i)
                // fill newly empty squares with a random color
                if (isFirstRow && squares[i].style.backgroundImage === '') {
                  let randomColor = Math.floor(Math.random() * candyColors.length)
                  squares[i].style.backgroundImage = candyColors[randomColor]
                }
            }
        }
    }

    // Match Checking

    // row of four
    function checkRowForFour() {
        for (i = 0; i < 60; i ++) {
          let rowOfFour = [i, i+1, i+2, i+3]
          let decidedColor = squares[i].style.backgroundImage
          const isBlank = squares[i].style.backgroundImage === ''
    
          const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55]
          if (notValid.includes(i)) continue
    
          if(rowOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
            score += 4
            scoreDisplay.innerHTML = score
            rowOfFour.forEach(index => {
            squares[index].style.backgroundImage = ''
            })
          }
        }
      }
    
    checkRowForFour()

    // column of four
    function checkColumnForFour() {
        for (i = 0; i < 39; i ++) {
          let columnOfFour = [i, i+width, i+width*2, i+width*3]
          let decidedColor = squares[i].style.backgroundImage
          const isBlank = squares[i].style.backgroundImage === ''
    
          if(columnOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
            score += 4
            scoreDisplay.innerHTML = score
            columnOfFour.forEach(index => {
            squares[index].style.backgroundImage = ''
            })
          }
        }
      }
    checkColumnForFour()

    // row of Three
    function checkRowForThree() {
        for (i = 0; i < 61; i ++) {
          let rowOfThree = [i, i+1, i+2]
          let decidedColor = squares[i].style.backgroundImage
          const isBlank = squares[i].style.backgroundImage === ''
    
          // fix issue where row matches continue on other side of grid
          const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55]
          if (notValid.includes(i)) continue
    
          if(rowOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
            score += 3
            scoreDisplay.innerHTML = score
            rowOfThree.forEach(index => {
            squares[index].style.backgroundImage = ''
            })
          }
        }
      }
      checkRowForThree()

    // column of three
    function checkColumnForThree() {
        for (i = 0; i < 47; i ++) {
          let columnOfThree = [i, i+width, i+width*2]
          let decidedColor = squares[i].style.backgroundImage
          const isBlank = squares[i].style.backgroundImage === ''
    
          if(columnOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
            score += 3
            scoreDisplay.innerHTML = score
            columnOfThree.forEach(index => {
            squares[index].style.backgroundImage = ''
            })
          }
        }
      }
    checkColumnForThree()
})
