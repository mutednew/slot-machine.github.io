window.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('btn');
    const restart = document.getElementById('restart');
    const tries = document.getElementById('tries');
    const debagEl = document.getElementById('debag');
    const slots = document.querySelector('.slots');
    const result = document.getElementById('result');
    const blockAll = document.querySelector('.block');

    const iconWidth = 80,
      iconHeight = 80,
      iconsNum = 9,
      timePerIcon = 100,
      indexes = [0, 0, 0],
      iconMap = ["seven", "banana", "cherry", "plum", "orange", "bell", "bar", "lemon", "melon"];

    let currentTry = 0;
    let totalRound = 3;

    setTimeout(() => {
        let username = prompt('Enter username');

        if (username) {
            document.getElementById('username').innerHTML = username;
        } else {
            document.getElementById('username').innerHTML = 'Player';
        }
    }, 100);

    const roll = (reel, offset = 0) => {
        let rand = (offset + 2) * iconsNum + Math.floor(Math.random() * iconsNum);

        let style = getComputedStyle(reel),
            backgroundPosition = style['backgroundPosition'].split(' '),
            backgroundPositionY = parseFloat(backgroundPosition[1]),
            targetBackgroundPositionY = backgroundPositionY + rand * iconHeight,
			normTargetBackgroundPositionY = targetBackgroundPositionY % (iconsNum * iconHeight);
        
        return new Promise((resolve) => {
            reel.style.transition = `background-position ${8 + rand * timePerIcon}ms cubic-bezier(.45, .05, .58, 1.09)`; 
            reel.style.backgroundPositionY = `${targetBackgroundPositionY}px`;

            setTimeout(() => {
                reel.style.transition = 'none';
                reel.style.backgroundPositionY = `${normTargetBackgroundPositionY}px`;

                resolve(rand % iconsNum);
            }, 8 + rand * timePerIcon);
        });
    };

    function rollAll() {
        const reelsList = document.querySelectorAll('.reel');

        debagEl.innerHTML = 'Rolling...';
        result.innerHTML = '';
        
        Promise
            .all([...reelsList].map((reel, i) => roll(reel, i)))
            .then((rand) => {
                rand.forEach((rand, i) => indexes[i] = (indexes[i] + rand) % iconsNum);
                debagEl.innerHTML = indexes.map((i) => iconMap[i]).join(' - ')

                if (indexes[0] == indexes[1] && indexes[1] == indexes[2]) {
                    slots.classList.add('win');
                    result.innerHTML = 'You win!';
                    
                    setTimeout(() => {
                        slots.classList.remove('win');
                    }, 1000);
                } else if (currentTry == totalRound) {
                    result.innerHTML = 'Try again';
                }
            });
    }

    button.addEventListener('click', () => {
        if (currentTry < totalRound) {
            blockAll.style.display = 'block';
            setTimeout(() => {
                blockAll.style.display = 'none';
            }, 4000);

            rollAll();
            currentTry++;
            tries.innerHTML = `Try ${currentTry} of 3`;
        }
    });

    restart.addEventListener('click', () => {
        blockAll.style.display = 'block';
        setTimeout(() => {
            blockAll.style.display = 'none';
        }, 1800);

        currentTry = 0;
        tries.innerHTML = 'Try 0 of 3';
        result.innerHTML = '';
        debagEl.innerHTML = '';

        let reelStartPos = document.querySelectorAll('.reel');
        reelStartPos.forEach((s) => {
            s.style.backgroundPositionY = 0;
            s.style.transition = `1.5s cubic-bezier(.45, .05, .58, 1.09)`;
        });

        indexes.fill(0);
        console.clear();
    });
});