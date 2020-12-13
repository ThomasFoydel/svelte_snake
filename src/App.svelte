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
  const food = { x: 8, y: 10 };
  let snakeDirection = "L";

  let lose = false;

  const renderLose = (updatedSnake) => {
    console.log("render lose screen");
  };

  onMount(() => {
    const renderSnake = (updatedSnake) => {
      container.innerHTML = "";
      updatedSnake.forEach((piece) => {
        const snakePiece = document.createElement("div");
        snakePiece.className = "snake";
        snakePiece.style.gridRowStart = piece.y;
        snakePiece.style.gridColumnStart = piece.x;
        container.appendChild(snakePiece);
      });
    };

    const calculateNewPos = () => {
      const updatedSnake = [];

      snake.forEach((piece, i) => {
        if (i === 0) {
          if (piece.y - 1 === 0) {
            console.log("LOSE!");
            lose = true;
          }
          switch (snakeDirection) {
            case "U":
              updatedSnake.push({ x: piece.x, y: piece.y - 1 });
              break;
            case "D":
              updatedSnake.push({ x: piece.x, y: piece.y + 1 });
              break;
            case "L":
              updatedSnake.push({ x: piece.x - 1, y: piece.y });
              break;
            case "R":
              updatedSnake.push({ x: piece.x + 1, y: piece.y });
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
        renderSnake(updatedSnake);
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
      }, 400);
    };
    start();
  });
</script>

<div class="game-board" bind:this="{container}" />
