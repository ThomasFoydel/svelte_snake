<script>
  import { onMount } from "svelte";
  let gameLoop;
  let container;
  let start;
  let snake = [
    { x: 8, y: 1 },
    { x: 8, y: 2 },
    { x: 8, y: 3 },
  ];
  const food = { x: 8, y: 10 };
  let direction = "D";

  const handleKeydown = ({ which }) => {
    switch (which) {
      case 37:
        if (direction !== "R") direction = "L";
        break;
      case 38:
        if (direction !== "D") direction = "U";
        break;
      case 39:
        if (direction !== "L") direction = "R";
        break;
      case 40:
        if (direction !== "U") direction = "D";
        break;
    }
  };

  const changeFoodLocation = () => {
    food.x = Math.floor(Math.random() * 21);
    food.y = Math.floor(Math.random() * 21);
  };

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

    const newFrame = () => {
      const updatedSnake = [];

      snake.forEach((piece, i) => {
        if (i === 0) {
          // console.log("Y ", piece.y, "X: ", piece.x);
          //   if (piece.y - 1 === 0) {
          //     console.log("LOSE!");
          //     lose = true;
          //   }
          switch (direction) {
            case "U":
              if (piece.y === 0) lose = true;
              updatedSnake.push({ x: piece.x, y: piece.y - 1 });
              break;
            case "D":
              if (piece.y === 21) lose = true;
              updatedSnake.push({ x: piece.x, y: piece.y + 1 });
              break;
            case "L":
              if (piece.x === 0) lose = true;
              updatedSnake.push({ x: piece.x - 1, y: piece.y });
              break;
            case "R":
              updatedSnake.push({ x: piece.x + 1, y: piece.y });
              if (piece.x === 21) lose = true;
              break;
          }
        } else {
          updatedSnake.push({ x: snake[i - 1].x, y: snake[i - 1].y });
        }
      });
      if (updatedSnake[0].x === food.x && updatedSnake[0].y === food.y) {
        console.log("hit!");
        updatedSnake.push({
          x: snake[snake.length - 1].x,
          y: snake[snake.length - 1].y,
        });
        changeFoodLocation();
      }

      if (lose) {
        renderLose(updatedSnake);
      } else {
        console.log(updatedSnake);
        draw(updatedSnake);
        snake = updatedSnake;
      }
    };

    start = () => {
      gameLoop = setInterval(() => {
        if (lose) {
          clearInterval(gameLoop);
        } else {
          newFrame();
        }
      }, 100);
    };
    start();
  });
</script>

<svelte:window on:keydown="{handleKeydown}" />
<div class="game-board" bind:this="{container}" />
