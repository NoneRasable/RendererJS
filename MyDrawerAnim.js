var stop = false;
var frameCount = 0;
var fps = 10;
var fpsInterval, startTime, now, then, elapsed;

class Color {
    constructor(red, green, blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;        
        this.alpha = 255;
    }
}

class Drawer {
    constructor(canvasName, width, height, pixelSize) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.width = width * pixelSize;
        this.height = height * pixelSize;
        this.drawerPixels = new Array(width);
        this.canvasName = canvasName;
        this.drawerPixels.forEach(function(item, index, array) {
            item = new Array(this.height);
        });
        this.pixelSize = pixelSize;
        this.canvas = document.getElementById(canvasName);
        if (this.canvas == null) {
            console.log('Not find element with name "' + this.canvasName + '"');
            return;
        }
        this.context = this.canvas.getContext('2d');
        this.imageData = this.context.createImageData(this.width, this.height);
        this.currentColor = new Color(0, 0, 0);
        this.context.canvas.width = this.width;
        this.context.canvas.height = this.width;

        this.buf = new ArrayBuffer(this.imageData.data.length);
        this.buf8 = new Uint8ClampedArray(this.buf);
        this.data = new Uint32Array(this.buf);

        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        this.update = () => {};
    }

    SetFpsLimit(fps = 10) {
        fpsInterval = 1000 / fps;
    }
    
    StartAnimating() {    
        requestAnimationFrame(this.StartAnimating.bind(this));
    
        now = Date.now();
        elapsed = now - then;
        if (elapsed > fpsInterval) {
            then = now - (elapsed % fpsInterval);
            this.update();
        }
    }
    
    SetUpdate(updateFunction) {
        this.update = updateFunction;
    }
    
    SetColor(r, g, b) {
        this.currentColor.red = r;
        this.currentColor.green = g;
        this.currentColor.blue = b;
        this.currentColor.alpha = 255;
        this.int24Color = (255 << 24) | (this.currentColor.blue << 16) | (this.currentColor.green << 8) | this.currentColor.red;
    };

    Clear() {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                this.data[y * this.width + x] = this.int24Color;
            }
        }
    }

    AddPoint(x, y) {
        let canvasX = x;
        let canvasY = this.canvasHeight - y - 1;
        if (this.pixelSize == 1) {
            let pixelIndex = canvasY * this.width + canvasX;
            this.data[pixelIndex] = this.int24Color;
            return;
        }
        
        const canvasStartX = canvasX * this.pixelSize;
        const canvasStartY = canvasY * this.pixelSize;
        for (var dx = 0; dx < this.pixelSize; dx++) {
            for (var dy = 0; dy < this.pixelSize; dy++) {
                let pixelIndex = (canvasStartY + dy) * this.width + canvasStartX + dx; 
                this.data[pixelIndex] = this.int24Color;
            }
        }
    };
    
    StopDraw() {    
    };
    
    Show() {   
        this.imageData.data.set(this.buf8); 
        this.context.putImageData(this.imageData, 0, 0);
    };
}