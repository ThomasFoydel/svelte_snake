<style>

</style>

<script>
  import { onMount } from "svelte";

  let gameLoop;
  let gameboard;
  let start;
  let snake = [
    { x: 8, y: 3 },
    { x: 8, y: 2 },
    { x: 8, y: 1 },
  ];
  const food = { x: 8, y: 10 };
  let direction = "D";
  let score = 0;

  let directionCheck = {};

  let coin = new Audio("./audio/coin.mp3");
  let hit = new Audio("./audio/hit.mp3");
  let lvlup = new Audio("./audio/lvlup.mp3");
  let lvlup2 = new Audio("./audio/lvlup2.mp3");
  // let death = new Audio("./audio/death.mp3");
  let death2 = new Audio("./audio/death2.mp3");

  const handleKeydown = ({ which }) => {
    let head = snake[0];
    let neck = snake[1];

    directionCheck = {
      L: head.x < neck.x,
      R: head.x > neck.x,
      D: head.y > neck.y,
      U: head.y < neck.y,
    };

    if (!lose)
      switch (which) {
        case 37:
          if (!directionCheck.R) direction = "L";
          break;
        case 38:
          if (!directionCheck.D) direction = "U";
          break;
        case 39:
          if (!directionCheck.L) direction = "R";
          break;
        case 40:
          if (!directionCheck.U) direction = "D";
          break;
          default: 
          null;
      }
  };

  const collidesWithSnake = ({ x, y }) => {
    let collides = false;
    snake.forEach((piece) => {
      if (x === piece.x && y === piece.y) collides = true;
    });
    return collides;
  };

  const changeFoodLocation = () => {
    let newValCollides = true;
    let newX;
    let newY;
    while (newValCollides) {
      newX = Math.floor(Math.random() * 20 + 1);
      newY = Math.floor(Math.random() * 20 + 1);
      newValCollides = collidesWithSnake({ x: newX, y: newY });
    }
    food.x = newX;
    food.y = newY;
  };

  let lose = false;

  const renderLose = (updatedSnake) => {
    hit.play();
    setTimeout(() => {
      death2.play();
    }, 250);
    console.log("render lose screen");
  };

  onMount(() => {
    const draw = (updatedSnake) => {
      gameboard.innerHTML = "";
      updatedSnake.forEach((piece, i) => {
        const snakePiece = document.createElement("div");
        snakePiece.className = "snake";
        if (i > 0) snakePiece.style.opacity = 1 - (i / snake.length) * .8;
        snakePiece.style.gridRowStart = piece.y;
        snakePiece.style.gridColumnStart = piece.x;
        gameboard.appendChild(snakePiece);
      });

      const newFood = document.createElement("div");
      newFood.className = "food";
      newFood.style.gridRowStart = food.y;
      newFood.style.gridColumnStart = food.x;
      gameboard.appendChild(newFood);
    };

    const newFrame = () => {
      const updatedSnake = [];

      snake.forEach((piece, i) => {
        if (i === 0) {
          let newHead = {};
          switch (direction) {
            case "U":
              if (piece.y === 1) lose = true;
              else newHead = { x: piece.x, y: piece.y - 1 };
              break;
            case "D":
              if (piece.y === 21) lose = true;
              newHead = { x: piece.x, y: piece.y + 1 };
              break;
            case "L":
              if (piece.x === 1) lose = true;
              newHead = { x: piece.x - 1, y: piece.y };
              break;
            case "R":
              newHead = { x: piece.x + 1, y: piece.y };
              if (piece.x === 21) lose = true;
              break;
          }
          let cannibalism = collidesWithSnake(newHead);
          if (cannibalism) lose = true;
          else updatedSnake.push(newHead);
        } else {
          updatedSnake.push({ x: snake[i - 1].x, y: snake[i - 1].y });
        }
      });
      if (updatedSnake[0].x === food.x && updatedSnake[0].y === food.y) {
        // food collision
        coin.play();
        score++;
        if (score % 10 === 0) lvlup2.play();
        else if (score % 5 === 0) lvlup.play();
        updatedSnake.push({
          x: snake[snake.length - 1].x,
          y: snake[snake.length - 1].y,
        });
        changeFoodLocation();
      }
console.log("updatedSnake: ", directionCheck, updatedSnake);
      if (lose) {
          console.log("LOSE!")
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
          newFrame();
        }
      }, 90);
    };
  });
</script>

<svelte:window on:keydown="{handleKeydown}" />

<div class="container">
    <div class="score">{score}</div>
    <div class="game-board" bind:this="{gameboard}">
        <button class="start" on:click="{start}"><h2>start</h2></button>
    </div>
    <div class="score">{score}</div>
</div>