
var img;
var playerTurn = 1;
var darkColor = '#855c33';
var colorClicked = '#804000';
var lastSquare;
var playerInSquare;
var toolEaten = false;
var toolChoosen = false;
var moveExecute = false;
var toolCanEat = false;
var isWinVar = false;
var isTekoVar = false;
var checkersBoard = [[0, 1, 0, 1, 0, 1, 0, 1],
                    [1, 0, 1, 0, 1, 0, 1, 0],
                    [0, 1, 0, 1, 0, 1, 0, 1],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [2, 0, 2, 0, 2, 0, 2, 0],
                    [0, 2, 0, 2, 0, 2, 0, 2],
                    [2, 0, 2, 0, 2, 0, 2, 0]];
var testBoard = [[0, 0, 0, 0, 0, 0, 0, 0],
                 [1, 0, 0, 0, 0, 0, 0, 0],
                 [0, 2, 0, 2, 0, 2, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 2, 0, 2, 0, 2, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 2, 0, 2, 0, 2, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0]];
var board = checkersBoard;
createBoard(board);
function createBoard(board) {
    for (var i = 0 ; i<8 ; i++)
    {
        for (var j = 0 ; j<8 ; j++)
        {
            if (board[i][j]==0)
                 continue; 
            img = document.createElement("img");
            var src = document.getElementById(i+"-"+j);
            if (board[i][j]==1)
                img.src = "images/red.jpg";
            else if (board[i][j]==2)
                img.src = "images/black.jpg";
            else if (board[i][j]==11)
                img.src = "images/red king.jpg";
            else if (board[i][j]==22)
                img.src = "images/black king.jpg";
            src.appendChild(img);
        }
    }   
}
function clicked(location) {  
    var square = new position(location);
    mainGame(square);
}
function mainGame(square)
{
    playerInSquare = (board[square.row][square.col])%10;
    if (playerInSquare == 0 && !toolChoosen)
      return;
    if (toolChoosen && playerInSquare == 0)
        moveExecute = move(lastSquare, square);
    else if (playerTurn == playerInSquare)
    {
        toolChoosen = true;
        document.getElementById(square.str).style.backgroundColor = colorClicked;
    }
    toolEaten = moveExecute ? (square.col+2 == lastSquare.col || square.col-2 == lastSquare.col):false;
    if ((toolEaten && canThisToolEat(square)) && !(position.equal(lastSquare,square)))
    {
        lastSquare = new position(square.str);
        return;
    }
    defaultColor (lastSquare, square);
    moveExecuteChanges () ;
    lastSquare = new position(square.str);  
}
function deleteAllTrace(){
    var someSquare;
    for (var i = 0 ; i < 8 ; i++)
    {
        for (var j = 1 ; j < 8 ; j=j+2)
        {
            if (i%2==1&&j==1)
                j=0;
            someSquare = new position(i+"-"+j);
            squareColorToDefault(someSquare);   
        } 
    }
}
function defaultColor (lastSquare, square){
    var someSquare;
    for (var i = 0 ; i < 8 ; i++)
    {
        for (var j = 1 ; j < 8 ; j=j+2)
        {
            if (i%2==1&&j==1)
                j=0;
            someSquare = new position(i+"-"+j);
            if (position.equal(someSquare, square))
                continue;
            if (lastSquare!=undefined)
                if (!position.equal(square, lastSquare)) 
                    squareColorToDefault(someSquare);   
        } 
    }
}
function squareColorToDefault(square)
{
    if (square != undefined)
        document.getElementById(square.str).style.backgroundColor = darkColor;
}
function moveExecuteChanges (){
    if (moveExecute)
    {
        deleteAllTrace();
        if (playerTurn == 1)
        {
            playerTurn = 2;
            document.getElementById("turn").innerHTML = "Black turn";
            document.getElementById("turn").style.color = "black";
        }
        else
        {
            playerTurn = 1; 
            document.getElementById("turn").innerHTML = "Red turn";
            document.getElementById("turn").style.color = "#df1e1e";
        }
        moveExecute = false;
        toolChoosen = false;
        isWinVar = win(isWin(playerTurn), playerTurn);
        if (!isWinVar)
            isTekoVar = teko(isTeko(playerTurn), playerTurn);
    }
}
function move(lastSquare, square)
{
    var answer = false ;
    if (board[lastSquare.row][lastSquare.col] > 10)
        answer=moveKing(lastSquare, square)
    else
        answer=moveChecker(lastSquare, square)
    if (answer)
    {
        updateBoardAndArray (lastSquare, square);
        return true;
    }
}
function moveChecker(lastSquare, square)
{ 
    playerToMove = board[lastSquare.row][lastSquare.col]%10;
    if (playerToMove == 1)
    {
        if (lastSquare.row + 1 == square.row && (lastSquare.col + 1 == square.col || lastSquare.col - 1 == square.col))
            return true;
        else if ((lastSquare.row + 2 == square.row) && (lastSquare.col + 2 == square.col || (lastSquare.col - 2 == square.col)))
            return eat(lastSquare, square);   
    }
    else //(playerToMove == 2)
    {
        if (lastSquare.row - 1 == square.row && (lastSquare.col + 1 == square.col || lastSquare.col - 1 == square.col))
            return true;
        else if ((lastSquare.row - 2 == square.row) && (lastSquare.col + 2 == square.col || (lastSquare.col - 2 == square.col))) 
            return eat(lastSquare, square); 
    }
    return false;
}
function moveKing(lastSquare, square)
{ 
    if (lastSquare.row + 1 == square.row && (lastSquare.col + 1 == square.col || lastSquare.col - 1 == square.col))
            return true;
    else if ((lastSquare.row + 2 == square.row) && (lastSquare.col + 2 == square.col || (lastSquare.col - 2 == square.col)))
            return eat(lastSquare, square);
    else if (lastSquare.row - 1 == square.row && (lastSquare.col + 1 == square.col || lastSquare.col - 1 == square.col))
            return true;
    else if ((lastSquare.row - 2 == square.row) && (lastSquare.col + 2 == square.col || (lastSquare.col - 2 == square.col)))
            return eat(lastSquare, square); 
    return false;
}
function canMove(lastSquare, square)
{ 
    if (square.col>7||square.col<0||square.row>7||square.row<0||isNaN(square.col)||isNaN(square.row))
        return false;
    if (board[square.row][square.col]!=0)
        return false;
    var king = board[lastSquare.row][lastSquare.col];

    if ((square.row>lastSquare.row) &&  (king == 1 || king==11 || king==22)) // הליכה קדימה  
    {
        if (lastSquare.row + 1 == square.row && (lastSquare.col + 1 == square.col || lastSquare.col - 1 == square.col))
            return true;
    }
    else if ((square.row<lastSquare.row) &&  (king == 2 || king==11 || king==22)) // הליכה אחורה
    {
         if (lastSquare.row - 1 == square.row && (lastSquare.col + 1 == square.col || lastSquare.col - 1 == square.col))
             return true;
    }
    return false;
}
function eat(lastSquare, square)
{ 
    if (board[square.row][square.col]!=0)
        return false;
    var king = board[lastSquare.row][lastSquare.col];
    playerToMove = board[lastSquare.row][lastSquare.col]%10;
    otherPlayer = playerToMove==1?2:1;
    
    if ((square.row>lastSquare.row) &&  (king == 1 || king==11 || king==22)) // אכילה קדימה 
    {
        var rowSquareToEat = lastSquare.row+1;
        var colSquareToEat = (lastSquare.col+2==square.col? lastSquare.col+1:lastSquare.col-1 )
        var playerToEat = board[rowSquareToEat][colSquareToEat]%10;
        if ( playerToEat!=playerToMove && playerToEat!= 0)
        {
            removeToolByRowCol(rowSquareToEat, colSquareToEat);
            board[rowSquareToEat][colSquareToEat] = 0;
            return true;
        }
    }
    else if ((square.row<lastSquare.row) &&  (king == 2 || king==11 || king==22)) // אכילה אחורה
    {
        var rowSquareToEat = lastSquare.row-1;
        var colSquareToEat = (lastSquare.col+2==square.col? lastSquare.col+1:lastSquare.col-1)
        var playerToEat = board[rowSquareToEat][colSquareToEat]%10;
        if ( playerToEat!=playerToMove && playerToEat!= 0)  
        {     
            removeToolByRowCol(rowSquareToEat, colSquareToEat);
            board[rowSquareToEat][colSquareToEat] = 0;
            return true;
        }
    }
    return false;
}
function canEat(lastSquare, square)
{ 
    if (square.col>7||square.col<0||square.row>7||square.row<0||isNaN(square.col)||isNaN(square.row))
        return false;
    if (board[square.row][square.col]!=0)
        return false;
    var king = board[lastSquare.row][lastSquare.col];
    playerToMove = board[lastSquare.row][lastSquare.col]%10;
    otherPlayer = playerToMove==1?2:1;
    if ((square.row>lastSquare.row) &&  (king == 1 || king==11 || king==22)) // אכילה קדימה 
    {
        var rowSquareToEat = lastSquare.row+1;
        var colSquareToEat = (lastSquare.col+2==square.col? lastSquare.col+1:lastSquare.col-1 )
        var playerToEat = board[rowSquareToEat][colSquareToEat]%10;
        if ( playerToEat!=playerToMove && playerToEat!= 0)
            return true;
    }
    else if ((square.row<lastSquare.row) &&  (king == 2 || king==11 || king==22)) // אכילה אחורה
    {
        var rowSquareToEat = lastSquare.row-1;
        var colSquareToEat = (lastSquare.col+2==square.col? lastSquare.col+1:lastSquare.col-1)
        var playerToEat = board[rowSquareToEat][colSquareToEat]%10;
        if ( playerToEat!=playerToMove && playerToEat!= 0)  
            return true;
    }
    return false;
}
function canThisToolMove(square)
{
    var upRight = new position((square.row-1)+"-"+(square.col+1));
    var downRight = new position((square.row+1)+"-"+(square.col+1));
    var downLeft = new position((square.row+1)+"-"+(square.col-1));
    var upLeft = new position((square.row-1)+"-"+(square.col-1));
    if (canMove(square, upRight) || canMove(square, downRight) || canMove(square, downLeft) || canMove(square, upLeft))
        return true;   
}
function canThisToolEat(square)
{
    var upRight = new position((square.row-2)+"-"+(square.col+2));
    var downRight = new position((square.row+2)+"-"+(square.col+2));
    var downLeft = new position((square.row+2)+"-"+(square.col-2));
    var upLeft = new position((square.row-2)+"-"+(square.col-2));
    if ( canEat(square, upRight) || canEat(square, downRight) || canEat(square, downLeft) || canEat(square, upLeft) )
        return true;
}
function updateBoardAndArray (lastSquare, square)
{
    board[square.row][square.col] = board[lastSquare.row][lastSquare.col];
    toolToKing(square)
    board[lastSquare.row][lastSquare.col] = 0;
    removeToolBySquare(lastSquare);
    img = document.createElement("img");
    if (board[square.row][square.col] == 1)    
        img.src = "images/red.jpg";
    if (board[square.row][square.col] == 2)
        img.src = "images/black.jpg";
    else if (board[square.row][square.col] == 11)
        img.src = "images/red king.jpg";
    else if (board[square.row][square.col] == 22)
        img.src = "images/black king.jpg";

    var src = document.getElementById(square.str);
    src.appendChild(img);
}
function toolToKing (square)
{
if (board[square.row][square.col] == 1 && square.row == 7)
    board[square.row][square.col] = 11;
else if (board[square.row][square.col] == 2 && square.row == 0)
    board[square.row][square.col] = 22;
}
function removeToolBySquare(square) {
    var remove = document.getElementById(square.str);
    remove.removeChild(remove.childNodes[0]);
}
function removeToolByRowCol(row, col) {
    var remove = document.getElementById(row+"-"+col);
   remove.removeChild(remove.childNodes[0]);
}
function isTeko(player)
{
    var someSquare;
    for (var i = 0 ; i < 8 ; i++)
    {
        for (var j = 1 ; j < 8 ; j=j+2)
        {
            if (i%2==1&&j==1)
                j=0;
            someSquare = new position(i+"-"+j);
            if (board[i][j]%10==player && (canThisToolMove(someSquare) || canThisToolEat(someSquare)))
                return false ;
        } 
    }
    return true;
}
function teko(answer, player)
{
    if (answer)
    {
        document.getElementById("turn").style.color = (player == 1 ? "#df1e1e": "black ");
        document.getElementById("turn").innerHTML = "Game is tie " + (player == 1 ? "red ": "black ") + "can't move";
    }
    return answer;
}
function isWin(player)
{
    var someSquare;
    for (var i = 0 ; i < 8 ; i++)
    {
        for (var j = 1 ; j < 8 ; j=j+2)
        {
            if (i%2==1&&j==1)
                j=0;
            someSquare = new position(i+"-"+j);
            if (board[i][j]%10==player)
                return false;
        } 
    }
    return true;
}
function win(answer, player)
{
    if (answer)
    {
        document.getElementById("turn").style.color = (player == 2 ? "#df1e1e": "black ");
        document.getElementById("turn").innerHTML = "Congratulations " + (player == 2 ? "red ": "black ")+ "you won";
    }
    return answer ;
}
function position(square) {
    row = square.slice(0, 1);
    col = square.slice(2);
    row = parseInt(row);
    col = parseInt(col);
    this.row = row;
    this.col = col;
    this.str = square;
}
position.equal = function (p1, p2) {
    return (p1.row == p2.row && p1.col == p2.col);
}







/*
function tool(player, king) {
    this.player = player;
    this.king = king;
}
function clearBoardImages(board)
{
    for (var i = 0 ; i<8 ; i++)
    {
        for (var j = 0 ; j<8 ; j++)
        {
            if (board[i][j]!=0)
                removeToolByRowCol(row, col);
        }
    } 
}
function init(board){
    var copyBoard = [];
    for ( var i = 0; i < 8; i++ ) 
        copyBoard[i] = [0,0,0,0,0,0,0,0]; 
    for ( var i = 0; i < 8; i++ ) 
        for (var j = 0; j < 8; j++) 
            copyBoard[i][j]=board[i][j];
    return copyBoard;
}

Tool.getPossibleMoves = function()
{
    var possibleMoves = [];
    if (this.king)
    {
        if (row+1<8 && col+1<8 && board[row+1][col+1] === 0)
        possibleMoves.push(new Square(this.row+1, this.col+1))
        if (row+1<8 && col-1<8 && board[row+1][col-1] === 0)
        possibleMoves.push(new Square(this.row+1, this.col-1))
        if (row-1<8 && col+1<8 && board[row-1][col+1] === 0)
        possibleMoves.push(new Square(this.row-1, this.col+1))
        if (row-1<8 && col-1<8 && board[row-1][col-1] === 0)
        possibleMoves.push(new Square(this.row-1, this.col-1))   
    }
}

function Tool(row, col, player) {
    this.player = player;
    this.row = row;
    this.col = col;
    this.king = false; 
    this.selected = false; 
}

for (var i = 1 ; i < 8 ; i=i+2)
{
    change= "s"+i;
    document.getElementById(change).src = "images/red.jpg";
}
document.getElementById("s62").src = "images/black.jpg";

document.getElementById("s2").src = "images/red.jpg";

html
<p> second picture<img squareChoosen="s2"></p>

*/

/*
for (var i = 1; i < 8 ;i=i+2)
{
    redImg = document.createElement("img");
    redImg.src = "images/red.jpg";
    var src = document.getElementById("0-"+i);
    src.appendChild(redImg);
}
for (var i = 0; i < 8 ;i=i+2)
{
    redImg = document.createElement("img");
    redImg.src = "images/red.jpg";
    var src = document.getElementById("1-"+i);
    src.appendChild(redImg);
}
for (var i = 1; i < 8 ;i=i+2)
{
    redImg = document.createElement("img");
    redImg.src = "images/red.jpg";
    var src = document.getElementById("2-"+i);
    src.appendChild(redImg);
}
for (var i = 0; i < 8 ;i=i+2)
{
    blackImg = document.createElement("img");
    blackImg.src = "images/black.jpg";
    var src = document.getElementById("5-"+i);
    src.appendChild(blackImg);
}
for (var i = 1; i < 8 ;i=i+2)
{
    blackImg = document.createElement("img");
    blackImg.src = "images/black.jpg";
    var src = document.getElementById("6-"+i);
    src.appendChild(blackImg);
}
for (var i = 0; i < 8 ;i=i+2)
{
    blackImg = document.createElement("img");
    blackImg.src = "images/black.jpg";
    var src = document.getElementById("7-"+i);
    src.appendChild(blackImg);
}
var squareBackTodfaultColor = "0-1";
*/
//function defaultColor (lastSquare, square){
//    if (lastSquare!=undefined)
//        if (!(square.col==lastSquare.col&&square.row==lastSquare.row))     
//       squareColorToDefault(lastSquare)
//}

/*
        answer=true;
    else if (canMove(square, downRight))
        answer=true;
    else if (canMove(square, downLeft))
        answer=true;
    else if (canMove(square, upLeft))
        answer=true;
    return answer;
    */
       /*
        answer=true;
    else if (canEat(square, downRight))
        answer=true;
    else if (canEat(square, downLeft))
        answer=true;
    else if (canEat(square, upLeft))
        answer=true;
    return answer;
    */
//img = document.createElement("img");
//var src = document.getElementById(i+"-"+j);
//src.appendChild(img);


/*
   in main // 

*/









