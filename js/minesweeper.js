
var time = 0;
var startedGame = false;
var matrix = [];
var columns = 9;
var rows = 9;
var difficulty = 0;
var remainMines = 10;
var totalMines = 10;
var timer_id;

var correctlyFlag = 0;
var uncorrectlyFlag = 0;
var remainedHidden = columns*rows;

function buildGrid() {

    // Fetch grid and clear out old elements.
    var grid = document.getElementById("minefield");
    grid.innerHTML = "";

    if(difficulty == 0){
        columns = 9;
        rows = 9;
        remainMines = 10;
        totalMines = 10;
    }

    else if(difficulty == 1){
        columns = 16;
        rows = 16;
        remainMines = 40;
        totalMines = 40;
    }

    else if(difficulty == 2){
        rows = 16;
        columns = 30;
        remainMines = 99;
        totalMines = 99;
    }

    remainedHidden = columns * rows;
    correctlyFlag = 0;
    uncorrectlyFlag = 0;

    document.getElementById("flagCount").innerHTML = remainMines;

    generateEmptyMatrix(rows,columns);


    // Build DOM Grid
    var tile;
    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < columns; x++) {
            tile = createTile(x,y);
            grid.appendChild(tile);
        }
    }
    
    var style = window.getComputedStyle(tile);

    var width = parseInt(style.width.slice(0, -2));
    
    var height = parseInt(style.height.slice(0, -2));
    
    grid.style.width = (columns * width) + "px";
    grid.style.height = (rows * height) + "px";
}

function createTile(x,y) {
    var tile = document.createElement("div");

    tile.classList.add("tile");
    tile.classList.add("hidden");

    tile.dataset.x = x;
    tile.dataset.y = y;
    tile.id = x+","+y;
    tile.dataset.mine = false;
    
    tile.addEventListener("auxclick", function(e) { e.preventDefault(); }); // Middle Click
    tile.addEventListener("contextmenu", function(e) { e.preventDefault(); }); // Right Click
    tile.addEventListener("mouseup", handleTileClick ); // All Clicks
    tile.addEventListener("mousedown", ()=> {
        // change face
        document.getElementById("smiley").classList.add("face_limbo");

    } );

    return tile;
}

function startGame() {
    console.log("entered startGame()");
    startedGame = false;
    time = 0;

    // clean face classes
    var face = document.getElementById("smiley");
    face.className = "smiley";

    // reset banner
    document.getElementById("banner").innerHTML = "";
    // if(typeof(time_id) !== 'undefined'){
        
    // }
    clearInterval(timer_id);
    
    buildGrid();
    startTimer();
}



function generateEmptyMatrix(rows, columns) {
    matrix = [];
    for(var i = 0; i < columns; i++) {
        matrix.push(new Array(rows).fill(0))
    }
    console.log(matrix);
}

function checkWinning(){
    // var mineConter =0;
    // var hiddenRemain = 0;
    // for(var i = 0; i<columns; i++){
    //     for(var j = 0; j<rows; j++){
    //         var tile = document.getElementById(i+","+j);
    //         // if the tile is not clicked and it is a mine
    //         if(tile.classList.contains("hidden")){
    //             hiddenRemain++;
    //         }
    //         if (tile.classList.contains("flag") && matrix[i][j] === -1){
    //             mineConter++;

    //         }
    //     }
    // }
    // console.log(hiddenRemain);
    // console.log(mineConter);
    // console.log(totalMines);

    // if(hiddenRemain+mineConter === totalMines){
    //     return true;
    // }
    // return false;
    console.log("remainedHidden: " + remainedHidden);
    console.log("correctlyFlag: " + correctlyFlag);
    console.log("uncorrectlyFlag: " + uncorrectlyFlag);
    if(uncorrectlyFlag === 0 && remainedHidden + correctlyFlag === totalMines){
        return true;
    }
    else{
        return false;
    }
}


function generateMines(x, y) {
    console.log("clicked: "+x+","+y);
    console.log("testing: ");

    var tmp = 0;
    // randomly generate mines
    var checkDirections = [[0,0],[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]];

    while(tmp<remainMines){
        var x_ = Math.floor(Math.random() * columns);
        var y_ = Math.floor(Math.random() * rows);
        // should not be tile that selected or already assigned
        if(matrix[x_][y_] === 0){
            // check adjacent
            var validMineLocation = true;
            for(var i=0; i<checkDirections.length; i++){
                var direction = checkDirections[i];
                checkX = x+direction[0];
                checkY = y+direction[1];
                // console.log("check: " + checkX + ", " + checkY);
                if(x_ === checkX && y_ === checkY){
                    validMineLocation = false;
                }
            }
            console.log(validMineLocation);
            if(validMineLocation === true){
                console.log( x_ + "," + y_);
                matrix[x_][y_] = -1;
                tmp++;
            }

        }        
    }
    console.log(matrix);
    //calculate count
    

    var directions = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]];

    for(var i=0; i<columns; i++){
        for(var j=0; j<rows; j++){
            if(matrix[i][j] === 0){
                for(var k=0; k<directions.length; k++){

                    if(typeof(matrix[i+directions[k][0]]) !== 'undefined' && typeof(matrix[i+directions[k][0]][j+directions[k][1]]) !== 'undefined' && matrix[i+directions[k][0]][j+directions[k][1]] === -1){
                        matrix[i][j]++;
                    }
                }
            }
        }
    }


    console.log(matrix);
    // for testing: show in grid the result of generation
    // for(var i=0; i<columns; i++){
    //     for(var j=0; j<rows; j++){
    //         document.getElementById(i+","+j).classList.remove("hidden");
    //         if(matrix[i][j] !== -1){
    //             document.getElementById(i+","+j).classList.add("tile_"+matrix[i][j]);
    //         }
    //         else{
    //             console.log("hi");
    //             document.getElementById(i+","+j).classList.add("mine");
    //         }
            
    //     }
    // }

}


function smileyDown() {
    var smiley = document.getElementById("smiley");
    smiley.classList.add("face_down");
}

function smileyUp() {
    var smiley = document.getElementById("smiley");
    smiley.classList.remove("face_down");
}

function handleTileClick(event) {
    document.getElementById("smiley").className = "smiley";
    var x = parseInt(this.dataset.x);
    var y = parseInt(this.dataset.y);

    console.log( x + "," + y);

    if(!startedGame){
        generateMines(x,y);
        startedGame = true;
    }
    // Left Click
    if (event.which === 1) {
        //TODO reveal the tile
        if(this.classList.contains("hidden")){
            
            console.log("the tile you clicked has value: ");
            console.log(matrix[x][y]);
            if(matrix[x][y] === -1){
                // game over
                showGameOver(x,y);
                var banner = document.getElementById("banner");
                banner.innerHTML = "Game Over :(";
                
                
            }
            else if(matrix[x][y] === 0){
                // expand to numbers
                expandAdjacentTile(x,y);
            }
            else{
                // show numbers
                this.classList.add("tile_"+matrix[x][y]);
            }
        }
        else{
            //check tile has numbers
            console.log("check has number");
            if(matrix[x][y] > 0){
                // check flag match
                var directions = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]];
                var flag_counter = 0;
                var gameOver = false;
                for(var i=0; i<directions.length; i++){
                    // get 
                    var newX = x + directions[i][0];
                    var newY = y + directions[i][1];
                    
                    var tileChecking = document.getElementById(newX+","+newY);
                    if(typeof(matrix[newX]) !== 'undefined' && typeof(matrix[newX][newY]) !== 'undefined' && tileChecking.classList.contains("flag")){
                        // correctly identify
                        if(matrix[newX][newY] === -1){   
                            flag_counter++;
                        }
                        // wrong flag, game over
                        else{
                            tileChecking.classList.add("mine_marked");
                            gameOver = true;
                            
                        }
                        
                    }
                }
                if(gameOver){
                    for(var i=0; i<directions.length; i++){
                        // get 
                        var newX = x + directions[i][0];
                        var newY = y + directions[i][1];
                        var tileChecking = document.getElementById(newX+","+newY);
                        if(typeof(matrix[newX]) !== 'undefined' && typeof(matrix[newX][newY]) !== 'undefined' && tileChecking.classList.contains("hidden") && matrix[newX][newY] === -1){
                            tileChecking.classList.add("mine_hit");
                            
                        }
                    }
                    showGameOver(newX,newY);
                }
                console.log("flag_counter = " + flag_counter);
                console.log("matrix[x][y] = " + matrix[x][y]);
                if(flag_counter === matrix[x][y]){
                    for(var i=0; i<directions.length; i++){
                        var newX = x + directions[i][0];
                        var newY = y + directions[i][1];
                        expandAdjacentTile(newX,newY);
                    }
                }
            }
        }

    }
    // Middle Click
    else if (event.which === 2) {
        //TODO try to reveal adjacent tiles
        console.log("middle clicked");
    }
    // Right Click
    else if (event.which === 3) {
        //TODO toggle a tile flag
        // if hidden, set flag
        if(this.classList.contains("hidden")){
            this.classList.toggle("hidden");
            this.classList.toggle("flag");
            remainMines -= 1;
            if(matrix[x][y] === -1){
                correctlyFlag++;
            }
            else{
                uncorrectlyFlag++;
            }
            remainedHidden--;
        }
        // if flag set hidden
        else if(this.classList.contains("flag")){
            this.classList.toggle("hidden");
            this.classList.toggle("flag");
            remainMines += 1;
            if(matrix[x][y] === -1){
                correctlyFlag--;
            }
            else{
                uncorrectlyFlag--;
            }
            remainedHidden++;
        }

        document.getElementById("flagCount").innerHTML = remainMines;
    }

    if(checkWinning()){
        var face = document.getElementById("smiley");
        face.classList.add ("face_win");
        document.getElementById("banner").innerHTML = "You win :)";
        clearInterval(timer_id);
        // alert("you win!");
    }
    
}

function showGameOver(x,y){
    clearInterval(timer_id);
    console.log("enter showGameOver()");
    for(var i=0; i<rows; i++){
        for(var j=0; j<columns; j++){
            var tileSelected = document.getElementById(i+","+j);
            tileSelected.removeEventListener("mouseup", handleTileClick);
            if(i===x && j===y){
                tileSelected.classList.add("mine_hit");
            }
            
            else if(tileSelected.classList.contains("hidden")){
                
                if(matrix[i][j] === -1){
                    tileSelected.classList.remove("hidden");
                    tileSelected.classList.add("mine");
                }
                // else{
                //     tileSelected.classList.add("tile_"+matrix[i][j]);
                // }
            }

        }
    }
    var smiley = document.getElementById("smiley");
    smiley.classList.add("face_lose");
}

function expandAdjacentTile(x,y) {
    var tile = document.getElementById(x+","+y);
    console.log("entered expandAdjacentTile function");
    // console.log(tile.classList.contains("hidden"));
    if(typeof(matrix[x]) === 'undefined' || typeof(matrix[x][y]) === 'undefined' || tile.classList.contains("hidden") === false){
        return;
    }

    remainedHidden--;
    if(matrix[x][y] > 0){
        tile.classList.remove("hidden");
        tile.classList.add("tile_" + matrix[x][y]);
        return;
    }
    
    if(matrix[x][y] === 0){
        tile.classList.remove("hidden");
    }
    
    
    var directions = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]];
    for(var i=0; i<directions.length; i++){
        dir = directions[i];
        newX = x+dir[0];
        newY = y+dir[1];
        console.log("new");
        console.log(newX+","+newY);
        expandAdjacentTile(newX,newY);
    }
}

function setDifficulty() {
    var difficultySelector = document.getElementById("difficulty");
    difficulty = difficultySelector.selectedIndex;
}

function startTimer() {
    timeValue = 0;
    timer_id = window.setInterval(onTimerTick, 1000);
}

function onTimerTick() {
    timeValue++;
    updateTimer();
}

function updateTimer() {
    document.getElementById("timer").innerHTML = timeValue;
}