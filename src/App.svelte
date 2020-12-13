<script>
  import { onMount } from "svelte";
  let gameLoop;
  let container;
  let start;
  let snake = [
    { x: 8, y: 14 },
    { x: 8, y: 15 },
    { x: 8, y: 16 },
  ];
  const food = { x: 12, y: 10 };
  let snakeDirection = "D";

  const handleKeydown = ({which})=> {
      switch(which){
          case 37: snakeDirection = "L"; break;
          case 38: snakeDirection = "U"; break;
          case 39: snakeDirection = "R"; break;
          case 40: snakeDirection = "D"; break;
        }
  }

  let lose = false;


  const renderLose = (updatedSnake) => {
    console.log("render lose screen");
  };
  
  onMount(() => {
  


    const draw = (updatedSnake) => {
      container.innerHTML = "";
      updatedSnake.forEach((piece) => {
        const snakePiece = document.createElement("div");
        snakePiece.className = "snake";
        snakePiece.style.gridRowStart = piece.y;
        snakePiece.style.gridColumnStart = piece.x;
        container.appendChild(snakePiece);
      });

      const newFood = document.createElement("div");
      newFood.className = "food";
      newFood.style.gridRowStart = food.y;
      newFood.style.gridColumnStart = food.x;
      container.appendChild(newFood);
    };

    const calculateNewPos = () => {
      const updatedSnake = [];

      snake.forEach((piece, i) => {
        if (i === 0) {
            console.log("Y ", piece.y, "X: ", piece.x);
        //   if (piece.y - 1 === 0) {
        //     console.log("LOSE!");
        //     lose = true;
        //   }
          switch (snakeDirection) {
            case "U":
              updatedSnake.push({ x: piece.x, y: piece.y - 1 });
               if (piece.y === 0) lose = true;
              break;
            case "D":
              updatedSnake.push({ x: piece.x, y: piece.y + 1 });
               if (piece.y  === 21) lose = true;
              break;
            case "L":
              updatedSnake.push({ x: piece.x - 1, y: piece.y });
               if (piece.x  === 0) lose = true;
              break;
            case "R":
              updatedSnake.push({ x: piece.x + 1, y: piece.y });
                 if (piece.x  === 21) lose = true;
              break;
          }
        } else {
          updatedSnake.push({ x: snake[i - 1].x, y: snake[i - 1].y });
        }

        // if (updatedSnake[0].x === food.x && updatedSnake[0].y === food.y) {
        //     console.log("hit!");
        //     updatedSnake.push({x: snake[snake.length -1].x , y: snake[snake.length-1].y});
        // }
      });

      if (lose) {
        renderLose(updatedSnake);
      } else {
        draw(updatedSnake);
        snake = updatedSnake;
      }
    };

    start = () => {
      gameLoop = setInterval(() => {
        if (lose) {
          clearInterval(gameLoop);
        } else {
          calculateNewPos();
        }
      }, 100);
    };
    start();
  });
</script>

<svelte:window on:keydown={handleKeydown}/>
<div class="game-board" bind:this="{container}" />
