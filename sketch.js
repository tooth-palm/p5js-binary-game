let binaryManager;
let noteManager;

function setup() {
  createCanvas(600, 450);
  binaryManager = new BinaryManager(4, height * 0.9);
  noteManager = new NoteManager(4, 4);
}

function draw() {
  background(0);
  drawStage();
  binaryManager.draw();
  noteManager.update(frameCount);
  noteManager.draw();
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    binaryManager.moveSelectorLeft();
  } else if (keyCode === RIGHT_ARROW) {
    binaryManager.moveSelectorRight();
  } else if (keyCode === UP_ARROW) {
    binaryManager.increment();
  } else if (keyCode == DOWN_ARROW) {
    binaryManager.decrement();
  }
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
    this.#drawSumNumber();
  }

  increment() {
    if (this.#binaryNumbers[this.#selectorIndex] === 1) return;

    this.#binaryNumbers[this.#selectorIndex]++;
  }

  decrement() {
    if (this.#binaryNumbers[this.#selectorIndex] === 0) return;

    this.#binaryNumbers[this.#selectorIndex]--;
  }

  moveSelectorLeft() {
    if (this.#selectorIndex === 0) return;

    this.#selectorIndex--;
  }

  moveSelectorRight() {
    if (this.#selectorIndex === this.#digitNum - 1) return;

    this.#selectorIndex++;
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

  #drawSumNumber() {
    push();
    fill(255);
    textAlign(CENTER, CENTER);
    text(this.#getSumNumber(), width * 0.2, height * 0.7);
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

  #getSumNumber() {
    let sum = 0;
    for (let i = 0; i < this.#digitNum; i++) {
      if (this.#binaryNumbers[i] === 1) {
        // convert binary to decimal
        sum += 2 ** (this.#digitNum - i - 1);
      }
    }
    return sum;
  }
}

class NoteManager {
  #digitNum;
  #waitingNotes;
  #maxFallingStep;
  #currentFallingStep;
  #fallingNote;

  constructor(digitNum, fallingStepNum) {
    this.#digitNum = digitNum;
    this.#waitingNotes = [];
    for (let i = 0; i < 4; i++) {
      this.#waitingNotes.push(floor(random(2 ** this.#digitNum)));
    }
    this.#maxFallingStep = fallingStepNum - 1;
    this.#nextNote();
  }

  update(frame) {
    if (frame % 60 === 0) {
      this.#updateStep();
    }
  }

  draw() {
    if (this.#currentFallingStep > 0) {
      this.#drawFallingNote();
      return;
    }
    if (this.#isMatched()) {
      this.#drawNoteCorrect();
    } else {
      this.#drawNoteWrong();
    }
  }

  #updateStep() {
    this.#currentFallingStep--;
    if (this.#currentFallingStep < 0) {
      this.#nextNote();
    }
  }

  #drawFallingNote() {
    push();
    fill(255);
    textAlign(CENTER, CENTER);
    const fallingNumberHeight = this.#getYFromStep();
    text(this.#fallingNote, width * 0.2, fallingNumberHeight);
    pop();
  }

  #drawNoteCorrect() {
    push();
    fill(0, 255, 0);
    textAlign(CENTER, CENTER);
    const fallingNumberHeight = this.#getYFromStep();
    text(this.#fallingNote, width * 0.2, fallingNumberHeight);
    pop();
  }

  #drawNoteWrong() {
    push();
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    const fallingNumberHeight = this.#getYFromStep();
    text(this.#fallingNote, width * 0.2, fallingNumberHeight);
    pop();
  }

  #isMatched() {}

  #nextNote() {
    this.#fallingNote = this.#waitingNotes.shift();
    this.#currentFallingStep = this.#maxFallingStep;
    this.#waitingNotes.push(floor(random(2 ** this.#digitNum)));
  }

  #getYFromStep() {
    const startY = height * 0.1;
    const endY = height * 0.7;
    const numberHeight = map(
      this.#currentFallingStep,
      this.#maxFallingStep,
      0,
      startY,
      endY
    );

    return numberHeight;
  }
}
