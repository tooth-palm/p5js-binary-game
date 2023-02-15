function setup() {
  createCanvas(600, 450);
  background(0);
  noLoop();
}

function draw() {
  drawStage();
  const binaryManager = new BinaryManager(4, height * 0.9);
  binaryManager.draw();
}

function drawStage() {
  // bar over numbers
  push();
  stroke(255);
  strokeWeight(3);
  noFill();

  const centerX = width / 2;
  const barLong = width * 0.8;
  line(
    centerX - barLong / 2,
    height * 0.8,
    centerX + barLong / 2,
    height * 0.8
  );
  pop();

  // bar under notes
  push();
  stroke(255);
  noFill();
  line(width * 0.3, height * 0.2, width, height * 0.2);
  pop();
}

class BinaryManager {
  #digitNum;
  #binaryNumbers;
  #positionY;
  #selectorIndex;

  constructor(digitNum, positionY) {
    this.#digitNum = digitNum;
    this.#binaryNumbers = Array(digitNum).fill(0);
    this.#positionY = positionY;
    this.#selectorIndex = 0;
  }

  draw() {
    this.#drawNumbers();
    this.#drawSelector();
  }

  #drawNumbers() {
    for (let i = 0; i < this.#digitNum; i++) {
      const drawPosition = this.#getXFromIndex(i);
      if (this.#binaryNumbers[i] === 0) {
        this.#drawZero(drawPosition);
      } else {
        this.#drawOne(drawPosition);
      }
    }
  }

  #drawZero(x) {
    push();
    fill(255);
    textAlign(CENTER, CENTER);
    text("0", x, this.#positionY);
    pop();
  }

  #drawOne(x) {
    push();
    fill(255);
    textAlign(CENTER, CENTER);
    text("1", x, this.#positionY);
    pop();
  }

  #drawSelector() {
    push();
    rectMode(CENTER);
    noStroke();
    fill(255);

    const selectorPosition = this.#getXFromIndex(this.#selectorIndex);
    const selectorWide = 20;
    const selectorTall = 5;
    rect(selectorPosition, this.#positionY + 20, selectorWide, selectorTall);
    pop();
  }

  #getXFromIndex(index) {
    if (this.#digitNum === 1) {
      return width / 2;
    }

    const leftX = width * 0.2;
    const rightX = width * 0.8;
    const position = map(index, 0, this.#digitNum - 1, leftX, rightX);
    return position;
  }
}
