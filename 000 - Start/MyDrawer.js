var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;

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
    }

    StartAnimating() {
    };
    
    StartDraw() {    
    };
    
    SetColor(r, g, b) {
        this.currentColor.red = r;
        this.currentColor.green = g;
        this.currentColor.blue = b;
        this.currentColor.alpha = 255;
    };

    Clear() {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                this.AddPoint(x, y);
            }
        }  
    }

    AddPoint(x, y) {
        for (var dx = 0; dx < this.pixelSize; dx++) {
            for (var dy = 0; dy < this.pixelSize; dy++) {
                let pixelindex = ((y * this.pixelSize + dy) * this.width + x * this.pixelSize + dx) * 4;

                this.imageData.data[pixelindex] = this.currentColor.red;
                this.imageData.data[pixelindex+1] = this.currentColor.green;
                this.imageData.data[pixelindex+2] = this.currentColor.blue;
                this.imageData.data[pixelindex+3] = this.currentColor.alpha;
            }
        }        
    };
    
    StopDraw() {    
    };
    
    Show() {    
        this.context.putImageData(this.imageData, 0, 0);
    }
}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}

function animate() {
    if (stop) {
        return;
    }

    requestAnimationFrame(animate);

    function animate() {    
        requestAnimationFrame(animate);    
        now = Date.now();
        elapsed = now - then;
        if (elapsed > fpsInterval) {
            then = now - (elapsed % fpsInterval);    
        }
    }
}