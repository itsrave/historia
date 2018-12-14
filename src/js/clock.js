const defaultClockStyle = {
  faceColor: "#FFF",
  number: {
    color: "#075B91",
    size: 0.2,
    font: '"Tw Cen Mt", sans-serif', // fallback musi być
  },
  background: {
    display: true,
    src: document.getElementById("logo"),
    size: 0.71,
  },
  cap: {
    size: 0.02,
    color: "#000",
  },
  hands: {
    second: {
      draw: true,
      // round: false,
      width: 2,
      length: 0.69,
      color: "#FF0000",
    },
    minute: {
      draw: true,
      // round: true,
      width: 4,
      length: 0.7,
      color: "#000",
    },
    hour: {
      draw: true,
      // round: true,
      width: 5,
      length: 0.46,
      color: "#000",
    },
  },
};

/* Round miało pozwalać na rysowanie wskazówek z zaokrąglonymi końcami, ale
 * konieczność zamykania ścieżek by były one rysowane poprawnie powoduje, że
 * jest to nie możliwe. */

class Clock {
  constructor (id, size = 0.4, style = defaultClockStyle) {
    // konstruktor obiektu z zegarem
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");

    this.style = style;
    this.size = size;

    // do sprawdzania czy zmienił się rozmiar elementu, w którym znajduje się
    // canvas
    this.oldWidth = this.canvas.parentElement.offsetWidth;

    // wstępne ustawienie rozmiaru (koniecznie na siłę za pierwszym razem)
    this.resize();

    this.draw();

    // scope callbacka ma znaczenie
    this.interval = setInterval(() => this.draw(), 1000);
  }

  draw () {
    // zmień rozmiar canvas tylko jak jest to potrzebne (tymczasowa zmienna z
    // nową wysokością)
    let newWidth = this.canvas.parentElement.offsetWidth;

    if (newWidth !== this.oldHeight) {
      this.oldHeight = newWidth;
      this.resize();
    }

    // wyczyść canvas
    this.clear();

    // narysuj tarczę zegara
    this.drawFace();

    // wskazówki
    this.getAngles();

    for (let hand in this.style.hands)
      if (this.style.hands[hand].draw)
        this.drawHand(this.style.hands[hand], this.angles[hand]);

    // zasłonienie końców wskazówek
    this.drawCap();
  }

  drawFace () {
    // puste stroke
    this.ctx.strokeStyle = "rgba(0, 0, 0, 0)";

    // narysuj tarczę zegara
    this.ctx.fillStyle = this.style.faceColor;
    this.ctx.arc(this.center, this.center, this.center, 0, Math.PI * 2);
    this.ctx.fill();
    
    // dorysuj obrazek
    if (this.style.background.display) {
      let size = this.style.background.size * this.canvas.width,
          position = (this.canvas.width - size) / 2;
      this.ctx.drawImage(this.style.background.src, position, position, size, size);
    }
    
    // narysuj cyfry na tarczy
    this.ctx.fillStyle = this.style.number.color;
    this.ctx.font = (this.center * this.style.number.size)
      + "px" + ' ' + this.style.number.font;

    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    for (let number = 1; number < 13; number++) {
      let angle = number * (Math.PI /6) - (Math.PI / 2);
      this.ctx.fillText(number.toString(),
                        this.center + (this.numberRadius * Math.cos(angle)),
                        this.center + (this.numberRadius * Math.sin(angle)));
    }
  }

  drawHand (handStyle, angle) {
    // Rysuje wskazówkę zegara. handStyle to jej styl, a angle to jej kąt w
    // radianach.

    let length = handStyle.length * this.center;

    // ustawienie stylu z obiektu
    this.ctx.lineWidth = handStyle.width;
    /* tutaj był kod ogarniający końcówki wskazówek */
    // if (handStyle.round)
    //   this.ctx.lineCap = "round";
    // else
    //   this.ctx.lineCap = "butt";
    this.ctx.strokeStyle = handStyle.color;

    // rysowanie
    this.ctx.beginPath();
    this.ctx.moveTo(this.center, this.center);
    this.ctx.lineTo(this.center + (length * Math.cos(angle)),
                    this.center + (length * Math.sin(angle)));
    this.ctx.closePath();
    this.ctx.stroke();
  }

  getAngles () {
    this.time = new Date();
    let numbers = {
      hour: this.time.getHours() % 12,
      minute: this.time.getMinutes(),
      second: this.time.getSeconds(),
    };

    this.angles = {
      hour: (numbers.hour + (numbers.minute / 60)
             + (numbers.second / Math.pow(60, 2)))
        * (Math.PI / 6),
      minute: (numbers.minute + (numbers.second / 60))
        * (Math.PI / 30),
      second: numbers.second
        * (Math.PI / 30),
    };

    for (let hand in this.angles)
      this.angles[hand] -= Math.PI / 2;
  }

  drawCap () {
    this.ctx.beginPath();

    this.ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    this.ctx.fillStyle = this.style.cap.color;

    this.ctx.arc(this.center, this.center,
                 (this.style.cap.size * this.canvas.width),
                 0, Math.PI * 2);
    this.ctx.closePath();
    this.ctx.fill();
  }

  clear () {
    // czyści canvas z zegarem
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  resize () {
    /* Ogarnia rozmiar zegarka, zakładając że 0.4 wysokości ekranu to odpowiedni
     * rozmimar dla niego. */
    this.canvas.width = this.canvas.parentElement.offsetWidth * this.size;
    this.canvas.height = this.canvas.width;

    // obliczanie zmiennych do rysowania zegara
    this.center = this.canvas.width / 2;
    // jest tylko jeden rozmiar bo canvas jest kwadratowy (jest również równy
    // promieniowi tarczy w tym wypadku)

    this.numberRadius = this.center * (1 - (this.style.number.size * 0.75));
  }
}

// nowy zegar
// let zegar = new Clock("zegar", 0.3);
