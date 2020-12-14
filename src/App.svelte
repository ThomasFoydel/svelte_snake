<script>
  import { onMount } from "svelte";

  let gameLoop;
  let gameboard;
  let theme;
  let start;
  let gameRunning = false;
  let backgroundIdx = 0;

  const backgrounds = [
      "background: url('imgs/space.jpg');",
      "background: url('imgs/water.jpg');",
      "background: url('imgs/redstripe.jpg');",
      "background: url('imgs/stone.jpg');",
      "background: url('imgs/brick.jpg');",
      "background: url('imgs/paint.jpg');",
  ];

  let snake = [
    { x: 8, y: 3 },
    { x: 8, y: 2 },
    { x: 8, y: 1 },
  ];
  const food = { x: 8, y: 10 };
  let direction = "D";
  let score = 0;
  let specialMoves = 0;

  let directionCheck = {};

  let coin = new Audio("./audio/coin.mp3");
  coin.volume = 0.4;
  let hit = new Audio("./audio/hit.mp3");
  let lvlup = new Audio("./audio/lvlup.mp3");
  lvlup.volume = 0.8;
  let lvlup2 = new Audio("./audio/lvlup2.mp3");
  lvlup2.volume = 0.8;
  // let death = new Audio("./audio/death.mp3");
  let reload = new Audio("./audio/reload.mp3");
  let death2 = new Audio("./audio/death2.mp3");
  death2.volume = 0.6;

  const collidesWithSnake = ({ x, y }) => {
    let collides = false;
    snake.forEach((piece) => {
      if (x === piece.x && y === piece.y) collides = true;
    });
    if (collides) {
      console.log("####################################");
      console.log("colides x: ", x, "collides y: ", y);
      console.log("collides snake: ", snake);
    }

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
      if (!newValCollides) {
        //   console.log("!newValueCollides, x: ", newX," y: ", newY);
        //   console.log({snake})
        food.x = newX;
        food.y = newY;
      }
      //   else {
      //        console.log("###################################");
      //       console.log("COLLIDES, x: ", newX," y: ", newY , "snek: ", snake);
      //         console.log("###################################");
      //   }
    }
  };

  let lose = false;

  const renderLose = (updatedSnake) => {
    theme.pause();
    lvlup.pause();
    lvlup2.pause();
    reload.pause();
    hit.play();
    const loseScreen = document.createElement("div");
    loseScreen.className = "lose-screen";
    loseScreen.innerHTML = `You died! Your score:<br/>&nbsp;<br/>&nbsp;`;
    gameboard.append(loseScreen);

    setTimeout(() => {
      death2.play();
      setTimeout(() => {
        loseScreen.innerHTML = `You died! Your score:<br/>${score}<br/>&nbsp;`;
        setTimeout(() => {
          gameRunning = false;
          loseScreen.innerHTML = `You died! Your score:<br/>${score}<br/>Hit return to replay`;
        }, 1015);
      }, 850);
    }, 250);
  };

  onMount(() => {
    const draw = (updatedSnake) => {
      gameboard.innerHTML = "";
      updatedSnake.forEach((piece, i) => {
        const snakePiece = document.createElement("div");
        snakePiece.className = "snake";
        if (i > 0) snakePiece.style.opacity = 1 - (i / snake.length) * 0.8;
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
        coin.currentTime = 0;
        coin.play();
        score++;

        // if (score % 20 === 0) specialMoves++;
        if (score % 20 === 0) {
                specialMoves++;
            backgroundIdx++;
          theme.pause();
          lvlup2.play();
          setTimeout(() => {
            if (!lose) theme.play();
          }, 2400);
        } else if (score % 10 === 0) {
          specialMoves++;
          theme.pause();
          lvlup.play();
          setTimeout(() => {
            if (!lose) theme.play();
          }, 1400);
        }
        updatedSnake.push({
          x: snake[snake.length - 1].x,
          y: snake[snake.length - 1].y,
        });
        changeFoodLocation();
      }
      //   console.log("updatedSnake: ", updatedSnake);
      if (lose) {
        renderLose(updatedSnake);
      } else {
        draw(updatedSnake);
        snake = updatedSnake;
      }
    };

    start = () => {
      if (!gameRunning) {
        gameRunning = true;
        theme.play();
        gameLoop = setInterval(() => {
          if (lose) {
            clearInterval(gameLoop);
          } else {
            newFrame();
          }
        }, 95);
      }
    };
  });

  const restart = () => {
    direction = "D";
    theme.currentTime = 0;
    gameboard.innerHTML = "";
    snake = [
      { x: 8, y: 3 },
      { x: 8, y: 2 },
      { x: 8, y: 1 },
    ];
    food.x = 8;
    food.y = 10;
    score = 0;
    lose = false;
    backgroundIdx = 0;
    specialMoves = 0;
    start();
  };

  const specialMove = () => {
    if (specialMoves > 0) {
        console.log("spec moves: ", specialMoves)
      reload.currentTime = 0;
      reload.play();
      snake.length = snake.length - 8;
      specialMoves--;
    }
  };

  const handleKeydown = ({ which }) => {
    if (which === 13 && !lose && !gameRunning) return start();
    if (which === 13 && lose && !gameRunning) return restart();
    if (which === 32 && !lose && gameRunning) return specialMove();
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
</script>

<svelte:window on:keydown="{handleKeydown}" />

<div class="container">
  <div class="score">{score}</div>
  
  <div class="game-board-container">
        <div class="background-image" style="{backgrounds[0]} opacity: {backgroundIdx % 6 === 0 ? "1": "0"};  background-position: center center; background-size: cover; "></div>
        <div class="background-image" style="{backgrounds[1]} opacity: {backgroundIdx % 6 === 1 ? "1": "0"};  background-position: center center; background-size: cover; "></div>
        <div class="background-image" style="{backgrounds[2]} opacity: {backgroundIdx % 6 === 2 ? "1": "0"};  background-position: center center; background-size: cover; "></div>
        <div class="background-image" style="{backgrounds[3]} opacity: {backgroundIdx % 6 === 3 ? "1": "0"};  background-position: center center; background-size: cover; "></div>
        <div class="background-image" style="{backgrounds[4]} opacity: {backgroundIdx % 6 === 4 ? "1": "0"};  background-position: center center; background-size: cover; "></div>
        <div class="background-image" style="{backgrounds[5]} opacity: {backgroundIdx % 6 === 5 ? "1": "0"};  background-position: center center; background-size: cover; "></div>
      {#if backgroundIdx % 6 !== 0}
      <div class="shadow"></div>
        {/if}
        <div class="game-board" bind:this="{gameboard}">
            <h2 class="title">snake</h2>
            <button class="start" on:click="{start}">Hit enter to play</button>
        </div>
  </div>

  <div class="score">{score}</div>
</div>

<audio bind:this="{theme}" id="music" loop src="audio/theme.mp3" />
