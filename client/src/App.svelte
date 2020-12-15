<script>

  import { onMount } from "svelte";

  let gameLoop;
  let gameboard;
  let theme;
  let start;
  let gameRunning = false;
  let intervalTime = 105; 

  let backgroundIdx = 0;
  const backgrounds = [
      "background: url('imgs/comb.jpg');",
      "background: url('imgs/space.jpg');",
      "background: url('imgs/winter.jpg');",
      "background: url('imgs/water.jpg');",
      "background: url('imgs/leaves.jpg');",
      "background: url('imgs/mountain.jpg');",
      "background: url('imgs/dust.jpg');",
      "background: url('imgs/stone.jpg');",
      "background: url('imgs/brick.jpg');",
      "background: url('imgs/redstripe.jpg');",
  ];

  let foodColorIdx = 0;

 const foodColors =[
      "radial-gradient(circle, rgba(2,0,36,1) 0%, rgba(244,59,207,1) 50%, rgba(38,237,255,1) 100%)",
      "radial-gradient(circle, rgba(38,237,255,1) 0%, rgba(2,0,36,1) 11%, rgba(2,0,36,1) 48%, rgba(244,59,207,1) 85%, rgba(38,237,255,1) 100%)",
      "radial-gradient(circle, rgba(38,237,255,1) 0%, rgba(2,0,36,1) 21%, rgba(2,0,36,1) 58%, rgba(244,59,207,1) 99%)",
      "radial-gradient(circle, rgba(244,59,207,1) 0%, rgba(38,237,255,1) 48%, rgba(2,0,36,1) 83%)"
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
  hit.volume = 0.8;
  let lvlup = new Audio("./audio/lvlup.mp3");
  lvlup.volume = 0.8;
  let lvlup2 = new Audio("./audio/lvlup2.mp3");
  lvlup2.volume = 0.8;
  let reload = new Audio("./audio/reload.mp3");
  reload.volume = 0.7;
  let death = new Audio("./audio/death.mp3");
  death.volume = 0.6;

  const collidesWithSnake = ({ x, y }) => {
    let collides = false;
    snake.forEach((piece) => {
      if (x === piece.x && y === piece.y) collides = true;
    });
    // if (collides) {
    //   console.log("####################################");
    //   console.log("colides x: ", x, "collides y: ", y);
    //   console.log("collides snake: ", snake);
    // }

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
      death.play();
      setTimeout(() => {
        loseScreen.innerHTML = `You died! Your score:<br/><div class="final-score">${score}</div>&nbsp;`;
        setTimeout(() => {
          gameRunning = false;
          loseScreen.innerHTML = `You died! Your score:<br/><div class="final-score">${score}</div>Hit return to replay`;
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
      newFood.style.background = foodColors[foodColorIdx % 4];
      newFood.className = "food";
      newFood.style.gridRowStart = food.y;
      newFood.style.gridColumnStart = food.x;
      gameboard.appendChild(newFood);
      foodColorIdx++;
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

        if (score % 20 === 0) {
            intervalTime -= 1;
            specialMoves++;
            backgroundIdx++;
            theme.pause();
            lvlup2.play();
            setTimeout(() => {
                if (!lose) theme.play();
            }, 2400);
        } else if (score % 10 === 0) {
            intervalTime -= 1;
            backgroundIdx++;
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
    
        const timer = function() { 
           if (lose) {
            clearTimeout(gameLoop);
          } else {
            newFrame();
            gameLoop = setTimeout(timer, intervalTime); 
          }
        };
        timer();

      }
    };
  });

  const restart = () => {
      intervalTime = 105;
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
      reload.currentTime = 0;
      coin.currentTime = 0;
      reload.play();
      coin.play();
      snake.length = snake.length - 8;
      intervalTime -= 5;
      score += 20;
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
  <!-- <div class="score">{score}</div> -->
  
  <div class="game-board-container">
      <div class="background-image" style="{backgrounds[backgroundIdx % 10 ]}; transition: background 1.2s ease; background-position: center center; background-size: cover; "></div>
      <!-- <div class="shadow" style="opacity: {backgroundIdx % 10 !== 0 ? "1" : "0"}; transition: opacity 2s ease;" ></div> -->
      <div class="shadow" style="opacity: {lose ? "1" : "0.75"}; transition: opacity 1s ease;" ></div>
        <div class="game-board" bind:this="{gameboard}">
            <h2 class="title">snake</h2>
            <button class="start" on:click="{start}">Hit enter to play</button>
        </div>
        {#if specialMoves > 0 }
            <div class="special-moves">{specialMoves}x spaceBars</div>
        {/if}
        <div class="overlay-score">score: {score}</div>
  </div>

  <!-- <div class="score">{score}</div> -->
</div>

<audio bind:this="{theme}" id="music" loop src="audio/theme.mp3"><track src="" kind="captions" srclang="en" label="english_captions"></audio>
